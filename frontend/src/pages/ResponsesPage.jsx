import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import { useResponses } from '../hooks/useResponses';
import { useForms } from '../hooks/useForms';
import { useToast } from '../context/ToastContext';

const ResponsesPage = () => {
    const [searchParams] = useSearchParams();
    const { addToast } = useToast();
    const formId = searchParams.get('form_id');
    const { forms } = useForms();
    const { responses, loading, error, fetchResponses, deleteResponse, exportResponses } = useResponses(formId);

    const [selectedFormId, setSelectedFormId] = useState(formId || '');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchResponses({ form_id: selectedFormId });
    }, [selectedFormId]);

    const handleExport = async () => {
        try {
            await exportResponses({ form_id: selectedFormId });
            addToast('Export started...');
        } catch (err) {
            addToast('Failed to export responses', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this response?')) {
            try {
                await deleteResponse(id);
                addToast('Response deleted');
            } catch (err) {
                addToast('Failed to delete response', 'error');
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                        Form Responses
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight">Inspect and export your collected intelligence</p>
                </div>
                <button
                    onClick={handleExport}
                    className="btn-secondary flex items-center shadow-sm"
                    disabled={responses.length === 0}
                >
                    <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export CSV
                </button>
            </div>

            <div className="glass shadow-xl rounded-[2rem] overflow-hidden mb-12 border-white/40">
                <div className="p-8 flex flex-col md:flex-row gap-6 items-end bg-white/40">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Source Filter</label>
                        <select
                            value={selectedFormId}
                            onChange={(e) => setSelectedFormId(e.target.value)}
                            className="input-field glass !py-2.5 !bg-white/60"
                        >
                            <option value="">All active forms</option>
                            {forms.map(form => (
                                <option key={form.id} value={form.id}>{form.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : responses.length > 0 ? (
                <div className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-white/50">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50 backdrop-blur">
                                <tr>
                                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Signature</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Origin Source</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Network Node</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Captured At</th>
                                    <th className="px-8 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/40 divide-y divide-slate-100/50">
                                {responses.map((response) => (
                                    <tr key={response.id} className="hover:bg-primary-50/30 transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">#{response.id}</span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-700">{response.form?.title || 'Unknown Source'}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">eFormX Module</div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                                                <span className="text-sm font-medium text-slate-500 font-mono italic">{response.ip_address}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-500 font-medium">
                                            {new Date(response.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end space-x-4">
                                                <Link
                                                    to={`/responses/${response.id}`}
                                                    className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center"
                                                >
                                                    Inspect
                                                    <svg className="w-4 h-4 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(response.id)}
                                                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="glass-card text-center py-32 animate-float">
                    <div className="bg-slate-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Awaiting intelligence</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">No responses captured yet. Deployment is active.</p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ResponsesPage;
