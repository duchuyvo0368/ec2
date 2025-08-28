/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useState } from 'react';
import { addFriend } from '../api/user.service';

export function useUserCard(userId: string) {
	const [loading, setLoading] = useState(false);
	const [removed, setRemoved] = useState(false);

	const handleAddFriend = useCallback(async () => {
		if (loading) return;
		setLoading(true);
		try {
			await addFriend({
				userId,
				onSuccess: () => setRemoved(true),
				onError: (err: any) => {
					if (err && Object.keys(err).length > 0) {
						console.error('Add friend error:', err);
					}
				},
			});
		} catch (err) {
			if (err && Object.keys(err).length > 0) {
				console.error('Add friend catch error:', err);
			}
		} finally {
			setLoading(false);
		}
	}, [loading, userId]);

	return { loading, removed, handleAddFriend };
}


