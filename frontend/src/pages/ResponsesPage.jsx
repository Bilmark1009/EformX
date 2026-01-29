import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import { useResponses } from '../hooks/useResponses';
import { useForms } from '../hooks/useForms';
import { useToast } from '../context/ToastContext';
import SubmissionTrendChart from '../components/analytics/SubmissionTrendChart';

const ResponsesPage = () => {
    const [searchParams] = useSearchParams();
    const { addToast } = useToast();
    const formId = searchParams.get('form_id');
    const { forms } = useForms();
    const { responses, loading, stats, fetchResponses, fetchStats, deleteResponse, exportResponses } = useResponses(formId);

    const [selectedFormId, setSelectedFormId] = useState(formId || '');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchResponses({ form_id: selectedFormId });
        if (selectedFormId) {
            fetchStats(selectedFormId);
        }
    }, [selectedFormId]);

    const handleExport = async () => {
        try {
            await exportResponses({ form_id: selectedFormId });
            addToast('Intelligence report exported successfully.');
        } catch (err) {
            addToast('Failed to export data module', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to terminate this response module?')) {
            try {
                await deleteResponse(id);
                addToast('Response data purged');
            } catch (err) {
                addToast('Purge protocol failed', 'error');
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary-500/50 rounded-full"></div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold font-mono tracking-[0.2em] text-primary-500 uppercase">Response Center</span>
                        <div className="h-[1px] w-12 bg-primary-500/30"></div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white font-display">
                        Form <span className="text-primary-500">Responses</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-md leading-relaxed">
                        View and manage the data collected from your published forms.
                    </p>
                </div>

                <button
                    onClick={handleExport}
                    className="btn-secondary !rounded-xl shadow-glow hover:shadow-glow-lg transition-all !px-8"
                    disabled={responses.length === 0}
                >
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Results (CSV)
                </button>
            </div>

            <div className="glass-card !bg-slate-900/40 tech-border mb-12 py-6">
                <div className="flex flex-col md:flex-row gap-8 items-end">
                    <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-2 ml-1">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Filter by Form</label>
                        </div>
                        <select
                            value={selectedFormId}
                            onChange={(e) => setSelectedFormId(e.target.value)}
                            className="input-field !bg-slate-950/50 !py-3 font-mono text-sm tracking-tight"
                        >
                            <option value="">All forms</option>
                            {forms.map(form => (
                                <option key={form.id} value={form.id}>{form.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {selectedFormId && (
                <div className="mb-12">
                    <SubmissionTrendChart data={stats} loading={loading} />
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-primary-500/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin shadow-glow"></div>
                    </div>
                    <span className="text-[10px] font-bold font-mono text-primary-500 animate-pulse tracking-[0.3em] uppercase">Loading responses...</span>
                </div>
            ) : responses.length > 0 ? (
                <div className="glass-card !p-0 tech-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-800">
                            <thead className="bg-slate-900/50 backdrop-blur-xl">
                                <tr>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] font-mono">Index</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] font-mono">Form Name</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] font-mono">User IP</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] font-mono">Submitted On</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] font-mono">Access</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {responses.map((response) => (
                                    <tr key={response.id} className="hover:bg-primary-500/5 transition-all duration-300 group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="text-xs font-mono font-bold text-primary-400">ID-{String(response.id).padStart(4, '0')}</span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="text-sm font-bold text-white mb-0.5">{response.form?.title || 'Unknown Source'}</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">eFormX Response</div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center space-x-2.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                                                <span className="text-xs font-bold text-slate-400 font-mono tracking-tight">{response.ip_address}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-xs text-slate-400 font-mono">
                                            {new Date(response.created_at).toLocaleString().toUpperCase()}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end space-x-6">
                                                <Link
                                                    to={`/responses/${response.id}`}
                                                    className="text-primary-500 hover:text-primary-400 font-black text-[10px] tracking-[0.2em] uppercase flex items-center group/link"
                                                >
                                                    Process
                                                    <svg className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(response.id)}
                                                    className="text-slate-600 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-500/10 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="glass-card text-center py-32 tech-border group relative overflow-hidden">
                    <div className="scanline"></div>
                    <div className="bg-slate-900/50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-800 shadow-inner group-hover:border-primary-500/30 transition-all duration-500">
                        <svg className="w-12 h-12 text-slate-700 group-hover:text-primary-500/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">No Responses Yet</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                        Your forms haven't received any submissions yet. Once results come in, they will appear here.
                    </p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ResponsesPage;

