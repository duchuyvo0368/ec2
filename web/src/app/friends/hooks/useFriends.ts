/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { getFriends, getFriendPending, getRequestSent, unFriend, acceptFriendRequest, rejectFriendRequest, cancelRequest } from '../friends.service';

export type FriendsTab = 'friends' | 'suggestions' | 'request' | 'sent';

export function useFriendsList(tab: FriendsTab) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (tab === 'friends') {
            getFriends({
                limit: 12,
                onSuccess: (res) => {
                    const raw = res.metadata.data || [];
                    const formatted = raw.map((u: any) => ({
                        _id: u._id,
                        userId: u._id,
                        name: u.name,
                        avatar: u.avatar,
                        followers: (u.countFollowers?.toString() ?? '0') + ' followers',
                    }));
                    setItems(formatted);
                    setLoading(false);
                },
                onError: () => setLoading(false),
            });
        } else if (tab === 'request') {
            getFriendPending({
                onSuccess: (res) => {
                    const raw = res.metadata || [];
                    const formatted = raw.map((r: any) => ({
                        _id: r._id,
                        userId: r.fromUser._id,
                        name: r.fromUser.name,
                        avatar: r.fromUser.avatar,
                        followers: r.fromUser.followers?.toString() || '0 followers',
                    }));
                    setItems(formatted);
                    setLoading(false);
                },
                onError: () => setLoading(false),
            });
        } else if (tab === 'sent') {
            getRequestSent({
                limit: 12,
                page: 1,
                onSuccess: (res) => {
                    const raw = res.metadata || [];
                    const formatted = raw.map((r: any) => ({
                        _id: r._id,
                        userId: r.toUser._id,
                        name: r.toUser.name,
                        avatar: r.toUser.avatar,
                        followersCount: r.toUser.followersCount?.toString(),
                    }));
                    setItems(formatted);
                    setLoading(false);
                },
                onError: () => setLoading(false),
            });
        } else {
            setItems([]);
            setLoading(false);
        }
    }, [tab]);

    const removeByUserId = useCallback((userId: string) => {
        setItems((prev) => prev.filter((i) => i.userId !== userId));
    }, []);

    return { items, loading, removeByUserId };
}

export function useUnfriend(userId: string, onAfter?: () => void) {
    const [loading, setLoading] = useState(false);
    const onClick = useCallback(async () => {
        setLoading(true);
        try {
            await unFriend({ userId });
            onAfter?.();
        } finally {
            setLoading(false);
        }
    }, [onAfter, userId]);
    return { loading, onClick };
}

export function useRespondRequest(userId: string, onAccept?: () => void, onReject?: () => void) {
    const accept = useCallback(async () => {
        await acceptFriendRequest({ userId, onSuccess: onAccept });
    }, [onAccept, userId]);
    const reject = useCallback(async () => {
        await rejectFriendRequest({ userId, onSuccess: onReject });
    }, [onReject, userId]);
    return { accept, reject };
}

export function useCancelRequest(userId: string, onAfter?: () => void) {
    const [loading, setLoading] = useState(false);
    const cancel = useCallback(async () => {
        setLoading(true);
        try {
            await cancelRequest({ userId, onSuccess: onAfter });
        } finally {
            setLoading(false);
        }
    }, [onAfter, userId]);
    return { loading, cancel };
}


