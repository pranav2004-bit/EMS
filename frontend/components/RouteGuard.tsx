'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Role } from '@/types';

interface RouteGuardProps {
    children: ReactNode;
    allowedRoles: Role[];
    redirectTo: string;
}

export default function RouteGuard({ children, allowedRoles, redirectTo }: RouteGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || !allowedRoles.includes(user.role)) {
                router.push(redirectTo);
            }
        }
    }, [user, loading, allowedRoles, redirectTo, router]);

    if (loading || !user || !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen bg-navy-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-muted-blue"></div>
            </div>
        );
    }

    return <>{children}</>;
}
