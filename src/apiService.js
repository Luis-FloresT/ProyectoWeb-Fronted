import axios from 'axios';

// Ruta base de la API
// VITE_API_URL=http://127.0.0.1:8000/api
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Crear instancia de axios para la API
const api = axios.create({
  baseURL: API_URL,
});

/* ========= INTERCEPTORES ========= */

// Interceptor para autenticación Tipo Token
// Lee el token actual (del usuario logueado) en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // aquí debes guardar el token al hacer login
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de errores global (se ejecuta después de la request)
// NO lanza alertas automáticos - cada página maneja sus propios errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

/* ========= AUTH ========= */

// Login: devuelve token e info de usuario
export const login = (data) => api.post('/login/', data);

// Registro de usuario (nombre, email, clave)
export const register = (data) => api.post('/registro/', data);

/* ========= USUARIOS ========= */

export const getUsuarios = () => api.get('/usuarios/');
export const getUsuario = (id) => api.get(`/usuarios/${id}/`);
export const createUsuario = (data) => api.post('/usuarios/', data);
export const updateUsuario = (id, data) => api.put(`/usuarios/${id}/`, data);
export const deleteUsuario = (id) => api.delete(`/usuarios/${id}/`);

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

/* ========= PROMOCIONES ========= */

export const getPromociones = () => api.get('/promociones/');
export const getPromocion = (id) => api.get(`/promociones/${id}/`);
export const createPromocion = (data) => api.post('/promociones/', data);
export const updatePromocion = (id, data) => api.put(`/promociones/${id}/`, data);
export const deletePromocion = (id) => api.delete(`/promociones/${id}/`);

/* ========= HORARIOS ========= */

export const getHorarios = () => api.get('/horarios/');
export const getHorario = (id) => api.get(`/horarios/${id}/`);
export const getHorariosDisponibles = (fecha) => api.get(`/horarios/disponibles/?fecha=${fecha}`);
export const createHorario = (data) => api.post('/horarios/', data);
export const updateHorario = (id, data) => api.put(`/horarios/${id}/`, data);
export const deleteHorario = (id) => api.delete(`/horarios/${id}/`);

/* ========= COMBOS ========= */

export const getCombos = () => api.get('/combos/');
export const getCombo = (id) => api.get(`/combos/${id}/`);
export const createCombo = (data) => api.post('/combos/', data);
export const updateCombo = (id, data) => api.put(`/combos/${id}/`, data);
export const deleteCombo = (id) => api.delete(`/combos/${id}/`);

/* ========= RESERVAS ========= */

export const getReservas = () => api.get('/reservas/');
export const getReserva = (id) => api.get(`/reservas/${id}/`);
export const createReserva = (data) => api.post('/reservas/', data);
export const updateReserva = (id, data) => api.put(`/reservas/${id}/`, data);
export const deleteReserva = (id) => api.delete(`/reservas/${id}/`);

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

/* ========= CARRITO DE COMPRAS (CORREGIDO) ========= */

// Obtener el carrito (GET /carritos/)
export const getCarrito = () => api.get('/carritos/'); 

// Agregar item (POST /carrito/agregar/)
export const addToCarrito = (data) => api.post('/carrito/agregar/', data); 

// Eliminar item (DELETE /items-carrito/{id}/)
export const deleteItemCarrito = (id) => api.delete(`/items-carrito/${id}/`); 

// Confirmar reserva (POST /carrito/confirmar/)
export const confirmarCarrito = (data) => api.post('/carrito/confirmar/', data);