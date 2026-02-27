'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { LogOut, ChevronRight, LayoutDashboard, Users, FileText, PieChart, ShieldCheck, UserCog } from 'lucide-react';

interface SidebarProps {
    role: Role;
    links: { name: string; href: string; icon?: React.ReactNode }[];
}

export default function Sidebar({ role, links }: SidebarProps) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    // Map names to icons for a more industrial feel
    const getIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('dashboard') || lower.includes('overview')) return <LayoutDashboard className="w-4 h-4" />;
        if (lower.includes('hr') || lower.includes('user')) return <Users className="w-4 h-4" />;
        if (lower.includes('incident') || lower.includes('case')) return <FileText className="w-4 h-4" />;
        if (lower.includes('analytic')) return <PieChart className="w-4 h-4" />;
        return <ChevronRight className="w-4 h-4" />;
    };

    return (
        <aside className="w-72 glass-card rounded-none border-y-0 border-l-0 border-r border-navy-800 flex flex-col h-screen fixed left-0 top-0 z-50 overflow-hidden">
            {/* Logo/Header Section */}
            <div className="p-8 pb-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
                        <ShieldCheck className="w-6 h-6 text-accent-blue" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight leading-none font-heading">EthicalGuard</h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-500 mt-1.5">Enterprise Portal</p>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-navy-950/50 border border-navy-800 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-navy-700 to-navy-900 border border-navy-700 flex items-center justify-center">
                        <UserCog className="w-5 h-5 text-brand-300" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{user?.email?.split('@')[0] || 'Member'}</p>
                        <p className="text-[10px] font-medium text-brand-500 uppercase tracking-wider">
                            {role === 'admin' ? 'System Admin' : 'Investigator'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-4 space-y-1.5">
                <p className="px-4 text-[10px] font-bold text-brand-600 uppercase tracking-[0.15em] mb-4">Core Management</p>
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-accent-blue/10 text-white shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]'
                                : 'text-brand-400 hover:text-white hover:bg-navy-800/40'
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`transition-colors duration-200 ${isActive ? 'text-accent-blue' : 'text-brand-500 group-hover:text-brand-300'}`}>
                                    {getIcon(link.name)}
                                </div>
                                <span className="text-sm font-semibold tracking-wide">{link.name}</span>
                            </div>
                            {isActive && <div className="h-1.5 w-1.5 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse"></div>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Section */}
            <div className="mt-auto p-6 border-t border-navy-800/50">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-brand-400 hover:text-white hover:bg-danger/10 hover:text-danger transition-all duration-300 group"
                >
                    <div className="p-1.5 rounded-lg bg-navy-800 group-hover:bg-danger/10 transition-colors">
                        <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </div>
                    <span className="text-sm font-bold tracking-wide">Secure Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
