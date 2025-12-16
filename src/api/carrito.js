import api from './client';

/* ========= CARRITO DE COMPRAS ========= */

// Obtener el carrito (GET /carritos/)
export const getCarrito = () => api.get('/carritos/');

// Agregar item (POST /carrito/agregar/)
export const addToCarrito = (data) => api.post('/carrito/agregar/', data);

// Eliminar item (DELETE /items-carrito/{id}/)
export const deleteItemCarrito = (id) => api.delete(`/items-carrito/${id}/`);

// Confirmar reserva (POST /carrito/confirmar/)
export const confirmarCarrito = (data) => api.post('/carrito/confirmar/', data);
