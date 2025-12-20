import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServicios, getCombos, getPromociones, addToCarrito, getCarrito } from '../api';
import { AuthContext } from '../auth/AuthContext';
import { Box, Typography, Alert, Snackbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme/theme';
import Header from '../components/layout/Header';
import ProductSection from '../components/ProductSection';



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

  const handleReservar = () => {
    if (!token) {
      navigate('/login');
    } else {
      navigate('/reservas/nueva');
    }
  };

  const footerHoverStyle = {
  marginBottom: "8px",
  color: "#555",
  cursor: "pointer",
  padding: "6px 10px",
  borderRadius: "8px",
  width: "fit-content",
  transition: "all 0.25s ease",

  "&:hover": {
    color: "#FF6B9D",
    backgroundColor: "#ffe6f0",
    transform: "scale(1.08)",
    boxShadow: "0 4px 10px rgba(255,107,157,0.3)",
  },
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
<Box
  sx={{
    background: "#a9e2f3ff",
    padding: { xs: "40px 20px", md: "60px 80px" },
    marginTop: "80px",
  }}
>
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr 1fr" },
      gap: "40px",
    }}
  >
    {/* Columna 1 */}
<Box>
  {/* SOLO EL NOMBRE CON HOVER */}
  <Box
    sx={{
      display: "inline-block",
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "scale(1.05)",
        filter: "drop-shadow(0px 6px 12px rgba(0,0,0,0.25))",
      },
    }}
  >
    <Typography
      variant="h4"
      sx={{
        fontWeight: "bold",
        color: "#FF6B9D",
        transition: "color 0.3s ease",
        "&:hover": {
          color: "#ff4f8b",
        },
      }}
    >
      BURBUJITAS
    </Typography>

    <Typography
      variant="h5"
      sx={{
        fontWeight: "bold",
        color: "#FFC74F",
        transition: "color 0.3s ease",
        "&:hover": {
          color: "#ffb703",
        },
      }}
    >
      DE COLORES
    </Typography>
  </Box>

  {/* TEXTO NORMAL (SIN HOVER) */}
  <Typography variant="body2" sx={{ color: "#555", marginTop: "10px" }}>
    Tu fiesta perfecta empieza aquí
  </Typography>

  <Typography variant="body2" sx={{ color: "#777" }}>
    © 2025 BURBUJITAS DE COLORES
  </Typography>
</Box>

   {/* Columna 2 */}
<Box>
  <Typography sx={{ fontWeight: "bold", marginBottom: "15px" }}>
    BURBUJITAS
  </Typography>

  {[
    { text: "¿Quiénes somos?", path: "/quienes-somos" },
    { text: "Sobre nosotros", path: "/quienes-somos" },
    { text: "Ingresar", path: "/login" },
    { text: "Términos y condiciones", path: "/terminos" },
    { text: "Política de privacidad", path: "/privacidad" },
    { text: "Contacto", path: "/contacto" },
  ].map((item) => (
    <Typography
      key={item.text}
      sx={footerHoverStyle}
      onClick={() => navigate(item.path)}
    >
      {item.text}
    </Typography>
  ))}
</Box>


    {/* Columna 3 */}
<Box>
  <Typography sx={{ fontWeight: "bold", marginBottom: "15px" }}>
    Servicios
  </Typography>

  {[
    { text: "Solicitar servicio", path: "/solicitar-servicio" },
    { text: "Arma tu fiesta", path: "/arma-tu-fiesta" },
    { text: "Ofertas", path: "/ofertas" },
    { text: "Quiero ser proveedor", path: "/proveedor" },
  ].map((item) => (
    <Typography
      key={item.text}
      sx={footerHoverStyle}
      onClick={() => navigate(item.path)}
    >
      {item.text}
    </Typography>
  ))}
</Box>


    {/* Columna 4 */}
    <Box>
      <Typography sx={{ fontWeight: "bold", marginBottom: "15px" }}>
        Redes Sociales
      </Typography>

      <Box sx={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        {["f", "🎵", "📸", "▶️"].map((icon, i) => (
          <Box
            key={i}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#FF6B9D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.25s ease",

              "&:hover": {
                transform: "scale(1.2)",
                boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
              },
            }}
          >
            {icon}
          </Box>
        ))}
      </Box>

      <Typography sx={{ fontWeight: "bold", marginBottom: "10px" }}>
        Contacto
      </Typography>

      <Typography >
        info@burbujitasdecolores.com
      </Typography>

      <Typography >
        WhatsApp: +593 91362088
      </Typography>
    </Box>
  </Box>
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
