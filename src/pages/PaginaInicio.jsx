import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getServicios, getCombos, getPromociones, addToCarrito, getCarrito } from '../api';
import { AuthContext } from '../auth/AuthContext';
import {
  Container,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Badge,
  Snackbar,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const logoLeft = "/logo.png";

// Tema con colores infantiles vibrantes
const theme = createTheme({
  palette: {
    primary: { main: '#FF6B9D' }, // Rosa vibrante
    secondary: { main: '#FFC74F' }, // Amarillo vibrante
    success: { main: '#4ECDC4' }, // Turquesa
    warning: { main: '#FF6348' }, // Rojo-naranja
  },
  typography: {
    fontFamily: '"Comic Sans MS", "Trebuchet MS", cursive, sans-serif',
    h1: { fontWeight: 'bold', fontSize: '2.8rem' },
    h4: { fontWeight: 'bold' },
  },
});

// Colores para gradient por servicio
const serviceColors = [
  'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)', // Rosa
  'linear-gradient(135deg, #FFC74F 0%, #FFE66D 100%)', // Amarillo
  'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)', // Turquesa
  'linear-gradient(135deg, #FF6348 0%, #FF8C42 100%)', // Rojo-naranja
  'linear-gradient(135deg, #A8E6CF 0%, #56CCF2 100%)', // Verde-Azul
  'linear-gradient(135deg, #FFB997 0%, #FFB584 100%)', // Naranja
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

// En src/pages/PaginaInicio.jsx:

// ... (después de fetchCarritoCount, antes de handleLogout) ...

  const handleAddToCarrito = async (item, tipo) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const data = {
        tipo: tipo,       // 'servicio', 'combo', 'promocion'
        item_id: item.id, // El backend espera 'item_id', no 'servicio' o 'combo'
        cantidad: 1,
      };
      
      // 🚨 DEBUGGING: Revisa si el ID y tipo se envían correctamente
      console.log('--- ENVIANDO A AGREGAR CARRITO ---');
      console.log('Datos enviados:', data); 

      // La API es única para los 3 tipos de productos
      await addToCarrito(data); 
      
      setSnackbarMsg(`✅ ${item.nombre} agregado al carrito`);
      setSnackbarOpen(true);
      fetchCarritoCount(); // Actualizar contador
    } catch (err) {
        // Muestra el error de respuesta del servidor (cuerpo del 400 o 500)
        const errorMsg = err.response?.data?.error || err.message;
        console.error("Error al agregar al carrito:", errorMsg);
        
        setSnackbarMsg(`⚠️ Error: ${errorMsg}`);
        setSnackbarOpen(true);
    }
  };
  
