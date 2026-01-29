import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/common/DashboardLayout';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const { addToast } = useToast();

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);
        try {
            const res = await api.put('/user/profile', profileData);
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            addToast('Profile updated successfully');
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoadingPassword(true);
        try {
            await api.put('/user/password', passwordData);
            addToast('Password updated successfully');
            setPasswordData({
                current_password: '',
                password: '',
                password_confirmation: ''
            });
        } catch (err) {
            if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                Object.keys(errors).forEach(key => {
                    addToast(errors[key][0], 'error');
                });
            } else {
                addToast(err.response?.data?.message || 'Failed to update password', 'error');
            }
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-10 py-6">
                <div>
                    <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent italic">
                        User Profile
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight uppercase text-xs font-mono">Manage your identity and security protocols</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="glass-card tech-border space-y-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center text-primary-500 border border-primary-500/20">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">Personal Identity</h2>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">ADMIN_NAME</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="input-field"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">CONTACT_EMAIL</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="input-field"
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loadingProfile}
                                className="btn-primary w-full !py-3 font-mono text-xs tracking-[0.2em] uppercase"
                            >
                                {loadingProfile ? 'Synchronizing...' : 'Save Identity'}
                            </button>
                        </form>
                    </div>

                    {/* Security Section */}
                    <div className="glass-card tech-border space-y-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-500 border border-rose-500/20">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">Security Vault</h2>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">CURRENT_KEY</label>
                                <input
                                    type="password"
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                    className="input-field"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">NEW_KEY</label>
                                <input
                                    type="password"
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                    className="input-field"
                                    placeholder="Min. 8 characters"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">CONFIRM_KEY</label>
                                <input
                                    type="password"
                                    value={passwordData.password_confirmation}
                                    onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                                    className="input-field"
                                    placeholder="Retype new key"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loadingPassword}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl border border-slate-700 transition-all font-mono text-xs tracking-[0.2em] uppercase active:scale-95 shadow-lg"
                            >
                                {loadingPassword ? 'Encrypting...' : 'Update Security'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
