'use client';

import { useState, useEffect } from 'react';
import { Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Api } from '@/services/api';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const hasToken = typeof window !== 'undefined' && localStorage.getItem('accessToken');
		if (hasToken) router.replace('/home');
	}, [router]);

	const handleLogin = async () => {
		setError('');

		if (!email || !password) {
			setError('Preencha e-mail e senha.');
			return;
		}

		setIsLoading(true);

		const data = { email, password };

		Api.auth
			.login(data)
			.then(res => {
				const { access, user } = res;

				localStorage.setItem('accessToken', access);
				localStorage.setItem('type', user.type);
				localStorage.setItem('name', user.name);

				router.push('/home');
			})
			.catch(() => {
				setError('Credenciais inválidas.');
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<main className='min-h-screen flex items-center justify-center px-4 bg-gray-50'>
			<div className='max-w-md w-full border rounded-2xl shadow-lg p-8 bg-white'>
				<h1 className='text-3xl font-bold mb-6'>Acesso</h1>

				<label className='block text-left text-xs font-semibold text-gray-600 mb-1'>EMAIL</label>
				<div className='flex items-center gap-2 w-full px-4 py-3 rounded-lg mb-4 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500'>
					<Mail className='w-4 h-4 text-gray-500' />
					<input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='exemplo@suaempresa.com.br' className='w-full outline-none' autoComplete='email' />
				</div>

				<label className='block text-left text-xs font-semibold text-gray-600 mb-1'>SENHA</label>
				<div className='flex items-center gap-2 w-full px-4 py-3 rounded-lg mb-4 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500'>
					<Lock className='w-4 h-4 text-gray-500' />
					<input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='super secreta' className='w-full outline-none' autoComplete='current-password' />
				</div>

				{error && <div className='bg-red-100 text-red-700 px-4 py-2 mb-4 text-sm rounded'>{error}</div>}

				<button
					onClick={handleLogin}
					disabled={!email || !password || isLoading}
					className={`w-full px-6 py-3 rounded-2xl text-sm font-semibold transition ${
						!email || !password || isLoading ? 'bg-blue-200 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
					}`}>
					{isLoading ? 'Entrando...' : 'Entrar'}
				</button>
			</div>
		</main>
	);
}
