/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPostByUser } from "../api/user.service";
import { PaginatedResponse, PostFromServer } from "../../posts/type";

export interface UseUserPostsOptions {
	userId: string | undefined;
	pageSize?: number;
	enabled?: boolean;
}

export function useUserPosts({ userId, pageSize = 10, enabled = true }: UseUserPostsOptions) {
	const [posts, setPosts] = useState<PostFromServer[]>([]);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<unknown>(null);
	const [hasMore, setHasMore] = useState(true);
	const isFetchingRef = useRef(false);

	const fetchPage = useCallback(async (pageToLoad: number) => {
		if (!userId || isFetchingRef.current || !hasMore) return;
		isFetchingRef.current = true;
		setIsLoading(true);
		setIsError(false);
		setError(null);
		await getPostByUser({
			limit: pageSize,
			pages: pageToLoad,
			userId,
			onSuccess: (res: PaginatedResponse<PostFromServer>) => {
				const newPosts = res?.data ?? [];
				setPosts((prev) => (pageToLoad === 1 ? newPosts : [...prev, ...newPosts]));
				const total = res?.pagination?.totalItems ?? newPosts.length;
				const accumulated = (pageToLoad === 1 ? newPosts.length : posts.length + newPosts.length);
				setHasMore(accumulated < total);
			},
			onError: (err) => {
				setIsError(true);
				setError(err);
			},
			onFinally: () => {
				setIsLoading(false);
				isFetchingRef.current = false;
			},
		});
	}, [userId, pageSize, hasMore, posts.length]);

	useEffect(() => {
		if (!enabled) return;
		// reset and load first page when userId changes
		setPosts([]);
		setPage(1);
		setHasMore(true);
		void fetchPage(1);
	}, [userId, enabled, fetchPage]);

	const loadMore = useCallback(() => {
		if (!hasMore || isFetchingRef.current) return;
		const next = page + 1;
		setPage(next);
		void fetchPage(next);
	}, [page, hasMore, fetchPage]);

	return useMemo(
		() => ({ posts, isLoading, isError, error, hasMore, page, reload: () => fetchPage(1), loadMore }),
		[posts, isLoading, isError, error, hasMore, page, fetchPage]
	);
}


