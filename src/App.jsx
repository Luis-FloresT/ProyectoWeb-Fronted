import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importa tus páginas
import ServiciosList from './pages/ServiciosList';
import CrearServicioForm from './pages/CrearServicioForm';
import PaginaReservas from './pages/PaginaReservas';
import PaginaCategorias from './pages/PaginaCategorias';
import PaginaPromociones from './pages/PaginaPromociones';
import PaginaCombos from './pages/PaginaCombos';
import PaginaUsuarios from './pages/PaginaUsuarios';
import PaginaHorarios from './pages/PaginaHorarios';
import PaginaPagos from './pages/PaginaPagos';
import PaginaCancelaciones from './pages/PaginaCancelaciones';
import PaginaInicio from './pages/PaginaInicio'; // Tu página de inicio con barra hero

import PaginaAdmin from './pages/PaginaAdmin'; // Para panel admin

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import './App.css';

function App() {
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  return (
    <>
  

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reservas" element={<PaginaReservas />} />
        <Route path="/categorias" element={<PaginaCategorias />} />
        <Route path="/servicios" element={<ServiciosList />} />
        <Route path="/servicios/crear" element={<CrearServicioForm />} />
        <Route path="/promociones" element={<PaginaPromociones />} />
        <Route path="/combos" element={<PaginaCombos />} />
        <Route path="/usuarios" element={<PaginaUsuarios />} />
        <Route path="/horarios" element={<PaginaHorarios />} />
        <Route path="/pagos" element={<PaginaPagos />} />
        <Route path="/cancelaciones" element={<PaginaCancelaciones />} />

        {/* Ruta protegida para admin */}
        <Route path="/admin" element={
          isAdmin
           ? <PaginaAdmin />
           : <Navigate to="/" replace />
        } />

        {/* Página de inicio */}
        <Route path="/" element={<PaginaInicio />} />
      </Routes>
    </>
  );
}

export default App;
