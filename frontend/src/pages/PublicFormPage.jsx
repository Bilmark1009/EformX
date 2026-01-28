import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import FieldRenderer from '../components/public/FieldRenderer';
import { useToast } from '../context/ToastContext';

const PublicFormPage = () => {
    const { id } = useParams();
    const { addToast } = useToast();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await api.get(`/public/forms/${id}`);
                setForm(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Form not found or no longer active.');
                setLoading(false);
            }
        };
        fetchForm();
    }, [id]);

    const onSubmit = async (data) => {
        setSubmitting(true);
        setError(null);

        // Prepare FormData for file uploads
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (data[key] instanceof FileList) {
                if (data[key].length > 0) {
                    formData.append(key, data[key][0]);
                }
            } else if (Array.isArray(data[key])) {
                // For checkboxes or multi-select
                data[key].forEach(val => formData.append(`${key}[]`, val));
            } else {
                formData.append(key, data[key]);
            }
        });

        try {
            await api.post(`/public/forms/${id}/submit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSubmitted(true);
            addToast('Form submitted successfully!');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to submit form. Please try again.';
            setError(msg);
            addToast(msg, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error && !form) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
                    <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Unavailable</h1>
                    <p className="text-gray-500 mb-8">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary w-full"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/30 rounded-full filter blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-cyan/10 rounded-full filter blur-3xl opacity-50"></div>

                <div className="max-w-md w-full glass-card !p-12 text-center rounded-[2.5rem] relative z-10 border-white/50 shadow-2xl">
                    <div className="bg-emerald-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner shadow-emerald-200/50">
                        <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 font-display">Success!</h1>
                    <p className="text-slate-500 mb-10 font-medium leading-relaxed">Your response was captured with precision. We appreciate your time.</p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="text-primary-600 font-bold hover:text-primary-700 transition-colors flex items-center justify-center mx-auto group"
                    >
                        Submit another
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Immersive background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/20 rounded-full filter blur-[120px] opacity-40 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-pink/10 rounded-full filter blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="glass shadow-2xl rounded-[3rem] overflow-hidden border-white/40">
                    {/* Premium Form Header */}
                    <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-cyan h-3"></div>
                    <div className="p-10 sm:p-16 border-b border-slate-100/50 bg-white/40">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <span className="text-white font-bold text-xl font-display italic">e</span>
                            </div>
                            <span className="text-primary-600 font-bold uppercase tracking-[0.2em] text-xs">eFormX Premium</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            {form.title}
                        </h1>
                        {form.description && (
                            <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-2xl">
                                {form.description}
                            </p>
                        )}
                    </div>

                    {/* Interactive Form Fields */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-10 sm:p-16 space-y-12 bg-white/20">
                        {error && (
                            <div className="bg-rose-50/80 backdrop-blur border-l-4 border-rose-500 p-6 rounded-r-2xl mb-12 flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                    <svg className="h-6 w-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-bold text-rose-800 uppercase tracking-wider mb-1">Submission Error</h3>
                                    <p className="text-rose-600 font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-10">
                            {form.fields && form.fields.map(field => (
                                <div key={field.id} className="group transition-all duration-300">
                                    <FieldRenderer
                                        field={field}
                                        register={register}
                                        errors={errors}
                                        watch={watch}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="pt-12">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary w-full !py-5 !text-xl shadow-2xl flex items-center justify-center group"
                            >
                                {submitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        Submit Response
                                        <svg className="w-5 h-5 ml-3 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-12 text-center">
                    <div className="flex items-center justify-center space-x-2 text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">
                        <span>Powered by</span>
                        <div className="flex items-center text-slate-600 font-black tracking-normal lowercase italic text-base scale-90">
                            <span className="text-primary-500">e</span>
                            <span>formX</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicFormPage;
