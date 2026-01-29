import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const ResponseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResponseDetail = async () => {
            try {
                const res = await api.get(`/responses/${id}`);
                setResponse(res.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch response details');
                setLoading(false);
            }
        };
        fetchResponseDetail();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this response?')) {
            try {
                await api.delete(`/responses/${id}`);
                addToast('Response deleted');
                navigate('/responses');
            } catch (err) {
                addToast('Failed to delete response', 'error');
            }
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="bg-error/10 border-l-4 border-error p-6 rounded-r-2xl">
                    <p className="text-error font-bold tracking-tight uppercase font-mono text-xs">{error}</p>
                    <Link to="/responses" className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-4 inline-block hover:text-white transition-colors">Return to Hub</Link>
                </div>
            </DashboardLayout>
        );
    }

    const formatValue = (value) => {
        if (!value) return <span className="text-slate-400 italic font-medium">No value provided</span>;

        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {parsed.map((v, i) => (
                            <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm font-bold border border-slate-200">{v}</span>
                        ))}
                    </div>
                );
            }
            return String(parsed);
        } catch (e) {
            return value;
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center space-x-6">
                    <Link
                        to="/responses"
                        className="w-12 h-12 glass shadow-sm rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-600 hover:shadow-md transition-all group"
                    >
                        <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                            Response Inspection
                        </h1>
                        <p className="text-slate-500 font-medium tracking-tight">Verified capture on {new Date(response.created_at).toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleDelete}
                        className="text-error font-bold text-sm px-6 py-3 rounded-2xl border border-error/20 hover:bg-error/10 transition-all flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Record
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content - Values */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-slate-800">
                        <div className="p-10 sm:p-14 space-y-12 bg-slate-900/60 transition-colors">
                            {response.values && response.values.map((val) => (
                                <div key={val.id} className="group">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">
                                        {val.field?.label || 'Deleted Descriptor'}
                                    </label>
                                    <div className="text-2xl font-bold text-white leading-relaxed pl-1 border-l-4 border-slate-700 group-hover:border-primary-400 transition-colors duration-300">
                                        {formatValue(val.value)}
                                    </div>
                                </div>
                            ))}
                            {(!response.values || response.values.length === 0) && (
                                <div className="text-center py-20 bg-slate-900/40 rounded-[2rem]">
                                    <p className="text-slate-500 font-bold italic">No intelligence captured for this record.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Metadata & Files */}
                <div className="space-y-10">
                    {/* Files */}
                    <div className="glass shadow-xl rounded-[2rem] overflow-hidden border-slate-800">
                        <div className="bg-slate-900/80 backdrop-blur px-8 py-5 border-b border-slate-800/50">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Transferred Assets</h3>
                        </div>
                        <div className="p-8 space-y-6 bg-slate-900/40">
                            {response.files && response.files.length > 0 ? (
                                response.files.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between p-5 glass-card !rounded-2xl border-white hover:border-primary-200 transition-all group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 mr-4 group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-100 text-sm truncate max-w-[140px]">{file.filename}</p>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <a
                                            href={`${import.meta.env.VITE_API_URL}/files/${file.id}/download`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-10 h-10 bg-slate-800 shadow-sm rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-600 hover:shadow-md transition-all active:scale-95 border border-slate-700"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">No Assets Attached</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ResponseDetailPage;
