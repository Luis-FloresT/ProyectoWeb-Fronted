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
import InfoModal from '../components/InfoModal';

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

  // Estado para los modales de info
  const [infoModals, setInfoModals] = useState({
    quienesSomos: false,
    sobreNosotros: false,
    terminos: false,
    privacidad: false,
    contacto: false,
    solicitarServicio: false,
    armatufiesta: false,
    ofertas: false,
    proveedor: false,
  });

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
                { text: "¿Quiénes somos?", key: "quienesSomos" },
                { text: "Sobre nosotros", key: "sobreNosotros" },
                { text: "Ingresar", path: "/login" },
                { text: "Términos y condiciones", key: "terminos" },
                { text: "Política de privacidad", key: "privacidad" },
                { text: "Contacto", key: "contacto" },
              ].map((item) => (
                <Typography 
                  key={item.text} 
                  sx={footerHoverStyle} 
                  onClick={() => item.key ? setInfoModals({...infoModals, [item.key]: true}) : navigate(item.path)}
                >
                  {item.text}
                </Typography>
              ))}
            </Box>

            {/* Columna 3 */}
            <Box>
              <Typography sx={{ fontWeight: "bold", marginBottom: "15px" }}>Servicios</Typography>
              {[
                { text: "Solicitar servicio", key: "solicitarServicio" },
                { text: "Arma tu fiesta", key: "armatufiesta" },
                { text: "Ofertas", key: "ofertas" },
                { text: "Quiero ser proveedor", key: "proveedor" },
              ].map((item) => (
                <Typography 
                  key={item.text} 
                  sx={footerHoverStyle} 
                  onClick={() => setInfoModals({...infoModals, [item.key]: true})}
                >
                  {item.text}
                </Typography>
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

        <InfoModal
          open={infoModals.quienesSomos}
          onClose={() => setInfoModals({...infoModals, quienesSomos: false})}
          title="¿Quiénes Somos?"
          icon="🎈"
        >
          <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8 }}>
            Burbujitas de Colores es una empresa especializada en crear momentos mágicos e inolvidables 
            para los más pequeños de la casa. Con años de experiencia, nos dedicamos a organizar fiestas 
            infantiles llenas de diversión, emociones y sonrisas que perdurarán en la memoria de tus hijos.
          </Typography>
        </InfoModal>

        <InfoModal
          open={infoModals.sobreNosotros}
          onClose={() => setInfoModals({...infoModals, sobreNosotros: false})}
          title="Sobre Nosotros"
          icon="💖"
        >
          <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8 }}>
            Somos un equipo apasionado por hacer que cada celebración sea especial. Contamos con 
            profesionales capacitados, decoraciones coloridas y actividades entretenidas diseñadas 
            específicamente para niños. Nuestro compromiso es convertir tu visión en realidad.
          </Typography>
        </InfoModal>

        <InfoModal
          open={infoModals.terminos}
          onClose={() => setInfoModals({...infoModals, terminos: false})}
          title="Términos y Condiciones"
          icon="📋"
        >
          <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8 }}>
            Al utilizar nuestros servicios, aceptas nuestros términos y condiciones. Las reservas deben 
            confirmarse con 15 días de anticipación. El cliente es responsable de proporcionar información 
            correcta sobre la fecha, hora y lugar del evento. Nos reservamos el derecho de cancelar servicios 
            en caso de incumplimiento de pagos. Para más detalles, contáctanos directamente.
          </Typography>
        </InfoModal>

        <InfoModal
          open={infoModals.privacidad}
          onClose={() => setInfoModals({...infoModals, privacidad: false})}
          title="Política de Privacidad"
          icon="🔒"
        >
          <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8 }}>
            Tu privacidad es importante para nosotros. Los datos personales que proporcionas se utilizan 
            únicamente para procesar tus reservas y mejorar nuestros servicios. No compartimos información 
            con terceros sin tu consentimiento. Tus datos están protegidos con los más altos estándares 
            de seguridad.
          </Typography>
        </InfoModal>

        <InfoModal
          open={infoModals.contacto}
          onClose={() => setInfoModals({...infoModals, contacto: false})}
          title="Contacto"
          icon="📞"
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 'bold', color: '#FF6B9D' }}>📧 Email</Typography>
              <Typography sx={{ color: '#333' }}>info@burbujitasdecolores.com</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 'bold', color: '#FF6B9D' }}>📱 WhatsApp</Typography>
              <Typography sx={{ color: '#333' }}>+593 981362088</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 'bold', color: '#FF6B9D' }}>🌐 Redes Sociales</Typography>
              <Typography sx={{ color: '#333' }}>Síguenos en Instagram y TikTok para ver nuestros eventos</Typography>
            </Box>
          </Box>
        </InfoModal>

        <InfoModal
          open={infoModals.solicitarServicio}
          onClose={() => setInfoModals({...infoModals, solicitarServicio: false})}
          title="Solicitar Servicio"
          icon="🎉"
        >
          <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8 }}>
            ¿Deseas solicitar un servicio personalizado? Nuestro equipo está listo para ayudarte. 
            Contáctanos directamente por WhatsApp o email con los detalles de tu evento: fecha, 
            número de niños, temática deseada y presupuesto. Nos encantaría hacer que tu fiesta 
            sea inolvidable.
          </Typography>
        </InfoModal>

        <InfoModal
          open={infoModals.armatufiesta}
          onClose={() => setInfoModals({...infoModals, armatufiesta: false})}
          title="Arma Tu Fiesta"
          icon="🛠️"
        >
          <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8 }}>
            Con nuestra opción "Arma tu Fiesta" puedes combinar servicios y crear el paquete perfecto 
            para tu celebración. Elige tus decoraciones, actividades, catering y entretenimiento. 
            Nuestro sistema te permite personalizar cada detalle según tus preferencias y presupuesto.
          </Typography>
        </InfoModal>

        <InfoModal
          open={infoModals.ofertas}
          onClose={() => setInfoModals({...infoModals, ofertas: false})}
          title="Ofertas"
          icon="🎁"
        >
          <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8 }}>
            ¡Aprovecha nuestras ofertas especiales! Tenemos descuentos por reservas anticipadas, 
            paquetes para grupos grandes y promociones en fechas especiales. Visita nuestra sección 
            de promociones para conocer todas las ofertas disponibles. ¡No te pierdas estas oportunidades!
          </Typography>
        </InfoModal>

        <InfoModal
          open={infoModals.proveedor}
          onClose={() => setInfoModals({...infoModals, proveedor: false})}
          title="Quiero Ser Proveedor"
          icon="🤝"
        >
          <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8 }}>
            ¿Tienes servicios complementarios para eventos? ¡Nos encantaría trabajar contigo! 
            Buscamos fotógrafos, payasos, magos, catering y otros proveedores de calidad. 
            Envíanos tu propuesta a info@burbujitasdecolores.com y nos pondremos en contacto 
            para explorar una posible colaboración.
          </Typography>
        </InfoModal>

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