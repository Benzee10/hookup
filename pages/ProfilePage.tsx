import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { Profile } from '../types';

const LockedContact: React.FC<{ cost: number; onUnlock: () => void; }> = ({ cost, onUnlock }) => (
  <div className="bg-slate-100 p-6 rounded-lg text-center border-2 border-dashed border-slate-300">
    <div className="flex justify-center items-center mb-4">
        <div className="font-mono text-xl tracking-widest bg-slate-200 text-slate-500 rounded px-4 py-2 blur-sm select-none">
            **********
        </div>
    </div>
    <p className="text-slate-600 mb-4">Unlock premium contact information to connect directly.</p>
    <button onClick={onUnlock} className="bg-brand-secondary hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105">
      Unlock for {cost} Credits
    </button>
  </div>
);

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 mr-2" fill="currentColor">
      <path d="M16.75 13.96c.25.13.41.2.46.3.05.1.05.61-.02.66-.07.05-1.42.68-1.66.82-.24.14-.48.17-.73.04-.25-.13-1.04-.38-1.98-1.22-.73-.66-1.21-1.48-1.34-1.73-.13-.25-.01-.38.11-.51.11-.11.25-.28.38-.42.13-.14.17-.25.25-.41.08-.17.04-.33-.02-.46-.06-.13-.73-1.77-.99-2.42-.26-.65-.53-.55-.73-.55h-.22c-.2,0-.46.08-.7.38-.24.3-.92,1.04-.92,2.53s.95,2.94,1.08,3.14c.14.2,1.86,2.9,4.5,4.03.61.25,1.09.4,1.46.51.76.24,1.42.21,1.94.13.57-.09,1.75-.71,2-1.37s.25-1.24.17-1.37c-.07-.13-.25-.21-.52-.34zM12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 20c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9z" />
    </svg>
);

const UnlockedContact: React.FC<{ contact: string }> = ({ contact }) => {
    const isWhatsApp = contact.toLowerCase().startsWith('whatsapp:');
    let whatsAppNumber = '';
    if (isWhatsApp) {
        whatsAppNumber = contact.split(':')[1].replace(/[^0-9+]/g, '');
    }

    return (
        <div className="bg-green-50 p-6 rounded-lg text-center border-2 border-green-200">
            <p className="text-sm font-semibold text-green-700 mb-2">Contact Unlocked!</p>
            {isWhatsApp ? (
                <a
                    href={`https://wa.me/${whatsAppNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-2xl font-bold text-green-800 hover:text-green-900"
                >
                    <WhatsAppIcon />
                    <span>{contact.split(':')[1].trim()}</span>
                </a>
            ) : (
                <p className="text-2xl font-bold text-green-800">{contact}</p>
            )}
            <p className="text-xs text-slate-500 mt-2">Please be respectful when reaching out.</p>
        </div>
    );
};

const InsufficientCreditsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
        <div className="bg-white rounded-lg p-8 shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold text-red-600 mb-4">Insufficient Credits</h3>
            <p className="text-slate-600 mb-6">You don't have enough credits to unlock this profile.</p>
            <div className="flex justify-center gap-4">
                <Link to="/buy-credits" className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700">Buy Credits</Link>
                <button onClick={onClose} className="bg-slate-200 text-slate-700 font-semibold py-2 px-6 rounded-lg hover:bg-slate-300">Close</button>
            </div>
        </div>
    </div>
);

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();
  const { showNotification } = useNotification();
  const { profiles, hasUnlocked, unlockProfile: dataUnlockProfile } = useData();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false);

  useEffect(() => {
    const foundProfile = profiles.find(p => p.id === id);
    if (foundProfile) {
      setProfile(foundProfile);
    } else {
        // handle case where profile not found, maybe redirect
    }
  }, [id, profiles]);

  const handleUnlock = useCallback(async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!profile) return;

    if (user.credits >= profile.unlockCost) {
      try {
        await dataUnlockProfile(profile.id);
        await refreshUser(); // Refresh user to get updated credits
        showNotification("Profile unlocked successfully!", "success");
      } catch (error) {
        console.error("Failed to unlock:", error);
        showNotification((error as Error).message, "error");
      }
    } else {
      setShowInsufficientCreditsModal(true);
    }
  }, [user, profile, dataUnlockProfile, refreshUser, navigate, location, showNotification]);

  if (!profile) {
    return <div className="text-center p-10">Loading profile...</div>;
  }
  
  const isUnlocked = user ? hasUnlocked(profile.id) : false;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {showInsufficientCreditsModal && <InsufficientCreditsModal onClose={() => setShowInsufficientCreditsModal(false)} />}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img className="h-64 w-full object-cover md:h-full" src={profile.gallery[0]} alt={profile.name} />
          </div>
          <div className="p-8 md:w-1/2 flex flex-col justify-between">
            <div>
                <div className="uppercase tracking-wide text-sm text-brand-primary font-semibold">{profile.location}</div>
                <h1 className="block mt-1 text-4xl leading-tight font-extrabold text-black">{profile.name}</h1>
                <p className="mt-2 text-slate-500">Age: {profile.age}</p>
                <div className="flex flex-wrap gap-2 my-4">
                    {profile.categories.map(cat => (
                        <span key={cat} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{cat}</span>
                    ))}
                </div>
                <p className="mt-4 text-slate-600">{profile.description}</p>
            </div>
            <div className="mt-8">
                {isUnlocked ? (
                    <UnlockedContact contact={profile.premiumContact} />
                ) : (
                    <LockedContact cost={profile.unlockCost} onUnlock={handleUnlock} />
                )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profile.gallery.map((img, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md">
                      <img src={img} alt={`${profile.name} gallery image ${index + 1}`} className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300" />
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default ProfilePage;