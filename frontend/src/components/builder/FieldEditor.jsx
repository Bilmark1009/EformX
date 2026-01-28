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

    // Watch for changes and auto-save (or we can just use a save button)
    // For now, let's use a manual save button to keep it simple, or sync on blur

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded uppercase">
                    {field.type.replace('_', ' ')}
                </span>
                <button
                    onClick={() => onDelete(field.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                    Delete Field
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field Label</label>
                    <input
                        type="text"
                        {...register('label', { required: true })}
                        className="input-field"
                        onBlur={handleSubmit(onSubmit)}
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        {...register('required')}
                        id="required"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        onChange={(e) => {
                            register('required').onChange(e);
                            handleSubmit(onSubmit)();
                        }}
                    />
                    <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
                        Required Field
                    </label>
                </div>

                <hr className="my-4 border-gray-100" />

                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900">Advanced Config</h4>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                        <input
                            type="text"
                            {...register('config.placeholder')}
                            className="input-field"
                            onBlur={handleSubmit(onSubmit)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Help Text</label>
                        <input
                            type="text"
                            {...register('config.helpText')}
                            className="input-field"
                            onBlur={handleSubmit(onSubmit)}
                        />
                    </div>

                    {/* Conditional config based on type */}
                    {(field.type === 'dropdown' || field.type === 'checkbox') && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Options (one per line)</label>
                            <textarea
                                className="input-field h-32 resize-none"
                                placeholder="Option 1&#10;Option 2&#10;Option 3"
                                defaultValue={field.config?.options?.map(o => o.label).join('\n')}
                                onBlur={(e) => {
                                    const options = e.target.value.split('\n')
                                        .filter(line => line.trim() !== '')
                                        .map(line => ({ label: line.trim(), value: line.trim().toLowerCase().replace(/\s+/g, '_') }));
                                    onUpdate(field.id, { config: { ...field.config, options } });
                                }}
                            ></textarea>
                        </div>
                    )}

                    {field.type === 'number' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min</label>
                                <input
                                    type="number"
                                    {...register('config.min')}
                                    className="input-field"
                                    onBlur={handleSubmit(onSubmit)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max</label>
                                <input
                                    type="number"
                                    {...register('config.max')}
                                    className="input-field"
                                    onBlur={handleSubmit(onSubmit)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="btn-primary w-full text-sm"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FieldEditor;
