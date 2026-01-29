import axios from 'axios';

// Ruta base de la API usando variables de entorno de Vite
// URL del Backend (Render) configurada en .env
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = `${BASE_URL}/api`;

// Crear instancia de axios para la API
const api = axios.create({
  baseURL: API_URL,
  baseURL: API_URL,
  headers: {} // Headers limpios para producción
});

/* ========= INTERCEPTORES ========= */

// Interceptor para autenticación Tipo Token
// Lee el token actual (del usuario logueado) en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Asegurar header de Ngrok en TODAS las peticiones
    // config.headers['ngrok-skip-browser-warning'] = 'true'; // Eliminado para producción

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

export default api;
