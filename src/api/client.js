import axios from 'axios';

// Ruta base de la API
// VITE_API_URL=http://127.0.0.1:8000/api
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const NG_ROK_URL = 'https://melina-dynastical-shenita.ngrok-free.dev';

export const BASE_URL = isDevelopment ? 'http://localhost:5000' : NG_ROK_URL;
const API_URL = `${BASE_URL}/api`;

// Crear instancia de axios para la API
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

/* ========= INTERCEPTORES ========= */

// Interceptor para autenticación Tipo Token
// Lee el token actual (del usuario logueado) en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Asegurar header de Ngrok en TODAS las peticiones
    config.headers['ngrok-skip-browser-warning'] = 'true';

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