// ... (resto del componente) ...

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReservar = () => {
    if (!token) {
      navigate('/login'); // Redirige a login si no está autenticado
    } else {
      navigate('/reservas/nueva'); // Va al formulario de reserva si está logueado
    }
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
        {/* Header mejorado */}
        <header style={{
          background: "linear-gradient(90deg, #FF6B9D 0%, #FFC74F 100%)",
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <CelebrationIcon sx={{ fontSize: 40, color: "#fff" }} />
            <div>
              <h1 style={{
                color: "#fff",
                margin: 0,
                fontSize: "28px",
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
              }}>
                🎉 BURBUJITAS DE COLORES 🎉
              </h1>
              <p style={{ color: "#fff", margin: 0, fontSize: "12px", opacity: 0.9 }}>
                Fiestas infantiles llenas de diversión
              </p>
            </div>
          </div>

          <nav style={{
            display: "flex",
            gap: "30px",
            fontWeight: "bold",
            fontSize: "16px",
          }}>
            <a href="#servicios" style={{
              color: "#fff",
              textDecoration: "none",
              opacity: 0.9,
              transition: "all 0.3s",
            }}>
              🎈 Servicios
            </a>
            <a href="#combos" style={{
              color: "#fff",
              textDecoration: "none",
              opacity: 0.9,
            }}>
              🎁 Combos
            </a>
            <a href="#promociones" style={{
              color: "#fff",
              textDecoration: "none",
              opacity: 0.9,
            }}>
              🎊 Promociones
            </a>
            {token && (
              <NavLink to="/reservas" style={({ isActive }) => ({
                color: "#fff",
                textDecoration: isActive ? "underline" : "none",
                opacity: isActive ? 1 : 0.9,
              })}>
                📅 Mis Reservas
              </NavLink>
            )}
            {isAdmin && (
              <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noopener noreferrer" style={{
                color: "#fff",
                textDecoration: "none",
                opacity: 0.9,
              }}>
                ⚙️ Admin
              </a>
            )}
          </nav>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Icono del carrito con contador */}
            {token && (
              <IconButton 
                onClick={() => navigate('/carrito')}
                sx={{ 
                  color: '#fff',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              >
                <Badge badgeContent={carritoCount} color="error">
                  <ShoppingCartIcon sx={{ fontSize: 32 }} />
                </Badge>
              </IconButton>
            )}
            
            {!token ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    padding: "10px 25px",
                    background: "#fff",
                    color: "#FF6B9D",
                    border: "none",
                    fontWeight: "bold",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.3s",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                  onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                >
                  🔑 Iniciar Sesión
                </button>
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    padding: "10px 25px",
                    background: "transparent",
                    color: "#fff",
                    border: "2px solid #fff",
                    fontWeight: "bold",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.3s",
                  }}
                  onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                  onMouseOut={(e) => e.target.style.background = "transparent"}
                >
                  📝 Registrarse
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 25px",
                  background: "#fff",
                  color: "#FF6B9D",
                  border: "none",
                  fontWeight: "bold",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.target.style.transform = "scale(1)"}
              >
                🚪 Salir
              </button>
            )}
          </div>
        </header>

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

        {/* Sección de Servicios */}
        <Container maxWidth="lg" sx={{ paddingY: 4, marginBottom: "40px" }} id="servicios">
          <Typography variant="h3" sx={{
            textAlign: "center",
            color: "#FF6B9D",
            fontWeight: "bold",
            marginBottom: "30px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
          }}>
            🎈 Nuestros Servicios
          </Typography>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={50} />
            </Box>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {servicios.length > 0 && (
            <Grid container spacing={3}>
              {servicios.map((servicio, index) => (
                <Grid item xs={12} sm={6} md={4} key={servicio.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "20px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      "&:hover": {
                        transform: "translateY(-15px)",
                        boxShadow: "0 20px 48px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    {/* Imagen con gradiente */}
                    <Box
                      sx={{
                        height: 250,
                        background: servicio.imagen 
                          ? `url(${servicio.imagen}) center/cover no-repeat` 
                          : serviceColors[index % serviceColors.length],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "80px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {!servicio.imagen && (
                        <span style={{
                          fontSize: "100px",
                          filter: "drop-shadow(3px 3px 6px rgba(0,0,0,0.2))",
                        }}>
                          🎈
                        </span>
                      )}
                    </Box>

                    {/* Contenido */}
                    <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                      <Typography variant="h5" component="div" sx={{
                        fontWeight: "bold",
                        color: "#FF6B9D",
                        marginBottom: "10px",
                      }}>
                        {servicio.nombre}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: "15px" }}>
                        {servicio.descripcion || "Servicio especial para tu fiesta"}
                      </Typography>
                      <Typography variant="h6" sx={{
                        color: "#FFC74F",
                        fontWeight: "bold",
                        fontSize: "24px",
                      }}>
                        ${servicio.precio_base}
                      </Typography>
                    </CardContent>

                    {/* Botones */}
                    <CardActions sx={{ gap: "10px", pt: "20px", pb: "20px", px: "16px" }}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          background: "linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)",
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: "15px",
                          textTransform: "none",
                          fontSize: "15px",
                          "&:hover": {
                            background: "linear-gradient(135deg, #FF8C94 0%, #FF6B9D 100%)",
                          },
                        }}
                        onClick={handleReservar}
                      >
                        🎯 Reservar
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddShoppingCartIcon />}
                        sx={{
                          background: "linear-gradient(135deg, #FFC74F 0%, #FFE66D 100%)",
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: "15px",
                          textTransform: "none",
                          fontSize: "15px",
                          "&:hover": {
                            background: "linear-gradient(135deg, #FFE66D 0%, #FFC74F 100%)",
                          },
                        }}
                        onClick={() => handleAddToCarrito(servicio, 'servicio')}
                      >
                        Agregar al Carrito
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          borderColor: "#4ECDC4",
                          color: "#4ECDC4",
                          fontWeight: "bold",
                          borderRadius: "15px",
                          textTransform: "none",
                          fontSize: "15px",
                          "&:hover": {
                            background: "rgba(78, 205, 196, 0.1)",
                          },
                        }}
                      >
                        📋 Ver más
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {servicios.length === 0 && !loading && !error && (
            <Box sx={{
              textAlign: "center",
              py: 5,
              background: "rgba(255, 107, 157, 0.1)",
              borderRadius: "15px",
              padding: "40px",
            }}>
              <Typography variant="h5" sx={{ color: "#FF6B9D", fontWeight: "bold" }}>
                🎪 Aún no hay servicios disponibles
              </Typography>
              <Typography variant="body1" sx={{ color: "#666", mt: 2 }}>
                Vuelve pronto para ver nuestros increíbles servicios
              </Typography>
            </Box>
          )}
        </Container>

        {/* Sección de Combos */}
        <Container maxWidth="lg" sx={{ paddingY: 4, marginBottom: "40px" }} id="combos">
          <Typography variant="h3" sx={{
            textAlign: "center",
            color: "#FFC74F",
            fontWeight: "bold",
            marginBottom: "30px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
          }}>
            🎁 Combos Especiales
          </Typography>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={50} />
            </Box>
          )}

          {combos.length > 0 && (
            <Grid container spacing={3}>
              {combos.map((combo, index) => (
                <Grid item xs={12} sm={6} md={4} key={combo.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "20px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      "&:hover": {
                        transform: "translateY(-15px)",
                        boxShadow: "0 20px 48px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 250,
                        background: "linear-gradient(135deg, #FFC74F 0%, #FFE66D 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "80px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <span style={{
                        fontSize: "100px",
                        filter: "drop-shadow(3px 3px 6px rgba(0,0,0,0.2))",
                      }}>
                        🎁
                      </span>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                      <Typography variant="h5" component="div" sx={{
                        fontWeight: "bold",
                        color: "#FFC74F",
                        marginBottom: "10px",
                      }}>
                        {combo.nombre}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: "15px" }}>
                        {combo.descripcion || "Combo especial con múltiples servicios"}
                      </Typography>
                      <Typography variant="h6" sx={{
                        color: "#FF6B9D",
                        fontWeight: "bold",
                        fontSize: "24px",
                      }}>
                        ${combo.precio_total}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ gap: "10px", pt: "20px", pb: "20px", px: "16px" }}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          background: "linear-gradient(135deg, #FFC74F 0%, #FFE66D 100%)",
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: "15px",
                          textTransform: "none",
                          fontSize: "15px",
                          "&:hover": {
                            background: "linear-gradient(135deg, #FFE66D 0%, #FFC74F 100%)",
                          },
                        }}
                        onClick={handleReservar}
                      >
                        🎯 Reservar Combo
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddShoppingCartIcon />}
                        sx={{
                          background: "linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)",
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: "15px",
                          textTransform: "none",
                          fontSize: "15px",
                          "&:hover": {
                            background: "linear-gradient(135deg, #FF8C94 0%, #FF6B9D 100%)",
                          },
                        }}
                        onClick={() => handleAddToCarrito(combo, 'combo')}
                      >
                        Agregar al Carrito
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {combos.length === 0 && !loading && !error && (
            <Box sx={{
              textAlign: "center",
              py: 5,
              background: "rgba(255, 199, 79, 0.1)",
              borderRadius: "15px",
              padding: "40px",
            }}>
              <Typography variant="h5" sx={{ color: "#FFC74F", fontWeight: "bold" }}>
                🎁 Aún no hay combos disponibles
              </Typography>
              <Typography variant="body1" sx={{ color: "#666", mt: 2 }}>
                Vuelve pronto para ver nuestros paquetes especiales
              </Typography>
            </Box>
          )}
        </Container>

        {/* Sección de Promociones */}
        <Container maxWidth="lg" sx={{ paddingY: 4, marginBottom: "40px" }} id="promociones">
          <Typography variant="h3" sx={{
            textAlign: "center",
            color: "#4ECDC4",
            fontWeight: "bold",
            marginBottom: "30px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
          }}>
            🎊 Promociones Activas
          </Typography>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={50} />
            </Box>
          )}

          {promociones.length > 0 && (
            <Grid container spacing={3}>
              {promociones.map((promo, index) => (
                <Grid item xs={12} sm={6} md={4} key={promo.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "20px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      border: "3px solid #4ECDC4",
                      "&:hover": {
                        transform: "translateY(-15px)",
                        boxShadow: "0 20px 48px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 250,
                        background: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "80px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Chip
                        label={`${promo.descuento}% OFF`}
                        sx={{
                          position: "absolute",
                          top: 15,
                          right: 15,
                          background: "#FF6348",
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "16px",
                          padding: "5px",
                        }}
                      />
                      <span style={{
                        fontSize: "100px",
                        filter: "drop-shadow(3px 3px 6px rgba(0,0,0,0.2))",
                      }}>
                        🎊
                      </span>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                      <Typography variant="h5" component="div" sx={{
                        fontWeight: "bold",
                        color: "#4ECDC4",
                        marginBottom: "10px",
                      }}>
                        {promo.nombre}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: "15px" }}>
                        {promo.descripcion || "Promoción especial por tiempo limitado"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666", fontStyle: "italic" }}>
                        Válido hasta: {promo.fecha_fin ? new Date(promo.fecha_fin).toLocaleDateString() : 'Sin límite'}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ gap: "10px", pt: "20px", pb: "20px", px: "16px" }}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          background: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: "15px",
                          textTransform: "none",
                          fontSize: "15px",
                          "&:hover": {
                            background: "linear-gradient(135deg, #44A08D 0%, #4ECDC4 100%)",
                          },
                        }}
                        onClick={handleReservar}
                      >
                        🎯 Aprovechar Ahora
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddShoppingCartIcon />}
                        sx={{
                          background: "linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)",
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: "15px",
                          textTransform: "none",
                          fontSize: "15px",
                          "&:hover": {
                            background: "linear-gradient(135deg, #FF8C94 0%, #FF6B9D 100%)",
                          },
                        }}
                        onClick={() => handleAddToCarrito(promo, 'promocion')}
                      >
                        Agregar al Carrito
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {promociones.length === 0 && !loading && !error && (
            <Box sx={{
              textAlign: "center",
              py: 5,
              background: "rgba(78, 205, 196, 0.1)",
              borderRadius: "15px",
              padding: "40px",
            }}>
              <Typography variant="h5" sx={{ color: "#4ECDC4", fontWeight: "bold" }}>
                🎊 No hay promociones activas
              </Typography>
              <Typography variant="body1" sx={{ color: "#666", mt: 2 }}>
                Mantente atento a nuestras ofertas especiales
              </Typography>
            </Box>
          )}
        </Container>

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
