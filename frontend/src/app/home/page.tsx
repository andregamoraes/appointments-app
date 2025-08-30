// src/app/home/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Api, AppointmentSummary } from '@/services/api';
import { CalendarDays, Ticket } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useRouter } from 'next/navigation';

function fmtDateTime(iso: string) {
	const d = new Date(iso);
	return d
		.toLocaleString('pt-BR', {
			weekday: 'long',
			day: '2-digit',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'UTC'
		})
		.replace('.', '');
}

export default function HomePage() {
	const router = useRouter();
	const { isAuthenticated, name, checking } = useAuthGuard();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [summary, setSummary] = useState<AppointmentSummary | null>(null);

	useEffect(() => {
		if (!isAuthenticated) return;
		setLoading(true);
		Api.appointments
			.summary()
			.then(res => {
				setSummary(res);
				setError('');
			})
			.catch(() => setError('Não foi possível carregar seu painel.'))
			.finally(() => setLoading(false));
	}, [isAuthenticated]);

	if (checking || !isAuthenticated) return null;

	const hasNext = (summary?.next_appointments?.length ?? 0) > 0;
	const hasPlan = !!summary?.active_plan;
	const therapistName = summary?.active_plan?.therapist_name ?? '';

	return (
		<main className='min-h-screen bg-[#1E2030] text-white pb-28'>
			<div className='mx-auto max-w-sm px-4 pt-6'>
				<h1 className='text-4xl font-extrabold mb-6'>Olá, {name}!</h1>

				{loading && <div className='bg-white/10 h-24 rounded-2xl animate-pulse' />}

				{!loading && error && <div className='bg-red-100 text-red-700 px-4 py-2 rounded-2xl'>{error}</div>}

				{!loading && !error && (
					<>
						{hasPlan && (
							<div className='bg-white text-gray-900 rounded-2xl shadow p-4 mb-4'>
								<div className='text-xs font-semibold text-gray-500 mb-1'>PLANO</div>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-3'>
										<div className='p-2 bg-blue-100 rounded-xl'>
											<Ticket className='w-5 h-5 text-blue-600' />
										</div>
										<div className='font-semibold'>
											{summary!.active_plan!.type === 'QUINZENAL' ? 'Quinzenal, 40min' : summary!.active_plan!.type === 'SEMANAL' ? 'Semanal, 40min' : 'Avulso, 40min'}
										</div>
									</div>
								</div>
							</div>
						)}

						{hasNext && <h3 className='mt-4 mb-2 text-white/90 font-semibold'>Próximas Consultas com {therapistName}</h3>}

						{hasNext ? (
							<div className='space-y-3'>
								{summary!.next_appointments.slice(0, 2).map(appt => (
									<div key={appt.id} className='bg-white text-gray-900 rounded-2xl shadow p-4'>
										<div className='text-xs font-semibold text-gray-500 mb-1'>CONFIRMADO</div>
										<div className='flex items-center gap-3'>
											<div className='p-2 bg-green-100 rounded-xl'>
												<CalendarDays className='w-5 h-5 text-green-700' />
											</div>
											<div className='font-semibold'>{fmtDateTime(appt.start)}</div>
											<div className='ml-auto opacity-60'>›</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='bg-white/95 rounded-2xl shadow-lg overflow-hidden'>
								<div className='flex items-center gap-4 p-4'>
									<div className='flex-1'>
										<p className='text-[11px] font-semibold tracking-[0.08em] text-gray-500'>TERAPIA</p>
										<h2 className='text-lg font-semibold text-gray-900'>Agende agora sua sessão</h2>
									</div>
								</div>

								<button
									className='w-full py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer'
									onClick={() => router.push('/book/therapists')}>
									Agendar sessão
								</button>
							</div>
						)}
					</>
				)}
			</div>
			<BottomNav />
		</main>
	);
}
