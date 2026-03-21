
import React from 'react';
import { Link } from 'react-router-dom';
import { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-[32px] shadow-xl shadow-premium-ink/5 border border-premium-ink/5 overflow-hidden transition-all hover:shadow-2xl hover:shadow-premium-ink/10 animate-fade-in p-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-light text-premium-ink tracking-tight">{profile.name}, <span className="italic font-serif text-premium-accent">{profile.age}</span></h3>
          <p className="text-premium-muted text-[10px] uppercase tracking-widest font-medium mt-1">{profile.location}</p>
        </div>
        <span className="bg-premium-accent/10 text-premium-accent text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {profile.lookingFor}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {profile.interests.slice(0, 3).map(interest => (
          <span key={interest} className="text-premium-muted text-[9px] px-3 py-1 rounded-full border border-premium-ink/10 uppercase tracking-widest">
            {interest}
          </span>
        ))}
      </div>
      
      <p className="text-premium-ink/70 text-sm mb-8 line-clamp-3 italic leading-relaxed whitespace-pre-wrap font-serif">
        {profile.bio}
      </p>
      
      <Link 
        to={`/profile/${profile.id}`} 
        className="w-full text-center block bg-premium-ink hover:bg-premium-accent text-white font-semibold py-4 px-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-premium-ink/10"
      >
        Connect Now
      </Link>
    </div>
  );
};

export default ProfileCard;