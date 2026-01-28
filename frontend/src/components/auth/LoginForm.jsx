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
        <div className="card w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
                        <input
                            {...register('email', { required: 'Email is required' })}
                            type="email"
                            className={`input-field ${errors.email ? 'border-rose-500 focus:ring-rose-100' : ''}`}
                            placeholder="name@company.com"
                        />
                        {errors.email && <p className="mt-1.5 text-xs font-bold text-rose-500 ml-1 uppercase letter-spacing-wide">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                        <input
                            {...register('password', { required: 'Password is required' })}
                            type="password"
                            className={`input-field ${errors.password ? 'border-rose-500 focus:ring-rose-100' : ''}`}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-1.5 text-xs font-bold text-rose-500 ml-1 uppercase letter-spacing-wide">{errors.password.message}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full mt-8"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Authenticating...
                        </div>
                    ) : 'Sign In to Workspace'}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-slate-500 font-medium tracking-tight">
                    New to eFormX?{' '}
                    <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
