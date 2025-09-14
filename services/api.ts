import { supabase, isApiAvailable } from './supabaseClient';
import { Profile, Unlock, User, Payment, CreditTransaction } from '../types';
import type { Database } from './database.types';

// Helper to check for API availability and throw a clear error for write operations
const requireApi = () => {
    if (!isApiAvailable) {
        throw new Error("This feature is disabled. The application is not connected to a backend.");
    }
};

// --- AUTH ---
export const signup = async (name: string, email: string, pass: string) => {
    requireApi();
    const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { name } },
    });
    if (error) throw new Error(error.message);
    return data;
};


export const login = async (email: string, pass: string) => {
    requireApi();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw new Error(error.message);
    return data;
}

export const logout = async () => {
    if (!isApiAvailable) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
};

export const getSession = async () => {
    if (!isApiAvailable) return null;
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return session;
};

export const onAuthStateChange = (callback: (event: string, session: any | null) => void) => {
    if (!isApiAvailable) {
        return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
}

export const sendPasswordResetEmail = async (email: string) => {
    requireApi();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin, // URL to redirect to after password reset
    });
    if (error) throw new Error(error.message);
};

// --- USERS ---
export const getUserProfile = async (userId: string): Promise<User> => {
    if (!isApiAvailable) {
        throw new Error('API not available. Cannot fetch user profile.');
    }
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error) throw new Error(error.message);
    if (!data) {
        throw new Error('User profile not found.');
    }
    return data;
};

// --- PROFILES ---
export const fetchProfiles = async (): Promise<Profile[]> => {
    if (!isApiAvailable) return [];
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    if (!data) return [];
    
    return data.map((p) => {
        const { premium_contact, unlock_cost, ...rest } = p;
        return { ...rest, premiumContact: premium_contact, unlockCost: unlock_cost };
    });
};

export const addProfile = async (profileData: Omit<Profile, 'id' | 'created_at'>): Promise<Profile> => {
    requireApi();
    const dbData: Database['public']['Tables']['profiles']['Insert'] = {
        name: profileData.name,
        location: profileData.location,
        age: profileData.age,
        categories: profileData.categories,
        description: profileData.description,
        gallery: profileData.gallery,
        premium_contact: profileData.premiumContact,
        unlock_cost: profileData.unlockCost,
    };
    const { data, error } = await supabase.from('profiles').insert(dbData).select().single();
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to create profile.');
    const { premium_contact, unlock_cost, ...rest } = data;
    return { ...rest, premiumContact: premium_contact, unlockCost: unlock_cost };
};

export const updateProfile = async (profileData: Profile): Promise<Profile> => {
    requireApi();
    const dbUpdateData: Database['public']['Tables']['profiles']['Update'] = {
        name: profileData.name,
        location: profileData.location,
        age: profileData.age,
        categories: profileData.categories,
        description: profileData.description,
        gallery: profileData.gallery,
        premium_contact: profileData.premiumContact,
        unlock_cost: profileData.unlockCost,
    };
    const { data, error } = await supabase.from('profiles').update(dbUpdateData).eq('id', profileData.id).select().single();
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to update profile.');
    const { premium_contact, unlock_cost, ...rest } = data;
    return { ...rest, premiumContact: premium_contact, unlockCost: unlock_cost };
};

export const deleteProfile = async (profileId: string): Promise<void> => {
    requireApi();
    const { error } = await supabase.from('profiles').delete().eq('id', profileId);
    if (error) throw new Error(error.message);
};

// --- UNLOCKS & TRANSACTIONS ---
export const unlockProfile = async (profileId: string): Promise<void> => {
    requireApi();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
        throw new Error("User is not authenticated.");
    }
    const user = session.user;

    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('unlock_cost, name')
        .eq('id', profileId)
        .single();
    
    if (profileError || !profileData) throw new Error("Could not fetch profile details.");

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single();
    
    if (userError || !userData) throw new Error("Could not fetch user credits.");

    const unlockCost = profileData.unlock_cost;
    const profileName = profileData.name;
    const userCredits = userData.credits;

    if (userCredits < unlockCost) {
        throw new Error("You do not have enough credits to unlock this profile.");
    }
    
    const newCredits = userCredits - unlockCost;
    const { error: updateError } = await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', user.id);

    if (updateError) {
        throw new Error("Failed to update user credits.");
    }

    const { error: unlockInsertError } = await supabase
        .from('unlocks')
        .insert({ user_id: user.id, profile_id: profileId });

    if (unlockInsertError) {
        await supabase
            .from('users')
            .update({ credits: userCredits })
            .eq('id', user.id);
        throw new Error(`Failed to create unlock record: ${unlockInsertError.message}`);
    }

    const { error: transactionInsertError } = await supabase
        .from('credit_transactions')
        .insert({
            user_id: user.id,
            amount: -unlockCost,
            type: 'unlock',
            description: `Unlocked profile: ${profileName}`
        });
    
    if (transactionInsertError) {
        console.error("CRITICAL: Failed to log credit transaction after unlocking profile.");
    }
};

