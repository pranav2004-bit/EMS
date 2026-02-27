'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { Complaint } from '@/types';
import {
    Search,
    History,
    Clock,
    CheckCircle2,
    AlertCircle,
    Calendar,
    ArrowRight,
    Loader2,
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function TrackCasePage() {
    const [caseId, setCaseId] = useState('');
    const [report, setReport] = useState<Partial<Complaint> | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setReport(null);

        const cleanId = caseId.trim();
        if (!cleanId) return;

        try {
            const { data } = await api.get(`/complaints/track/${cleanId}/`);
            setReport(data);
        } catch (err: any) {
            setError(err.response?.status === 404 ? 'No case found matching this identifier.' : 'Systems error occurred during lookup.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusConfig = (status?: string) => {
        switch (status) {
            case 'Open': return { color: 'text-brand-400', bg: 'bg-brand-400/10', border: 'border-brand-400/20', icon: <Clock className="w-5 h-5" /> };
            case 'Under Review': return { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', icon: <AlertCircle className="w-5 h-5" /> };
            case 'Resolved': return { color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', icon: <CheckCircle2 className="w-5 h-5" /> };
            default: return { color: 'text-brand-500', bg: 'bg-brand-500/10', border: 'border-brand-500/20', icon: <History className="w-5 h-5" /> };
        }
    };

    return (
        <div className="min-h-screen bg-navy-950 py-20 px-6 flex flex-col items-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-blue/5 blur-[100px] rounded-full"></div>

            <div className="max-w-3xl w-full space-y-12 relative animate-fade-in">
                <div className="text-center space-y-4">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 rounded-2xl bg-navy-900 border border-navy-800">
                            <History className="w-8 h-8 text-accent-blue" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight font-heading">Investigation Status</h1>
                    <p className="text-brand-500 font-light max-w-sm mx-auto">
                        Enter your secure Case ID to access the current lifecycle status of your report.
                    </p>
                </div>

                <div className="glass-card shadow-2xl border-navy-800/50">
                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-navy-700 group-focus-within:text-accent-blue transition-colors" />
                            </div>
                            <input
                                type="text"
                                required
                                placeholder="Case ID (e.g. 550e8400...)"
                                className="input-base pl-11 bg-navy-950 font-mono tracking-tight h-14"
                                value={caseId}
                                onChange={(e) => setCaseId(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !caseId}
                            className="btn-primary h-14 px-8 min-w-[160px] group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2 font-bold">
                                    Lookup Case
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>
                    {error && (
                        <div className="mt-6 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs font-bold text-center animate-shake">
                            {error}
                        </div>
                    )}
                </div>

                {report && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="glass-card overflow-hidden border-navy-800/50 p-0">
                            <div className="bg-navy-900/50 p-8 border-b border-navy-800">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-brand-600 uppercase tracking-[0.2em]">Lifecycle Status</p>
                                        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border ${getStatusConfig(report.status).bg} ${getStatusConfig(report.status).border} ${getStatusConfig(report.status).color}`}>
                                            {getStatusConfig(report.status).icon}
                                            <span className="text-sm font-extrabold uppercase tracking-widest">{report.status}</span>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right space-y-1">
                                        <p className="text-[10px] font-bold text-brand-600 uppercase tracking-[0.2em]">Registry Date</p>
                                        <div className="flex items-center sm:justify-end gap-2 text-white">
                                            <Calendar className="w-4 h-4 text-brand-500" />
                                            <span className="text-sm font-bold">
                                                {new Date(report.created_at!).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-brand-500 uppercase tracking-[0.2em]">Resolution / Narrative Update</h3>
                                    <div className="bg-navy-950 p-6 rounded-2xl border border-navy-800 leading-relaxed">
                                        {report.resolution_note ? (
                                            <p className="text-slate-300 text-sm font-light whitespace-pre-wrap">{report.resolution_note}</p>
                                        ) : (
                                            <div className="flex items-center gap-4 text-brand-600">
                                                <div className="flex space-x-1">
                                                    <div className="h-1.5 w-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                    <div className="h-1.5 w-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                    <div className="h-1.5 w-1.5 bg-brand-600 rounded-full animate-bounce"></div>
                                                </div>
                                                <span className="text-sm italic font-medium">Investigative audit in progress. Check back shortly.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {report.status === 'Resolved' && (
                                    <div className="p-4 rounded-xl bg-success/5 border border-success/10 flex items-start gap-3">
                                        <ShieldCheck className="w-5 h-5 text-success mt-0.5" />
                                        <p className="text-[11px] font-medium text-success/80 leading-relaxed italic">
                                            Case closure complete. The integrity audit for this file is finished. Thank you for your contribution to organizational ethics.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Return button */}
                <div className="text-center">
                    <Link href="/" className="text-xs font-bold text-brand-600 hover:text-white transition-all uppercase tracking-[0.2em]">
                        Return to Hub
                    </Link>
                </div>
            </div>
        </div>
    );
}
