import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useData } from '../hooks/useData';
import { Profile } from '../types';

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 mr-2" fill="currentColor">
      <path d="M16.75 13.96c.25.13.41.2.46.3.05.1.05.61-.02.66-.07.05-1.42.68-1.66.82-.24.14-.48.17-.73.04-.25-.13-1.04-.38-1.98-1.22-.73-.66-1.21-1.48-1.34-1.73-.13-.25-.01-.38.11-.51.11-.11.25-.28.38-.42.13-.14.17-.25.25-.41.08-.17.04-.33-.02-.46-.06-.13-.73-1.77-.99-2.42-.26-.65-.53-.55-.73-.55h-.22c-.2,0-.46.08-.7.38-.24.3-.92,1.04-.92,2.53s.95,2.94,1.08,3.14c.14.2,1.86,2.9,4.5,4.03.61.25,1.09.4,1.46.51.76.24,1.42.21,1.94.13.57-.09,1.75-.71,2-1.37s.25-1.24.17-1.37c-.07-.13-.25-.21-.52-.34zM12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 20c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9z" />
    </svg>
);

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { profiles } = useData();
  const [profile, setProfile] = useState<Profile | null>(null);
  const isLocked = true; // Always locked on this page, funnel to VIP

  useEffect(() => {
    const foundProfile = profiles.find(p => p.id === id);
    if (foundProfile) {
      setProfile(foundProfile);
    }
  }, [id, profiles]);

  if (!profile) {
    return <div className="text-center p-10 font-sans text-slate-500">Loading profile...</div>;
  }
  
  return (
    <div className="max-w-3xl mx-auto animate-fade-in px-6 py-12 md:py-20">
      <Link to="/" className="inline-flex items-center text-premium-muted hover:text-premium-ink mb-12 transition-colors text-xs uppercase tracking-widest font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Discover
      </Link>

      <div className="bg-white/80 backdrop-blur-md rounded-[40px] border border-premium-ink/5 overflow-hidden p-10 md:p-20 shadow-2xl shadow-premium-ink/5">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-light text-premium-ink mb-4 tracking-tighter leading-none">
            {profile.name}, <span className="italic font-serif text-premium-accent">{profile.age}</span>
          </h1>
          <p className="text-premium-muted text-xs uppercase tracking-[0.3em] font-medium">{profile.location}</p>
          <div className="flex justify-center flex-wrap gap-3 mt-8">
            {profile.interests.map(interest => (
              <span key={interest} className="text-premium-muted text-[10px] px-4 py-1.5 rounded-full border border-premium-ink/10 uppercase tracking-widest">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-16 mb-20">
          <div className="space-y-8 bg-white/40 p-10 rounded-[40px] border border-premium-ink/5 shadow-inner">
            <h3 className="text-[10px] font-bold text-premium-muted uppercase tracking-[0.3em] border-b border-premium-ink/5 pb-4">Profile Story</h3>
            <div className="prose prose-slate max-w-none text-premium-ink/90 leading-relaxed font-serif text-lg">
              <ReactMarkdown>{profile.bio}</ReactMarkdown>
            </div>
          </div>
          <div className="space-y-4 bg-premium-ink/5 p-8 rounded-[32px]">
            <h3 className="text-[10px] font-bold text-premium-muted uppercase tracking-[0.2em]">Looking For</h3>
            <p className="text-premium-ink/80 leading-relaxed text-sm font-light italic">"{profile.lookingFor}"</p>
          </div>
        </div>

        {isLocked ? (
          <div className="bg-premium-bg rounded-[32px] p-10 text-center border border-premium-ink/5">
            <h3 className="text-2xl font-light text-premium-ink mb-3 tracking-tight">Contact Locked</h3>
            <p className="text-premium-muted text-sm mb-12 max-w-md mx-auto font-light leading-relaxed">
              To maintain the exclusivity of our community, direct contact information is reserved for verified members.
            </p>
            
            <div className="flex justify-center">
              <Link 
                to="/vip"
                className="group relative bg-premium-ink hover:bg-premium-accent p-8 rounded-[24px] transition-all text-left text-white hover:shadow-xl hover:shadow-premium-accent/20 w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Premium</span>
                  <span className="text-[9px] bg-white/10 text-white px-3 py-1 rounded-full uppercase font-bold">Instant Access</span>
                </div>
                <h4 className="text-xl font-light mb-2">Join VIP</h4>
                <p className="text-xs text-white/60 leading-relaxed font-light">Skip all verifications and get lifetime access to all profiles.</p>
              </Link>
            </div>
            
            <p className="text-[9px] text-premium-muted mt-10 uppercase tracking-[0.3em] font-bold">Premium Secure Connection</p>
          </div>
        ) : (
          <div className="bg-emerald-50/50 rounded-[32px] p-12 text-center border border-emerald-100 animate-fade-in">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
              <WhatsAppIcon />
            </div>
            <h3 className="text-2xl font-light text-emerald-900 mb-2 tracking-tight">Access Granted</h3>
            <p className="text-emerald-700/70 text-sm mb-10 font-light">You can now initiate a direct conversation with {profile.name}.</p>
            <a 
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-5 px-10 rounded-full transition-all w-full uppercase tracking-widest shadow-2xl shadow-emerald-200"
            >
              <WhatsAppIcon />
              Message on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;