/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getAllUser } from '../api/user.service';

interface UserItem {
	id: string;
	name: string;
	img: string;
	mutual?: string;
	followersCount?: string;
	isFollowing: boolean;
}

export function useUserGrid(limit = 12) {
	const [users, setUsers] = useState<UserItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const loaderRef = useRef<HTMLDivElement | null>(null);

	const fetchUsers = useCallback((pageNumber: number, append = false) => {
		setLoading(true);
		getAllUser({
			limit,
			page: pageNumber,
			onSuccess: (res) => {
				const rawUsers = res.metadata?.data || [];
				const formatted = rawUsers.map((item: any) => ({
					id: item._id,
					name: item.name,
					img: item.avatar,
					followersCount: item.followersCount,
					isFollowing: item.isFollowing,
				}));

				setUsers((prev) => (append ? [...prev, ...formatted] : formatted));
				setTotalPages(res.metadata?.pagination?.totalPages || 1);
				setLoading(false);
			},
			onError: () => setLoading(false),
		});
	}, [limit]);

	useEffect(() => {
		fetchUsers(page, page > 1);
	}, [fetchUsers, page]);

	useEffect(() => {
		if (!loaderRef.current) return;
		const observer = new IntersectionObserver((entries) => {
			const target = entries[0];
			if (target.isIntersecting && !loading && page < totalPages) {
				setPage((prev) => prev + 1);
			}
		}, { threshold: 1.0 });

		observer.observe(loaderRef.current);
		return () => {
			if (loaderRef.current) observer.unobserve(loaderRef.current);
		};
	}, [loading, page, totalPages]);

	return { users, loading, page, totalPages, loaderRef };
}


