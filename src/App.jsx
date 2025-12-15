import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importa páginas necesarias
import PaginaInicio from './pages/PaginaInicio';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PaginaReservas from './pages/PaginaReservas';
import NuevaReserva from "./pages/NuevaReserva";
import PaginaPagos from './pages/PaginaPagos';
import PaginaCancelaciones from './pages/PaginaCancelaciones';
import PaginaCarrito from './pages/PaginaCarrito';


import './App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      {/* Página principal - PÚBLICA */}
      <Route path="/" element={<PaginaInicio />} />
      
      {/* Rutas de autenticación - PÚBLICAS */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Rutas protegidas - requieren autenticación */}
      <Route 
        path="/carrito" 
        element={token ? <PaginaCarrito /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/reservas" 
        element={token ? <PaginaReservas /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/reservas/nueva" 
        element={token ? <NuevaReserva /> : <Navigate to="/login" replace />}
      />
      <Route 
        path="/pagos" 
        element={token ? <PaginaPagos /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/cancelaciones" 
        element={token ? <PaginaCancelaciones /> : <Navigate to="/login" replace />} 
      />
      
      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

    
  );
}

export default App;