--
-- supabase_schema.sql
--
-- This script sets up the entire database schema for the CrediMarket application.
-- It includes table creation, row-level security policies, server-side functions (RPC),
-- and initial seed data.
--
-- Instructions:
-- 1. Navigate to the SQL Editor in your Supabase project.
-- 2. Paste the entire content of this file into a new query.
-- 3. Click "RUN".
--

-- 1. Create custom types (Enums)
-- Using text with CHECK constraints is often more flexible than enums in Postgres.
-- We will define these as tables are created.

-- 2. Create Tables
-- We start with the `users` table, which will be linked to `auth.users`.
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    credits integer NOT NULL DEFAULT 0,
    role text NOT NULL DEFAULT 'user'::text CHECK (role IN ('user', 'admin'))
);
COMMENT ON TABLE public.users IS 'Stores public user data and application-specific info like credits and role.';

-- `profiles` for the service providers
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text NOT NULL,
    location text NOT NULL,
    age integer NOT NULL,
    categories text[] NOT NULL DEFAULT '{}',
    description text NOT NULL,
    premium_contact text NOT NULL,
    gallery text[] NOT NULL DEFAULT '{}',
    unlock_cost integer NOT NULL DEFAULT 10 CHECK (unlock_cost >= 0)
);
COMMENT ON TABLE public.profiles IS 'Service provider profiles that users can browse and unlock.';

-- `unlocks` to track which user has unlocked which profile
CREATE TABLE IF NOT EXISTS public.unlocks (
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, profile_id)
);
COMMENT ON TABLE public.unlocks IS 'Records which users have unlocked which profiles.';

-- `credit_transactions` for auditing credit changes
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    type text NOT NULL CHECK (type IN ('purchase', 'unlock', 'admin_grant')),
    description text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.credit_transactions IS 'An audit log of all credit additions and deductions for each user.';

-- `payments` for manual payment proof submissions
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    transaction_id text NOT NULL,
    proof_url text NOT NULL,
    status text NOT NULL DEFAULT 'pending'::text CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.payments IS 'Stores user submissions for manual payment verification.';

-- 3. Set up triggers to automatically populate the `public.users` table
-- This function runs every time a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$;

-- And this trigger calls the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 4. Create Server-Side Functions (RPC) for secure operations
-- These functions ensure business logic is executed securely on the server.

