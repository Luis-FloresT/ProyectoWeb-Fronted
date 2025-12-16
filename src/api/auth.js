import api from './client';

/* ========= AUTH ========= */

// Login: devuelve token e info de usuario
export const login = (data) => api.post('/login/', data);

// Registro de usuario (nombre, email, clave)
export const register = (data) => api.post('/registro/', data);
