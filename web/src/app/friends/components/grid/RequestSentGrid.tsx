/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import RequestSentCard from '../card/RequestSentCard';
import UserCardSkeleton from '../skeleton/UserCardSkeleton';
import { useFriendsList } from '../../hooks/useFriends';

const RequestSentGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { items: friends, loading } = useFriendsList('sent');
    if (loading) return <p className="text-center text-sm text-gray-500">Loading Friend...</p>;

    return (
        <div className={`flex flex-col ${className} pb-20`}>
            {/* User grid */}
            <div className="flex flex-wrap gap-2 ">
                {friends.map((friend) => (
                    <RequestSentCard
                        key={friend._id}
                        userId={friend.userId}
                        name={friend.name}
                        img={friend.avatar}
                        mutual=""
                        followersCount={`${friend.followersCount ?? 0} followers`}
                    />
                ))}
                {loading &&
                    Array.from({ length: 12 }).map((_, index) => (
                        <UserCardSkeleton key={index} />
                    ))}
            </div>
        </div>
    );
};

export default RequestSentGrid;
