import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const FieldEditor = ({ field, onUpdate, onDelete }) => {
    const { register, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            label: field.label,
            required: field.required,
            order: field.order,
            config: field.config || {}
        }
    });

    useEffect(() => {
        reset({
            label: field.label,
            required: field.required,
            order: field.order,
            config: field.config || {}
        });
    }, [field, reset]);

    const onSubmit = (data) => {
        onUpdate(field.id, data);
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center -mt-2">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] font-mono leading-none mb-1">
                        Inspector
                    </span>
                    <span className="text-white font-black uppercase text-sm tracking-tight">
                        {field.type.replace('_', ' ')}
                    </span>
                </div>
                <button
                    onClick={() => onDelete(field.id)}
                    className="p-2 text-error hover:bg-error/10 rounded-xl transition-all group"
                    title="Terminate Module"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 font-mono ml-1">PARAM_LABEL</label>
                        <input
                            type="text"
                            {...register('label', { required: true })}
                            className="input-field !py-3.5 !text-xs font-mono font-bold"
                            onBlur={handleSubmit(onSubmit)}
                            placeholder="Identify module..."
                        />
                    </div>

                    <div className="flex items-center gap-3 group/cb">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                {...register('required')}
                                id="required"
                                className="peer appearance-none h-5 w-5 bg-slate-900/50 border border-slate-800 rounded-lg checked:border-primary-500 checked:bg-primary-500/10 cursor-pointer transition-all"
                                onChange={(e) => {
                                    register('required').onChange(e);
                                    handleSubmit(onSubmit)();
                                }}
                            />
                            <svg className="absolute w-3 h-3 text-primary-500 left-1 translate-x-0.5 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <label htmlFor="required" className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono cursor-pointer group-hover/cb:text-slate-400">
                            Critical Field Protocol
                        </label>
                    </div>
                </div>

                <div className="h-[1px] bg-slate-800/50 w-full"></div>

                <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-primary-500/50 uppercase tracking-[0.2em] font-mono">Telemetry Config</h4>

                    <div>
                        <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 font-mono ml-1">PARAM_PLACEHOLDER</label>
                        <input
                            type="text"
                            {...register('config.placeholder')}
                            className="input-field !py-3.5 !text-xs font-mono font-bold !bg-slate-900/30"
                            onBlur={handleSubmit(onSubmit)}
                            placeholder="Awaiting input..."
                        />
                    </div>

                    <div>
                        <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 font-mono ml-1">PARAM_HELP_TEXT</label>
                        <input
                            type="text"
                            {...register('config.helpText')}
                            className="input-field !py-3.5 !text-xs font-mono font-bold !bg-slate-900/30"
                            onBlur={handleSubmit(onSubmit)}
                            placeholder="// Descriptive metadata"
                        />
                    </div>

                    {/* Conditional config based on type */}
                    {(field.type === 'dropdown' || field.type === 'checkbox') && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 font-mono ml-1">PARAM_OPTIONS_LIST</label>
                            <textarea
                                className="input-field !py-4 h-32 resize-none !text-xs font-mono font-bold !bg-slate-900/30"
                                placeholder="Alpha&#10;Beta&#10;Gamma"
                                defaultValue={field.config?.options?.map(o => o.label).join('\n')}
                                onBlur={(e) => {
                                    const options = e.target.value.split('\n')
                                        .filter(line => line.trim() !== '')
                                        .map(line => ({ label: line.trim(), value: line.trim().toLowerCase().replace(/\s+/g, '_') }));
                                    onUpdate(field.id, { config: { ...field.config, options } });
                                }}
                            ></textarea>
                            <span className="text-[8px] text-slate-700 font-mono mt-2 block uppercase tracking-tighter italic">// Separate values by line-break</span>
                        </div>
                    )}

                    {field.type === 'number' && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div>
                                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 font-mono ml-1">MIN_VAL</label>
                                <input
                                    type="number"
                                    {...register('config.min')}
                                    className="input-field !py-3.5 !text-xs font-mono font-bold !bg-slate-900/30"
                                    onBlur={handleSubmit(onSubmit)}
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 font-mono ml-1">MAX_VAL</label>
                                <input
                                    type="number"
                                    {...register('config.max')}
                                    className="input-field !py-3.5 !text-xs font-mono font-bold !bg-slate-900/30"
                                    onBlur={handleSubmit(onSubmit)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="btn-primary w-full !rounded-xl !py-4 !text-[10px] font-black uppercase tracking-[0.2em] shadow-glow"
                    >
                        Sync Protocol
                    </button>
                    <p className="text-[8px] text-slate-800 font-mono text-center mt-4 tracking-widest uppercase">Encryption status: Active</p>
                </div>
            </form>
        </div>
    );
};

export default FieldEditor;

