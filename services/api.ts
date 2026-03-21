import { supabase, isApiAvailable } from './supabaseClient';
import { Profile } from '../types';
import type { Database } from './database.types';

// Helper to check for API availability and throw a clear error for write operations
const requireApi = () => {
    if (!isApiAvailable) {
        throw new Error("This feature is disabled. The application is not connected to a backend.");
    }
};

// --- LOCAL STORAGE FALLBACK ---
const STORAGE_KEY = 'premium_connect_profiles';

const getLocalProfiles = (): Profile[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveLocalProfiles = (profiles: Profile[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

// --- PROFILES ---
export const fetchProfiles = async (): Promise<Profile[]> => {
    try {
        if (!isApiAvailable) return getLocalProfiles();
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (error) throw new Error(error.message);
        if (!data) return getLocalProfiles();
        
        const profiles = data.map((p) => {
            const { looking_for, ...rest } = p;
            return { ...rest, lookingFor: looking_for };
        });
        
        // Sync with local storage
        if (profiles.length > 0) {
            saveLocalProfiles(profiles);
        }
        
        return profiles;
    } catch (error) {
        console.warn("Supabase fetch failed, falling back to local storage:", error);
        return getLocalProfiles();
    }
};

export const addProfile = async (profileData: Omit<Profile, 'id' | 'created_at'>): Promise<Profile> => {
    const newProfile: Profile = {
        ...profileData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
    };

    try {
        if (isApiAvailable) {
            const dbData: Database['public']['Tables']['profiles']['Insert'] = {
                name: profileData.name,
                location: profileData.location,
                age: profileData.age,
                interests: profileData.interests,
                bio: profileData.bio,
                looking_for: profileData.lookingFor,
                whatsapp: profileData.whatsapp,
            };
            const { data, error } = await supabase.from('profiles').insert(dbData).select().single();
            if (!error && data) {
                const { looking_for, ...rest } = data;
                const syncedProfile = { ...rest, lookingFor: looking_for };
                const local = getLocalProfiles();
                saveLocalProfiles([...local, syncedProfile]);
                return syncedProfile;
            }
        }
    } catch (error) {
        console.warn("Supabase insert failed, using local storage only:", error);
    }

    const local = getLocalProfiles();
    saveLocalProfiles([...local, newProfile]);
    return newProfile;
};

export const updateProfile = async (profileData: Profile): Promise<Profile> => {
    try {
        if (isApiAvailable) {
            const dbUpdateData: Database['public']['Tables']['profiles']['Update'] = {
                name: profileData.name,
                location: profileData.location,
                age: profileData.age,
                interests: profileData.interests,
                bio: profileData.bio,
                looking_for: profileData.lookingFor,
                whatsapp: profileData.whatsapp,
            };
            const { data, error } = await supabase.from('profiles').update(dbUpdateData).eq('id', profileData.id).select().single();
            if (!error && data) {
                const { looking_for, ...rest } = data;
                const updated = { ...rest, lookingFor: looking_for };
                const local = getLocalProfiles();
                saveLocalProfiles(local.map(p => p.id === updated.id ? updated : p));
                return updated;
            }
        }
    } catch (error) {
        console.warn("Supabase update failed, using local storage only:", error);
    }

    const local = getLocalProfiles();
    const updatedLocal = local.map(p => p.id === profileData.id ? profileData : p);
    saveLocalProfiles(updatedLocal);
    return profileData;
};

export const deleteProfile = async (profileId: string): Promise<void> => {
    try {
        if (isApiAvailable) {
            const { error } = await supabase.from('profiles').delete().eq('id', profileId);
            if (error) console.warn("Supabase delete failed:", error.message);
        }
    } catch (error) {
        console.warn("Supabase delete failed, removing from local storage only:", error);
    }

    const local = getLocalProfiles();
    saveLocalProfiles(local.filter(p => p.id !== profileId));
};
