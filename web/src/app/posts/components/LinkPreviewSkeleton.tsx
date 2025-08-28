import React from 'react';

const LinkPreviewSkeleton: React.FC = () => (
  <div className="border rounded overflow-hidden mt-2 mb-2 w-full max-w-md mx-auto animate-pulse">
    <div className="w-full h-20 bg-gray-200 flex items-center justify-center" />
    <div className="p-2">
      <div className="w-24 h-3 bg-gray-200 rounded mb-1" />
      <div className="w-32 h-2 bg-gray-100 rounded mb-1" />
      <div className="w-20 h-2 bg-gray-100 rounded" />
    </div>
  </div>
);

export default LinkPreviewSkeleton; 