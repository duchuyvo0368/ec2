"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getProfile } from "../api/user.service";

export interface UseUserProfileOptions {
	userId: string | undefined;
	enabled?: boolean;
}

export interface UseAsyncState<T> {
	data: T | null;
	isLoading: boolean;
	isError: boolean;
	error: unknown;
}

export function useUserProfile<T = any>({ userId, enabled = true }: UseUserProfileOptions) {
	const [state, setState] = useState<UseAsyncState<T>>({
		data: null,
		isLoading: false,
		isError: false,
		error: null,
	});

	const fetchProfile = useCallback(async () => {
		if (!userId) return;
		setState((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));
		await getProfile({
			userId,
			onSuccess: (res) => {
				setState({ data: (res?.metadata ?? res) as T, isLoading: false, isError: false, error: null });
			},
			onError: (err) => {
				setState({ data: null, isLoading: false, isError: true, error: err });
			},
		});
	}, [userId]);

	useEffect(() => {
		if (!enabled) return;
		void fetchProfile();
	}, [enabled, fetchProfile]);

	return useMemo(
		() => ({
			...state,
			reload: fetchProfile,
		}),
		[state, fetchProfile]
	);
}


