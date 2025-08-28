'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

export function useRegisterGate() {
	const [authChecked, setAuthChecked] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get('redirect') || '/';

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await axios.get('http://localhost:5000/v1/api/user', {
					withCredentials: true,
					params: { page: 1, limit: 10 },
				});
				if (res.data?.metadata?.results?.length > 0) {
					router.replace(redirectTo);
				} else {
					setAuthChecked(true);
				}
			} catch {
				setAuthChecked(true);
			}
		};
		checkAuth();
	}, [redirectTo, router]);

	return { authChecked, redirectTo };
}


