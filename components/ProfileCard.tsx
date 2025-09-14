
import React from 'react';
import { Link } from 'react-router-dom';
import { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 animate-fade-in">
      <div className="relative">
        <img className="w-full h-56 object-cover" src={profile.gallery[0]} alt={profile.name} />
        <div className="absolute top-0 right-0 bg-brand-primary text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
          {profile.location}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{profile.name}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.categories.slice(0, 3).map(cat => (
            <span key={cat} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{cat}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm mb-6 line-clamp-3">{profile.description}</p>
        <Link 
          to={`/profile/${profile.id}`} 
          className="w-full text-center block bg-brand-primary hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;