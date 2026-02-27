'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { DashboardStats } from '@/types';
import {
    Briefcase,
    Clock,
    CheckCircle2,
    AlertTriangle,
    BarChart3,
    PieChart,
    ShieldAlert,
    ChevronRight,
    Search
} from 'lucide-react';
import Link from 'next/link';

export default function HRDashboardPage() {
    const { data: stats, isLoading } = useQuery<any>({
        queryKey: ['hr-analytics-dashboard'],
        queryFn: async () => {
            const { data } = await api.get('/hr/analytics');
            return data;
        },
        refetchInterval: 10000 // Refetch every 10 seconds for real-time feel
    });

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-brand-500 uppercase tracking-widest">Compiling Analytics...</p>
            </div>
        </div>
    );

    const getStatusCount = (status: string) => {
        return stats?.status_distribution?.find((s: any) => s.status === status)?.count || 0;
    };

    const cards = [
        {
            label: 'Open Requests',
            value: getStatusCount('Open'),
            color: 'text-accent-blue',
            icon: <ShieldAlert className="w-5 h-5" />,
            trend: 'Awaiting Initial Audit'
        },
        {
            label: 'Active Reviews',
            value: getStatusCount('Under Review'),
            color: 'text-warning',
            icon: <Clock className="w-5 h-5" />,
            trend: 'In-progress Investigations'
        },
        {
            label: 'Closed Cases',
            value: getStatusCount('Resolved'),
            color: 'text-success',
            icon: <CheckCircle2 className="w-5 h-5" />,
            trend: 'Resolution Target Achieved'
        },
        {
            label: 'Registry Total',
            value: stats?.total_complaints || 0,
            color: 'text-white',
            icon: <Briefcase className="w-5 h-5" />,
            trend: 'Cumulative System Load'
        },
    ];

    return (
        <div className="space-y-12 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 border-b border-navy-800 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-accent-blue font-bold tracking-[0.2em] text-[10px] uppercase">
                        <BarChart3 className="w-4 h-4" />
                        Intelligence Analytics
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight font-heading">Investigation Ops</h1>
                    <p className="text-brand-500 font-light max-w-lg">Monitoring organizational integrity and incident lifecycle metrics in real-time.</p>
                </div>
                <Link
                    href="/hr/complaints"
                    className="btn-primary gap-3 px-6 py-4 shadow-xl shadow-accent-blue/20 group"
                >
                    <Search className="w-5 h-5" />
                    <span className="font-bold">Access Case Vault</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </header>

            {/* Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.label} className="glass-card p-6 border-navy-800/50 hover:bg-navy-900/60 transition-all group relative overflow-hidden">
                        <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                            {card.icon}
                        </div>
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 rounded-xl bg-navy-950 border border-navy-800 ${card.color}`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-brand-500 uppercase tracking-[0.2em]">{card.label}</p>
                            <p className="text-4xl font-black text-white tracking-tight font-heading">{card.value}</p>
                        </div>
                        <p className="text-[10px] font-medium text-brand-700 mt-4 italic">{card.trend}</p>
                    </div>
                ))}
            </div>

            {/* Placeholder Charts in Glass Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="glass-card border-navy-800/50 h-[320px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-xs font-bold text-brand-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-8">
                        <BarChart3 className="w-4 h-4 text-accent-blue" />
                        Resolution Velocity
                    </h3>
                    <div className="flex flex-col items-center justify-center h-full pb-12 space-y-4">
                        <div className="flex items-end gap-2 h-32">
                            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                <div key={i} className="w-6 bg-navy-800 rounded-t-sm group-hover:bg-accent-blue/40 transition-all" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                        <p className="text-[10px] font-bold text-brand-700 uppercase tracking-widest italic tracking-tighter">Velocity metrics pending more data</p>
                    </div>
                </div>

                <div className="glass-card border-navy-800/50 h-[320px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-xs font-bold text-brand-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-8">
                        <PieChart className="w-4 h-4 text-warning" />
                        Incident Topology
                    </h3>
                    <div className="flex flex-col items-center justify-center h-full pb-12 space-y-6">
                        <div className="h-32 w-32 rounded-full border-[12px] border-navy-800 border-t-warning border-l-accent-blue group-hover:rotate-45 transition-transform duration-700"></div>
                        <p className="text-[10px] font-bold text-brand-700 uppercase tracking-widest italic tracking-tighter">Contextual breakdown unavailable</p>
                    </div>
                </div>
            </div>

            <div className="glass-card border-navy-800/50 p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-accent-blue/10 border border-accent-blue/20">
                        <ShieldAlert className="w-8 h-8 text-accent-blue" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-white tracking-tight">Active Duty Protection</h4>
                        <p className="text-xs text-brand-500 font-light max-w-md">The platform ensures all investigative actions are logged and immutable to prevent tampering or bias during the ethics audit.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-success"></div>
                    <span className="text-[10px] font-black text-success uppercase tracking-widest">End-to-End Audited</span>
                </div>
            </div>
        </div>
    );
}
