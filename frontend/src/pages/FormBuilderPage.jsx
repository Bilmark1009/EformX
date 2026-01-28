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
            addToast(`Added ${type.replace('_', ' ')} field`);
        } catch (err) {
            addToast('Failed to add field', 'error');
        }
    };

    const handleUpdateField = async (id, data) => {
        try {
            await updateField(id, data);
            addToast('Field updated');
        } catch (err) {
            addToast('Failed to update field', 'error');
        }
    };

    const handleDeleteField = async (id) => {
        if (window.confirm('Delete this field?')) {
            try {
                await deleteField(id);
                addToast('Field deleted');
            } catch (err) {
                addToast('Failed to delete field', 'error');
            }
        }
    };

    const handleUpdateSettings = async (data) => {
        try {
            await updateFormSettings(data);
            addToast('Settings saved');
        } catch (err) {
            addToast('Failed to save settings', 'error');
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{form?.title}</h1>
                        <p className="text-sm text-gray-500">{form?.status} • {fields.length} fields</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <Link
                        to={`/f/${id}`}
                        target="_blank"
                        className="btn-secondary text-sm flex items-center"
                    >
                        Preview
                    </Link>
                    <button
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${form?.status === 'draft'
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        onClick={() => handleUpdateSettings({ status: form.status === 'draft' ? 'active' : 'draft' })}
                        disabled={saving}
                    >
                        {form?.status === 'draft' ? 'Publish' : 'Set to Draft'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar - Field Types */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="sticky top-8 space-y-6">
                        <FieldTypeSelector onSelect={handleAddField} />

                        <div className="bg-white p-4 border rounded-lg">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Form Meta</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Form Title</label>
                                    <input
                                        type="text"
                                        className="input-field text-sm"
                                        defaultValue={form?.title}
                                        onBlur={(e) => handleUpdateSettings({ title: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Canvas */}
                <div className="flex-1">
                    <div className="bg-white border rounded-lg min-h-[600px] shadow-sm overflow-hidden">
                        <div className="bg-gray-50 border-b px-6 py-3 flex justify-between items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span>Canvas Area</span>
                            <span>{fields.length} Fields</span>
                        </div>
                        {fields.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[550px] text-gray-400">
                                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <p className="text-lg">Click a field type to start building</p>
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
                                        <div className="space-y-4">
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

                {/* Right Sidebar - Field Settings */}
                <div className="lg:w-80 flex-shrink-0">
                    <div className="bg-white p-6 border rounded-lg shadow-sm sticky top-8">
                        {selectedField ? (
                            <FieldEditor
                                field={selectedField}
                                onUpdate={handleUpdateField}
                                onDelete={handleDeleteField}
                            />
                        ) : (
                            <div className="text-center py-20 text-gray-400">
                                <p className="text-sm">Select a field on the canvas to customize its settings.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FormBuilderPage;
