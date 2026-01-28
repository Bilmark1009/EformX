import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import FormCard from '../components/dashboard/FormCard';
import Modal from '../components/common/Modal';
import { useForms } from '../hooks/useForms';
import { useForm } from 'react-hook-form';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
    const { forms, loading, fetchForms, createForm, deleteForm } = useForms();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const newForm = await createForm(data);
            setIsModalOpen(false);
            reset();
            addToast('Form created successfully!');
            // Navigate to builder for the new form
            navigate(`/forms/${newForm.id}/edit`);
        } catch (error) {
            addToast('Failed to create form', 'error');
            console.error('Error creating form:', error);
        }
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"? This will also delete all its responses.`)) {
            try {
                await deleteForm(id);
                addToast('Form deleted successfully');
            } catch (error) {
                addToast('Failed to delete form', 'error');
            }
        }
    };

    const filteredForms = forms
        .filter(form =>
            form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
            if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
            if (sortBy === 'responses') return (b.responses_count || 0) - (a.responses_count || 0);
            return 0;
        });

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                        My Workspace
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight">Manage and build your eFormX collection</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Find a form..."
                            className="input-field !pl-10 !py-2.5 w-64 glass shadow-none hover:border-slate-300 focus:glass"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Form
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : filteredForms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredForms.map((form) => (
                        <FormCard key={form.id} form={form} onDelete={handleDelete} />
                    ))}
                </div>
            ) : (
                <div className="glass-card text-center py-24 animate-float">
                    <div className="bg-primary-50 text-primary-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No forms created yet</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">Capture voices and scale your ideas with beautiful forms.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary"
                    >
                        Create Your First Form
                    </button>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Form"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                        <input
                            type="text"
                            {...register('title', { required: 'Title is required' })}
                            className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                            placeholder="e.g., Customer Satisfaction Survey"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <textarea
                            {...register('description')}
                            className="input-field resize-none h-24"
                            placeholder="Briefly describe the purpose of this form..."
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Create Form
                        </button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
};

export default Dashboard;
