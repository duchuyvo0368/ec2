import React from 'react';

const SkeletonProfile: React.FC = () => (
  <div className="animate-pulse space-y-4 p-6">
    <div className="h-40 bg-gray-200 rounded-lg" />
    <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mt-[-48px]" />
    <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
    <div className="h-3 w-48 bg-gray-100 rounded mx-auto" />
    <div className="flex justify-center gap-6 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-4 w-20 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
);

export default SkeletonProfile;
