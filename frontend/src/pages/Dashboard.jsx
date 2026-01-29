import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import FormCard from '../components/dashboard/FormCard';
import Modal from '../components/common/Modal';
import { useForms } from '../hooks/useForms';
import { useForm } from 'react-hook-form';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { forms, loading, fetchForms, createForm, updateForm, deleteForm } = useForms();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user?.role === 'superadmin') {
            navigate('/users');
        }
    }, [user, navigate]);

    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

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

    const handleToggleStatus = async (id, newStatus) => {
        try {
            await updateForm(id, { status: newStatus });
            addToast(`Portal ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully.`);
        } catch (error) {
            addToast('Failed to update portal status', 'error');
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
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 relative">
                <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary-500/50 rounded-full"></div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold font-mono tracking-[0.2em] text-primary-500 uppercase">Dashboard Control</span>
                        <div className="h-[1px] w-12 bg-primary-500/30"></div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white font-display">
                        My <span className="text-primary-500">Workspace</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-md leading-relaxed">
                        Manage your forms and track submissions in real-time.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group w-full sm:w-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search your forms..."
                            className="input-field !pl-11 !py-3 w-full sm:w-72 glass !bg-slate-900/40 border-slate-800 text-sm font-mono tracking-tight focus:border-primary-500/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary w-full sm:w-auto !rounded-xl !px-8 shadow-glow hover:shadow-glow-lg transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Form
                    </button>
                    {user?.role === 'superadmin' && (
                        <button
                            onClick={() => navigate('/users')}
                            className="btn-secondary !bg-violet-500/10 !text-violet-400 !border-violet-500/20 hover:!bg-violet-500/20 !rounded-xl !px-6 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </button>
                    )}

                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <span className="text-xs font-bold font-mono text-primary-500 animate-pulse tracking-widest uppercase">Loading workspace...</span>
                </div>
            ) : filteredForms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredForms.map((form) => (
                        <FormCard
                            key={form.id}
                            form={form}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))}
                </div>
            ) : (
                <div className="glass-card text-center py-28 relative overflow-hidden group">
                    <div className="scanline"></div>
                    <div className="bg-primary-500/5 text-primary-500 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary-500/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">No Forms Yet</h3>
                    <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium leading-relaxed">
                        You haven't created any forms yet. Start by creating your first form to collect information.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary !px-10 !rounded-xl"
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
                        <label className="block text-sm font-bold text-slate-400 mb-2 ml-1 uppercase tracking-widest text-[10px]">Form Title</label>
                        <input
                            type="text"
                            {...register('title', { required: 'Title is required' })}
                            className={`input-field ${errors.title ? 'border-error' : ''}`}
                            placeholder="e.g., Customer Satisfaction Survey"
                        />
                        {errors.title && <p className="text-error text-xs mt-2 ml-1 font-bold italic">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2 ml-1 uppercase tracking-widest text-[10px]">Description (Optional)</label>
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
