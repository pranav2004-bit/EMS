'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/axios';
import { Complaint } from '@/types';
import {
    ShieldAlert,
    Calendar,
    MapPin,
    UserCircle,
    Paperclip,
    MessageSquare,
    ArrowLeft,
    CheckCircle2,
    Activity,
    Lock,
    Unlock,
    Download,
    Eye,
    ChevronRight,
    GanttChart,
    Briefcase
} from 'lucide-react';

export default function CaseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [resolutionText, setResolutionText] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const { data: report, isLoading } = useQuery<Complaint>({
        queryKey: ['case', id],
        queryFn: async () => {
            const { data } = await api.get(`/hr/complaints/${id}`);
            return data;
        },
        // Only update the local text if we're not currently editing it
        onSuccess: (data: Complaint) => {
            if (!isEditing) {
                setResolutionText(data.resolution_note || '');
            }
        }
    } as any);

    const updateMutation = useMutation({
        mutationFn: async (payload: { status?: string, resolution_note?: string }) => {
            const { data } = await api.patch(`/hr/complaints/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['case', id] });
        },
        onError: (error: any) => {
            const msg = error.response?.data?.detail || error.response?.data?.status?.[0] || 'System error: Could not commit changes.';
            alert(`Protocol Error: ${msg}`);
        }
    });

    const handleStatusChange = (newStatus: string) => {
        updateMutation.mutate({
            status: newStatus,
            resolution_note: resolutionText
        });
    };

    const saveResolution = () => {
        updateMutation.mutate({ resolution_note: resolutionText });
    };

    const getSignedUrl = async (attachmentId: string) => {
        try {
            const { data } = await api.get(`/complaints/attachments/${attachmentId}/signed-url`);
            window.open(data.signed_url, '_blank');
        } catch (err) {
            alert('Security Error: Could not generate signed access token.');
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
            <div className="h-12 w-12 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold text-brand-500 uppercase tracking-[0.3em]">Decoding Secure File...</p>
        </div>
    );

    if (!report) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
            <ShieldAlert className="w-16 h-16 text-danger opacity-20" />
            <p className="text-xl font-bold text-white tracking-tight">Access Denied: Record Missing</p>
            <button onClick={() => router.back()} className="btn-ghost text-brand-500 hover:text-white uppercase tracking-widest font-bold text-xs">Return to Vault</button>
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-navy-800 pb-10 px-1">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-brand-600 hover:text-white hover:border-accent-blue transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="px-4 py-1.5 rounded-full bg-navy-900 border border-navy-800 flex items-center gap-3">
                            <Lock className="w-3.5 h-3.5 text-accent-blue" />
                            <span className="font-mono text-[11px] font-black text-brand-400 tracking-tighter uppercase">Registry ID: {report.case_id}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight font-heading">{report.title}</h1>
                        <div className="flex items-center gap-6 text-brand-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-bold uppercase tracking-widest">Entry Date: {new Date(report.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className={`w-3.5 h-3.5 ${report.status === 'Resolved' ? 'text-success' : 'text-accent-blue'}`} />
                                <span className="text-[11px] font-bold uppercase tracking-widest">Status: {report.status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {report.status === 'Open' && (
                        <button
                            onClick={() => handleStatusChange('Under Review')}
                            className="btn-primary px-8 py-4 shadow-xl shadow-accent-blue/30 group"
                        >
                            <Unlock className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                            <span className="font-bold uppercase tracking-widest text-xs">Initiate Review</span>
                        </button>
                    )}
                    {report.status === 'Under Review' && (
                        <button
                            onClick={() => handleStatusChange('Resolved')}
                            className="btn-primary bg-success hover:bg-success/90 border-0 shadow-xl shadow-success/20 group"
                        >
                            <CheckCircle2 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                            <span className="font-bold uppercase tracking-widest text-xs">Close Case</span>
                        </button>
                    )}
                    <button className="btn-outline border-navy-800 text-brand-500 px-6 py-4 hover:bg-navy-900 group">
                        <Download className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">Export Dossier</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Detailed Analysis */}
                <div className="xl:col-span-8 space-y-10">
                    <div className="glass-card space-y-10 border-navy-800/50">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 bg-accent-blue rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            <h2 className="text-xl font-bold text-white tracking-tight font-heading">Investigation Narrative</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <DetailBlock icon={<GanttChart className="text-accent-blue" />} label="Classification" value={report.category} />
                            <DetailBlock icon={<Calendar className="text-accent-blue" />} label="Event Date" value={report.incident_date} />
                            <DetailBlock icon={<MapPin className="text-accent-blue" />} label="Site/Origin" value={report.location} />
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] px-1">Factual Log</p>
                            <div className="bg-navy-950 p-8 rounded-3xl border border-navy-800 leading-relaxed text-slate-300 font-light">
                                {report.description}
                            </div>
                        </div>
                    </div>

                    <div className="glass-card space-y-10 border-navy-800/50">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 bg-warning rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                            <h2 className="text-xl font-bold text-white tracking-tight font-heading">Subject Identification</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <DetailBlock icon={<UserCircle className="text-warning" />} label="Subject Name" value={report.accused_name || "PROTECTED / ANONYMOUS"} />
                            <DetailBlock icon={<Briefcase className="text-warning" />} label="Professional Role" value={report.accused_role || "DATA UNAVAILABLE"} />
                        </div>
                    </div>

                    <div className="glass-card space-y-10 border-navy-800/50 bg-accent-blue/5 border-accent-blue/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1 bg-accent-blue rounded-full"></div>
                                <h2 className="text-xl font-bold text-white tracking-tight font-heading">Case Resolution & Notes</h2>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20">
                                <Lock className="w-3 h-3 text-accent-blue" />
                                <span className="text-[9px] font-black text-accent-blue uppercase tracking-tighter">Authorized Personal Only</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <textarea
                                className="input-base bg-navy-950/80 border-navy-800 min-h-[250px] resize-none p-8 leading-relaxed placeholder:text-navy-800 font-light"
                                placeholder="Formal investigation summary, investigative steps, and final determination of ethics audit..."
                                value={resolutionText}
                                onChange={e => setResolutionText(e.target.value)}
                                onFocus={() => setIsEditing(true)}
                                onBlur={() => setIsEditing(false)}
                            />
                            <div className="flex justify-between items-center px-2">
                                <div className="flex items-center gap-2 text-brand-700">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest italic tracking-tighter">Drafts are auto-saved locally</span>
                                </div>
                                <button
                                    onClick={saveResolution}
                                    disabled={updateMutation.isPending}
                                    className={`btn-primary px-10 py-4 shadow-xl transition-all ${updateMutation.isSuccess ? 'bg-success shadow-success/20' : 'shadow-accent-blue/20'}`}
                                >
                                    {updateMutation.isPending ? 'Committing Changes...' :
                                        updateMutation.isSuccess ? 'Update Committed' :
                                            'Commit Status Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Metrics */}
                <div className="xl:col-span-4 space-y-10">
                    {/* Status Summary */}
                    <div className="glass-card space-y-6 border-navy-800/50">
                        <p className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] mb-4">Lifecycle Audit</p>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-navy-950 border border-navy-800">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-4 h-4 text-accent-blue" />
                                    <span className="text-[11px] font-bold text-brand-500 uppercase">Phase</span>
                                </div>
                                <span className="text-xs font-black text-white uppercase tracking-widest">{report.status}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-navy-950 border border-navy-800">
                                <div className="flex items-center gap-3">
                                    <ShieldAlert className="w-4 h-4 text-warning" />
                                    <span className="text-[11px] font-bold text-brand-500 uppercase">Severity Index</span>
                                </div>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-md border ${report.severity === 'High' ? 'bg-danger/10 border-danger/30 text-danger' : 'bg-success/10 border-success/30 text-success'} uppercase tracking-tighter`}>
                                    {report.severity} Rank
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Evidence Locker */}
                    <div className="glass-card space-y-8 border-navy-800/50">
                        <div className="flex items-center justify-between border-b border-navy-800 pb-4">
                            <p className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em]">Evidence Vault</p>
                            <div className="flex items-center gap-2">
                                <Paperclip className="w-3.5 h-3.5 text-brand-700" />
                                <span className="text-[10px] font-black text-white">{report.attachments.length} Files</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {report.attachments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 opacity-30 gap-3 grayscale">
                                    <Paperclip className="w-8 h-8" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">No Metadata Evidence</p>
                                </div>
                            ) : (
                                report.attachments.map(file => (
                                    <div key={file.id} className="group p-4 bg-navy-950/50 border border-navy-800 rounded-2xl hover:bg-navy-900 transition-all flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-white tracking-tight truncate max-w-[160px]">{file.file_name}</p>
                                            <p className="text-[9px] font-bold text-brand-700 uppercase tracking-tighter">
                                                {(file.file_size / 1024 / 1024).toFixed(2)} MB • {file.file_type.split('/')[1]}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => getSignedUrl(file.id)}
                                                className="p-2 rounded-lg bg-navy-900 border border-navy-800 text-brand-500 hover:text-accent-blue hover:border-accent-blue transition-all"
                                                title="View Secure Stream"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailBlock({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="space-y-3 group">
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-navy-950 border border-navy-800 group-hover:border-navy-700 transition-all">
                    {icon}
                </div>
                <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em]">{label}</p>
                    <p className="text-sm font-bold text-white tracking-tight group-hover:text-brand-300 transition-colors uppercase">{value}</p>
                </div>
            </div>
        </div>
    );
}
