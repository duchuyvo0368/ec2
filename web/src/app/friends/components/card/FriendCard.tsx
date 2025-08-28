/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import Link from 'next/link';
import { unFriend } from '@/app/friends/friends.service';
import { useUnfriend } from '../../hooks/useFriends';
import { UserCheck, MessageCircle } from 'lucide-react';

interface FriendCardProps {
    userId: string;
    name: string;
    avatarUrl: string;
    mutualFriends?: string;
    followerCount?: string;
    onUnfriend?: () => void; // callback để remove thẻ khỏi parent
}

const FriendCard: React.FC<FriendCardProps> = ({
    userId,
    name,
    avatarUrl,
    mutualFriends,
    followerCount = '0',
    onUnfriend,
}) => {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleUnfriend = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            await unFriend({ userId });
            onUnfriend?.();
        } catch (err) {
            console.error('Lỗi khi hủy kết bạn:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-md shadow hover:shadow-md border border-gray-200 w-[158px] overflow-hidden flex flex-col items-center transition-all duration-200">
            <div className="relative w-full h-16 bg-[url('https://file.apetavers.com/api/files/admin/20241226/3d48b567-fd61-415d-a2bc-aa09966a05cd.png')] bg-cover bg-center">
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-6">
                    <img
                        src={avatarUrl}
                        alt={name}
                        className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover bg-gray-100"
                    />
                </div>
            </div>

            <div className="mt-8 text-center px-3">
                <Link href={`/profile/${userId}`} className="no-underline">
                    <h3 className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                        {name}
                    </h3>
                    {mutualFriends && <p className="text-xs text-gray-500">{mutualFriends} mutual friends</p>}
                    {followerCount && <p className="text-xs text-gray-400">{followerCount}</p>}
                </Link>
            </div>

            <div className="flex flex-col gap-2 w-full px-3 py-3">
                <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center justify-center gap-2 w-full py-1.5 text-sm rounded-md font-medium transition text-white bg-red-500 hover:bg-red-600"
                >
                    <UserCheck size={16} />
                    {loading ? 'Loading...' : 'Unfriend'}
                </button>

                <Link
                    href={`/messages/${userId}`}
                    className="flex items-center justify-center gap-2 w-full py-1.5 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium transition"
                >
                    <MessageCircle size={16} />
                    Chat
                </Link>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-lg p-5 shadow-lg w-72 text-center">
                        <p className="text-sm text-gray-700 mb-4">
                            You sure want to unfriend <b>{name}</b>?
                        </p>
                        <div className="flex justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 transition text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUnfriend}
                                disabled={loading}
                                className="flex-1 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white transition text-sm"
                            >
                                {loading ? 'Loading...' : 'Unfriend'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FriendCard;
