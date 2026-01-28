import { useState, useEffect } from 'react';
import api from '../services/api';

export const useFormBuilder = (formId) => {
    const [form, setForm] = useState(null);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFieldId, setSelectedFieldId] = useState(null);

    const fetchForm = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/forms/${formId}`);
            setForm(response.data);
            setFields(response.data.fields || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch form');
        } finally {
            setLoading(false);
        }
    };

    const addField = async (type) => {
        try {
            const response = await api.post(`/forms/${formId}/fields`, {
                type,
                label: `New ${type.replace('_', ' ')}`,
                order: fields.length,
                config: {},
                required: false
            });
            const newField = response.data;
            setFields([...fields, newField]);
            setSelectedFieldId(newField.id);
            return newField;
        } catch (err) {
            console.error('Error adding field:', err);
            throw err;
        }
    };

    const updateField = async (fieldId, updates) => {
        try {
            const response = await api.put(`/fields/${fieldId}`, updates);
            setFields(fields.map(f => f.id === fieldId ? response.data : f));
            return response.data;
        } catch (err) {
            console.error('Error updating field:', err);
            throw err;
        }
    };

    const deleteField = async (fieldId) => {
        try {
            await api.delete(`/fields/${fieldId}`);
            setFields(fields.filter(f => f.id !== fieldId));
            if (selectedFieldId === fieldId) setSelectedFieldId(null);
        } catch (err) {
            console.error('Error deleting field:', err);
            throw err;
        }
    };

    const reorderFields = async (newFields) => {
        const oldFields = [...fields];
        setFields(newFields); // Optimistic update

        try {
            await api.post(`/forms/${formId}/fields/reorder`, {
                fields: newFields.map((f, index) => ({ id: f.id, order: index }))
            });
        } catch (err) {
            setFields(oldFields); // Rollback
            console.error('Error reordering fields:', err);
            throw err;
        }
    };

    const updateFormSettings = async (settings) => {
        setSaving(true);
        try {
            const response = await api.put(`/forms/${formId}`, settings);
            setForm(response.data);
            return response.data;
        } catch (err) {
            console.error('Error updating form:', err);
            throw err;
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (formId) fetchForm();
    }, [formId]);

    return {
        form,
        fields,
        loading,
        saving,
        error,
        selectedFieldId,
        setSelectedFieldId,
        addField,
        updateField,
        deleteField,
        reorderFields,
        updateFormSettings,
        refresh: fetchForm
    };
};
