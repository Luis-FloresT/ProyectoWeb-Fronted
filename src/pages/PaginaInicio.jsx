import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getServicios } from '../apiService';
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
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CelebrationIcon from '@mui/icons-material/Celebration';

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
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await getServicios();
        setServicios(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error cargando servicios');
        setLoading(false);
      }
    };
    fetchServicios();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fff9e6 0%, #ffe6f0 100%)",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
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
            <NavLink to="/reservas" style={({ isActive }) => ({
              color: isActive ? "#fff" : "#fff",
              textDecoration: isActive ? "underline" : "none",
              opacity: isActive ? 1 : 0.8,
              transition: "all 0.3s",
            })}>
              📅 Reservas
            </NavLink>
            <NavLink to="/combos" style={({ isActive }) => ({
              color: isActive ? "#fff" : "#fff",
              textDecoration: isActive ? "underline" : "none",
              opacity: isActive ? 1 : 0.8,
            })}>
              🎁 Combos
            </NavLink>
            <NavLink to="/promociones" style={({ isActive }) => ({
              color: isActive ? "#fff" : "#fff",
              textDecoration: isActive ? "underline" : "none",
              opacity: isActive ? 1 : 0.8,
            })}>
              🎊 Promociones
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" style={({ isActive }) => ({
                color: isActive ? "#fff" : "#fff",
                textDecoration: isActive ? "underline" : "none",
                opacity: isActive ? 1 : 0.8,
              })}>
                ⚙️ Admin
              </NavLink>
            )}
          </nav>

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
            ¡Servicios Destacados! ✨
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95, maxWidth: "600px", margin: "0 auto" }}>
            Descubre nuestros increíbles servicios para hacer tu fiesta única y memorable
          </Typography>
        </Box>

        {/* Sección de Servicios */}
        <Container maxWidth="lg" sx={{ paddingY: 4, marginBottom: "40px" }}>
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
                        background: serviceColors[index % serviceColors.length],
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
                        🎈
                      </span>
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
                        onClick={() => navigate("/reservas")}
                      >
                        🎯 Reservar
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          borderColor: "#FFC74F",
                          color: "#FFC74F",
                          fontWeight: "bold",
                          borderRadius: "15px",
                          textTransform: "none",
                          fontSize: "15px",
                          "&:hover": {
                            background: "rgba(255, 199, 79, 0.1)",
                          },
                        }}
                        onClick={() => navigate("/categorias")}
                      >
                        📋 Detalles
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
      </div>
    </ThemeProvider>
  );
}
