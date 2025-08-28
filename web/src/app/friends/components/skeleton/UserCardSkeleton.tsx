import React from 'react';

const UserCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-l shadow border border-gray-200 w-[158px] overflow-hidden flex flex-col items-center animate-pulse">
            {/* Header background */}
            <div className="relative w-full h-16 bg-gray-200" />

            {/* Avatar */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-16 h-16 rounded-full bg-gray-300 border-2 border-white" />

            {/* Name and info */}
            <div className="mt-8 text-center px-3 w-full flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 w-full px-3 py-3 mt-auto">
                <div className="h-8 bg-gray-200 rounded w-full" />
                <div className="h-8 bg-gray-200 rounded w-full" />
            </div>
        </div>
    );
};

export default UserCardSkeleton;
