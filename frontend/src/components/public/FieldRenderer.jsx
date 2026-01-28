import React from 'react';

const FieldRenderer = ({ field, register, errors, watch }) => {
    const { type, label, required, config } = field;
    const fieldName = `field_${field.id}`;
    const error = errors[fieldName];

    const containerClass = "mb-6";
    const labelClass = "block text-base font-semibold text-gray-900 mb-2";
    const inputClass = `w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-4 focus:ring-primary-100 outline-none ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
        }`;
    const helpClass = "mt-2 text-sm text-gray-500";
    const errorClass = "mt-2 text-sm text-red-600 font-medium flex items-center";

    const renderInput = () => {
        switch (type) {
            case 'short_text':
                return (
                    <input
                        type="text"
                        placeholder={config?.placeholder}
                        {...register(fieldName, { required: required && `${label} is required` })}
                        className={inputClass}
                    />
                );

            case 'long_text':
                return (
                    <textarea
                        placeholder={config?.placeholder}
                        rows={4}
                        {...register(fieldName, { required: required && `${label} is required` })}
                        className={`${inputClass} resize-none`}
                    ></textarea>
                );

            case 'number':
                return (
                    <input
                        type="number"
                        placeholder={config?.placeholder}
                        min={config?.min}
                        max={config?.max}
                        {...register(fieldName, {
                            required: required && `${label} is required`,
                            min: config?.min && { value: config.min, message: `Minimum value is ${config.min}` },
                            max: config?.max && { value: config.max, message: `Maximum value is ${config.max}` }
                        })}
                        className={inputClass}
                    />
                );

            case 'dropdown':
                return (
                    <select
                        {...register(fieldName, { required: required && `${label} is required` })}
                        className={inputClass}
                    >
                        <option value="">Select an option</option>
                        {config?.options?.map((option, idx) => (
                            <option key={idx} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'checkbox':
                return (
                    <div className="space-y-3">
                        {config?.options?.map((option, idx) => (
                            <label key={idx} className="flex items-center group cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={option.value}
                                    {...register(fieldName, { required: required && `Please select at least one option` })}
                                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                                />
                                <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
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
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2.5 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-semibold
                                file:bg-primary-50 file:text-primary-700
                                hover:file:bg-primary-100
                                cursor-pointer"
                        />
                    </div>
                );

            default:
                return <p className="text-red-500 italic">Unsupported field type: {type}</p>;
        }
    };

    return (
        <div className={containerClass}>
            <label className={labelClass}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {renderInput()}

            {config?.helpText && <p className={helpClass}>{config.helpText}</p>}

            {error && (
                <p className={errorClass}>
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default FieldRenderer;
