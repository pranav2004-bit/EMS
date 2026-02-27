import RouteGuard from '@/components/RouteGuard';
import Sidebar from '@/components/Sidebar';

export default function HRLayout({ children }: { children: React.ReactNode }) {
    const links = [
        { name: 'Dashboard', href: '/hr/dashboard' },
        { name: 'Incidents', href: '/hr/cases' },
        { name: 'Analytics', href: '/hr/analytics' },
    ];

    return (
        <RouteGuard allowedRoles={['hr']} redirectTo="/hr/login">
            <div className="flex min-h-screen bg-navy-900">
                <Sidebar role="hr" links={links} />
                <main className="flex-1 ml-64 p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </RouteGuard>
    );
}
