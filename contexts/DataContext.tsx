
import React, { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';
import { Profile } from '../types';
import * as api from '../services/api';
import { NotificationContext } from './NotificationContext';

interface DataContextType {
  profiles: Profile[];
  loadingProfiles: boolean;
  addProfile: (profile: Omit<Profile, 'id' | 'created_at'>) => Promise<Profile>;
  updateProfile: (profile: Profile) => Promise<Profile>;
  deleteProfile: (profileId: string) => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

const MOCK_PROFILES: Profile[] = [
  {
    id: 'naomi-1',
    created_at: new Date().toISOString(),
    name: 'Naomi',
    location: 'Lagos / London',
    age: 24,
    interests: ['Naughty', 'Roleplay', 'Dirty Talk', 'Passion'],
    bio: `**💋 NAOMI – Your Naughty Naija Fantasy 🇳🇬🔥**  
**Lagos-born, London-raised, body built for sin**

Hey love… you’ve been scrolling too long looking for something real, something filthy, something that actually makes your cock twitch the second you read it.  
Well stop. You just found her.

I’m Naomi – 24, 5’6 of thick, chocolate curves that don’t quit.  
Soft waist → fat juicy ass → heavy natural tits that spill out of everything I wear.  
Smooth dark skin that glows under bedroom lights, long legs that lock around your back, and a smile that says “I already know what you want to do to me.”

I talk dirty in that sweet Naija accent that makes men weak.  
I moan your name like a prayer when you hit it right.  
I ride like I’m trying to break the bedframe and suck like I’m starving for every last drop.

**What I crave (and what I do best):**
- Deep sloppy throat sessions till my mascara runs and your balls are empty  
- Ass clapping back while you grip my waist and call me your little African slut  
- Sitting on your face till my thighs shake and you’re drowning in sweet wet pussy  
- Taking it raw from behind while I arch and beg you to go deeper, harder, fill me up  
- Roleplay – your innocent church girl gone bad, your bossy sugar baby, your obedient cum-dump princess… whatever makes you throb  
- Passionate tongue kissing that turns into animalistic fucking in under 60 seconds

I’m not the shy type.  
I’ll send you voice notes moaning while I finger myself thinking about your dick.  
I’ll send mirror selfies with my ass oiled up and my thong pulled to the side saying “this is waiting for you tonight.”  
I love being told how nasty I am, how much of a whore I look like when I’m gagging or creaming.

Clean, discreet, always freshly shaved/waxed, smelling like vanilla and sin.  
I show up smelling good, looking better, and leave you drained, shaking, and already texting me for round 2.

**If you want a proper good-girl-gone-wrong Nigerian queen who fucks like she hates you and kisses you like she loves you…**  
I’m your girl.

Slide in my DMs and tell me exactly how you want to ruin me tonight.  
I don’t bite… unless you beg nicely 😈🍑

Naomi xoxo  
Your favourite dark-skinned fantasy`,
    lookingFor: 'Your Naughty Naija Fantasy',
    whatsapp: '+234-VIP-ONLY',
  },
  {
    id: 'amara-1',
    created_at: new Date().toISOString(),
    name: 'Amara',
    location: 'Lagos Island / International',
    age: 23,
    interests: ['Ebony', 'Natural', 'Travel', 'Intense'],
    bio: `**🌹 EBONY QUEEN – AMARA ××× Lagos' Wettest Nightmare 🌹**  
**📍 Lagos Island Queen | Ready to invade Abuja, PH, Enugu, Accra, Dubai, UK**

**Stats: 34E-25-48 (all natural, heavy tits that slap your face when I ride)**

I'm Amara, 23, and I'm here to turn your nights into a beautiful, wet disaster. I'm a 5'5" ebony powerhouse with curves that are 100% natural and 100% dangerous. 

If you're looking for a girl who knows how to use what she's got, you've found her. My stats don't lie – I'm built for pleasure and I'm not afraid to take charge. Whether it's a quiet night in Lagos or a wild trip to Dubai or the UK, I'm ready to be your favorite escape.

**What you can expect:**
- Intense, all-natural curves that demand attention
- A wild spirit that's ready to travel and explore with you
- Unforgettable sessions where I'm not afraid to get loud and messy
- The kind of energy that stays with you long after the night is over

I'm currently based on Lagos Island, but I'm always ready to pack my bags for the right person. Abuja, PH, Enugu, Accra... or even further.

Are you ready for the nightmare you'll never want to wake up from?

Amara xoxo  
Your Ebony Queen`,
    lookingFor: "Lagos' Wettest Nightmare",
    whatsapp: '+234-VIP-ONLY',
  }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const notificationContext = useContext(NotificationContext);

  const loadInitialData = useCallback(async () => {
    setLoadingProfiles(true);
    try {
      const fetchedProfiles = await api.fetchProfiles();
      
      // If no profiles found in Supabase or LocalStorage, seed with MOCK_PROFILES
      if (fetchedProfiles.length === 0) {
        setProfiles(MOCK_PROFILES);
      } else {
        setProfiles(fetchedProfiles);
      }
    } catch (error) {
      console.warn("DataContext: Error loading profiles, using mock data:", error);
      setProfiles(MOCK_PROFILES);
    } finally {
      setLoadingProfiles(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  
  const addProfile = async (profileData: Omit<Profile, 'id' | 'created_at'>) => {
    const newProfile = await api.addProfile(profileData);
    setProfiles(prev => [...prev, newProfile]);
    return newProfile;
  };

  const updateProfile = async (profileData: Profile) => {
    const updatedProfile = await api.updateProfile(profileData);
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    return updatedProfile;
  };
  
  const deleteProfile = async (profileId: string) => {
    await api.deleteProfile(profileId);
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };
  
  return (
    <DataContext.Provider value={{ 
        profiles, loadingProfiles, addProfile, updateProfile, deleteProfile
    }}>
      {children}
    </DataContext.Provider>
  );
};
