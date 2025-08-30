'use client';

import { useEffect, useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import BottomNav from '@/components/BottomNav';
import TherapistCard from '@/components/TherapistCard';
import { Api } from '@/services/api';
import type { User } from '@/services/api';

export default function TherapistsPage() {
	const { isAuthenticated, checking } = useAuthGuard();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		if (!isAuthenticated) return;

		setLoading(true);
		setError('');

		Api.users
			.list({ type: 'THERAPIST' })
			.then(res => setUsers(res))
			.catch(() => {
				setError('Falha ao carregar terapeutas.');
			})
			.finally(() => setLoading(false));
	}, [isAuthenticated]);

	if (checking) return null;
	if (!isAuthenticated) return null;

	return (
		<main className='min-h-screen bg-[#E6EEF5] pt-6 pb-28'>
			<div className='mx-auto max-w-sm px-4'>
				<h1 className='text-center text-lg font-semibold text-gray-800 mb-4'>Buscar Terapeuta</h1>

				{loading && <div className='text-center text-gray-500'>Carregando...</div>}
				{error && <div className='bg-red-100 text-red-700 px-4 py-2 rounded mb-3'>{error}</div>}

				<div className='space-y-4'>
					{users.map(user => (
						<TherapistCard key={user.id} therapist={user} />
					))}
					{!loading && !users.length && <div className='text-center text-gray-500'>Nenhum terapeuta encontrado.</div>}
				</div>
			</div>
			<BottomNav />
		</main>
	);
}
