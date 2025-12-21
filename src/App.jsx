import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Importa páginas necesarias
import PaginaInicio from './pages/PaginaInicio';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PaginaReservas from './pages/PaginaReservas';
import PaginaPagos from './pages/PaginaPagos';
import PaginaCancelaciones from './pages/PaginaCancelaciones';
import PaginaCarrito from './pages/PaginaCarrito';


import './App.css';
import { AuthContext } from './auth/AuthContext';

function App() {
  return (
	<ErrorBoundary>
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
		  <Route path="/pagos" element={<ProtectedRoute><PaginaPagos /></ProtectedRoute>} />
		  <Route path="/cancelaciones" element={<ProtectedRoute><PaginaCancelaciones /></ProtectedRoute>} />

		  {/* Ruta por defecto */}
		  <Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	  </AuthProvider>
	</ErrorBoundary>
  );
}

export default App;

function ProtectedRoute({ children }) {
	const { isAuthenticated } = useContext(AuthContext);
	if (!isAuthenticated) return <Navigate to="/login" replace />;
	return children;
}