// --- USER-SPECIFIC DATA ---
export const fetchUnlocksForUser = async (userId: string): Promise<Unlock[]> => {
    if (!isApiAvailable) return [];
    const { data, error } = await supabase
        .from('unlocks')
        .select('profile_id, created_at')
        .eq('user_id', userId);

    if (error) throw new Error(error.message);
    if (!data) return [];
    
    return data.map((u) => ({
        userId,
        profileId: u.profile_id,
        unlockedAt: u.created_at,
    }));
};

export const fetchTransactionsForUser = async (userId: string): Promise<CreditTransaction[]> => {
    if (!isApiAvailable) return [];
    const { data, error } = await supabase
        .from('credit_transactions')
        .select('id, description, amount, type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map((tx) => ({
        ...tx,
        userId,
        timestamp: tx.created_at,
    }));
};

// --- PAYMENTS ---
export const addPaymentRequest = async (userId: string, transactionId: string, proofFile: File): Promise<Payment> => {
    requireApi();
    // 1. Upload file to storage
    const fileExt = proofFile.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(filePath, proofFile);

    if (uploadError) {
        throw new Error('Failed to upload payment proof.');
    }
    
    // 2. Insert payment record into DB
    const paymentData: Database['public']['Tables']['payments']['Insert'] = { user_id: userId, transaction_id: transactionId, proof_url: filePath };
    const { data, error } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();
    
    if (error || !data) {
         await supabase.storage.from('payment_proofs').remove([filePath]);
         throw new Error(error ? error.message : "Failed to record payment after upload.");
    }
    
    const result = data;
    // Convert DB response to frontend type
    return {
        id: result.id,
        userId: result.user_id,
        proofUrl: result.proof_url,
        transactionId: result.transaction_id,
        status: result.status,
        timestamp: result.created_at,
    };
};

export const getPaymentProofUrl = async (proofPath: string): Promise<string | null> => {
    if (!isApiAvailable) return null;
    const { data, error } = await supabase.storage
        .from('payment_proofs')
        .createSignedUrl(proofPath, 60); // Create a URL that's valid for 60 seconds

    if (error) {
        console.error("Error creating signed URL:", error);
        return null;
    }
    
    return data.signedUrl;
}


// --- ADMIN ---
export const fetchAllUsers = async (): Promise<User[]> => {
    if (!isApiAvailable) return [];
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

export const fetchPayments = async (): Promise<Payment[]> => {
    if (!isApiAvailable) return [];
    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    if (!data) return [];
    
    return data.map((p) => ({
        id: p.id,
        userId: p.user_id,
        proofUrl: p.proof_url,
        transactionId: p.transaction_id,
        status: p.status,
        timestamp: p.created_at,
    }));
};

export const grantCredits = async (userId: string, amount: number, description: string): Promise<void> => {
    requireApi();
    const { error } = await supabase.rpc('grant_credits', {
        target_user_id: userId,
        amount_to_grant: amount,
        admin_description: description,
    });
    if (error) throw new Error(error.message);
};

export const approvePayment = async (paymentId: string, credits: number): Promise<void> => {
    requireApi();
    const { error } = await supabase.rpc('approve_payment', {
        payment_id_to_approve: paymentId,
        credits_to_award: credits,
    });
    if (error) throw new Error(error.message);
};

export const rejectPayment = async (paymentId: string): Promise<void> => {
    requireApi();
    const { error } = await supabase.from('payments').update({ status: 'rejected' }).eq('id', paymentId);
    if (error) throw new Error(error.message);
};