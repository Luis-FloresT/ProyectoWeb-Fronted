import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';

// Importa páginas necesarias
import PaginaInicio from './pages/PaginaInicio';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PaginaReservas from './pages/PaginaReservas';
import NuevaReserva from "./pages/NuevaReserva";
import PaginaPagos from './pages/PaginaPagos';
import PaginaCancelaciones from './pages/PaginaCancelaciones';
import PaginaCarrito from './pages/PaginaCarrito';

import QuienesSomos from "./pages/QuienesSomos";
import Terminos from "./pages/Terminos";
import Privacidad from "./pages/Privacidad";
import SolicitarServicio from "./pages/SolicitarServicio";
import ArmaTuFiesta from "./pages/ArmaTuFiesta";
import Ofertas from "./pages/Ofertas";
import Proveedor from "./pages/Proveedor";



import './App.css';
import { AuthContext } from './auth/AuthContext';

function App() {
  return (
	<AuthProvider>
	  <Routes>
		{/* Página principal - PÚBLICA */}
		<Route path="/" element={<PaginaInicio />} />

		{/* Rutas de autenticación - PÚBLICAS */}
		<Route path="/login" element={<LoginPage />} />
		<Route path="/register" element={<RegisterPage />} />

		{/* Rutas protegidas - requieren autenticación */}
		<Route path="/carrito" element={<ProtectedRoute><PaginaCarrito /></ProtectedRoute>} />
		<Route path="/reservas" element={<ProtectedRoute><PaginaReservas /></ProtectedRoute>} />
		<Route path="/reservas/nueva" element={<ProtectedRoute><NuevaReserva /></ProtectedRoute>} />
		<Route path="/pagos" element={<ProtectedRoute><PaginaPagos /></ProtectedRoute>} />
		<Route path="/cancelaciones" element={<ProtectedRoute><PaginaCancelaciones /></ProtectedRoute>} />

		{/* Ruta por defecto */}
		<Route path="*" element={<Navigate to="/" replace />} />

		<Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
		<Route path="/solicitar-servicio" element={<SolicitarServicio />} />
        <Route path="/arma-tu-fiesta" element={<ArmaTuFiesta />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/proveedor" element={<Proveedor />} />


	  </Routes>
	</AuthProvider>
  );
}

export default App;

function ProtectedRoute({ children }) {
	const { isAuthenticated } = useContext(AuthContext);
	if (!isAuthenticated) return <Navigate to="/login" replace />;
	return children;
}