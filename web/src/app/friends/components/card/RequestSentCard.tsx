/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import Link from 'next/link';
import { useCancelRequest } from '../../hooks/useFriends';

interface RequestSentCardProps {
    userId: string;
    name: string;
    img: string;
    mutual?: string;
    followersCount?: string;
    onCancel?: () => void;
}

const RequestSentCard: React.FC<RequestSentCardProps> = ({
    userId,
    name,
    img,
    mutual,
    followersCount,
    onCancel,
}) => {
    const [removed, setRemoved] = useState(false);
    const { loading, cancel } = useCancelRequest(userId, () => {
        setRemoved(true);
        onCancel?.();
    });
    const handleCancelRequest = async () => {
        await cancel();
    };

    if (removed) return null; // card mất luôn

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
                    {followersCount && <p className="text-xs text-gray-400">{followersCount}</p>}
                </Link>
            </div>

            {/* Action */}
            <div className="flex flex-col gap-2 w-full px-4 py-3">
                <button
                    type="button"
                    disabled={loading}
                    onClick={handleCancelRequest}
                    className="flex items-center justify-center w-full py-1.5 text-sm rounded-md font-medium transition text-white bg-red-500 hover:bg-red-600"
                >
                    {loading ? 'Processing...' : 'Delete'}
                </button>
            </div>
        </div>
    );
};

export default RequestSentCard;
