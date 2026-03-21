--
-- supabase_schema.sql
--
-- This script sets up the database schema for the Geo-Tagging Service Provider Marketplace.
-- It includes table creation and row-level security policies.
--

-- 1. Create Tables
-- `profiles` for the dating profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text NOT NULL,
    location text NOT NULL,
    age integer NOT NULL,
    interests text[] NOT NULL DEFAULT '{}',
    bio text NOT NULL,
    looking_for text NOT NULL,
    whatsapp text NOT NULL
);
COMMENT ON TABLE public.profiles IS 'Dating profiles.';

-- 2. Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- profiles table
DROP POLICY IF EXISTS "Profiles are publicly viewable." ON public.profiles;
CREATE POLICY "Profiles are publicly viewable." ON public.profiles FOR SELECT USING (true);

-- For this simplified app, we allow public inserts for demo purposes, 
-- but in a real app, you'd restrict this to authenticated users or admins.
DROP POLICY IF EXISTS "Anyone can add a profile." ON public.profiles;
CREATE POLICY "Anyone can add a profile." ON public.profiles FOR INSERT WITH CHECK (true);

-- 3. Add some seed data
INSERT INTO public.profiles (name, location, age, interests, bio, looking_for, whatsapp)
VALUES
(
  'Sarah',
  'Los Angeles, CA',
  24,
  '{"Travel", "Yoga", "Cooking"}',
  'Looking for someone who loves adventure and trying new restaurants. I spend my weekends at the beach or hiking.',
  'Serious relationship',
  '+1234567890'
),
(
  'Jessica',
  'Miami, FL',
  27,
  '{"Photography", "Music", "Fitness"}',
  'Music lover and part-time photographer. I value honesty and a good sense of humor. Let''s grab a coffee!',
  'Casual dating',
  '+1987654321'
),
(
  'Emily',
  'Austin, TX',
  22,
  '{"Gaming", "Anime", "Art"}',
  'Introvert who loves deep conversations and late-night gaming sessions. Looking for my player two.',
  'Friendship & more',
  '+1122334455'
);
