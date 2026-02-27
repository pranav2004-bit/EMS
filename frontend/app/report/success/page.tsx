'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
    const [caseId, setCaseId] = useState('');
    const router = useRouter();

    useEffect(() => {
        const id = sessionStorage.getItem('last_case_id');
        if (!id) {
            router.push('/report');
        } else {
            setCaseId(id);
            // Clear flag after showing
            sessionStorage.removeItem('reporter_authenticated');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-navy-900 flex items-center justify-center p-6">
            <div className="max-w-xl w-full card border-green-900/30 shadow-2xl shadow-green-900/10 text-center space-y-8 py-12">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-900/20 text-green-500 mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-white">Report Successfully Submitted</h1>
                    <p className="text-muted-gray">
                        Your report has been received and logged securely.
                        An HR investigator will begin reviewing your case shortly.
                    </p>
                </div>

                <div className="bg-navy-900/80 border border-navy-700 p-8 rounded-xl space-y-4">
                    <p className="text-xs uppercase tracking-widest text-muted-blue font-bold">Your Unique Case ID</p>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight break-all">
                        {caseId}
                    </div>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(caseId);
                            alert('Case ID copied to clipboard');
                        }}
                        className="text-sm text-muted-gray hover:text-white transition-colors"
                    >
                        Copy to Clipboard
                    </button>
                </div>

                <div className="bg-amber-900/10 border border-amber-900/30 p-4 rounded-lg text-sm text-amber-200/80">
                    <p>
                        <strong>IMPORTANT:</strong> Save this ID securely.
                        This is the only way to track your case.
                        Lost IDs cannot be recovered as we store no reporter information.
                    </p>
                </div>

                <button
                    onClick={() => router.push('/')}
                    className="btn-outline w-full py-3"
                >
                    Return to Portal Root
                </button>
            </div>
        </div>
    );
}
