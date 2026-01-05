import api from './client';

/* ========= HORARIOS ========= */

export const getHorarios = () => api.get('/horarios/');
export const getHorario = (id) => api.get(`/horarios/${id}/`);
export const getHorariosDisponibles = (fecha) => api.get(`/horarios/disponibles/?fecha=${fecha}`);
export const createHorario = (data) => api.post('/horarios/', data);
export const updateHorario = (id, data) => api.put(`/horarios/${id}/`, data);
export const deleteHorario = (id) => api.delete(`/horarios/${id}/`);

/* ========= RESERVAS ========= */

export const getReservas = () => api.get('/reservas/');
export const getReserva = (id) => api.get(`/reservas/${id}/`);
export const createReserva = (data) => api.post('/reservas/', data);
export const updateReserva = (id, data) => api.put(`/reservas/${id}/`, data);
export const patchReserva = (id, data) => api.patch(`/reservas/${id}/`, data);
export const deleteReserva = (id) => api.delete(`/reservas/${id}/`);
export const verificarTransaccion = (txId) => api.get(`/reservas/verificar_transaccion/?tx_id=${txId}`);
export const checkoutPago = (reserva_id, data) => api.post(`/checkout-pago/${reserva_id}/`, data);
export const getBancos = () => api.get('/bancos/');

/* ========= PAGOS ========= */

export const getPagos = () => api.get('/pagos/');
export const getPago = (id) => api.get(`/pagos/${id}/`);
export const createPago = (data) => api.post('/pagos/', data);
export const updatePago = (id, data) => api.put(`/pagos/${id}/`, data);
export const deletePago = (id) => api.delete(`/pagos/${id}/`);

/* ========= CANCELACIONES ========= */

export const getCancelaciones = () => api.get('/cancelaciones/');
export const getCancelacion = (id) => api.get(`/cancelaciones/${id}/`);
export const createCancelacion = (data) => api.post('/cancelaciones/', data);
export const updateCancelacion = (id, data) => api.put(`/cancelaciones/${id}/`, data);
export const deleteCancelacion = (id) => api.delete(`/cancelaciones/${id}/`);
