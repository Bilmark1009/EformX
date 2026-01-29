import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import FieldTypeSelector from '../components/builder/FieldTypeSelector';
import FieldEditor from '../components/builder/FieldEditor';
import DraggableField from '../components/builder/DraggableField';
import { useFormBuilder } from '../hooks/useFormBuilder';
import { useToast } from '../context/ToastContext';

const FormBuilderPage = () => {
    const { id } = useParams();
    const { addToast } = useToast();
    const {
        form,
        fields,
        loading,
        saving,
        addField,
        updateField,
        deleteField,
        reorderFields,
        selectedFieldId,
        setSelectedFieldId,
        updateFormSettings
    } = useFormBuilder(id);

    const selectedField = fields.find(f => f.id === selectedFieldId);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = fields.findIndex(f => f.id === active.id);
            const newIndex = fields.findIndex(f => f.id === over.id);
            reorderFields(arrayMove(fields, oldIndex, newIndex));
        }
    };

    const handleAddField = async (type) => {
        try {
            await addField(type);
            addToast(`Module ${type.replace('_', ' ')} initialized.`);
        } catch (err) {
            addToast('Initialization failure', 'error');
        }
    };

    const handleUpdateField = async (id, data) => {
        try {
            await updateField(id, data);
            addToast('Module parameters updated');
        } catch (err) {
            addToast('Update protocol failed', 'error');
        }
    };

    const handleDeleteField = async (id) => {
        if (window.confirm('Terminate this module?')) {
            try {
                await deleteField(id);
                addToast('Module decommissioned');
            } catch (err) {
                addToast('Decommission failure', 'error');
            }
        }
    };

    const handleUpdateSettings = async (data) => {
        try {
            await updateFormSettings(data);
            addToast('Node settings synchronized');
        } catch (err) {
            addToast('Sync failure', 'error');
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-primary-500/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin shadow-glow"></div>
                    </div>
                    <span className="text-[10px] font-bold font-mono text-primary-500 animate-pulse tracking-[0.3em] uppercase">Opening Editor...</span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative">
                <div className="flex items-center gap-6">
                    <Link to="/dashboard" className="p-3 glass rounded-xl text-slate-400 hover:text-white hover:border-primary-500/30 transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-bold font-mono tracking-[0.2em] text-primary-500 uppercase">Form Editor</span>
                            <div className="h-[1px] w-12 bg-primary-500/30"></div>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white font-display">
                            {form?.title}
                        </h1>
                        <div className="flex items-center gap-3 mt-2 font-mono text-[10px] uppercase font-black">
                            <span className={`${form?.status === 'active' ? 'text-success' : 'text-slate-500'}`}>
                                {form?.status}
                            </span>
                            <span className="text-slate-800">•</span>
                            <span className="text-primary-400">{fields.length} Fields Added</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        to={`/f/${id}`}
                        target="_blank"
                        className="btn-secondary !text-[10px] font-black uppercase tracking-[0.2em] !rounded-xl !px-6"
                    >
                        Live Preview
                    </Link>
                    <button
                        className={`!text-[10px] px-8 py-3.5 rounded-xl transition-all font-black uppercase tracking-[0.2em] ${form?.status === 'draft'
                            ? 'bg-primary-500 text-white shadow-glow hover:shadow-glow-lg'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                        onClick={() => handleUpdateSettings({ status: form.status === 'draft' ? 'active' : 'draft' })}
                        disabled={saving}
                    >
                        {form?.status === 'draft' ? 'Publish Form' : 'Unpublish Form'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="lg:w-72 w-full flex-shrink-0 space-y-8">
                    <div className="glass-card tech-border !p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Field Library</h3>
                        </div>
                        <FieldTypeSelector onSelect={handleAddField} />
                    </div>

                    <div className="glass-card tech-border !p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full shadow-glow"></div>
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">General Settings</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 font-mono ml-1">Form Name</label>
                                <input
                                    type="text"
                                    className="input-field !text-xs !py-3 font-mono font-bold tracking-tight !bg-slate-900/80"
                                    defaultValue={form?.title}
                                    onBlur={(e) => handleUpdateSettings({ title: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <div className="glass-card tech-border !p-0 min-h-[700px] flex flex-col relative overflow-hidden group">
                        <div className="scanline"></div>
                        <div className="bg-slate-900/40 border-b border-slate-800/80 px-8 py-4 flex justify-between items-center relative z-10">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Form Preview</span>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest font-mono">{fields.length} Fields</span>
                                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-glow"></div>
                            </div>
                        </div>

                        <div className="flex-1 relative z-10">
                            {fields.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-20 text-center">
                                    <div className="w-24 h-24 bg-slate-800/20 rounded-3xl flex items-center justify-center mb-8 border border-slate-800 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-3">Your Form is Empty</h3>
                                    <p className="text-slate-500 max-w-xs font-medium text-sm">Select a field type from the library to start building your form.</p>
                                </div>
                            ) : (
                                <div className="p-8">
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={fields.map(f => f.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-6">
                                                {fields.map(field => (
                                                    <DraggableField
                                                        key={field.id}
                                                        field={field}
                                                        isSelected={selectedFieldId === field.id}
                                                        onClick={() => setSelectedFieldId(field.id)}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:w-80 w-full flex-shrink-0">
                    <div className="glass-card tech-border !p-8 sticky top-8">
                        {selectedField ? (
                            <FieldEditor
                                field={selectedField}
                                onUpdate={handleUpdateField}
                                onDelete={handleDeleteField}
                            />
                        ) : (
                            <div className="text-center py-24 group">
                                <div className="w-16 h-16 bg-slate-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-800 group-hover:border-primary-500/30 transition-all">
                                    <svg className="w-8 h-8 text-slate-700 group-hover:text-primary-500/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-2">Field Settings</h4>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed uppercase tracking-tight">Select a field in the preview to edit its options.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FormBuilderPage;

