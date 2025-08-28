/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRespondRequest } from '../../hooks/useFriends';

interface FriendRequestCardProps {
    requestId: string;
    userId: string;
    name: string;
    img: string;
    mutual: string;
    followers?: string;
    onAccept?: () => void;
    onReject?: () => void;
    onUnAccept?: () => void;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
    requestId,
    userId,
    name,
    img,
    mutual,
    followers = '0 followers',
    onAccept,
    onReject,
    onUnAccept,
}) => {
    const [accepted, setAccepted] = useState(false);
    const [rejected, setRejected] = useState(false);

    const { accept, reject } = useRespondRequest(userId, () => { setAccepted(true); onAccept?.(); }, () => { setRejected(true); onReject?.(); });
    const handleAccept = async () => { await accept(); };
    const handleReject = async () => { await reject(); };

    // Ẩn card nếu đã Accept hoặc Reject
    if (accepted || rejected) return null;

    return (
        <div className="bg-white rounded-md shadow-lg hover:shadow-2xl border border-gray-200 w-[158px] overflow-hidden flex flex-col items-center transition-all duration-300">
            {/* Cover */}
            <div className="relative w-full h-16 bg-[url('https://file.apetavers.com/api/files/admin/20241226/3d48b567-fd61-415d-a2bc-aa09966a05cd.png')] bg-cover bg-center">
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-6">
                    <img
                        src={img}
                        alt={name}
                        className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover bg-gray-100"
                    />
                </div>
            </div>

            {/* Info */}
            <div className="mt-8 text-center px-4">
                <Link href={`/profile/${userId}`} className="no-underline">
                    <h3 className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                        {name}
                    </h3>
                    {mutual && <p className="text-xs text-gray-500">{mutual}</p>}
                    {followers && <p className="text-xs text-gray-400">{followers}</p>}
                </Link>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 w-full px-4 py-3">
                <button
                    onClick={handleAccept}
                    className="flex items-center justify-center w-full py-1.5 text-sm font-medium text-white rounded-md bg-blue-600 hover:bg-blue-700 transition shadow-sm hover:shadow-md"
                >
                    Accept
                </button>
                <button
                    onClick={handleReject}
                    className="flex items-center justify-center w-full py-1.5 text-sm font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition shadow-sm hover:shadow-md"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default FriendRequestCard;
