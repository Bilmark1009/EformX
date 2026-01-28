import { useState, useEffect } from 'react';
import api from '../services/api';

export const useForms = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchForms = async () => {
        setLoading(true);
        try {
            const response = await api.get('/forms');
            setForms(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch forms');
        } finally {
            setLoading(false);
        }
    };

    const createForm = async (formData) => {
        try {
            const response = await api.post('/forms', formData);
            setForms([response.data, ...forms]);
            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const updateForm = async (id, formData) => {
        try {
            const response = await api.put(`/forms/${id}`, formData);
            setForms(forms.map(f => f.id === id ? response.data : f));
            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const deleteForm = async (id) => {
        try {
            await api.delete(`/forms/${id}`);
            setForms(forms.filter(f => f.id !== id));
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    return { forms, loading, error, fetchForms, createForm, updateForm, deleteForm };
};
