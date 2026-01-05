import api from './client';

export const getAdminStats = () => api.get('/admin-dashboard/stats/');
