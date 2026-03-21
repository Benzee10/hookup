
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
  },
  {
    id: 'mia-1',
    created_at: new Date().toISOString(),
    name: 'Mia',
    location: 'Lagos / International',
    age: 24,
    interests: ['Parisian', 'Bilingual', 'Anal', 'Fetish'],
    bio: `**🌹 PARISIAN POISON – MIA ××× Naija's Eiffel Tower Temptress 🌹**  
**📍 Based Lagos | Travel to Paris, Milan, Amsterdam, Dubai, London, Johannesburg**

**Stats: 38DD-25-46 (curves that stop traffic, all natural)**  
**Skin: Velvety dark silk | Ass: Booty so phat it’s criminal | Lips: French-kiss & suck expert**

*Café gossip:*  
*“Mia va te ruiner pour toujours – she’ll ruin you forever.”*

**What I crave nightly:**
- **Deepthroat devastation** – choke me till tears & spit flow like Seine
- **Sloppy French kiss to blowjob** – transition to gagging & swallowing
- **Cowgirl conquest** – ride till tits slap & ass bounces in your face
- **Queening deluxe** – suffocate under nyash & pussy till I squirt champagne
- **Anal artiste** – RAW, deep, gaping, beg for creampie in my cul
- **Piss play chic** – golden on my tits/face, drink me while I moan
- **Bilingual bitch** – French whispers + Pidgin fire – “Baise-moi fort, daddy, casse mon toto”
- **Cum art** – CIM gorge, COB canvas, raw breeding, facials dripping
- **Group glamour** – MMF Eiffel sandwich, FFM licking, watch or join
- **Fetish flair** – Foot worship à la Paris, spit, choking, spanking till rosy

**No:**
- Rushed romance
- Broke tourists
- Boring vanilla

**Availability:**
Champs-Élysées quickies • Overnight in luxury suites • Weekend escapes • Fly-with-me luxury  
*Reply speed: Face pic + tribute proof = wet voice note incoming*

I’m the exotic poison in Paris.  
The one who makes French lovers jealous.  
The Naija siren who turns City of Love into City of Lust.

*Viens… let’s make Paris cum tonight 🔥🍑💦🗼*`,
    lookingFor: 'Parisian Poison',
    whatsapp: '+234-VIP-ONLY',
  },
  {
    id: 'serena-1',
    created_at: new Date().toISOString(),
    name: 'Serena',
    location: 'Lagos / London',
    age: 23,
    interests: ['British-Bred', 'Throat Goat', 'Anal', 'Kink'],
    bio: `**🌹 LONDON LUST – SERENA ××× Naija's British-Bred Freak 🌹**  
**📍 Lagos base | Regular in London, Manchester, Birmingham, Paris, Dubai, Accra**

**Stats: 36E-26-44 (natural bounce, ass that demands worship)**  
**Skin: Smooth midnight chocolate | Ass: Thunderclap thick | Lips: Cock-worship specialist**

*They say in the pubs:*  
*“Serena will fuck the sense out of you & have you calling her madam.”*

**My go-to pleasures:**
- **Throat goat** – slam it down till I’m crying & drooling, no mercy
- **Nasty BJ** – spit trails, deep gags, swallow with eye contact
- **Doggy demolition** – clapback so loud neighbors complain, arch & beg deeper
- **Facesitting queen** – drown you in wet pussy & ass till you tap out
- **Anal enthusiast** – RAW stretching, gaping, “Fill my yansh daddy” pleas
- **Golden fun** – piss on me or in my mouth, I reciprocate filthily
- **Accent play** – Full British posh to raw Pidgin – “Pound this black cunt proper, yeah?”
- **Finish freestyle** – CIM, COB explosions, raw creampie fantasy, facials, swallow
- **Multi fun** – MMF spitroast, FFM clit & dick sharing, orgy vibes
- **Kinks** – Spit play heavy, choking, spanking red, foot fetish, light bondage

**Hard passes:**
- Time-wasters
- Cheap vibes
- Shy boys

**Availability:**
Quick city meets • Overnight in Mayfair • Weekend countryside fucks • International flights  
*Fast WhatsApp – face + tribute = instant dripping response*

Not your average girl.  
The one who turns London lads into addicts.  
The chocolate import that ruins local pussy forever.

*Come claim your British-Naija fantasy.*  
*Serena dey wait make you scatter am 🔥🍑💦🇬🇧*`,
    lookingFor: 'London Lust',
    whatsapp: '+234-VIP-ONLY',
  },
  {
    id: 'layla-1',
    created_at: new Date().toISOString(),
    name: 'Layla',
    location: 'Lagos / Dubai',
    age: 24,
    interests: ['Dubai Luxury', 'Heavy Tits', 'Anal', 'Watersports'],
    bio: `**🌹 DESERT SIREN – LAYLA ××× Dubai's Hottest Naija Secret 🌹**  
**📍 Lagos | Frequent in Dubai, Abu Dhabi, Doha, Riyadh, London, Paris on request**

**Stats: 34G-25-45 (all real, tits so heavy they swing hypnotically)**  
**Skin: Luscious dark cocoa | Ass: Desert dune curves | Lips: Supreme suck pillows**

*Whispers in the hotel lobbies:*  
*“Layla go drain you dry & leave you broke & smiling.”*

**What sets my pussy throbbing:**
- **Gagging marathons** – deep RAW throat till mascara ruins & I’m begging through gurgles
- **Spit-soaked head** – sloppy, noisy, ball-draining – swallow like it’s holy water
- **Missionary with legs pinned** – stare in my eyes while you drill deep & I cream
- **Ass smothering** – bury your face in this fat nyash till I ride your tongue to orgasm
- **Anal onlyfans-level** – take every inch RAW, gape me, creampie my backdoor
- **Piss princess** – drench my body, let me taste, or watch me piss while riding
- **Dirty talk switch** – Naija slang to posh English – “Fuck this Toto hard na, daddy”
- **Cum playground** – CIM swallow, COB ropes on face/tits, breeding kink, facials galore
- **Threesome/threesome+** – DP dreams, FFM pussy feast, group play if you bring friends
- **Fetish heaven** – Oil rubs, foot jobs, choking, hair-pulling, spanking till I bruise beautifully

**No:**
- Bargain hunters
- Liars
- Guys who finish too quick

**Availability:**
Luxury hotel quickies • Overnight in penthouses • Weekend yacht trips • VIP travel companion  
*Instant reply – face pic + tribute proof gets you my wettest selfies*

I’m the luxury escort fantasy.  
The one who turns Dubai nights into legends.  
The Naija queen who makes billionaires beg.

*Slide in… let’s make Dubai shake tonight 🔥🍑💦🕌*`,
    lookingFor: 'Desert Siren',
    whatsapp: '+234-VIP-ONLY',
  },
  {
    id: 'kiara-1',
    created_at: new Date().toISOString(),
    name: 'Kiara',
    location: 'Lagos / Johannesburg',
    age: 25,
    interests: ['Diamond Domme', 'Anal Pro', 'Group Expert', 'Kink'],
    bio: `**🌹 DIAMOND DOMME – KIARA ××× Johannesburg's Naughtiest Import 🌹**  
**📍 Lagos base | Travel to Johannesburg, Cape Town, Durban, Accra, Dubai, London on request**

**Stats: 36DD-24-42 (surgery-free, perky tits & ass carved for worship)**  
**Skin: Deep caramel shine | Ass: Bubble so round it hypnotizes | Lips: Made to wrap & drain**

*They warn their friends:*  
*“Kiara no be joke – she go own your dick & your mind.”*

**My favorite ways to break you:**
- **Throat destruction** – ram it deep till I choke & puke spit, eyes rolling back
- **Sloppy dome deluxe** – strings of drool, ball-licking, ass-eating finish with swallow
- **Prone bone smashing** – pin me flat, pound till my cheeks ripple & I scream in Zulu-tinged moans
- **Facesit & ride** – grind this juicy pussy till you’re gasping & coated in my squirt
- **Ass worship & anal pro** – RAW gaping, prostate milking, beg me to fist or take your fist
- **Golden rain giver/receiver** – shower me daddy, I’ll kneel & open wide
- **Multilingual filth** – Pidgin, English, light Zulu – “Hit it harder baba, make me wet pass rain”
- **Finish options** – Deep throat CIM, tits/ass COB, raw creampie (clean only), facials, swallow games
- **Group expert** – MMF spitroast, FFM clit-licking threesomes, watch me get used
- **Kink menu** – Foot domination, spit facials, breath play, rough spanking, light dom/sub play

**Won’t do:**
- Rush jobs
- Cheap talk
- Vanilla-only guys
- Anyone who can’t keep up

**Availability:**
Daytime drain sessions • Overnight ownership • Weekend slave escapes • International bookings  
*Quick WhatsApp – send face + tribute, I’ll send a teaser vid of me fingering to your name*

I’m the high-class freak your wallet fears.  
The one who makes you question everything.  
The chocolate domme who turns fantasies into addiction.

*Come get ruined in Jozi style.*  
*Kiara waiting to claim her next victim.*

*WhatsApp me… let’s make it messy tonight 🔥🍑💦👑*`,
    lookingFor: 'Diamond Domme',
    whatsapp: '+234-VIP-ONLY',
  },
  {
    id: 'zara-1',
    created_at: new Date().toISOString(),
    name: 'Zara',
    location: 'Enugu / International',
    age: 22,
    interests: ['Midnight Vixen', 'Massive Tits', 'Anal Fiend', 'Threesome'],
    bio: `**🌹 MIDNIGHT VIXEN – ZARA ××× Enugu's Thickest Temptation 🌹**  
**📍 Based in Enugu | Travel to Abuja, PH, Calabar, Accra, Johannesburg, Dubai on request**

**Stats: 38F-27-46 (pure natural, massive tits that smother & bounce like crazy on top)**  
**Skin: Rich ebony glow | Ass: Explosive nyash that jiggles for days | Lips: Full, cock-sucking perfection**

*Word on the street:*  
*“Zara go make you cum so hard you forget your mama name.”*

**What I live to do (and get soaking wet doing):**
- **Face-fucking** till I’m gagging, tears streaming, spit everywhere – I deepthroat like it’s oxygen
- **Messy, noisy blowjobs** – slobber, gargle, swallow your load like garri & soup
- **Reverse cowgirl pounding** – watch this fat ass clap & ripple while I grind your dick to death
- **Queening supreme** – sit my dripping pussy & heavy cheeks on your face till I cum buckets
- **Anal fiend** – RAW only, stretch me wide, make me gape & beg “Pour am inside my yansh daddy”
- **Watersports slut** – piss all over my body/tits/mouth, I’ll drink & squirt back if you’re nasty enough
- **Accent switch dirty talk** – Pure Igbo fire + sultry British – “Abeg fuck me scatter, you too sweet”
- **Cum anywhere** – CIM gulping, COB glazing my face & boobs, creampie breeding dreams, facials that drip
- **Threesome ready** – MMF airtight, FFM pussy eating while getting railed, gangbang vibes welcome
- **Fetish addict** – Toe sucking, heavy spit swaps, choking till dizzy, hair-yank, spanking till purple welts

**No-go’s:**
- Fakers
- Broke dudes
- Time-wasters
- Guys scared of a girl who cums louder than thunder

**Availability:**
Quick morning nut-busters • Lunchtime hotel specials • All-night marathons • Weekend trips • Fly-me-out adventures  
*Fast replies – drop face pic + small tribute proof, watch me get horny instantly*

I’m not here to play nice.  
I’m the one who ruins marriages quietly.  
The secret addiction that has you checking WhatsApp every 5 minutes.  
The Ebony goddess who turns good boys into cum-drunk fiends.

*Real Igbo heat. Dripping wet. Zero mercy.*  
*Zara ready to make you explode & crawl back for more.*

*Hit my WhatsApp… tell me how deep you wanna go tonight 🔥🍑💦😈*`,
    lookingFor: 'Midnight Vixen',
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
