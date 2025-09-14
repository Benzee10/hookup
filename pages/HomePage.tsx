
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import ProfileCard from '../components/ProfileCard';
import FilterBar from '../components/FilterBar';
import ProfileCardSkeleton from '../components/ProfileCardSkeleton';

const HomePage: React.FC = () => {
  const { profiles, loadingProfiles } = useData();
  const [filters, setFilters] = useState({ location: '', category: '' });

  const uniqueLocations = useMemo(() => {
    const locations = profiles.map(p => p.location);
    return [...new Set(locations)];
  }, [profiles]);

  const uniqueCategories = useMemo(() => {
    const categories = profiles.flatMap(p => p.categories);
    return [...new Set(categories)];
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const locationMatch = filters.location ? profile.location === filters.location : true;
      const categoryMatch = filters.category ? profile.categories.includes(filters.category) : true;
      return locationMatch && categoryMatch;
    });
  }, [profiles, filters]);
  
  return (
    <div className="animate-fade-in">
      <section className="text-center py-16 md:py-24 bg-white rounded-lg shadow-sm mb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark mb-4 leading-tight">Find Your Ideal Service Provider</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">Browse our curated list of professionals. Unlock their contact details using credits and connect directly.</p>
          <a href="#profiles-grid" className="bg-brand-primary hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform hover:scale-105 inline-block">
            View Profiles
          </a>
        </div>
      </section>

      <FilterBar 
        locations={uniqueLocations} 
        categories={uniqueCategories} 
        onFilterChange={setFilters} 
      />

      <div id="profiles-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loadingProfiles ? (
          Array.from({ length: 8 }).map((_, index) => <ProfileCardSkeleton key={index} />)
        ) : (
          filteredProfiles.length > 0 ? (
            filteredProfiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-700">No Profiles Found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your filters or check back later!</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default HomePage;