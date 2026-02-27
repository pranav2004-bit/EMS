'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/axios';
import { User } from '@/types';

export default function HRManagementPage() {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [newHR, setNewHR] = useState({ name: '', email: '', password: '' });

    const { data: users, isLoading } = useQuery<User[]>({
        queryKey: ['hr-users'],
        queryFn: async () => {
            const { data } = await api.get('/admin/hr-users');
            return data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (payload: typeof newHR) => {
            const { data } = await api.post('/admin/hr-users', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-users'] });
            setShowModal(false);
            setNewHR({ name: '', email: '', password: '' });
            alert('HR Investigator account created');
        }
    });

    const toggleMutation = useMutation({
        mutationFn: async ({ id, is_active }: { id: string, is_active: boolean }) => {
            const { data } = await api.patch(`/admin/hr-users/${id}`, { is_active });
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-users'] })
    });

    const resetPassword = async (id: string) => {
        const password = prompt('Enter new password for this investigator:');
        if (password && password.length >= 8) {
            try {
                await api.patch(`/admin/hr-users/${id}`, { reset_password: true, new_password: password });
                alert('Password updated successfully');
            } catch (err) {
                alert('Failed to update password');
            }
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">HR Investigator Management</h1>
                    <p className="text-muted-gray">Create and manage operational investigator accounts</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                >
                    Provision New Account
                </button>
            </header>

            <div className="card p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-navy-900 border-b border-navy-700 text-xs uppercase font-bold text-muted-gray">
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Created On</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-700">
                        {isLoading ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center animate-pulse">Loading personnel list...</td></tr>
                        ) : users?.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-gray">No investigator accounts provisioned.</td></tr>
                        ) : (
                            users?.map((u) => (
                                <tr key={u.id} className="hover:bg-navy-700/30 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">{u.name}</td>
                                    <td className="px-6 py-4 text-slate-300">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.is_active ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                            {u.is_active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-muted-gray">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <button
                                            onClick={() => toggleMutation.mutate({ id: u.id, is_active: !u.is_active })}
                                            className="text-xs font-bold text-muted-blue hover:text-white"
                                        >
                                            {u.is_active ? 'Disable' : 'Enable'}
                                        </button>
                                        <button
                                            onClick={() => resetPassword(u.id)}
                                            className="text-xs font-bold text-muted-gray hover:text-white"
                                        >
                                            Reset Credentials
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="card w-full max-w-lg space-y-6">
                        <h2 className="text-xl font-bold">New Investigator Account</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input
                                    className="input-field"
                                    value={newHR.name}
                                    onChange={e => setNewHR({ ...newHR, name: e.target.value })}
                                    placeholder="e.g. Jane Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={newHR.email}
                                    onChange={e => setNewHR({ ...newHR, email: e.target.value })}
                                    placeholder="jane.doe@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Initial Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={newHR.password}
                                    onChange={e => setNewHR({ ...newHR, password: e.target.value })}
                                    placeholder="Minimum 8 characters"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                            <button
                                onClick={() => createMutation.mutate(newHR)}
                                disabled={createMutation.isPending || !newHR.name || !newHR.email || newHR.password.length < 8}
                                className="btn-primary flex-1"
                            >
                                {createMutation.isPending ? 'Provisioning...' : 'Confirm Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
