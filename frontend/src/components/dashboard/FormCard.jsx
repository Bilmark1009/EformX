import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import AnimatedCounter from '../common/AnimatedCounter';

const FormCard = ({ form, onDelete, onToggleStatus }) => {
    const { addToast } = useToast();

    // Generate pseudo-random sparkline data based on form ID
    const generateSparklineData = () => {
        const seed = form.id;
        const points = [];
        for (let i = 0; i < 10; i++) {
            const val = 10 + Math.abs((Math.sin(seed * (i + 1)) * 40));
            points.push(val);
        }
        return points;
    };

    const sparklineData = generateSparklineData();
    const sparklinePoints = sparklineData.map((val, i) => `${i * 20},${60 - val}`).join(' ');

    const handleCopyLink = () => {
        const url = `${window.location.origin}/f/${form.id}`;
        navigator.clipboard.writeText(url);
        addToast('Public link copied to clipboard!');
    };

    const isClosed = form.status === 'closed';

    return (
        <div className={`glass-card flex flex-col h-full group relative overflow-hidden tech-border ${isClosed ? 'opacity-75 grayscale-[0.5]' : ''}`}>
            <div className="scanline opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex flex-col">
                    <div className={`badge ${!isClosed ? 'badge-success' : 'badge-danger'} mb-2`}>
                        {!isClosed ? 'Live' : 'Hidden'}
                    </div>
                    <button
                        onClick={() => onToggleStatus(form.id, isClosed ? 'active' : 'closed')}
                        className={`text-[9px] font-black font-mono tracking-widest uppercase px-2 py-1 rounded-md border transition-all ${!isClosed
                            ? 'border-warning/30 text-warning hover:bg-warning/10'
                            : 'border-success/30 text-success hover:bg-success/10'
                            }`}
                    >
                        {isClosed ? 'Make Public' : 'Hide from Public'}
                    </button>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono mb-1">Responses</span>
                    <div className="flex items-center text-primary-400 font-mono font-bold text-lg leading-none">
                        <svg className="w-4 h-4 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <AnimatedCounter value={form.responses_count || 0} />
                    </div>
                </div>
            </div>

            {/* Sparkline Visualizer */}
            <div className="h-16 w-full mb-4 relative overflow-hidden rounded-lg bg-slate-900/40 border border-slate-800/50">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent"></div>
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 180 60">
                    <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        points={sparklinePoints}
                        className="text-primary-500/30"
                    />
                    <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        points={sparklinePoints}
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        className="text-primary-500 animate-draw-sparkline"
                    />
                </svg>
            </div>

            <div className="mb-8 flex-grow relative z-10 px-1">
                <h3 className={`text-xl font-bold text-white group-hover:text-primary-400 transition-colors duration-300 mb-2 font-display ${isClosed ? 'line-through' : ''}`}>
                    {form.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">
                    {form.description || 'No system description initialized.'}
                </p>
            </div>

            {/* Rest of the file unchanged... */}
            <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                <Link
                    to={`/forms/${form.id}/edit`}
                    className="btn-primary !py-2 !text-xs !rounded-xl !tracking-widest uppercase font-bold"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Configure
                </Link>
                <Link
                    to={`/responses?form_id=${form.id}`}
                    className="btn-secondary !py-2 !text-xs !rounded-xl !tracking-widest uppercase font-bold"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Insights
                </Link>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10 px-1">
                <button
                    onClick={handleCopyLink}
                    disabled={isClosed}
                    className={`text-slate-500 hover:text-primary-400 transition-all duration-300 flex items-center gap-1.5 group/btn ${isClosed ? 'cursor-not-allowed opacity-30' : ''}`}
                    title={isClosed ? "Cannot copy link of hidden form" : "Copy Shared link"}
                >
                    <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover/btn:opacity-100 transition-opacity">Copy Link</span>
                </button>
                <button
                    onClick={() => onDelete(form.id, form.title)}
                    className="text-slate-500 hover:text-error transition-all duration-300 p-1.5 hover:bg-error/10 rounded-lg"
                    title="Delete Form"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default FormCard;

