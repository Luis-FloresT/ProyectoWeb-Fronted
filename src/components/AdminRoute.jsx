import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = () => {
    const { isAuthenticated, isAdmin } = useContext(AuthContext);

    // Opcional: Podrías añadir un estado de "cargando" si la verificación de auth es asíncrona
    // if (loading) return <LoadingSpinner />;

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
