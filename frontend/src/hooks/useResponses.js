import { useState, useEffect } from 'react';
import api from '../services/api';

export const useResponses = (formId = null) => {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);

    const fetchResponses = async (params = {}) => {
        setLoading(true);
        try {
            const url = formId ? `/forms/${formId}/responses` : '/responses';
            const response = await api.get(url, { params });
            setResponses(response.data.data || response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch responses');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async (targetId = formId) => {
        if (!targetId) return;
        try {
            const response = await api.get(`/forms/${targetId}/responses/stats`);
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const deleteResponse = async (id) => {
        try {
            await api.delete(`/responses/${id}`);
            setResponses(responses.filter(r => r.id !== id));
        } catch (err) {
            throw err;
        }
    };

    const exportResponses = async (params = {}) => {
        try {
            const targetId = params.form_id || formId;
            if (!targetId) throw new Error('Form ID is required for export');

            const response = await api.get(`/forms/${targetId}/responses/export`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `responses_${targetId}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        fetchResponses();
    }, [formId]);

    return {
        responses,
        loading,
        error,
        stats,
        fetchResponses,
        fetchStats,
        deleteResponse,
        exportResponses
    };
};
