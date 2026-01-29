import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DraggableField = ({ field, isSelected, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            className={`group relative p-6 glass-card tech-border !bg-slate-800/60 cursor-pointer transition-all duration-300 ${isSelected
                ? '!border-primary-500 shadow-glow shadow-primary-500/20 translate-x-2'
                : 'hover:!bg-slate-800/80 hover:border-slate-700'
                } ${isDragging ? 'shadow-2xl ring-2 ring-primary-500/50' : ''}`}
        >
            {/* Drag Handle - Industrial Gripper */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing text-slate-700 group-hover:text-primary-500/50 border-r border-slate-800/50"
            >
                <div className="flex flex-col gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                </div>
            </div>

            <div className="pl-6">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary-500 animate-pulse-glow' : 'bg-slate-700'}`}></div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">
                            {field.type.replace('_', ' ')} Module
                        </span>
                    </div>
                    {field.required && (
                        <span className="text-primary-500 text-[9px] font-black uppercase tracking-[0.2em] font-mono flex items-center">
                            <span className="mr-1.5">•</span> CRITICAL
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-white font-bold tracking-tight text-lg">{field.label || `UNINITIALIZED_${field.type.toUpperCase()}`}</div>
                    <div className="h-[1px] flex-1 bg-slate-800/50"></div>
                </div>

                {(field.config?.placeholder || field.config?.helpText) && (
                    <div className="mt-3 flex items-center gap-4 text-[10px] font-mono text-slate-500">
                        {field.config?.placeholder && (
                            <span className="flex items-center">
                                <span className="mr-2 text-slate-700">VAL:</span>
                                <span className="italic">{field.config.placeholder}</span>
                            </span>
                        )}
                        {field.config?.helpText && (
                            <span className="flex items-center">
                                <span className="mr-2 text-slate-700">DESC:</span>
                                <span className="truncate max-w-[200px]">{field.config.helpText}</span>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Selected Indicator Glow Line */}
            {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-full shadow-glow"></div>
            )}
        </div>
    );
};

export default DraggableField;

