'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import {
    Search,
    Filter,
    ChevronRight,
    FileText,
    AlertCircle,
    Clock,
    CheckCircle2,
    Database,
    ExternalLink
} from 'lucide-react';

export default function CaseListPage() {
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['cases', status, search],
        queryFn: async () => {
            const { data } = await api.get('/hr/complaints', {
                params: { status, search }
            });
            return data;
        }
    });

    const getStatusConfig = (status: string) => {
        const base = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ";
        switch (status) {
            case 'Open': return {
                class: base + "bg-brand-400/10 text-brand-400 border-brand-400/20",
                icon: <AlertCircle className="w-3 h-3" />
            };
            case 'Under Review': return {
                class: base + "bg-warning/10 text-warning border-warning/20",
                icon: <Clock className="w-3 h-3" />
            };
            case 'Resolved': return {
                class: base + "bg-success/10 text-success border-success/20",
                icon: <CheckCircle2 className="w-3 h-3" />
            };
            default: return {
                class: base + "bg-navy-800 text-brand-500 border-navy-700",
                icon: <FileText className="w-3 h-3" />
            };
        }
    };

    const getUrgencyConfig = (level: string) => {
        switch (level) {
            case 'Critical': return 'text-danger font-black';
            case 'High': return 'text-warning font-bold';
            default: return 'text-brand-500';
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 px-1">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-accent-blue font-bold tracking-[0.2em] text-[10px] uppercase">
                        <Database className="w-4 h-4" />
                        Incident Registry
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight font-heading">Case Vault</h1>
                    <p className="text-brand-500 font-light max-w-xl text-balance">
                        Authorized access to the secure repository of all submitted ethical concerns and behavioral risk reports.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group min-w-[240px]">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-navy-700 group-focus-within:text-accent-blue transition-colors">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter by Case ID..."
                            className="input-base pl-11 bg-navy-950/50 border-navy-800 h-12 text-sm"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-navy-700">
                            <Filter className="w-4 h-4" />
                        </div>
                        <select
                            className="input-base pl-11 pr-10 bg-navy-950/50 border-navy-800 h-12 text-sm appearance-none min-w-[180px]"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >
                            <option value="">Lifecycle: All</option>
                            <option value="Open">Status: Open</option>
                            <option value="Under Review">Status: Review</option>
                            <option value="Resolved">Status: Closed</option>
                        </select>
                    </div>
                </div>
            </header>

            <div className="glass-card p-0 border-navy-800/50 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-navy-900/80 border-b border-navy-800">
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-brand-600 tracking-[0.2em]">Unique Identifier</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-brand-600 tracking-[0.2em]">Incident Narrative</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-brand-600 tracking-[0.2em]">Risk Level</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-brand-600 tracking-[0.2em]">Workflow Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-brand-600 tracking-[0.2em] text-right">Admin Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-800/50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-10 bg-navy-950/20"></td>
                                    </tr>
                                ))
                            ) : data?.results?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-brand-700 italic font-medium">
                                        No registry records found matching current security filters.
                                    </td>
                                </tr>
                            ) : (
                                data?.results?.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-navy-900/40 transition-all group border-l-2 border-l-transparent hover:border-l-accent-blue">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-navy-950 border border-navy-800 group-hover:border-accent-blue/30 transition-colors">
                                                    <FileText className="w-4 h-4 text-brand-500 group-hover:text-accent-blue transition-colors" />
                                                </div>
                                                <span className="font-mono text-[11px] font-bold text-brand-400 group-hover:text-white transition-colors tracking-tight">
                                                    {item.case_id}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="font-bold text-white tracking-tight group-hover:text-accent-blue transition-colors">{item.title}</p>
                                                <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">{item.category}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] uppercase font-black tracking-widest ${getUrgencyConfig(item.urgency_level)}`}>
                                                {item.urgency_level}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 ${getStatusConfig(item.status).class}`}>
                                                {getStatusConfig(item.status).icon}
                                                {item.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link
                                                href={`/hr/cases/${item.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-950 border border-navy-800 text-[10px] font-black text-brand-500 hover:bg-accent-blue hover:text-white hover:border-accent-blue transition-all uppercase tracking-[0.1em]"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                View Audit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {data?.count > 0 && (
                    <div className="bg-navy-950/40 px-8 py-4 border-t border-navy-800 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-brand-700 uppercase tracking-widest">
                            Registry Audit: {data?.results?.length} of {data?.count} entries visible
                        </p>
                        <div className="flex items-center gap-6">
                            {/* Pagination would go here if needed, keeping UI space for it */}
                            <span className="text-[10px] font-black text-brand-800 uppercase italic">Immutable Logging Active</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
