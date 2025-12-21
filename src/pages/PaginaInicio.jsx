import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServicios, getCombos, getPromociones, addToCarrito, getCarrito } from '../api';
import { AuthContext } from '../auth/AuthContext';
import { Box, Typography, Alert, Snackbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme/theme';
import Header from '../components/layout/Header';
import ProductSection from '../components/ProductSection';
import ReservaModal from '../components/ReservaModal';

export default function PaginaInicio() {
  const navigate = useNavigate();
  const { token, logout, isAdmin } = useContext(AuthContext);
  
  const [servicios, setServicios] = useState([]);
  const [combos, setCombos] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carritoCount, setCarritoCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  // Estado para el modal de reserva
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviciosRes, combosRes, promocionesRes] = await Promise.all([
          getServicios(),
          getCombos(),
          getPromociones(),
        ]);
        setServicios(serviciosRes.data);
        setCombos(combosRes.data);
        setPromociones(promocionesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Error cargando datos');
        setLoading(false);
      }
    };
    fetchData();
    
    // Cargar contador del carrito si hay token
    if (token) {
      fetchCarritoCount();
    }
  }, [token]);

  const fetchCarritoCount = async () => {
    try {
      const res = await getCarrito();
      setCarritoCount(res.data.length || 0);
    } catch (err) {
      // Si falla (endpoint no implementado), usar 0
      setCarritoCount(0);
    }
  };

  const handleAddToCarrito = async (item, tipo) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const data = {
        tipo: tipo,
        item_id: item.id,
        cantidad: 1,
      };
      
      console.log('--- ENVIANDO A AGREGAR CARRITO ---');
      console.log('Datos enviados:', data); 

      await addToCarrito(data); 
      
      setSnackbarMsg(`✅ ${item.nombre} agregado al carrito`);
      setSnackbarOpen(true);
      fetchCarritoCount();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error("Error al agregar al carrito:", errorMsg);
      
      setSnackbarMsg(`⚠️ Error: ${errorMsg}`);
      setSnackbarOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReservar = (item, tipo) => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Abrir modal con el item seleccionado
    setSelectedItem(item);
    setSelectedTipo(tipo);
    setModalOpen(true);
  };

  const handleReservaCreada = (codigo) => {
    setModalOpen(false); // CERRAR MODAL
    setSnackbarMsg(`✅ Reserva creada exitosamente`);
    setSnackbarOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{
        minHeight: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(180deg, #fff9e6 0%, #ffe6f0 100%)",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        overflow: "auto",
      }}>
        <Header 
          token={token} 
          isAdmin={isAdmin} 
          carritoCount={carritoCount} 
          onLogout={handleLogout} 
        />

        {/* Banner Hero */}
        <Box sx={{
          background: "linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)",
          padding: "60px 20px",
          textAlign: "center",
          color: "#fff",
          marginBottom: "40px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        }}>
          <Typography variant="h1" sx={{ marginBottom: "20px", textShadow: "3px 3px 6px rgba(0,0,0,0.3)" }}>
            ¡Bienvenido a Burbujitas de Colores! ✨
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95, maxWidth: "600px", margin: "0 auto" }}>
            Descubre nuestros increíbles servicios, combos y promociones para hacer tu fiesta única
          </Typography>
        </Box>

        {error && (
          <Box sx={{ px: 4, pb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Sección de Servicios */}
        <ProductSection
          id="servicios"
          title="🎈 Nuestros Servicios"
          color="#FF6B9D"
          items={servicios}
          tipo="servicio"
          loading={loading}
          emptyIcon="🎪"
          emptyMessage="Aún no hay servicios disponibles"
          onReservar={handleReservar}
          onAddToCarrito={handleAddToCarrito}
        />

        {/* Sección de Combos */}
        <ProductSection
          id="combos"
          title="🎁 Combos Especiales"
          color="#FFC74F"
          items={combos}
          tipo="combo"
          loading={loading}
          emptyIcon="🎁"
          emptyMessage="Aún no hay combos disponibles"
          onReservar={handleReservar}
          onAddToCarrito={handleAddToCarrito}
        />

        {/* Sección de Promociones */}
        <ProductSection
          id="promociones"
          title="🎊 Promociones Activas"
          color="#4ECDC4"
          items={promociones}
          tipo="promocion"
          loading={loading}
          emptyIcon="🎊"
          emptyMessage="No hay promociones activas"
          onReservar={handleReservar}
          onAddToCarrito={handleAddToCarrito}
        />

        {/* Footer */}
        <Box sx={{
          background: "linear-gradient(90deg, #FF6B9D 0%, #FFC74F 100%)",
          color: "#fff",
          textAlign: "center",
          padding: "30px",
          marginTop: "40px",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.1)",
        }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
            🎉 BURBUJITAS DE COLORES 🎉

        {/* Modal de Reserva */}
        <ReservaModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          item={selectedItem}
          tipo={selectedTipo}
          onReservaCreada={handleReservaCreada}
        />
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Haz que tu fiesta sea inolvidable • Diversión garantizada • ¡Contacta con nosotros!
          </Typography>
        </Box>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </div>
    </ThemeProvider>
  );
}
