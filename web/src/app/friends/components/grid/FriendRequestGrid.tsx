'use client';
import React from 'react';
import FriendRequestCard from '../card/FriendsRequestCard';
import UserCardSkeleton from '../skeleton/UserCardSkeleton';
import { useFriendsList } from '../../hooks/useFriends';

const FriendsRequestGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
     const { items: friends, loading } = useFriendsList('request');
     if (loading) return <p className="text-center text-gray-500">Loading...</p>;

     return (
         <div className={`flex flex-col ${className} pb-20`}>
             {/* User grid */}
             <div className="flex flex-wrap gap-2 ">
               {friends.map((friend) => (
                    <FriendRequestCard
                         key={friend._id}
                         userId={friend.userId}
                         requestId={friend._id}
                         name={friend.name}
                         img={friend.avatar}
                         followers={friend.followers}
                         mutual=""
                    />
               ))}
                 {loading &&
                     Array.from({length: 12}).map((_, index) => (
                         <UserCardSkeleton key={index} />
                     ))}
             </div>
         </div>
     );
};

export default FriendsRequestGrid;
