import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const RegisterForm = () => {
    const { register: registerAuth } = useContext(AuthContext);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            await registerAuth(data.name, data.email, data.password, data.password_confirmation);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Create your Account</h2>

            {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm font-bold flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Full Name</label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            type="text"
                            className={`input-field ${errors.name ? 'border-rose-500 focus:ring-rose-100' : ''}`}
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="mt-1.5 text-xs font-bold text-rose-500 ml-1 uppercase letter-spacing-wide">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
                        <input
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                            })}
                            type="email"
                            className={`input-field ${errors.email ? 'border-rose-500 focus:ring-rose-100' : ''}`}
                            placeholder="name@company.com"
                        />
                        {errors.email && <p className="mt-1.5 text-xs font-bold text-rose-500 ml-1 uppercase letter-spacing-wide">{errors.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                            <input
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 8, message: 'Min 8 characters' }
                                })}
                                type="password"
                                className={`input-field ${errors.password ? 'border-rose-500 focus:ring-rose-100' : ''}`}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-1.5 text-xs font-bold text-rose-500 ml-1 uppercase letter-spacing-wide">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Confirm</label>
                            <input
                                {...register('password_confirmation', {
                                    required: 'Confirm is required',
                                    validate: (val) => watch('password') === val || 'Passwords mismatch'
                                })}
                                type="password"
                                className={`input-field ${errors.password_confirmation ? 'border-rose-500 focus:ring-rose-100' : ''}`}
                                placeholder="••••••••"
                            />
                            {errors.password_confirmation && <p className="mt-1.5 text-xs font-bold text-rose-500 ml-1 uppercase letter-spacing-wide">{errors.password_confirmation.message}</p>}
                        </div>
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
                            Creating Account...
                        </div>
                    ) : 'Register Workspace'}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-slate-500 font-medium tracking-tight">
                    Already an eFormX member?{' '}
                    <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;
