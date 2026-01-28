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
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            className={`group relative p-4 border rounded-lg cursor-pointer transition-all bg-white ${isSelected
                    ? 'border-primary-500 ring-2 ring-primary-200 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-300 group-hover:text-gray-400 border-r border-transparent group-hover:border-gray-100"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 7a2 2 0 100-4 2 2 0 000 4zM7 13a2 2 0 100-4 2 2 0 000 4zM7 19a2 2 0 100-4 2 2 0 000 4zM13 7a2 2 0 100-4 2 2 0 000 4zM13 13a2 2 0 100-4 2 2 0 000 4zM13 19a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
            </div>

            <div className="pl-6">
                <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {field.type.replace('_', ' ')}
                    </span>
                    {field.required && <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Required</span>}
                </div>
                <div className="text-gray-900 font-medium">{field.label || `Empty ${field.type.replace('_', ' ')}`}</div>
                {(field.config?.placeholder || field.config?.helpText) && (
                    <div className="mt-2 flex space-x-4">
                        {field.config?.placeholder && (
                            <span className="text-xs text-gray-400 italic flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                                </svg>
                                {field.config.placeholder}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DraggableField;
