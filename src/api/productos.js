import api from './client';

/* ========= SERVICIOS ========= */

export const getServicios = () => api.get('/servicios/');
export const getServicio = (id) => api.get(`/servicios/${id}/`);
export const createServicio = (data) => api.post('/servicios/', data);
export const updateServicio = (id, data) => api.put(`/servicios/${id}/`, data);
export const deleteServicio = (id) => api.delete(`/servicios/${id}/`);

/* ========= CATEGORÍAS ========= */

export const getCategorias = () => api.get('/categorias/');
export const getCategoria = (id) => api.get(`/categorias/${id}/`);
export const createCategoria = (data) => api.post('/categorias/', data);
export const updateCategoria = (id, data) => api.put(`/categorias/${id}/`, data);
export const deleteCategoria = (id) => api.delete(`/categorias/${id}/`);

/* ========= COMBOS ========= */

export const getCombos = () => api.get('/combos/');
export const getCombo = (id) => api.get(`/combos/${id}/`);
export const createCombo = (data) => api.post('/combos/', data);
export const updateCombo = (id, data) => api.put(`/combos/${id}/`, data);
export const deleteCombo = (id) => api.delete(`/combos/${id}/`);

/* ========= PROMOCIONES ========= */

export const getPromociones = () => api.get('/promociones/');
export const getPromocion = (id) => api.get(`/promociones/${id}/`);
export const createPromocion = (data) => api.post('/promociones/', data);
export const updatePromocion = (id, data) => api.put(`/promociones/${id}/`, data);
export const deletePromocion = (id) => api.delete(`/promociones/${id}/`);
