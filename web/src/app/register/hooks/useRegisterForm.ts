'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../login/auth.service';

export function useRegisterForm(redirectTo = '/') {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !email || !password) {
			setError('Please enter name, email, and password.');
			return;
		}
		setError('');
		setIsLoading(true);
		try {
			await register({
				data: { name, email, password },
				onSuccess: (response: any) => {
					const { accessToken, refreshToken } = response?.metadata?.tokens || {};
					const user = response?.metadata?.user;
					if (accessToken) {
						localStorage.setItem('accessToken', accessToken);
						localStorage.setItem('refreshToken', refreshToken);
						if (user) {
							const userWithAvatar = {
								...user,
								avatar: user.avatar || 'https://hoseiki.vn/wp-content/uploads/2025/03/avatar-mac-dinh-3.jpg',
							};
							localStorage.setItem('userInfo', JSON.stringify(userWithAvatar));
						}
						setTimeout(() => {
							localStorage.removeItem('accessToken');
							localStorage.removeItem('refreshToken');
							localStorage.removeItem('userInfo');
						}, 1500 * 60 * 1000);
						router.push(redirectTo);
					} else {
						setError('Registration failed: No token received.');
					}
				},
				onError: (err) => {
					setError(err.message || 'Registration failed. Please try again.');
				},
			});
		} catch {
			setError('Unexpected error during registration.');
		} finally {
			setIsLoading(false);
		}
	}, [email, name, password, redirectTo, router]);

	return {
		// state
		name,
		setName,
		email,
		setEmail,
		password,
		setPassword,
		error,
		isLoading,
		// actions
		handleSubmit,
	};
}


