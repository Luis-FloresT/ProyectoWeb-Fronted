 import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getReservas, deleteReserva } from '../api';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Chip,
  IconButton,
  Paper,
  List,
  ListItem,
  Divider,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { theme } from '../theme/theme';
import PageContainer from '../components/layout/PageContainer';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

function PaginaReservas() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const clienteId = localStorage.getItem('cliente_id') || localStorage.getItem('id');

  useEffect(() => {
    fetchReservas();
  }, [location]); // Recargar cuando cambie la ubicación (navegación)

  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReservas();

      // Filtrar por cliente
      const misReservas = res.data.filter(r => {
        return String(r.cliente) === String(clienteId);
      });

      setReservas(misReservas);
    } catch (err) {
      console.error('Error cargando reservas:', err);
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
    switch (estado) {
      case 'APROBADA': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'ANULADA': return 'error';
      default: return 'default';
    }
  };

  const formatFechaEvento = (fecha) => {
    if (!fecha) return '—';
    // Forzamos el parseo como fecha local (YYYY, MM-1, DD) para evitar desfases de zona horaria
    const parts = String(fecha).split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString();
    }
    // Fallback si el formato no es YYYY-MM-DD
    const d = new Date(fecha);
    return isNaN(d.getTime()) ? String(fecha) : d.toLocaleDateString();
  };
  
  const getStats = () => {
    const totalCount = reservas.length;
    
    // Desglose por estados
    const aprobadas = reservas.filter(r => r.estado === 'APROBADA').length;
    const pendientes = reservas.filter(r => r.estado === 'PENDIENTE' || r.estado === 'REVISION').length;
    const anuladas = reservas.filter(r => r.estado === 'ANULADA').length;

    // Saldo Pendiente: Reservas no PAGADAS y no ANULADAS
    const pendientesDePago = reservas.filter(r => r.estado !== 'APROBADA' && r.estado !== 'ANULADA');
    const saldoPendiente = pendientesDePago.reduce((acc, r) => acc + parseFloat(r.total || 0), 0);
    const numPendientesPago = pendientesDePago.length;
    
    // Próxima Fiesta: Fecha más cercana (excluyendo ANULADA)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const proximas = reservas
      .filter(r => {
        if (r.estado === 'ANULADA') return false;
        const parts = r.fecha_evento.split('-');
        const dateObj = parts.length === 3 
          ? new Date(parts[0], parts[1] - 1, parts[2])
          : new Date(r.fecha_evento);
        return dateObj >= hoy;
      })
      .sort((a, b) => {
        const dA = a.fecha_evento.split('-');
        const dB = b.fecha_evento.split('-');
        return new Date(dA[0], dA[1]-1, dA[2]) - new Date(dB[0], dB[1]-1, dB[2]);
      });
    
    let proximaFiesta = { fecha: 'Sin eventos próximos', nombre: '' };
    if (proximas.length > 0) {
      // Parseo local de la próxima fiesta
      const parts = proximas[0].fecha_evento.split('-');
      const d = parts.length === 3 
        ? new Date(parts[0], parts[1] - 1, parts[2])
        : new Date(proximas[0].fecha_evento);

      const opciones = { day: 'numeric', month: 'short' };
      proximaFiesta = {
        fecha: d.toLocaleDateString('es-ES', opciones),
        nombre: proximas[0].direccion_evento || 'Ubicación por definir'
      };
    }

    return { 
      totalCount, aprobadas, pendientes, anuladas, 
      saldoPendiente, numPendientesPago,
      proximaFiesta 
    };
  };

  const stats = getStats();

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <BackButton />
          </Box>

          <Typography variant="h4" sx={{
            color: '#FF6B9D',
            fontWeight: 'bold',
            mb: 4,
            textAlign: 'center'
          }}>
            📅 Mis Reservas
          </Typography>

          {/* TARJETAS DE ESTADÍSTICAS INTELIGENTES */}
          {reservas.length > 0 && (
            <Grid container spacing={3} sx={{ mb: 6, justifyContent: 'center' }}>
              {/* Tarjeta 1: Total */}
              <Grid item xs={12} sm={4}>
                <Card sx={{ borderRadius: '25px', border: '1px solid #FFE3ED', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255, 107, 157, 0.1)', color: '#FF6B9D', mb: 1, width: 45, height: 45 }}>
                      <CelebrationIcon size="small" />
                    </Avatar>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#333' }}>{stats.totalCount}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#666', mb: 1.5 }}>Total Reservas</Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4CAF50' }} />
                        <Typography sx={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{stats.aprobadas}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FFB800' }} />
                        <Typography sx={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{stats.pendientes}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FF6348' }} />
                        <Typography sx={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{stats.anuladas}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Tarjeta 2: Saldo */}
              <Grid item xs={12} sm={4}>
                <Card sx={{ borderRadius: '25px', border: '1px solid #FFE3ED', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255, 184, 0, 0.1)', color: '#FFB800', mb: 1, width: 45, height: 45 }}>
                      <AccountBalanceWalletIcon size="small" />
                    </Avatar>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#333' }}>${stats.saldoPendiente.toFixed(2)}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#666' }}>Saldo Pendiente</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#888', mt: 1, fontWeight: 500 }}>
                      En {stats.numPendientesPago} reservas por pagar
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Tarjeta 3: Próxima Fiesta */}
              <Grid item xs={12} sm={4}>
                <Card sx={{ borderRadius: '25px', border: '1px solid #FFE3ED', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                    <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', mb: 1, width: 45, height: 45 }}>
                      <EventAvailableIcon size="small" />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#333', textAlign: 'center' }}>
                      {stats.proximaFiesta.fecha}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#666' }}>Tu Próxima Fiesta</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#888', mt: 1, fontWeight: 500, textAlign: 'center' }}>
                      {stats.proximaFiesta.nombre}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {!loading && !error && reservas.length === 0 && (
            <>
              <EmptyState
                icon="🎈"
                message="No tienes reservas por el momento"
                subtitle="¡Explora nuestros servicios y haz tu primera reserva!"
              />
              <Box sx={{ textAlign: 'center', mt: 3 }}>
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
            </>
          )}

          {!loading && !error && reservas.length > 0 && (
            <Paper elevation={3} sx={{ borderRadius: '15px', overflow: 'hidden' }}>
              <List>
                {Array.isArray(reservas) && reservas.map((reserva, index) => (
                  <React.Fragment key={reserva.id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        '&:hover': { background: 'rgba(255, 107, 157, 0.05)' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, width: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF6B9D' }}>
                          Reserva #{reserva.codigo_reserva}
                        </Typography>
                        <Chip
                          label={reserva.estado}
                          color={getEstadoColor(reserva.estado)}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                        <Box sx={{ flex: 1 }} />
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(reserva.id)}
                          sx={{ color: '#FF6348' }}
                          aria-label="Eliminar"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body2" color="textSecondary">
                          📍 {reserva.direccion_evento}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          📅 Evento: {formatFechaEvento(reserva.fecha_evento)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFC74F', fontWeight: 'bold', mt: 1 }}>
                          💰 Total: ${reserva.total}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/confirmacion-pago/${reserva.id}`)}
                          sx={{ mt: 2, borderColor: '#FF6B9D', color: '#FF6B9D', borderRadius: '20px', textTransform: 'none', fontWeight: 600 }}
                        >
                          Ver Detalle / Gestionar Pago
                        </Button>
                      </Box>
                    </ListItem>
                    {index < reservas.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}

          {loading && <LoadingSpinner message="Cargando reservas..." />}
          {error && <Alert severity="error">{error}</Alert>}
        </Container>
      </PageContainer>
    </ThemeProvider>

  );
}

export default PaginaReservas;
