import React from 'react';

const fieldTypes = [
    { type: 'short_text', label: 'Short Text', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { type: 'long_text', label: 'Long Text', icon: 'M4 6h16M4 12h16M4 18h7' },
    { type: 'number', label: 'Number', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
    { type: 'dropdown', label: 'Dropdown', icon: 'M19 9l-7 7-7-7' },
    { type: 'checkbox', label: 'Checkbox', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { type: 'file', label: 'File Upload', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
    { type: 'date', label: 'Date Selection', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

const FieldTypeSelector = ({ onSelect }) => {
    return (
        <div className="grid grid-cols-1 gap-3">
            {fieldTypes.map((field) => (
                <button
                    key={field.type}
                    onClick={() => onSelect(field.type)}
                    className="flex items-center p-4 !bg-slate-900/40 border border-slate-800 rounded-xl hover:border-primary-500/50 hover:bg-slate-800/60 transition-all duration-300 group text-left relative overflow-hidden"
                >
                    <div className="absolute inset-y-0 left-0 w-1 bg-primary-500/0 group-hover:bg-primary-500 transition-all"></div>
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mr-4 group-hover:shadow-glow-sm group-hover:shadow-primary-500/20 group-hover:border-primary-500/30 transition-all">
                        <svg
                            className="w-5 h-5 text-slate-500 group-hover:text-primary-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={field.icon} />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest font-mono transition-colors">
                            {field.label}
                        </div>
                        <div className="text-[8px] font-bold text-slate-600 uppercase tracking-tight font-mono leading-tight mt-0.5">
                            ADD_{field.type.toUpperCase()}_FIELD
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default FieldTypeSelector;

