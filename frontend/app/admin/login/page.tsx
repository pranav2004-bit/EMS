'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await api.post('/admin/login', { email, password });
            login(email, 'admin');
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid credentials or access denied.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-navy-900 relative">
            {/* Top Left Home Link */}
            <Link
                href="/"
                className="absolute top-8 left-8 text-muted-gray hover:text-white flex items-center gap-2 transition-colors group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Return to Home
            </Link>

            <div className="card w-full max-w-md border-muted-blue/30 shadow-[0_0_50px_-12px_rgba(74,111,165,0.25)] relative">
                {/* Close Button UI */}
                <Link
                    href="/"
                    className="absolute top-4 right-4 text-muted-gray hover:text-white transition-colors p-1"
                    title="Exit to Home"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </Link>

                <h1 className="text-2xl font-bold text-center mb-2">System Administration</h1>
                <p className="text-muted-gray text-center mb-8">Governance and user management portal</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Admin Email</label>
                        <input
                            type="email"
                            required
                            className="input-field border-navy-700 bg-navy-800"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Master Password</label>
                        <input
                            type="password"
                            required
                            className="input-field border-navy-700 bg-navy-800"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-200 text-sm rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-slate-100 hover:bg-white text-navy-900 font-bold py-3 rounded transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="h-5 w-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin"></div>
                        ) : (
                            'Authenticate'
                        )}
                    </button>

                    <div className="text-center mt-4">
                        <Link href="/" className="text-sm text-muted-gray hover:text-muted-blue transition-colors">
                            Cancel and go back
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
