import React from 'react';

const ProfileCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-56 bg-slate-200"></div>
      <div className="p-6">
        <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-4 bg-slate-200 rounded-full w-20"></div>
          <div className="h-4 bg-slate-200 rounded-full w-24"></div>
        </div>
        <div className="space-y-2 mb-6">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
        <div className="h-10 bg-slate-300 rounded-lg w-full"></div>
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;
