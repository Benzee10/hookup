import React from 'react';

const ProfileCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white/50 rounded-[32px] border border-premium-ink/5 p-8 animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="w-2/3">
          <div className="h-8 bg-premium-ink/5 rounded-lg w-full mb-2"></div>
          <div className="h-3 bg-premium-ink/5 rounded w-1/2"></div>
        </div>
        <div className="h-5 bg-premium-ink/5 rounded-full w-20"></div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="h-6 bg-premium-ink/5 rounded-full w-16"></div>
        <div className="h-6 bg-premium-ink/5 rounded-full w-20"></div>
        <div className="h-6 bg-premium-ink/5 rounded-full w-14"></div>
      </div>
      
      <div className="space-y-3 mb-8">
        <div className="h-4 bg-premium-ink/5 rounded w-full"></div>
        <div className="h-4 bg-premium-ink/5 rounded w-full"></div>
        <div className="h-4 bg-premium-ink/5 rounded w-2/3"></div>
      </div>
      
      <div className="h-14 bg-premium-ink/5 rounded-full w-full"></div>
    </div>
  );
};

export default ProfileCardSkeleton;
