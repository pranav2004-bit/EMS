'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { AnalyticsData } from '@/types';
import {
    BarChart3,
    TrendingUp,
    LifeBuoy,
    PieChart,
    Fingerprint,
    Activity,
    Target,
    Zap,
    History
} from 'lucide-react';

export default function AnalyticsPage() {
    const { data, isLoading } = useQuery<AnalyticsData>({
        queryKey: ['hr-analytics'],
        queryFn: async () => {
            const { data } = await api.get('/hr/analytics');
            return data;
        }
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
            <div className="h-12 w-12 border-4 border-accent-blue/10 border-t-accent-blue rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold text-brand-500 uppercase tracking-[0.3em]">Processing Risk Data Models...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 border-b border-navy-800 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-accent-blue font-bold tracking-[0.2em] text-[10px] uppercase">
                        <Target className="w-4 h-4" />
                        Infrastructure Biometry
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight font-heading">Risk Intelligence</h1>
                    <p className="text-brand-500 font-light max-w-xl text-balance line-clamp-2">
                        Heuristic analysis of organizational integrity, behavioral trends, and incident resolution efficiency.
                    </p>
                </div>
                <div className="bg-navy-950 px-4 py-2 rounded-xl border border-navy-800 flex items-center gap-3">
                    <History className="w-4 h-4 text-brand-700" />
                    <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Real-time Stream Active</span>
                </div>
            </header>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    icon={<Zap className="w-6 h-6" />}
                    label="Resolution Efficacy"
                    value={`${data?.resolution_rate}%`}
                    subLabel="Target: 95.0%+"
                    color="text-accent-blue"
                />
                <StatCard
                    icon={<Target className="w-6 h-6" />}
                    label="Neutralized Threats"
                    value={data?.resolved_complaints || 0}
                    subLabel="Formal Closures"
                    color="text-success"
                />
                <StatCard
                    icon={<Activity className="w-6 h-6" />}
                    label="Active Load"
                    value={data?.total_complaints || 0}
                    subLabel="In-system Records"
                    color="text-white"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Category Breakdown */}
                <section className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Fingerprint className="w-5 h-5 text-accent-blue" />
                        <h2 className="text-xl font-bold text-white tracking-tight font-heading">Incident Topology</h2>
                    </div>

                    <div className="glass-card border-navy-800/50 p-8 space-y-8">
                        {data?.volume_by_category.map(item => (
                            <div key={item.category} className="space-y-3 group">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold text-brand-300 tracking-tight group-hover:text-accent-blue transition-colors uppercase">{item.category}</span>
                                        <p className="text-[9px] font-bold text-brand-700 uppercase tracking-tighter">Density Analysis</p>
                                    </div>
                                    <span className="font-mono text-xs font-bold text-white bg-navy-950 px-2 py-1 rounded border border-navy-800">{item.count}</span>
                                </div>
                                <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden border border-navy-900">
                                    <div
                                        className="h-full bg-accent-blue/60 group-hover:bg-accent-blue transition-all relative overflow-hidden"
                                        style={{ width: `${(item.count / (data.total_complaints || 1)) * 100}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Status Breakdown */}
                <section className="lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-warning" />
                        <h2 className="text-xl font-bold text-white tracking-tight font-heading">Process Lifecycle</h2>
                    </div>

                    <div className="glass-card border-navy-800/50 p-8 space-y-4 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                            <TrendingUp className="w-32 h-32" />
                        </div>
                        {data?.status_distribution.map(item => (
                            <div key={item.status} className="flex items-center justify-between p-5 bg-navy-950/60 border border-navy-800 rounded-2xl hover:bg-navy-900 hover:border-accent-blue/20 transition-all">
                                <span className="text-[11px] font-black text-brand-500 uppercase tracking-widest">{item.status}</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-black text-white tracking-tighter">{item.count}</span>
                                    <span className="text-[9px] font-bold text-brand-700 mb-1 uppercase tracking-tighter">Units</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Trend Analysis */}
                <section className="lg:col-span-12 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-success" />
                        <h2 className="text-xl font-bold text-white tracking-tight font-heading">Temporal Volume Progression</h2>
                    </div>
                    <div className="glass-card border-navy-800/50 p-10 relative overflow-hidden group">
                        <div className="flex items-end justify-between h-64 gap-6 px-4">
                            {data?.monthly_trend.map(item => (
                                <div key={item.month} className="flex-1 flex flex-col items-center gap-6 group/bar">
                                    <div className="relative w-full flex flex-col items-center">
                                        <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                            <span className="text-[10px] font-black text-accent-blue bg-navy-950 px-3 py-1.5 rounded-lg border border-accent-blue/30 shadow-xl">{item.count} Reports</span>
                                        </div>
                                        <div
                                            className="w-full bg-navy-950 border-t-2 border-accent-blue/30 rounded-t-xl group-hover/bar:bg-accent-blue/10 group-hover/bar:border-accent-blue transition-all relative overflow-hidden shadow-2xl"
                                            style={{ height: `${(item.count / Math.max(...data.monthly_trend.map(m => m.count), 1)) * 100}%`, minHeight: '4px' }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-accent-blue/20 to-transparent"></div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-brand-700 uppercase tracking-widest -rotate-45 md:rotate-0 mt-4 h-8 flex items-center">{item.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, subLabel, color }: { icon: React.ReactNode, label: string, value: string | number, subLabel: string, color: string }) {
    return (
        <div className="glass-card border-navy-800/50 p-10 hover:bg-navy-900/40 transition-all group relative overflow-hidden">
            <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className={`p-4 rounded-2xl bg-navy-950 border border-navy-800 mb-8 inline-flex group-hover:border-accent-blue/20 transition-all ${color}`}>
                {icon}
            </div>
            <div className="space-y-2 relative z-10">
                <p className="text-[11px] font-black text-brand-600 uppercase tracking-[0.3em]">{label}</p>
                <p className={`text-6xl font-black tracking-tighter font-heading ${color}`}>{value}</p>
                <p className="text-[10px] font-bold text-brand-800 uppercase italic tracking-tighter">{subLabel}</p>
            </div>
        </div>
    );
}
