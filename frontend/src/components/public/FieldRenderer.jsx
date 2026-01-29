import React from 'react';

const FieldRenderer = ({ field, register, errors, watch }) => {
    const { type, label, required, config } = field;
    const fieldName = `field_${field.id}`;
    const error = errors[fieldName];

    const containerClass = "mb-8 group/field";
    const labelClass = "block text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest font-mono group-focus-within/field:text-primary-400 transition-colors";
    const inputClass = `input-field ${error ? 'border-rose-500/50 bg-rose-500/5 focus:ring-rose-500/20 focus:border-rose-500' : ''}`;
    const helpClass = "mt-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono";
    const errorClass = "mt-3 text-xs text-rose-400 font-bold flex items-center gap-2 font-mono uppercase tracking-tight";

    const renderInput = () => {
        switch (type) {
            case 'short_text':
                return (
                    <input
                        type="text"
                        placeholder={config?.placeholder || 'Awaiting input...'}
                        {...register(fieldName, { required: required && `${label} is required` })}
                        className={inputClass}
                    />
                );

            case 'date':
                return (
                    <input
                        type="date"
                        {...register(fieldName, { required: required && `${label} is required` })}
                        className={inputClass}
                    />
                );

            case 'long_text':
            case 'textarea': // Alias for seeder compatibility
                return (
                    <textarea
                        placeholder={config?.placeholder || 'Enter detailed parameters...'}
                        rows={4}
                        {...register(fieldName, { required: required && `${label} is required` })}
                        className={`${inputClass} resize-none`}
                    ></textarea>
                );

            case 'number':
                return (
                    <input
                        type="number"
                        placeholder={config?.placeholder || '00.00'}
                        min={config?.min}
                        max={config?.max}
                        {...register(fieldName, {
                            required: required && `${label} is required`,
                            min: config?.min && { value: config.min, message: `Minimum value: ${config.min}` },
                            max: config?.max && { value: config.max, message: `Maximum value: ${config.max}` }
                        })}
                        className={inputClass}
                    />
                );

            case 'dropdown':
                return (
                    <div className="relative">
                        <select
                            {...register(fieldName, { required: required && `${label} is required` })}
                            className={`${inputClass} appearance-none`}
                        >
                            <option value="">Select initialization vector</option>
                            {config?.options?.map((option, idx) => (
                                <option key={idx} value={option.value} className="bg-slate-900 text-white">
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        {config?.options?.map((option, idx) => (
                            <label key={idx} className="flex items-center group cursor-pointer bg-slate-900/40 border border-slate-800 p-4 rounded-2xl hover:border-primary-500/30 transition-all duration-300">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        value={option.value}
                                        {...register(fieldName, { required: required && `Please select at least one option` })}
                                        className="peer w-6 h-6 rounded-lg opacity-0 absolute cursor-pointer"
                                    />
                                    <div className="w-6 h-6 border-2 border-slate-700 rounded-lg peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <span className="ml-4 text-sm font-bold text-slate-400 group-hover:text-white transition-colors">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            case 'file':
                return (
                    <div className="relative">
                        <input
                            type="file"
                            {...register(fieldName, { required: required && `${label} is required` })}
                            className="block w-full text-xs text-slate-500 font-mono
                                file:mr-6 file:py-3 file:px-6
                                file:rounded-xl file:border-0
                                file:text-[10px] file:font-black file:uppercase file:tracking-widest
                                file:bg-primary-600 file:text-white
                                hover:file:bg-primary-500
                                cursor-pointer bg-slate-900/40 border border-slate-800 rounded-2xl"
                        />
                    </div>
                );

            default:
                return <p className="text-rose-500 italic font-mono uppercase text-xs">Error: Unsupported Protocol Type: {type}</p>;
        }
    };

    return (
        <div className={containerClass}>
            <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>
                    {label}
                    {required && <span className="text-primary-500 ml-1.5">•</span>}
                </label>
                {required && <span className="text-[9px] font-black text-primary-500/50 uppercase tracking-widest font-mono">Required</span>}
            </div>

            {renderInput()}

            {config?.helpText && <p className={helpClass}>// {config.helpText}</p>}

            {error && (
                <p className={errorClass}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    System Alert: {error.message}
                </p>
            )}
        </div>
    );
};

export default FieldRenderer;

