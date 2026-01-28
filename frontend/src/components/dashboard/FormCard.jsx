import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const FormCard = ({ form, onDelete }) => {
    const { addToast } = useToast();

    const handleCopyLink = () => {
        const url = `${window.location.origin}/f/${form.id}`;
        navigator.clipboard.writeText(url);
        addToast('Public link copied to clipboard!');
    };

    return (
        <div className="glass-card flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <div className={`badge ${form.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {form.status}
                </div>
                <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <svg className="w-4 h-4 mr-1.5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {form.responses_count || 0} Responses
                </div>
            </div>

            <div className="mb-6 flex-grow">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-2">
                    {form.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                    {form.description || 'No description provided.'}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <Link
                    to={`/forms/${form.id}/edit`}
                    className="btn-secondary !py-2 text-center text-sm flex items-center justify-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                </Link>
                <Link
                    to={`/responses?form_id=${form.id}`}
                    className="btn-secondary !py-2 text-center text-sm flex items-center justify-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Data
                </Link>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                    onClick={handleCopyLink}
                    className="text-slate-400 hover:text-primary-600 transition-colors"
                    title="Copy Public Link"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                </button>
                <button
                    onClick={() => onDelete(form.id, form.title)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete Form"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default FormCard;
