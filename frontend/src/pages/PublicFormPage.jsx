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
                setError(err.response?.data?.message || 'Protocol Error: Node not found or decommissioned.');
                setLoading(false);
            }
        };
        fetchForm();
    }, [id]);

    const onSubmit = async (data) => {
        setSubmitting(true);
        setError(null);

        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (data[key] instanceof FileList) {
                if (data[key].length > 0) {
                    formData.append(key, data[key][0]);
                }
            } else if (Array.isArray(data[key])) {
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
            addToast('Data transmission successful.');
        } catch (err) {
            const msg = err.response?.data?.message || 'Transmission failed. Network interference detected.';
            setError(msg);
            addToast(msg, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 space-y-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-primary-500/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin shadow-glow"></div>
                </div>
                <span className="text-[10px] font-bold font-mono text-primary-500 animate-pulse tracking-[0.3em] uppercase">Connecting to Node...</span>
            </div>
        );
    }

    if (error && !form) {
        const isClosed = error.toLowerCase().includes('not accepting submissions') || error.toLowerCase().includes('decommissioned');

        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_100%)]"></div>
                <div className="max-w-md w-full glass-card tech-border !p-12 text-center relative z-10">
                    <div className={`${isClosed ? 'bg-amber-500/10 border-amber-500/20' : 'bg-rose-500/10 border-rose-500/20'} w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border shadow-inner`}>
                        {isClosed ? (
                            <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        ) : (
                            <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                    </div>
                    <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
                        {isClosed ? 'Module Offline' : 'Access Restricted'}
                    </h1>
                    <p className="text-slate-500 mb-10 font-medium leading-relaxed font-mono text-xs uppercase tracking-tight">
                        {isClosed ? 'The administrator has temporarily deactivated this data collection portal.' : error}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-secondary w-full !rounded-xl"
                    >
                        Return to Hub
                    </button>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="scanline"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05)_0%,rgba(2,6,23,0)_100%)]"></div>

                <div className="max-w-md w-full glass-card tech-border !p-12 text-center relative z-10">
                    <div className="bg-emerald-500/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-glow shadow-emerald-500/20">
                        <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">Transmission <span className="text-emerald-500">Complete</span></h1>
                    <p className="text-slate-500 mb-10 font-medium leading-relaxed text-sm font-mono uppercase tracking-tight">Your data packet has been encrypted and successfully routed to the central core.</p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="text-primary-500 font-black text-[10px] tracking-[0.3em] uppercase hover:text-primary-400 transition-all flex items-center justify-center mx-auto group"
                    >
                        Initialize New Upload
                        <svg className="w-4 h-4 ml-3 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="scanline"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.07)_0%,rgba(2,6,23,0)_70%)]"></div>

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="glass-card !p-0 tech-border overflow-hidden">
                    {/* Header */}
                    <div className="p-10 sm:p-16 border-b border-slate-800/50 bg-slate-900/30">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-glow shadow-primary-500/30">
                                <span className="text-white font-black text-xl italic font-display">e</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-primary-500 font-black uppercase tracking-[0.3em] text-[10px] font-mono leading-none">Protocol Active</span>
                                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest font-mono">eFormX Cryptographic Node</span>
                            </div>
                        </div>
                        <h1 className="text-5xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
                            {form.title}
                        </h1>
                        {form.description && (
                            <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-2xl">
                                {form.description}
                            </p>
                        )}
                    </div>

                    {/* Interactive Form Fields */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-10 sm:p-16 space-y-12">
                        {error && (
                            <div className="bg-rose-500/10 border-l-4 border-rose-500 p-6 rounded-r-2xl mb-12 flex items-start tech-border !border-t-0 !border-b-0 !border-r-0">
                                <div className="flex-shrink-0 mt-0.5">
                                    <svg className="h-6 w-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] font-mono mb-1">Transmission Error</h3>
                                    <p className="text-rose-400/80 font-medium text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-10">
                            {form.fields && form.fields.map((field, idx) => (
                                <div
                                    key={field.id}
                                    className="relative group transition-all duration-500"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
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
                                className="btn-primary w-full !py-6 !text-lg !rounded-2xl shadow-glow hover:shadow-glow-lg flex items-center justify-center group"
                            >
                                {submitting ? (
                                    <span className="flex items-center font-mono font-bold tracking-widest text-sm uppercase">
                                        <svg className="animate-spin -ml-1 mr-4 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Encrypting & Sending...
                                    </span>
                                ) : (
                                    <>
                                        <span className="font-mono font-black tracking-[0.2em] uppercase text-sm">Initialize Data Upload</span>
                                        <svg className="w-5 h-5 ml-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono">Infrastructure by</span>
                        <div className="flex items-center text-slate-400 font-black tracking-tighter text-lg leading-none">
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

