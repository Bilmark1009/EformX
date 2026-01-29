import React from 'react';

const SubmissionTrendChart = ({ data = [], loading = false }) => {
    if (loading) {
        return (
            <div className="h-48 flex items-center justify-center border border-slate-800 rounded-3xl bg-slate-900/20">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold font-mono text-primary-500 uppercase tracking-widest animate-pulse">Analyzing Data...</span>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.count), 5);
    const height = 150;
    const width = 1000; // Aspect ratio container

    // Create points for the path
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (d.count / maxValue) * height;
        return { x, y };
    });

    const pathData = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    const areaData = `${pathData} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return (
        <div className="glass-card !bg-slate-900/40 tech-border !p-8 relative overflow-hidden group">
            <div className="scanline"></div>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary-500 rounded-full shadow-glow"></div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight uppercase">Submission Frequency</h3>
                        <p className="text-[10px] font-bold font-mono text-slate-500 tracking-widest">RECENT SUBMISSION ACTIVITY (14D)</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Most in 1 Day</span>
                        <span className="text-lg font-black text-white font-mono">{maxValue}</span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-800"></div>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse-glow"></div>
                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-tight">System Live</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative h-40 w-full">
                <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Horizontal Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                        <line
                            key={p}
                            x1="0"
                            y1={height * p}
                            x2={width}
                            y2={height * p}
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Area Fill */}
                    <path
                        d={areaData}
                        fill="url(#glowingGradient)"
                        className="transition-all duration-1000"
                    />

                    {/* Line Path */}
                    <path
                        d={pathData}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-primary-500 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)] transition-all duration-1000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data Points */}
                    {points.map((p, i) => (
                        <g key={i} className="group/dot">
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                className="fill-slate-950 stroke-primary-500 stroke-2 cursor-pointer transition-all hover:r-6"
                            />
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r="12"
                                className="fill-primary-500/0 hover:fill-primary-500/10 transition-colors"
                            />
                        </g>
                    ))}

                    <defs>
                        <linearGradient id="glowingGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(14, 165, 233, 0.2)" />
                            <stop offset="100%" stopColor="rgba(14, 165, 233, 0)" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-4 px-1">
                {data.filter((_, i) => i % 2 === 0).map((d, i) => (
                    <span key={i} className="text-[9px] font-bold font-mono text-slate-600 uppercase tracking-tighter">
                        {d.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SubmissionTrendChart;
