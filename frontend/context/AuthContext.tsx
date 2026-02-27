'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/axios';
import { User, Role } from '@/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, role: Role) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // We don't have a /me endpoint yet per TRD, but we can check session
                // For now, we'll assume the browser cookies handle it.
                // In a real app, we'd fetch the user profile here.
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = (email: string, role: Role) => {
        // This is called after successful API login
        // Since we don't return user object in login yet, we mock or fetch
        setUser({ email, role, name: 'User' } as User);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            setUser(null);
            router.push('/');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
