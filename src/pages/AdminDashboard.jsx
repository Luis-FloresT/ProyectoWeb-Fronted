import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Label,
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme/theme';
import PageContainer from '../components/layout/PageContainer';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAdminStats, patchReserva, verificarTransaccion } from '../api';

// Icons
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TodayIcon from '@mui/icons-material/Today';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  RotateRight as RotateIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  IconButton, Tooltip as MuiTooltip, Chip
} from '@mui/material';

const COLORS = ['#FF6B9D', '#FFC74F', '#4CAF50', '#FF8C94', '#64B5F6'];

const formatUSD = (val) => new Intl.NumberFormat('en-US', { 
  style: 'currency', 
  currency: 'USD' 
}).format(val);

const CHART_MIN_HEIGHT = 420;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPendientesModal, setOpenPendientesModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [currentTxId, setCurrentTxId] = useState('');
  
  // NUEVOS ESTADOS PRO
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showMotivoField, setShowMotivoField] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [txIdExists, setTxIdExists] = useState(false);
  const [checkingTxId, setCheckingTxId] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getAdminStats();
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      if (err.response?.status === 403) {
        setError('Acceso denegado: No tienes permisos de administrador.');
      } else {
        setError('Ocurrió un error al cargar los datos del servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenValidation = (reserva) => {
    setSelectedReserva(reserva);
    setCurrentTxId(reserva.id_transaccion_bancaria || '');
    setRotation(0);
    setZoom(1);
    setShowMotivoField(false);
    setMotivoRechazo('');
    setTxIdExists(false);
    setShowValidationModal(true);
  };

  useEffect(() => {
    if (!currentTxId || currentTxId.length < 3) {
      setTxIdExists(false);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingTxId(true);
      try {
        const { data } = await verificarTransaccion(currentTxId);
        setTxIdExists(data.exists);
      } catch (err) {
        console.error("Error verificando ID:", err);
      } finally {
        setCheckingTxId(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [currentTxId]);

  const handleUpdateStatus = async (id, newStatus, txIdParam = null, motivo = null) => {
    setUpdating(true);
    setError(null);
    try {
      const payload = { estado: newStatus };
      if (txIdParam) payload.id_transaccion_bancaria = txIdParam;
      if (motivo) payload.motivo_rechazo = motivo;

      await patchReserva(id, payload);
      
      await fetchStats();
      setShowValidationModal(false);
      setOpenPendientesModal(false);
    } catch (err) {
      setError(`Error al actualizar estado: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw', 
      height: '100vh', 
      zIndex: 9999,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFF0F5 0%, #E3F2FD 100%)' 
    }}>
      <Paper elevation={0} sx={{ 
        p: 5, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        maxWidth: 400
      }}>
        <Avatar sx={{ 
          width: 80, 
          height: 80, 
          bgcolor: 'rgba(255, 107, 157, 0.1)', 
          color: '#FF6B9D', 
          mb: 3,
          boxShadow: '0 4px 12px rgba(255, 107, 157, 0.2)'
        }}>
          <AutoAwesomeIcon sx={{ fontSize: 40 }} /> 
        </Avatar>
        <CircularProgress size={40} thickness={4} sx={{ color: '#FF6B9D', mb: 3 }} />
        <Typography variant="h5" sx={{ color: '#333', fontWeight: '800', mb: 1 }}>
          Panel de Control
        </Typography>
        <Typography variant="body2" sx={{ color: '#888', textAlign: 'center' }}>
          Procesando métricas y estadísticas...
        </Typography>
      </Paper>
    </Box>
  );
  if (error) return (
    <PageContainer>
      <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>
    </PageContainer>
  );

  const { indicators, grafico_ingresos, servicios_populares, mapa_calor, proximos_eventos, actividad_reciente, eventos_mapa, sugerencia_ia, reservas_pendientes_detalle, indicadores } = stats;

  // El backend a veces envía 'indicators' o 'indicadores' según la versión, normalizamos:
  const activeIndicadores = indicadores || stats.indicators;

  const maxReservas = Math.max(...mapa_calor.map(d => d.reservas), 1);
  const hasPopulares = servicios_populares.length > 0;
  const hasIngresos = grafico_ingresos.length > 0;

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ color: '#FF6B9D', fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            📊 Dashboard Administrativo
          </Typography>

          {/* INDICADORES RÁPIDOS */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <StatCard 
              title="Ingresos Totales" 
              value={formatUSD(activeIndicadores.total_ingresos)} 
              icon={<MonetizationOnIcon />} 
              color="#4CAF50" 
              subtitle={
                <Typography variant="caption" sx={{ color: activeIndicadores.porcentaje_comparativa >= 0 ? '#4CAF50' : '#FF6348', fontWeight: 'bold' }}>
                  {activeIndicadores.porcentaje_comparativa >= 0 ? '+' : ''}{activeIndicadores.porcentaje_comparativa}% vs mes anterior
                </Typography>
              }
            />
            <StatCard 
              title="Utilidad Neta" 
              value={formatUSD(activeIndicadores.utilidad_neta)} 
              icon={<MonetizationOnIcon />} 
              color="#64B5F6" 
              subtitle={
                <Typography variant="caption" sx={{ color: '#888' }}>
                  Ingresos - Gastos: {formatUSD(activeIndicadores.total_gastos)}
                </Typography>
              }
              highlight
            />
            <StatCard 
              title="Reservas Pendientes" 
              value={activeIndicadores.reservas_pendientes} 
              icon={<PendingActionsIcon />} 
              color="#FFC74F" 
              onClick={() => setOpenPendientesModal(true)}
              clickable
            />
            <StatCard 
              title="Ingresos Hoy" 
              value={formatUSD(activeIndicadores.ingresos_hoy)} 
              icon={<TodayIcon />} 
              color="#FF6B9D" 
            />
            <StatCard 
              title="Cancelaciones (30d)" 
              value={activeIndicadores.cancelaciones_recientes} 
              icon={<CancelIcon />} 
              color="#FF6348" 
            />
          </Grid>

          {/* SUGERENCIA INTELIGENTE IA */}
          <Paper 
            sx={{ 
              mb: 4, 
              p: 3, 
              borderRadius: '20px', 
              background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
              borderLeft: '10px solid #FFC74F',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
              <AutoAwesomeIcon sx={{ fontSize: 120, color: '#FFC74F' }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#FFC74F', mr: 2 }}>
                <LightbulbIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5D4037' }}>
                  {sugerencia_ia?.titulo || 'Sugerencia de Crecimiento'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#795548', mt: 0.5 }}>
                  {sugerencia_ia?.mensaje}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={4}>
            {/* GRÁFICO DE INGRESOS */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', minHeight: CHART_MIN_HEIGHT }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#666' }}>
                  Tendencia de Ingresos
                </Typography>
                <Box sx={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {hasIngresos ? (
                    <ResponsiveContainer>
                      <LineChart data={grafico_ingresos}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="monto" 
                          stroke="#FF6B9D" 
                          strokeWidth={4} 
                          dot={{ r: 6, fill: '#FF6B9D', strokeWidth: 0 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic' }}>
                      Aún no hay suficientes datos para mostrar la tendencia
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* PRODUCTOS POPULARES */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', minHeight: CHART_MIN_HEIGHT, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#666' }}>
                  Servicios Estrella
                </Typography>
                <Box sx={{ width: '100%', height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {hasPopulares ? (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={servicios_populares}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {servicios_populares.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                          <Label 
                            value={servicios_populares.reduce((acc, curr) => acc + curr.value, 0)} 
                            position="center" 
                            style={{ fontSize: '24px', fontWeight: 'bold', fill: '#333' }}
                          />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center' }}>
                      Sin datos de ventas aún
                    </Typography>
                  )}
                </Box>
                <Box sx={{ mt: 2 }}>
                  {servicios_populares.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length], mr: 1 }} />
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                        {item.name} ({item.value})
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* MAPA DE CALOR SEMANAL */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', minHeight: CHART_MIN_HEIGHT }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#666' }}>
                  Demanda por Día de la Semana
                </Typography>
                <Box sx={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    <BarChart data={mapa_calor}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                      <XAxis dataKey="dia" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`${value} reservas`, 'Cantidad']}
                      />
                      <Bar 
                        dataKey="reservas" 
                        radius={[10, 10, 0, 0]} 
                        barSize={40}
                      >
                        {mapa_calor.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.reservas === maxReservas && entry.reservas > 0 ? '#4CAF50' : '#FFC74F'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* PRÓXIMOS EVENTOS */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', minHeight: CHART_MIN_HEIGHT }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#666' }}>
                  🗓️ Próximos Eventos
                </Typography>
                {proximos_eventos.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', color: '#999' }}>Cliente</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#999' }}>Fecha</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#999' }}>Evento</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {proximos_eventos.map((evento) => (
                          <TableRow key={evento.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/reservas`)}>
                            <TableCell sx={{ fontWeight: 600 }}>{evento.cliente}</TableCell>
                            <TableCell>{evento.fecha}</TableCell>
                            <TableCell>
                              <Box sx={{ bgcolor: 'rgba(78, 205, 196, 0.1)', color: '#4ECDC4', px: 1, py: 0.5, borderRadius: '10px', display: 'inline-block', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                {evento.evento}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic' }}>
                      No hay eventos confirmados próximamente
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* MAPA DE UBICACIÓN */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#666' }}>
                  📍 Ubicación de Eventos de la Semana
                </Typography>
                <Box sx={{ height: 400, width: '100%', borderRadius: '15px', overflow: 'hidden' }}>
                  <MapContainer center={[-0.1807, -78.4678]} zoom={12} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {eventos_mapa.filter(ev => ev.lat && ev.lng).map(ev => (
                      <Marker key={ev.id} position={[ev.lat, ev.lng]}>
                        <Popup>
                          <Box sx={{ p: 1, minWidth: 180 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#FF6B9D', mb: 0.5 }}>
                              {ev.cliente}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                              🎉 {ev.evento}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1 }}>
                              🕒 {ev.fecha} - {ev.hora}
                            </Typography>
                            {/* Buscar reserva en pendientes para mostrar botón Ver Pago */}
                            {reservas_pendientes_detalle?.find(r => r.id === ev.id) && (
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => handleOpenValidation(reservas_pendientes_detalle.find(r => r.id === ev.id))}
                                sx={{ 
                                  mt: 1,
                                  width: '100%',
                                  borderRadius: '10px', 
                                  bgcolor: '#64B5F6', 
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  textTransform: 'none',
                                  '&:hover': { bgcolor: '#42a5f5' } 
                                }}
                              >
                                Ver Pago
                              </Button>
                            )}
                          </Box>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </Box>
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#aaa', fontStyle: 'italic' }}>
                  * Se muestran los eventos con coordenadas registradas. Los marcadores de reservas pendientes incluyen botón "Ver Pago".
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* ACTIVIDAD RECIENTE (AUDITORÍA) */}
          <Paper sx={{ mt: 4, p: 3, borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#666' }}>
              🕵️ Actividad Reciente del Equipo
            </Typography>
            {actividad_reciente && actividad_reciente.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: '#999' }}>Fecha/Hora</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#999' }}>Usuario</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#999' }}>Acción</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#999' }}>Mensaje</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {actividad_reciente.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell sx={{ color: '#888', whiteSpace: 'nowrap' }}>{log.fecha}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: '#FF6B9D', mr: 1 }}>
                              {log.usuario.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{log.usuario}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ 
                            bgcolor: log.accion.includes('Estado') ? 'rgba(255, 199, 79, 0.1)' : 'rgba(100, 181, 246, 0.1)', 
                            color: log.accion.includes('Estado') ? '#FFC74F' : '#64B5F6', 
                            px: 1, py: 0.5, borderRadius: '5px', display: 'inline-block', fontSize: '0.7rem', fontWeight: 'bold' 
                           }}>
                            {log.accion}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: '#666', fontSize: '0.85rem' }}>{log.mensaje}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic' }}>
                  Aún no hay registros de actividad administrativa
                </Typography>
              </Box>
            )}
          </Paper>

          {/* MODAL DE RESERVAS PENDIENTES */}
          <Dialog 
            open={openPendientesModal} 
            onClose={() => setOpenPendientesModal(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: '20px' } }}
          >
            <DialogTitle sx={{ fontWeight: 'bold', color: '#FF6B9D' }}>
              ⏳ Reservas Pendientes de Aprobación
            </DialogTitle>
            <DialogContent dividers>
              {reservas_pendientes_detalle?.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Evento</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Comprobante</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reservas_pendientes_detalle.map((reserva) => (
                        <TableRow key={reserva.id}>
                          <TableCell sx={{ minWidth: 150, fontWeight: 600 }}>{reserva.cliente}</TableCell>
                          <TableCell>{reserva.fecha}</TableCell>
                          <TableCell>{reserva.evento}</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>{formatUSD(reserva.total)}</TableCell>
                          <TableCell>
                            {reserva.comprobante ? (
                              <MuiTooltip title="Validar Pago">
                                <Button 
                                  variant="contained" 
                                  size="small" 
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => handleOpenValidation(reserva)}
                                  sx={{ borderRadius: '10px', bgcolor: '#64B5F6', '&:hover': { bgcolor: '#42a5f5' } }}
                                >
                                  Validar
                                </Button>
                              </MuiTooltip>
                            ) : (
                              <Chip label="Sin comprobante" size="small" variant="outlined" />
                            )}
                          </TableCell>
                          <TableCell>
                            <MuiTooltip title="Rechazar directamente">
                              <IconButton 
                                color="error" 
                                disabled={updating}
                                onClick={() => handleUpdateStatus(reserva.id, 'RECHAZADA')}
                              >
                                <CancelIcon />
                              </IconButton>
                            </MuiTooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ color: '#888', fontStyle: 'italic' }}>
                    No hay reservas pendientes en este momento.
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenPendientesModal(false)} variant="outlined" sx={{ borderRadius: '10px' }}>
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>

          {/* INTERFAZ DE VALIDACIÓN DUAL */}
          <Dialog 
            open={showValidationModal} 
            onClose={() => setShowValidationModal(false)}
            maxWidth={false}
            PaperProps={{ sx: { borderRadius: '24px', width: '900px', maxWidth: '90vw', overflow: 'hidden' } }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff', borderBottom: '1px solid #f0f0f0', p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2d3436', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon sx={{ color: '#4CAF50' }} /> Verificación de Pago
              </Typography>
              <IconButton onClick={() => setShowValidationModal(false)} sx={{ color: '#b2bec3' }}>
                <CancelIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                  <Box sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                gap: '20px', 
                p: 2,
                bgcolor: '#f5f6fa',
                minHeight: '600px'
              }}>
                {/* LADO IZQUIERDO: EVIDENCIA (Visor Pro) */}
                <Box sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 1
                }}>
                  <Box sx={{ 
                    flex: 1,
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    bgcolor: '#1e272e', 
                    borderRadius: '16px',
                    overflow: 'hidden',
                    maxHeight: '70vh',
                    position: 'relative',
                    boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
                  }}>
                    {selectedReserva?.comprobante ? (
                      <img 
                        src={selectedReserva.comprobante} 
                        alt="Comprobante Bancario" 
                        style={{ 
                          maxWidth: '90%', 
                          maxHeight: '90%', 
                          objectFit: 'contain',
                          transform: `rotate(${rotation}deg) scale(${zoom})`,
                          transition: 'transform 0.3s ease'
                        }} 
                      />
                    ) : (
                      <Typography sx={{ color: '#999' }}>Sin imagen adjunta</Typography>
                    )}
                  </Box>
                  
                  {/* CONTROLES VISOR */}
                  <Paper variant="outlined" sx={{ p: 1, display: 'flex', justifyContent: 'center', gap: 2, borderRadius: '12px', bgcolor: '#fff' }}>
                    <MuiTooltip title="Rotar 90°">
                      <IconButton onClick={() => setRotation((prev) => (prev + 90) % 360)} color="primary">
                        <RotateIcon />
                      </IconButton>
                    </MuiTooltip>
                    <Divider orientation="vertical" flexItem />
                    <MuiTooltip title="Alejar">
                      <IconButton onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.2))} disabled={zoom <= 0.5}>
                        <ZoomOutIcon />
                      </IconButton>
                    </MuiTooltip>
                    <Typography sx={{ alignSelf: 'center', fontWeight: 'bold' }}>{Math.round(zoom * 100)}%</Typography>
                    <MuiTooltip title="Acercar">
                      <IconButton onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))} disabled={zoom >= 3}>
                        <ZoomInIcon />
                      </IconButton>
                    </MuiTooltip>
                  </Paper>
                </Box>

                {/* LADO DERECHO: VALIDACIÓN & RECHAZO */}
                <Box sx={{ 
                  width: '400px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 2,
                  bgcolor: '#fff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                  <Typography variant="overline" sx={{ color: '#636e72', fontWeight: 700, letterSpacing: 1.2 }}>
                    Panel de Validación
                  </Typography>
                  <Box sx={{ mb: 3, mt: 1, p: 2, borderRadius: '16px', border: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
                    <Typography variant="caption" sx={{ color: '#b2bec3', fontWeight: 600 }}>CLIENTE</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#2d3436', mb: 1 }}>
                      {selectedReserva?.cliente}
                    </Typography>
                    <Divider sx={{ mb: 1.5, opacity: 0.5 }} />
                    <Typography variant="caption" sx={{ color: '#b2bec3', fontWeight: 600 }}>MONTO TOTAL</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#4CAF50' }}>
                      {formatUSD(selectedReserva?.total || 0)}
                    </Typography>
                  </Box>

                  {/* ALERTA DE SEGURIDAD */}
                  {txIdExists && (
                    <Alert 
                      severity="warning" 
                      icon={<WarningIcon />}
                      sx={{ mb: 2, borderRadius: '12px', bgcolor: '#fff3e0' }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        ⚠️ POSIBLE FRAUDE: Este ID de transacción ya fue utilizado en otra reserva.
                      </Typography>
                    </Alert>
                  )}

                  <Typography variant="subtitle2" sx={{ color: '#2d3436', mb: 1, fontWeight: 700 }}>
                    ID de Transacción Bancaria
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Ingrese número de comprobante..."
                    value={currentTxId}
                    onChange={(e) => setCurrentTxId(e.target.value)}
                    variant="outlined"
                    required
                    autoFocus
                    error={txIdExists}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: '#fff'
                      }
                    }}
                  />
                  {/* FLUJO DE RECHAZO */}
                  {showMotivoField ? (
                    <Box sx={{ mb: 3, p: 2, borderRadius: '12px', border: '2px dashed #ff7675', bgcolor: '#fff5f5' }}>
                      <Typography variant="caption" sx={{ color: '#d63031', fontWeight: 800 }}>MOTIVO DEL RECHAZO</Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Ej: Monto incompleto, imagen borrosa..."
                        value={motivoRechazo}
                        onChange={(e) => setMotivoRechazo(e.target.value)}
                        variant="standard"
                        sx={{ mt: 1 }}
                      />
                      {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                          {error}
                        </Alert>
                      )}
                      
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button 
                          fullWidth 
                          variant="contained" 
                          color="error"
                          disabled={!motivoRechazo || updating}
                          onClick={() => handleUpdateStatus(selectedReserva.id, 'RECHAZADA', currentTxId, motivoRechazo)}
                        >
                          {updating ? 'Procesando...' : 'Confirmar Rechazo'}
                        </Button>
                        <Button 
                          onClick={() => setShowMotivoField(false)}
                          variant="outlined"
                          disabled={updating}
                        >
                          Cancelar
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={updating || !currentTxId || txIdExists}
                        onClick={() => handleUpdateStatus(selectedReserva?.id, 'APROBADA', currentTxId)}
                        sx={{ 
                          borderRadius: '12px', 
                          py: 2, 
                          bgcolor: '#4CAF50',
                          fontSize: '1rem',
                          fontWeight: 800,
                          textTransform: 'none',
                          boxShadow: '0 6px 20px rgba(76, 175, 80, 0.3)',
                          '&:hover': { bgcolor: '#43a047' }
                        }}
                      >
                        {updating ? 'Procesando...' : 'Aprobar Reserva'}
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        disabled={updating}
                        onClick={() => setShowMotivoField(true)}
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                      >
                        Rechazar Pago
                      </Button>
                    </Box>
                  )}

                  {!showMotivoField && (
                    <Typography variant="caption" sx={{ color: '#b2bec3', mt: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LightbulbIcon sx={{ fontSize: 14 }} /> Verifique los datos bancarios antes de aprobar.
                    </Typography>
                  )}
                </Box>
              </Box>
            </DialogContent>
          </Dialog>

        </Container>
      </PageContainer>
    </ThemeProvider>
  );
}

function StatCard({ title, value, icon, color, subtitle, onClick, clickable, highlight }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card 
        onClick={onClick}
        sx={{ 
          borderRadius: '20px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
          height: '100%',
          cursor: clickable ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: clickable ? 'translateY(-5px)' : 'none',
            boxShadow: clickable ? '0 12px 30px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.05)'
          }
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
          <Avatar sx={{ bgcolor: `${color}20`, color: color, mr: 2, width: 56, height: 56 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ color: highlight ? color : '#888', fontWeight: 600 }}>{title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>{value}</Typography>
            {subtitle && <Box sx={{ mt: 0.5 }}>{subtitle}</Box>}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
