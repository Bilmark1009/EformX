import React from 'react';

const fieldTypes = [
    { type: 'short_text', label: 'Short Text', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { type: 'long_text', label: 'Long Text', icon: 'M4 6h16M4 12h16M4 18h7' },
    { type: 'number', label: 'Number', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
    { type: 'dropdown', label: 'Dropdown', icon: 'M19 9l-7 7-7-7' },
    { type: 'checkbox', label: 'Checkbox', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { type: 'file', label: 'File Upload', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
];

const FieldTypeSelector = ({ onSelect }) => {
    return (
        <div className="bg-white p-4 border rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                Add Fields
            </h3>
            <div className="grid grid-cols-1 gap-2">
                {fieldTypes.map((field) => (
                    <button
                        key={field.type}
                        onClick={() => onSelect(field.type)}
                        className="flex items-center p-3 text-sm text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 border border-transparent hover:border-primary-200 transition-all duration-200 group"
                    >
                        <svg
                            className="w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={field.icon} />
                        </svg>
                        {field.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FieldTypeSelector;
