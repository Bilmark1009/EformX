import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import Modal from '../components/common/Modal';
import AnimatedCounter from '../components/common/AnimatedCounter';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ total_users: 0, total_forms: 0, total_responses: 0 });
    const [loading, setLoading] = useState(true);
    const [iscreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, statsRes] = await Promise.all([
                api.get('/users'),
                api.get('/admin/stats')
            ]);
            setUsers(usersRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error(error);
            addToast('Failed to fetch administration data', 'error');
            if (error.response?.status === 403) {
                navigate('/dashboard');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onCreateUser = async (data) => {
        try {
            await api.post('/users', data);
            addToast('User created successfully!');
            setIsCreateModalOpen(false);
            reset();
            fetchData();
        } catch (error) {
            console.error(error);
            addToast(error.response?.data?.message || 'Failed to create user', 'error');
        }
    };

    const onDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
            try {
                await api.delete(`/users/${userId}`);
                addToast('User deleted successfully');
                setUsers(users.filter(u => u.id !== userId));
            } catch (error) {
                const msg = error.response?.data?.message || 'Failed to delete user';
                addToast(msg, 'error');
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 relative">
                <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-violet-500/50 rounded-full"></div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold font-mono tracking-[0.2em] text-violet-500 uppercase">Admin Console</span>
                        <div className="h-[1px] w-12 bg-violet-500/30"></div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white font-display">
                        User <span className="text-violet-500">Management</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-md leading-relaxed">
                        Control system access and manage administrator privileges.
                    </p>
                </div>

                <div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn-primary !bg-violet-600 hover:!bg-violet-500 !rounded-xl !px-8 shadow-glow hover:shadow-glow-lg transition-all"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Create User
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { label: 'System Nodes', value: stats.total_users, sub: 'Authorized Admins', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'text-blue-500' },
                    { label: 'Deployed Modules', value: stats.total_forms, sub: 'Active Forms', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'text-violet-500' },
                    { label: 'Data Captured', value: stats.total_responses, sub: 'Global Responses', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'text-emerald-500' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card !p-6 flex items-center gap-6 group hover:border-violet-500/30 transition-all">
                        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                            </svg>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</div>
                            <div className="text-3xl font-black text-white tracking-tighter">
                                <AnimatedCounter value={stat.value} />
                            </div>
                            <div className="text-[10px] font-bold text-slate-600 mt-1">{stat.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <span className="text-xs font-bold font-mono text-violet-500 animate-pulse tracking-widest uppercase">Loading Users...</span>
                </div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest font-mono text-slate-400">
                                    <th className="p-4 font-bold">Name</th>
                                    <th className="p-4 font-bold">Email</th>
                                    <th className="p-4 font-bold">Role</th>
                                    <th className="p-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-white text-sm">{u.name}</div>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-300">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                                                ${u.role === 'superadmin' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {u.id !== user?.id && (
                                                <button
                                                    onClick={() => onDeleteUser(u.id, u.name)}
                                                    className="text-slate-500 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-500/10"
                                                    title="Delete User"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {users.length === 0 && (
                        <div className="p-8 text-center text-slate-500 font-mono text-sm">No users found.</div>
                    )}
                </div>
            )}

            <Modal
                isOpen={iscreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New User"
            >
                <form onSubmit={handleSubmit(onCreateUser)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2 ml-1 uppercase tracking-widest text-[10px]">Full Name</label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            className={`input-field ${errors.name ? 'border-error' : ''}`}
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-error text-xs mt-2 ml-1 font-bold italic">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2 ml-1 uppercase tracking-widest text-[10px]">Email Address</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className={`input-field ${errors.email ? 'border-error' : ''}`}
                            placeholder="john@example.com"
                        />
                        {errors.email && <p className="text-error text-xs mt-2 ml-1 font-bold italic">{errors.email.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2 ml-1 uppercase tracking-widest text-[10px]">Password</label>
                            <input
                                type="password"
                                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                                className={`input-field ${errors.password ? 'border-error' : ''}`}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-error text-xs mt-2 ml-1 font-bold italic">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2 ml-1 uppercase tracking-widest text-[10px]">Confirm Password</label>
                            <input
                                type="password"
                                {...register('password_confirmation', {
                                    required: 'Confirmation is required',
                                    validate: (val, formValues) => val === formValues.password || 'Passwords do not match'
                                })}
                                className={`input-field ${errors.password_confirmation ? 'border-error' : ''}`}
                                placeholder="••••••••"
                            />
                            {errors.password_confirmation && <p className="text-error text-xs mt-2 ml-1 font-bold italic">{errors.password_confirmation.message}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2 ml-1 uppercase tracking-widest text-[10px]">Role</label>
                        <select
                            {...register('role', { required: 'Role is required' })}
                            className="input-field appearance-none bg-slate-900"
                        >
                            <option value="admin">Admin</option>
                            <option value="superadmin">Super Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary !bg-violet-600 hover:!bg-violet-500">
                            Create User
                        </button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
};

export default UserManagement;