-- Function to unlock a profile
CREATE OR REPLACE FUNCTION public.unlock_profile(profile_id_to_unlock uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  unlock_cost_amount int;
  user_credits int;
BEGIN
  -- 1. Get the unlock cost and user's current credits
  SELECT unlock_cost INTO unlock_cost_amount FROM public.profiles WHERE id = profile_id_to_unlock;
  SELECT credits INTO user_credits FROM public.users WHERE id = current_user_id;

  -- 2. Check if user has enough credits
  IF user_credits < unlock_cost_amount THEN
    RAISE EXCEPTION 'Insufficient credits to unlock this profile.';
  END IF;

  -- 3. Check if already unlocked to prevent double charges
  IF EXISTS (SELECT 1 FROM public.unlocks WHERE user_id = current_user_id AND profile_id = profile_id_to_unlock) THEN
    -- Or we could RAISE EXCEPTION 'Profile already unlocked.';
    RETURN; 
  END IF;

  -- 4. Perform the transaction
  -- Deduct credits from user
  UPDATE public.users SET credits = credits - unlock_cost_amount WHERE id = current_user_id;
  -- Record the unlock
  INSERT INTO public.unlocks (user_id, profile_id) VALUES (current_user_id, profile_id_to_unlock);
  -- Log the transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (current_user_id, -unlock_cost_amount, 'unlock', 'Unlocked profile ' || (SELECT name FROM public.profiles WHERE id = profile_id_to_unlock));
END;
$$;


-- Function for an admin to grant credits to a user
CREATE OR REPLACE FUNCTION public.grant_credits(target_user_id uuid, amount_to_grant int, admin_description text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  admin_id uuid := auth.uid();
  admin_role text;
BEGIN
  -- 1. Check if the caller is an admin
  SELECT role INTO admin_role FROM public.users WHERE id = admin_id;
  IF admin_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can grant credits.';
  END IF;

  -- 2. Grant the credits
  UPDATE public.users SET credits = credits + amount_to_grant WHERE id = target_user_id;
  -- 3. Log the transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (target_user_id, amount_to_grant, 'admin_grant', admin_description);
END;
$$;


-- Function for an admin to approve a payment and grant credits
CREATE OR REPLACE FUNCTION public.approve_payment(payment_id_to_approve uuid, credits_to_award int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  admin_id uuid := auth.uid();
  admin_role text;
  payment_record public.payments%ROWTYPE;
BEGIN
  -- 1. Check if the caller is an admin
  SELECT role INTO admin_role FROM public.users WHERE id = admin_id;
  IF admin_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can approve payments.';
  END IF;

  -- 2. Get payment details and lock the row
  SELECT * INTO payment_record FROM public.payments WHERE id = payment_id_to_approve FOR UPDATE;

  -- 3. Check if payment is pending
  IF payment_record.status != 'pending' THEN
    RAISE EXCEPTION 'This payment has already been processed.';
  END IF;

  -- 4. Perform transaction
  -- Update payment status
  UPDATE public.payments SET status = 'approved' WHERE id = payment_id_to_approve;
  -- Grant credits to user
  UPDATE public.users SET credits = credits + credits_to_award WHERE id = payment_record.user_id;
  -- Log the transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (payment_record.user_id, credits_to_award, 'purchase', 'Approved payment ' || payment_record.transaction_id);
END;
$$;

-- 5. Set up Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- users table
DROP POLICY IF EXISTS "Users can view their own data." ON public.users;
CREATE POLICY "Users can view their own data." ON public.users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can view all users." ON public.users;
CREATE POLICY "Admins can view all users." ON public.users FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');
DROP POLICY IF EXISTS "Users can update their own name." ON public.users;
CREATE POLICY "Users can update their own name." ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- profiles table
DROP POLICY IF EXISTS "Profiles are publicly viewable." ON public.profiles;
CREATE POLICY "Profiles are publicly viewable." ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage all profiles." ON public.profiles;
CREATE POLICY "Admins can manage all profiles." ON public.profiles FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- unlocks table
DROP POLICY IF EXISTS "Users can view their own unlocks." ON public.unlocks;
CREATE POLICY "Users can view their own unlocks." ON public.unlocks FOR SELECT USING (auth.uid() = user_id);
-- No insert/update/delete policies, as this is handled by the `unlock_profile` function.

-- credit_transactions table
DROP POLICY IF EXISTS "Users can view their own transactions." ON public.credit_transactions;
CREATE POLICY "Users can view their own transactions." ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);
-- No insert/update/delete policies, as this is handled by server-side functions.

-- payments table
DROP POLICY IF EXISTS "Users can create their own payment requests." ON public.payments;
CREATE POLICY "Users can create their own payment requests." ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can view their own payment requests." ON public.payments;
CREATE POLICY "Users can view their own payment requests." ON public.payments FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view and manage all payments." ON public.payments;
CREATE POLICY "Admins can view and manage all payments." ON public.payments FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- 6. Add some seed data
-- This is optional but helps with initial testing.
-- Note: Manually create users via the app's signup form first, then you can assign roles.
-- After signing up `admin@market.com` and `user@market.com`, run this:
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@market.com';

INSERT INTO public.profiles (name, location, age, categories, description, premium_contact, gallery, unlock_cost)
VALUES
(
  'Elena Rodriguez',
  'Miami, USA',
  34,
  '{"Graphic Design", "Branding", "Illustration"}',
  'Award-winning graphic designer with over a decade of experience in creating compelling brand identities and stunning visual content. Specializes in minimalist and modern aesthetics.',
  'elena.design@email.com',
  '{"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1581338834928-14213389893d?w=500&auto=format&fit=crop&q=60"}',
  20
),
(
  'Marcus Chen',
  'Singapore',
  29,
  '{"Web Development", "React", "Node.js", "DevOps"}',
  'Full-stack developer passionate about building scalable and efficient web applications. Expert in the MERN stack and cloud infrastructure on AWS. Delivers clean code and robust solutions.',
  'whatsapp: +6591234567',
  '{"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?w=500&auto=format&fit=crop&q=60"}',
  50
),
(
  'Aisha Bello',
  'Lagos, Nigeria',
  38,
  '{"Project Management", "Agile Coaching", "Scrum"}',
  'Certified Scrum Master and Agile Coach with a proven track record of leading high-performing teams to deliver complex projects on time and within budget. Fosters collaboration and continuous improvement.',
  'linkedin.com/in/aishabello',
  '{"https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=500&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1599540237642-206e902e04a2?w=500&auto=format&fit=crop&q=60"}',
  30
);

-- End of script