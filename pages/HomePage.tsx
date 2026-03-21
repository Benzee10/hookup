
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import ProfileCard from '../components/ProfileCard';
import ProfileCardSkeleton from '../components/ProfileCardSkeleton';

const HomePage: React.FC = () => {
  const { profiles, loadingProfiles } = useData();
  
  // Check if we are using mock data (this is a bit hacky but works for this demo)
  // We know mock data IDs are '1', '2', '3'
  const isUsingMockData = useMemo(() => {
    return profiles.length > 0 && profiles.some(p => ['1', '2', '3'].includes(p.id)) && profiles.length <= 3;
  }, [profiles]);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6">
      {isUsingMockData && !loadingProfiles && (
        <div className="mt-8 p-4 bg-premium-accent/10 border border-premium-accent/20 rounded-2xl text-center">
          <p className="text-xs text-premium-accent uppercase tracking-widest font-medium">
            Offline Mode • Showing Curated Profiles
          </p>
          <p className="text-[10px] text-premium-muted mt-1">
            The live connection is currently unavailable. You are viewing our offline catalog.
          </p>
        </div>
      )}
      
      <section className="text-center py-20 md:py-32">
        <div className="container mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-light text-premium-ink mb-8 tracking-tighter leading-none">
            The Art of <span className="italic font-serif text-premium-accent">Connection</span>
          </h1>
          <p className="text-lg md:text-xl text-premium-muted max-w-xl mx-auto mb-16 font-light leading-relaxed">
            Curated profiles for those who value depth. Unlock exclusive access to direct communication.
          </p>
          <div className="w-16 h-[1px] bg-premium-accent mx-auto opacity-50"></div>
        </div>
      </section>

      <div id="profiles-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
        {loadingProfiles ? (
          Array.from({ length: 6 }).map((_, index) => <ProfileCardSkeleton key={index} />)
        ) : profiles.length > 0 ? (
          profiles.map(profile => (
            <ProfileCard key={profile.id} profile={profile} />
          ))
        ) : (
          <div className="col-span-full text-center py-24 bg-white/50 border border-premium-ink/5 rounded-3xl">
            <h3 className="text-xl font-light text-premium-ink">No Profiles Available</h3>
            <p className="text-premium-muted mt-2 text-sm">Our curators are working on new additions.</p>
          </div>
        )}
      </div>

      <footer className="text-center py-16 border-t border-premium-ink/5">
        <p className="text-[10px] text-premium-muted uppercase tracking-[0.2em] font-medium">
          © 2026 Premium Connect • Private • Secure • Exclusive
        </p>
      </footer>
    </div>
  );
};

export default HomePage;