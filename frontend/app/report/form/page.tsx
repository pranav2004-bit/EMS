'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import {
    ShieldCheck,
    Calendar,
    MapPin,
    FileText,
    AlertTriangle,
    Paperclip,
    ArrowLeft,
    Send,
    UserCircle,
    CheckCircle2
} from 'lucide-react';

const CATEGORIES = [
    'Harassment',
    'Discrimination',
    'Fraud / Financial Misconduct',
    'Safety Violation',
    'Conflict of Interest',
    'Bribery / Corruption',
    'Other Ethical Concern'
];

const URGENCY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];

const IMPACT_FLAGS = [
    { id: 'harassment', label: 'Involves Harassment' },
    { id: 'discrimination', label: 'Evidence of Discrimination' },
    { id: 'fraud', label: 'Financial Impropriety' },
    { id: 'safety', label: 'Physical Safety Risk' },
    { id: 'legal', label: 'Potential Legal Breach' },
];

export default function ComplaintFormPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        category: '',
        title: '',
        description: '',
        incident_date: '',
        location: '',
        accused_name: '',
        accused_role: '',
        urgency_level: 'Medium',
        impact_flags: [] as string[],
    });
    const [attachments, setAttachments] = useState<File[]>([]);

    useEffect(() => {
        if (!sessionStorage.getItem('reporter_authenticated')) {
            router.push('/report');
        }
    }, [router]);

    const handleCheckbox = (id: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            impact_flags: checked
                ? [...prev.impact_flags, id]
                : prev.impact_flags.filter(f => f !== id)
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const validFiles = Array.from(e.target.files).filter(file => {
                const isValidSize = file.size <= 10 * 1024 * 1024;
                return isValidSize;
            });
            setAttachments(prev => [...prev, ...validFiles]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'impact_flags') {
                submitData.append(key, JSON.stringify(value));
            } else {
                submitData.append(key, value as string);
            }
        });

        attachments.forEach(file => {
            submitData.append('attachments', file);
        });

        try {
            const { data } = await api.post('/complaints/', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            sessionStorage.setItem('last_case_id', data.case_id);
            router.push('/report/success');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'System Error: Failed to secure report submission.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy-950 py-16 px-6 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl w-full mx-auto space-y-10 relative">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-navy-800 pb-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-accent-blue font-bold tracking-[0.15em] text-[10px] uppercase">
                            <ShieldCheck className="w-4 h-4" />
                            Secure Channel Activated
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight font-heading">Submit Integrity Report</h1>
                        <p className="text-brand-500 font-light max-w-lg">
                            Provide comprehensive details regarding the concern. Your submission is protected by end-to-end encryption.
                        </p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="btn-ghost gap-2 text-xs font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Abort
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-24">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Section 1: Context */}
                        <div className="glass-card space-y-8 border-navy-800/50">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1 bg-accent-blue rounded-full"></div>
                                <h2 className="text-xl font-bold text-white tracking-tight font-heading">Incident Context</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Classification</label>
                                    <select
                                        required
                                        className="input-base bg-navy-950/50"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select Classification</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-accent-blue" />
                                        Approx. Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="input-base bg-navy-950/50"
                                        value={formData.incident_date}
                                        onChange={e => setFormData({ ...formData, incident_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3 h-3 text-accent-blue" />
                                    Location / Department
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Site, Global Region, or Virtual Office"
                                    className="input-base bg-navy-950/50 placeholder:text-navy-700"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Section 2: Narrative */}
                        <div className="glass-card space-y-8 border-navy-800/50">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1 bg-accent-blue rounded-full"></div>
                                <h2 className="text-xl font-bold text-white tracking-tight font-heading">Factual Narrative</h2>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Case Overview</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Concise header for this report"
                                    className="input-base bg-navy-950/50 placeholder:text-navy-700 font-semibold"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Detailed Event Log</label>
                                <textarea
                                    required
                                    placeholder="Provide a chronological account of the events..."
                                    className="input-base bg-navy-950/50 placeholder:text-navy-700 min-h-[220px] resize-none leading-relaxed"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Section 3: Parties */}
                        <div className="glass-card space-y-8 border-navy-800/50">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1 bg-accent-blue rounded-full"></div>
                                <h2 className="text-xl font-bold text-white tracking-tight font-heading">Subjects Involved</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
                                        <UserCircle className="w-3 h-3 text-accent-blue" />
                                        Primary Subject
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Full name (if known)"
                                        className="input-base bg-navy-950/50 placeholder:text-navy-700"
                                        value={formData.accused_name}
                                        onChange={e => setFormData({ ...formData, accused_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Professional Capacity</label>
                                    <input
                                        type="text"
                                        placeholder="Job title or seniority level"
                                        className="input-base bg-navy-950/50 placeholder:text-navy-700"
                                        value={formData.accused_role}
                                        onChange={e => setFormData({ ...formData, accused_role: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Controls */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Status Card */}
                        <div className="glass-card bg-accent-blue shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] border-none text-white space-y-6">
                            <h3 className="font-bold flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Urgency Assessment
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {URGENCY_LEVELS.map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, urgency_level: level })}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${formData.urgency_level === level
                                                ? 'bg-white text-accent-blue shadow-lg scale-105'
                                                : 'bg-white/10 hover:bg-white/20'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Impact Indicators */}
                        <div className="glass-card space-y-4 border-navy-800/50">
                            <p className="text-[10px] font-extrabold text-brand-500 uppercase tracking-widest px-1">Risk Factors</p>
                            <div className="space-y-2">
                                {IMPACT_FLAGS.map(flag => (
                                    <label
                                        key={flag.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${formData.impact_flags.includes(flag.id)
                                                ? 'bg-accent-blue/10 border-accent-blue/30 text-white'
                                                : 'bg-navy-900/50 border-navy-800 text-brand-400 hover:border-navy-700'
                                            }`}
                                    >
                                        <div className={`h-4 w-4 rounded-md border flex items-center justify-center transition-all ${formData.impact_flags.includes(flag.id)
                                                ? 'bg-accent-blue border-accent-blue'
                                                : 'bg-navy-950 border-navy-700'
                                            }`}>
                                            {formData.impact_flags.includes(flag.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.impact_flags.includes(flag.id)}
                                            onChange={(e) => handleCheckbox(flag.id, e.target.checked)}
                                        />
                                        <span className="text-[11px] font-bold tracking-tight">{flag.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Evidence Upload */}
                        <div className="glass-card space-y-4 border-navy-800/50 p-4">
                            <p className="text-[10px] font-extrabold text-brand-500 uppercase tracking-widest px-1">Metadata Evidence</p>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative border-2 border-dashed border-navy-800 hover:border-accent-blue/50 rounded-2xl p-6 text-center transition-all cursor-pointer bg-navy-950/40"
                            >
                                <Paperclip className="w-6 h-6 text-navy-700 group-hover:text-accent-blue mx-auto mb-2 transition-colors" />
                                <p className="text-[10px] font-bold text-navy-500 group-hover:text-brand-300">ATTACH FILES</p>
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                {attachments.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-navy-900/50 border border-navy-800 text-[10px] font-bold text-brand-400">
                                        <span className="truncate max-w-[120px]">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                                            className="text-danger hover:text-danger/80"
                                        >Remove</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Final Action */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full py-5 text-lg shadow-xl shadow-accent-blue/30 group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {isLoading ? 'Encrypting & Uploading...' : 'Finalize Submission'}
                                    {!isLoading && <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                </span>
                            </button>
                            <p className="text-center text-[10px] text-brand-700 mt-4 font-bold tracking-wider uppercase">End-to-End Encrypted Gateway</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
