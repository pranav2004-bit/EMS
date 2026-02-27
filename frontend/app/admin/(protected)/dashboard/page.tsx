'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { DashboardStats } from '@/types';
import {
    Activity,
    Users,
    FileWarning,
    CheckCircle2,
    Database,
    ShieldCheck,
    Lock,
    Server,
    History
} from 'lucide-react';

export default function AdminDashboardPage() {
    const { data: stats, isLoading } = useQuery<DashboardStats>({
        queryKey: ['admin-overview'],
        queryFn: async () => {
            const { data } = await api.get('/admin/overview');
            return data;
        }
    });

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-brand-500 uppercase tracking-widest">Polling System Metrics...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight font-heading">System Governance</h1>
                    <p className="text-brand-500 font-light tracking-wide">Infrastructure health and investigator activity oversight</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-success/10 border border-success/20 rounded-xl">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-[10px] font-bold text-success uppercase tracking-widest">Global Systems Online</span>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Users className="w-5 h-5 text-accent-blue" />}
                    label="Total Investigators"
                    value={stats?.total_hr_users || 0}
                    trend="Registered Accounts"
                />
                <StatCard
                    icon={<Activity className="w-5 h-5 text-success" />}
                    label="Active Sessions"
                    value={stats?.active_hr_users || 0}
                    trend="Real-time Monitoring"
                />
                <StatCard
                    icon={<FileWarning className="w-5 h-5 text-white" />}
                    label="Total Logs"
                    value={stats?.total_complaints || 0}
                    trend="Incident Registry"
                />
                <StatCard
                    icon={<Lock className="w-5 h-5 text-warning" />}
                    label="Pending Review"
                    value={(stats?.complaints_by_status.Open || 0) + (stats?.complaints_by_status['Under Review'] || 0)}
                    trend="Awaiting Action"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Health Monitoring */}
                <section className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold text-white tracking-tight font-heading flex items-center gap-3">
                            <Server className="w-5 h-5 text-brand-500" />
                            Infrastructure Health
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <HealthItem
                            icon={<Database className="w-4 h-4" />}
                            label="Supabase Core Cluster"
                            status="HEALTHY"
                            uptime="99.98%"
                        />
                        <HealthItem
                            icon={<ShieldCheck className="w-4 h-4" />}
                            label="Storage Vault (AWS)"
                            status="SECURED"
                            uptime="100%"
                        />
                        <HealthItem
                            icon={<Lock className="w-4 h-4" />}
                            label="JWT Auth Handlers"
                            status="ACTIVE"
                            uptime="100%"
                        />
                        <HealthItem
                            icon={<Activity className="w-4 h-4" />}
                            label="API Gateway"
                            status="POLLING"
                            uptime="99.99%"
                        />
                    </div>
                </section>

                {/* Audit Log */}
                <section className="lg:col-span-4 space-y-6">
                    <h2 className="text-xl font-bold text-white tracking-tight font-heading flex items-center gap-3">
                        <History className="w-5 h-5 text-brand-500" />
                        Security Audit
                    </h2>
                    <div className="glass-card border-navy-800/50 p-6 space-y-6 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Lock className="w-16 h-16" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            <AuditItem
                                title="Admin Auth Successful"
                                time="2 min ago"
                                type="success"
                            />
                            <AuditItem
                                title="CORS Policy Update"
                                time="14 min ago"
                                type="neutral"
                            />
                            <AuditItem
                                title="Storage Bucket Verified"
                                time="45 min ago"
                                type="success"
                            />
                            <div className="pt-2">
                                <button className="text-[10px] font-bold text-accent-blue hover:text-white transition-colors uppercase tracking-[0.2em] w-full text-center">
                                    View Full Audit Trail
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: number, trend: string }) {
    return (
        <div className="glass-card p-6 border-navy-800/50 hover:bg-navy-900/60 transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                {icon}
            </div>
            <div className="p-2 w-fit rounded-lg bg-navy-950 border border-navy-800 mb-4 group-hover:border-accent-blue/30 transition-colors">
                {icon}
            </div>
            <p className="text-[10px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-4xl font-black text-white tracking-tight mb-2 font-heading">{value}</p>
            <p className="text-[10px] font-medium text-brand-600 italic tracking-wide">{trend}</p>
        </div>
    );
}

function HealthItem({ icon, label, status, uptime }: { icon: React.ReactNode, label: string, status: string, uptime: string }) {
    return (
        <div className="glass-card border-navy-800/50 p-5 flex items-center justify-between group hover:border-accent-blue/20 transition-all">
            <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-brand-400 group-hover:text-accent-blue transition-colors">
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-bold text-white tracking-tight leading-none mb-1">{label}</p>
                    <p className="text-[10px] font-medium text-brand-600 uppercase tracking-tighter">Uptime: {uptime}</p>
                </div>
            </div>
            <div className="px-2 py-1 rounded bg-success/5 border border-success/10">
                <span className="text-[9px] font-black text-success tracking-tighter">{status}</span>
            </div>
        </div>
    );
}

function AuditItem({ title, time, type }: { title: string, time: string, type: 'success' | 'neutral' | 'danger' }) {
    return (
        <div className="flex items-start gap-4 group">
            <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${type === 'success' ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-brand-700'}`}></div>
            <div>
                <p className="text-[11px] font-semibold text-brand-200 group-hover:text-white transition-colors">{title}</p>
                <p className="text-[10px] text-brand-600 mt-0.5">{time}</p>
            </div>
        </div>
    );
}
