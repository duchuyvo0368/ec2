/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import UserCard from '../card/UserCard';
import UserCardSkeleton from '../../../friends/components/skeleton/UserCardSkeleton';
import { useUserGrid } from '../../hooks/useUserGrid';

const UserGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { users, loading, loaderRef, page, totalPages } = useUserGrid(12);

    return (
        <div className={`flex flex-col ${className} pb-20`}>
            {/* User grid */}
            <div className="flex flex-wrap gap-2  ">
                {users.map((user) => (
                    <UserCard
                        key={user.id}
                        userId={user.id}
                        name={user.name}
                        avatar={user.img}
                        followersCount={parseInt(user.followersCount || '0')}
                        mutualFriends="2 mutual friends"
                        isFollowing={user.isFollowing}
                    />
                ))}

                {loading &&
                    Array.from({ length: 12 }).map((_, index) => (
                        <UserCardSkeleton key={index} />
                    ))}
            </div>

            {/* Observer target */}
            <div ref={loaderRef} className="flex items-center justify-center h-6">
                {loading && <span className="text-gray-500 text-sm">Loading...</span>}
                {!loading && page >= totalPages && (
                    <span className="text-gray-400 text-sm"></span>
                )}
            </div>

        </div>
    );
};

export default UserGrid;
