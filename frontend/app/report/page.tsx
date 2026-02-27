'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { ShieldAlert, ArrowRight, Search, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function AccessKeyPage() {
    const [accessKey, setAccessKey] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await api.post('/access-key/validate', { access_key: accessKey });
            if (data.valid) {
                sessionStorage.setItem('reporter_authenticated', 'true');
                router.push('/report/form');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid access key. Verification failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_#1e293b_0%,_#0b0f19_100%)] overflow-hidden">
            <div className="max-w-xl w-full space-y-12 animate-fade-in">
                {/* Branding & Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 mb-2">
                        <ShieldAlert className="w-8 h-8 text-accent-blue" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white font-heading">Secure Gateway</h1>
                        <p className="text-brand-400 leading-relaxed max-w-sm mx-auto font-light">
                            Authorized access only. Enter your organization's integrity key to begin a confidential report.
                        </p>
                    </div>
                </div>

                {/* Entry Card */}
                <div className="glass-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-focus-within:opacity-30 transition-opacity">
                        <KeyRound className="w-20 h-20 text-accent-blue" />
                    </div>

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                        <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-500">
                                Integrity Access Key
                            </label>
                            <input
                                type="text"
                                required
                                className="input-base text-center text-2xl tracking-[0.4em] font-mono border-navy-800 bg-navy-950/80 h-16"
                                value={accessKey}
                                onChange={(e) => setAccessKey(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="off"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-xs font-semibold rounded-lg text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-4 relative group overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? 'Authenticating...' : 'Unlock Reporting System'}
                                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </button>
                    </form>
                </div>

                {/* Tracking Link */}
                <div className="flex flex-col items-center gap-6 pt-4">
                    <div className="h-px w-12 bg-navy-800"></div>
                    <div className="text-center space-y-3">
                        <p className="text-xs text-brand-500 font-medium">Already have a Case ID?</p>
                        <Link
                            href="/track"
                            className="inline-flex items-center gap-2 text-sm font-bold text-accent-blue hover:text-white transition-all group"
                        >
                            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Track Case Status
                        </Link>
                    </div>
                </div>
            </div>

            {/* Subtle Footer Disclaimer */}
            <div className="absolute bottom-8 left-0 right-0 text-center opacity-30 select-none pointer-events-none">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-700">Protected by EthicalGuard Military-Grade Encryption</p>
            </div>
        </div>
    );
}
