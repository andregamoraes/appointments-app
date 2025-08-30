'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthGuard() {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [name, setName] = useState<string | null>(null);
	const [checking, setChecking] = useState(true);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const token = localStorage.getItem('accessToken');
		const name = localStorage.getItem('name');

		if (!token) {
			setIsAuthenticated(false);
			setChecking(false);
			router.replace('/');
			return;
		}

		setIsAuthenticated(true);
		setName(name);
		setChecking(false);
	}, [router]);

	const logout = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('name');
		localStorage.removeItem('type');
		setIsAuthenticated(false);
		router.replace('/');
	};

	return { isAuthenticated, name, logout, checking };
}
