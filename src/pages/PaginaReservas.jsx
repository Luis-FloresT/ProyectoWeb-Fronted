import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReservas, deleteReserva } from '../api';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const theme = createTheme({
  palette: {
    primary: { main: '#FF6B9D' },
    secondary: { main: '#FFC74F' },
    success: { main: '#4ECDC4' },
  },
  typography: {
    fontFamily: '"Comic Sans MS", "Trebuchet MS", cursive, sans-serif',
  },
});

function PaginaReservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('id');

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReservas();
      const misReservas = res.data.filter(r => r.cliente == userId);
      setReservas(misReservas);
    } catch (err) {
      setError('Error cargando reservas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) return;
    try {
      await deleteReserva(id);
      fetchReservas();
    } catch (err) {
      alert('Error eliminando reserva');
    }
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'CONFIRMADA': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'CANCELADA': return 'error';
      default: return 'default';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#fff9e6',
        overflow: 'auto',
        py: 4,
      }}>
        <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{
              color: '#FF6B9D',
              fontWeight: 'bold',
              '&:hover': { background: 'rgba(255, 107, 157, 0.1)' }
            }}
          >
            Volver al Inicio
          </Button>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/reservas/nueva')}
            sx={{
              background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '25px',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #FF8C94 0%, #FF6B9D 100%)',
              }
            }}
          >
            Nueva Reserva
          </Button>
        </Box>

        <Typography variant="h4" sx={{ 
          color: '#FF6B9D', 
          fontWeight: 'bold', 
          mb: 3,
          textAlign: 'center' 
        }}>
          📅 Mis Reservas
        </Typography>

        {!loading && !error && reservas.length === 0 && (
          <Box sx={{
            textAlign: 'center',
            py: 8,
            background: 'rgba(255, 107, 157, 0.1)',
            borderRadius: '15px',
          }}>
            <Typography variant="h5" sx={{ color: '#FF6B9D', fontWeight: 'bold', mb: 2 }}>
              🎈 No tienes reservas por el momento
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              ¡Explora nuestros servicios y haz tu primera reserva!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: '25px',
                px: 4,
                py: 1.5,
              }}
            >
              Ver Servicios
            </Button>
          </Box>
        )}

        {!loading && !error && reservas.length > 0 && (
          <Paper elevation={3} sx={{ borderRadius: '15px', overflow: 'hidden' }}>
            <List>
              {reservas.map((reserva, index) => (
                <React.Fragment key={reserva.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      '&:hover': { background: 'rgba(255, 107, 157, 0.05)' }
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleDelete(reserva.id)}
                        sx={{ color: '#FF6348' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF6B9D' }}>
                            Reserva #{reserva.codigo_reserva}
                          </Typography>
                          <Chip 
                            label={reserva.estado} 
                            color={getEstadoColor(reserva.estado)}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            📍 {reserva.direccion_evento}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            📅 Evento: {new Date(reserva.fecha_evento).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#FFC74F', fontWeight: 'bold', mt: 1 }}>
                            💰 Total: ${reserva.total}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < reservas.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
        {error && <Alert severity="error">{error}</Alert>}
        </Container>
      </Box>
    </ThemeProvider>
    
  );
}

export default PaginaReservas;
