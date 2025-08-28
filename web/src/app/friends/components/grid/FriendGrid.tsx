/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import FriendCard from '../card/FriendCard';
import UserCardSkeleton from '../skeleton/UserCardSkeleton';
import { useFriendsList } from '../../hooks/useFriends';

const FriendsGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { items: friends, loading, removeByUserId } = useFriendsList('friends');
    if (loading) return <p className="p-4 text-gray-500">Loading Friend...</p>;

    return (
        <div className={`flex flex-col ${className} pb-20`}>
            {/* User grid */}
            <div className="flex flex-wrap gap-2 ">
            {friends.map((friend) => (
                <FriendCard
                    key={friend._id}
                    userId={friend.userId}
                    name={friend.name}
                    avatarUrl={friend.avatar}
                    followerCount={friend.followers}
                    mutualFriends="1"
                    onUnfriend={() => removeByUserId(friend.userId)}
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

export default FriendsGrid;
