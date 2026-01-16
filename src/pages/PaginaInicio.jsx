import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServicios, getCombos, getPromociones, addToCarrito, getCarrito } from '../api';
import { AuthContext } from '../auth/AuthContext';
import { Box, Typography, Alert, Snackbar, Container } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme/theme';
import Header from '../components/layout/Header';
import ProductSection from '../components/ProductSection';
import ReservaModal from '../components/ReservaModal';

// === 1. IMÁGENES PARA EL CARRUSEL  ===
const bannerImages = [
  '/img/banner-fiesta.jpg', 
  '/img/banner-bodas.jpeg',
  '/img/banner-niños.jpg'
];

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

  // === 2. ESTADO Y LÓGICA DEL CARRUSEL ===
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviciosRes, combosRes, promocionesRes] = await Promise.all([
          getServicios(),
          getCombos(),
          getPromociones(),
        ]);
        // Validar que sean arrays antes de setear (evita r.map error si DB está vacía/null)
        setServicios(Array.isArray(serviciosRes.data) ? serviciosRes.data : []);
        setCombos(Array.isArray(combosRes.data) ? combosRes.data : []);
        setPromociones(Array.isArray(promocionesRes.data) ? promocionesRes.data : []);
        setLoading(false);
      } catch (err) {
        console.error("Error crítico cargando datos:", err);
        setError('Error cargando datos');
        setServicios([]);
        setCombos([]);
        setPromociones([]);
        setLoading(false);
      }
    };
    fetchData();

    if (token) {
      fetchCarritoCount();
    }
  }, [token]);

  const fetchCarritoCount = async () => {
    try {
      const res = await getCarrito();
      const cart = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
      setCarritoCount(cart?.items?.length || 0);
    } catch (err) {
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

    setSelectedItem(item);
    setSelectedTipo(tipo);
    setModalOpen(true);
  };

  const handleReservaCreada = (codigo) => {
    setModalOpen(false); 
    setSnackbarMsg(`✅ Reserva creada exitosamente`);
    setSnackbarOpen(true);
  };

  const footerHoverStyle = {
  marginBottom: "8px",
  color: "#555",
  cursor: "pointer",
  padding: "4px 8px", 
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

const iconBoxStyle = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "#FF6B9D",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.25s ease",
  "&:hover": {
    transform: "scale(1.2)",
    boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
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

        {/* Banner Hero DINÁMICO  */}
        <Box sx={{
          width: "100%",
          height: { xs: "300px", md: "500px" },
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          marginBottom: "40px",
          backgroundColor: "#ffe6f0", 
          // Cambio a imagen dinámica con transición suave
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bannerImages[currentBanner]})`, 
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "background-image 1.5s ease-in-out", 
          backgroundAttachment: "scroll", 
        }}>
          <Box sx={{ position: "relative", zIndex: 2, textAlign: "center", color: "#fff", px: 4 }}>
            <Typography variant="h2" sx={{ 
              fontWeight: 'bold', 
              textShadow: "3px 3px 12px rgba(0,0,0,0.6)",
              fontSize: { xs: "2.2rem", md: "3.8rem" },
              letterSpacing: "1px"
            }}>
              ¡Bienvenido a Burbujitas de Colores! ✨
            </Typography>
            <Typography variant="h5" sx={{ 
              mt: 2, 
              textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
              fontSize: { xs: "1.1rem", md: "1.6rem" },
              maxWidth: "850px",
              mx: "auto"
            }}>
              Hacemos de tu fiesta un momento mágico e inolvidable
            </Typography>
          </Box>
        </Box>

        {error && (
          <Box sx={{ px: 4, pb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <Container maxWidth="lg">
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

          <Box sx={{ mt: 6 }}>
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
          </Box>

          <Box sx={{ mt: 6 }}>
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
          </Box>

        </Container>
        
        {/* FOOTER ORIGINAL SIN ELIMINAR NADA */}
        <Box sx={{ background: "#a9e2f3ff", padding: { xs: "40px 20px", md: "60px 80px" }, marginTop: "80px" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr 1fr" }, gap: "40px" }}>
            {/* Columna 1 */}
            <Box>
              <Box sx={{ display: "inline-block", cursor: "pointer", transition: "all 0.3s ease", "&:hover": { transform: "scale(1.05)", filter: "drop-shadow(0px 6px 12px rgba(0,0,0,0.25))" } }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FF6B9D" }}>BURBUJITAS</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFC74F" }}>DE COLORES</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#555", marginTop: "10px" }}>Tu fiesta perfecta empieza aquí</Typography>
              <Typography variant="body2" sx={{ color: "#777" }}>© 2025 BURBUJITAS DE COLORES</Typography>
            </Box>

            {/* Columna 2 */}
            <Box>
              <Typography sx={{ fontWeight: "bold", marginBottom: "15px" }}>BURBUJITAS</Typography>
              {[
                { text: "¿Quiénes somos?", path: "/quienes-somos" },
                { text: "Sobre nosotros", path: "/quienes-somos" },
                { text: "Ingresar", path: "/login" },
                { text: "Términos y condiciones", path: "/terminos" },
                { text: "Política de privacidad", path: "/privacidad" },
                { text: "Contacto", path: "/contacto" },
              ].map((item) => (
                <Typography key={item.text} sx={footerHoverStyle} onClick={() => navigate(item.path)}>{item.text}</Typography>
              ))}
            </Box>

            {/* Columna 3 */}
            <Box>
              <Typography sx={{ fontWeight: "bold", marginBottom: "15px" }}>Servicios</Typography>
              {[
                { text: "Solicitar servicio", path: "/solicitar-servicio" },
                { text: "Arma tu fiesta", path: "/arma-tu-fiesta" },
                { text: "Ofertas", path: "/ofertas" },
                { text: "Quiero ser proveedor", path: "/proveedor" },
              ].map((item) => (
                <Typography key={item.text} sx={footerHoverStyle} onClick={() => navigate(item.path)}>{item.text}</Typography>
              ))}
            </Box>

            {/* Columna 4 CON TIKTOK INTACTO */}
            <Box>
              <Typography sx={{ fontWeight: "bold", marginBottom: "15px" }}>Redes Sociales</Typography>
              <Box sx={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                <Box sx={iconBoxStyle}><img src="/icons/facebook.png" alt="Facebook" width="20" /></Box>
                <Box sx={iconBoxStyle}><img src="/icons/instagram.png" alt="Instagram" width="20" /></Box>
                <Box sx={iconBoxStyle}><img src="/icons/tik-tok.png" alt="TikTok" width="20" /></Box>
              </Box>
              <Typography sx={{ fontWeight: "bold", marginBottom: "10px" }}>Contacto</Typography>
              <Typography sx={{ marginBottom: "8px" }}>info@burbujitasdecolores.com</Typography>
              <Box component="a" href="https://wa.me/593981362088" target="_blank" rel="noopener noreferrer" sx={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                <img src="/icons/whatsapp.png" alt="WhatsApp" width="30" height="30" />
                <Typography component="span">WhatsApp: +593 981362088</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <ReservaModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          item={selectedItem}
          tipo={selectedTipo}
          onReservaCreada={handleReservaCreada}
        />

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