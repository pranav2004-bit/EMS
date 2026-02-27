import RouteGuard from '@/components/RouteGuard';
import Sidebar from '@/components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const links = [
        { name: 'Overview', href: '/admin/dashboard' },
        { name: 'HR Investigators', href: '/admin/users' },
    ];

    return (
        <RouteGuard allowedRoles={['admin']} redirectTo="/admin/login">
            <div className="flex min-h-screen bg-navy-900">
                <Sidebar role="admin" links={links} />
                <main className="flex-1 ml-64 p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </RouteGuard>
    );
}
