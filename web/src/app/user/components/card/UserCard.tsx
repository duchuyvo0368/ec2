/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import Link from 'next/link';
import { UserCardProps } from '../../api/type';
import { UserPlus, X } from 'lucide-react';
import { useUserCard } from '../../hooks/useUserCard';

const UserCard: React.FC<UserCardProps> = ({
    userId,
    name,
    avatar,
    mutualFriends = 0,
    followersCount
}) => {
    const { loading, removed, handleAddFriend } = useUserCard(userId);

    if (removed) return null; 

    return (
        <div className="bg-white rounded-md shadow  hover:shadow-lg border border-gray-200 w-[158px] overflow-hidden flex flex-col items-center transition-all duration-200">
            {/* Cover */}
            <div className="relative w-full h-16 bg-[url('https://file.apetavers.com/api/files/admin/20241226/3d48b567-fd61-415d-a2bc-aa09966a05cd.png')] bg-cover bg-center">
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-6">
                    <img
                        src={avatar}
                        alt={name}
                        className="w-14 h-14 rounded-full border-3 border-white shadow-md object-cover bg-gray-100"
                    />
                </div>
            </div>

            {/* Info */}
            <div className="mt-8 text-center px-3">
                <Link href={`/profile/${userId}`} className="no-underline">
                    <h3 className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                        {name}
                    </h3>
                    <p className="text-xs text-gray-500">{mutualFriends}</p>
                    <p className="text-xs text-gray-500">{followersCount} followers</p>
                </Link>
            </div>

            {/* Action */}
            <div className="flex flex-col gap-2 w-full px-3 py-3">
                <button
                    disabled={loading}
                    onClick={handleAddFriend}
                    className="flex items-center justify-center gap-2 w-full py-1.5 text-sm rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    {loading ? 'Processing...' : 'Add Friend'}
                </button>
                <button
                    className="flex items-center justify-center gap-2 w-full py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
                >
                    <X size={16} />
                    Remove
                </button>
            </div>
        </div>
    );
};

export default UserCard;
