import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import { getCarrito, deleteItemCarrito, confirmarCarrito } from '../apiService';

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

function PaginaCarrito() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [fechaReserva, setFechaReserva] = useState('');
  const [direccion, setDireccion] = useState('');

  useEffect(() => {
    fetchCarrito();
  }, []);

  const fetchCarrito = async () => {
    try {
      // TODO: Los compañeros deben implementar GET /api/carrito/ en backend
      const res = await getCarrito();
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      setError('Error cargando carrito. Endpoint aún no implementado en backend.');
      setLoading(false);
      // Mock data para desarrollo
      setItems([
        {
          id: 1,
          servicio: { id: 1, nombre: 'Picnic Infantil', precio_base: 180 },
          tipo: 'servicio',
          cantidad: 1,
        }
      ]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este item del carrito?')) return;
    try {
      // TODO: Los compañeros deben implementar DELETE /api/carrito/{id}/ en backend
      await deleteItemCarrito(id);
      fetchCarrito();
    } catch (err) {
      alert('Error eliminando item');
    }
  };

  const calcularTotal = () => {
    return items.reduce((total, item) => {
      const precio = item.servicio?.precio_base || 
                     item.combo?.precio_combo || 
                     item.promocion?.descuento_monto || 0;
      return total + (precio * (item.cantidad || 1));
    }, 0);
  };

  const handleConfirmar = async () => {
    if (!fechaReserva || !direccion) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      // TODO: Los compañeros deben implementar POST /api/carrito/confirmar/ en backend
      await confirmarCarrito({
        fecha_evento: fechaReserva,
        direccion_evento: direccion,
      });
      alert('¡Reserva confirmada exitosamente!');
      navigate('/reservas');
    } catch (err) {
      alert('Error confirmando reserva. Endpoint no implementado.');
    }
  };

  const getNombreItem = (item) => {
    return item.servicio?.nombre || 
           item.combo?.nombre || 
           item.promocion?.nombre || 
           'Item';
  };

  const getPrecioItem = (item) => {
    return item.servicio?.precio_base || 
           item.combo?.precio_combo || 
           item.promocion?.descuento_monto || 0;
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
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => navigate('/')} sx={{ color: '#FF6B9D' }}>
                <ArrowBackIcon fontSize="large" />
              </IconButton>
              <Typography variant="h3" sx={{
                color: '#FF6B9D',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <ShoppingCartIcon fontSize="large" />
                Mi Carrito
              </Typography>
            </Box>
            {items.length > 0 && (
              <Chip 
                label={`${items.length} ${items.length === 1 ? 'item' : 'items'}`}
                color="primary"
                sx={{ fontSize: '1rem', fontWeight: 'bold' }}
              />
            )}
          </Box>

          {error && <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>}

          {items.length === 0 ? (
            <Box sx={{
              textAlign: 'center',
              py: 10,
            }}>
              <ShoppingCartIcon sx={{ fontSize: 100, color: '#ccc', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
                Tu carrito está vacío
              </Typography>
              <Typography variant="body1" sx={{ color: '#999', mb: 4 }}>
                Agrega servicios, combos o promociones para empezar
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                }}
              >
                Ver Servicios
              </Button>
            </Box>
          ) : (
            <Box>
              {/* Lista de items */}
              {items.map((item) => (
                <Card key={item.id} sx={{
                  mb: 2,
                  borderRadius: '15px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF6B9D', mb: 1 }}>
                          {getNombreItem(item)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          Tipo: {item.tipo || 'Servicio'}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#FFC74F', fontWeight: 'bold' }}>
                          ${getPrecioItem(item).toFixed(2)}
                        </Typography>
                      </Box>
                      <IconButton 
                        onClick={() => handleDelete(item.id)}
                        sx={{ color: '#FF6348' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}

              <Divider sx={{ my: 3 }} />

              {/* Total */}
              <Box sx={{ 
                background: 'linear-gradient(135deg, #FFE6F0 0%, #FFF9E6 100%)',
                borderRadius: '15px',
                p: 3,
                mb: 3,
              }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FF6B9D', mb: 2 }}>
                  Resumen del Carrito
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6">Total de items:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{items.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FFC74F' }}>
                    ${calcularTotal().toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Botón confirmar */}
              <Button
                fullWidth
                variant="contained"
                startIcon={<EventIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  py: 2,
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(255, 107, 157, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FF8C94 0%, #FF6B9D 100%)',
                  },
                }}
              >
                Confirmar Reserva
              </Button>
            </Box>
          )}

          {/* Dialog para confirmar */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', color: '#FF6B9D' }}>
              Confirmar Reserva
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                Completa los datos para apartar tu reserva
              </Typography>
              <TextField
                fullWidth
                label="Fecha del Evento"
                type="date"
                value={fechaReserva}
                onChange={(e) => setFechaReserva(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Dirección del Evento"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                multiline
                rows={3}
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmar}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
                }}
              >
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default PaginaCarrito;
