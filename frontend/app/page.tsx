'use client';

import { useRouter } from 'next/navigation';
import { Shield, Lock, BarChart3, Users } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_30%_20%,_#1e293b_0%,_#0b0f19_100%)]">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-10 animate-fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold tracking-widest uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
                </span>
                Enterprise Integrity Portal
              </div>

              <h1 className="text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-heading">
                Reporting <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-brand-400">
                  With Confidence
                </span>
              </h1>

              <p className="text-xl text-brand-300 leading-relaxed max-w-xl font-light">
                A secure, industrial-grade anonymous reporting platform designed to uphold corporate transparency and ethical standards.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button
                onClick={() => router.push('/report')}
                className="btn-primary px-10 py-4 text-base tracking-wide"
              >
                Submit New Incident
              </button>
              <button
                onClick={() => router.push('/track')}
                className="btn-outline px-10 py-4 text-base tracking-wide"
              >
                Track History
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-accent-blue" />}
              title="Anonymity"
              description="Zero identity tracking by design. Your safety is our priority."
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6 text-accent-blue" />}
              title="Security"
              description="End-to-end encryption with military-grade storage."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-accent-blue" />}
              title="Analytics"
              description="Advanced data aggregation for executive oversight."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-accent-blue" />}
              title="Integrity"
              description="Structured workflows to ensure every voice is heard."
            />
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-24 pt-10 flex flex-col sm:flex-row justify-center items-center gap-12 border-t border-navy-800/50">
          <PortalLink
            onClick={() => router.push('/hr/login')}
            label="Investigator Portal"
          />
          <PortalLink
            onClick={() => router.push('/admin/login')}
            label="System Administration"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-card hover:bg-navy-900/60 transition-colors group">
      <div className="mb-4 p-2 inline-block rounded-lg bg-navy-800 border border-navy-700 group-hover:border-accent-blue/30 transition-colors">
        {icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2 font-heading tracking-tight">{title}</h3>
      <p className="text-sm text-brand-400 leading-relaxed font-light">{description}</p>
    </div>
  );
}

function PortalLink({ onClick, label }: { onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className="text-sm font-medium text-brand-500 hover:text-white transition-all flex items-center gap-3 group"
    >
      <div className="h-2 w-2 rounded-full bg-navy-800 border border-navy-700 group-hover:bg-accent-blue group-hover:border-accent-blue transition-all"></div>
      {label}
    </button>
  );
}
