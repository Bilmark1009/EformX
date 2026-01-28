import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const LoginForm = () => {
    const { login } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-xl font-black text-white mb-8 tracking-tight flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                Account Synchronization
            </h2>

            {error && (
                <div className="bg-rose-500/10 border-l-2 border-rose-500 text-rose-400 px-4 py-3 rounded-r-xl mb-8 text-xs font-bold font-mono uppercase tracking-tight">
                    System Alert: {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono ml-1">Identity Probe (Email)</label>
                        <input
                            {...register('email', { required: 'Email is required' })}
                            type="email"
                            className={`input-field !py-4 font-mono font-bold !text-sm ${errors.email ? 'border-rose-500 focus:ring-rose-500/20' : ''}`}
                            placeholder="admin@eformx.sys"
                        />
                        {errors.email && <p className="mt-2 text-[9px] font-black text-rose-500 ml-1 uppercase tracking-widest font-mono">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono ml-1">Access Protocol (Password)</label>
                        <input
                            {...register('password', { required: 'Password is required' })}
                            type="password"
                            className={`input-field !py-4 font-mono font-bold !text-sm ${errors.password ? 'border-rose-500 focus:ring-rose-500/20' : ''}`}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-2 text-[9px] font-black text-rose-500 ml-1 uppercase tracking-widest font-mono">{errors.password.message}</p>}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full !rounded-xl !py-4 !text-[11px] font-black uppercase tracking-[0.2em] shadow-glow"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center font-mono">
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Authenticating...
                            </div>
                        ) : 'Establish Connection'}
                    </button>
                </div>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-800/50 text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                    New Operator?{' '}
                    <Link to="/register" className="text-primary-500 hover:text-primary-400 transition-colors">
                        Initialize Profile
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;

