import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createReserva, getServicios, getHorariosDisponibles } from '../apiService';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

function CrearReservaForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const servicioParam = searchParams.get('servicio');
  
  const [servicios, setServicios] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  
  const [servicioId, setServicioId] = useState(servicioParam || '');
  const [horarioId, setHorarioId] = useState('');
  const [codigoReserva, setCodigoReserva] = useState('');
  const [fechaEvento, setFechaEvento] = useState('');
  const [direccion, setDireccion] = useState('');
  const [total, setTotal] = useState('');
  
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('id');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const servRes = await getServicios();
      setServicios(servRes.data);
      setLoading(false);
    } catch (err) {
      setError('Error cargando servicios');
      setLoading(false);
    }
  };

  const fetchHorariosDisponibles = async (fecha) => {
    if (!fecha) return;
    setCargandoHorarios(true);
    try {
      const res = await getHorariosDisponibles(fecha);
      setHorariosDisponibles(res.data);
      setHorarioId(''); // Limpiar selección anterior
    } catch (err) {
      setError('Error cargando horarios disponibles');
      setHorariosDisponibles([]);
    } finally {
      setCargandoHorarios(false);
    }
  };

  const handleFechaChange = (e) => {
    const fecha = e.target.value;
    setFechaEvento(fecha);
    fetchHorariosDisponibles(fecha);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    // Validar campos requeridos
    if (!servicioId || !horarioId || !fechaEvento || !direccion) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    // Obtener horario seleccionado para saber hora de inicio
    const horarioSeleccionado = horariosDisponibles.find(h => h.id == horarioId);
    if (!horarioSeleccionado) {
      setError('Horario seleccionado no válido');
      return;
    }

    // Generar código de reserva
    const codigo = `RES-${Date.now()}`;

    const reservaData = {
      cliente: userId,
      horario: horarioId,
      codigo_reserva: codigo,
      fecha_evento: fechaEvento,
      fecha_inicio: horarioSeleccionado.hora_inicio,
      direccion_evento: direccion,
      total: parseFloat(total) || 0,
      estado: 'PENDIENTE',
    };

    try {
      await createReserva(reservaData);
      setMensaje('¡Reserva creada exitosamente!');
      setTimeout(() => navigate('/reservas'), 2000);
    } catch (err) {
      setError('Error al crear reserva: ' + (err.response?.data?.error || err.message));
    }
  };

  const servicioSeleccionado = servicios.find(s => s.id == servicioId);

  useEffect(() => {
    if (servicioSeleccionado) {
      setTotal(servicioSeleccionado.precio_base);
    }
  }, [servicioSeleccionado]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(180deg, #fff9e6 0%, #ffe6f0 100%)",
        py: 4,
        overflow: "auto",
      }}>
        <Container maxWidth="md">
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: '#FF6B9D' }}>
              <ArrowBackIcon fontSize="large" />
            </IconButton>
            <Typography variant="h3" sx={{
              color: '#FF6B9D',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}>
              🎯 Nueva Reserva
            </Typography>
          </Box>

          {mensaje && <Alert severity="success" sx={{ mb: 3 }}>{mensaje}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Card sx={{
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Servicio</InputLabel>
                      <Select
                        value={servicioId}
                        label="Servicio"
                        onChange={(e) => setServicioId(e.target.value)}
                      >
                        <MenuItem value=""><em>Seleccione un servicio</em></MenuItem>
                        {servicios.map(s => (
                          <MenuItem key={s.id} value={s.id}>
                            {s.nombre} - ${s.precio_base}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Código de Reserva (opcional)"
                      value={codigoReserva}
                      onChange={(e) => setCodigoReserva(e.target.value)}
                      fullWidth
                      helperText="Se generará automáticamente si lo dejas vacío"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Fecha del Evento"
                      type="date"
                      value={fechaEvento}
                      onChange={handleFechaChange}
                      required
                      fullWidth
                      inputProps={{
                        min: new Date().toISOString().split('T')[0]
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required disabled={!fechaEvento || cargandoHorarios}>
                      <InputLabel>Seleccionar Horario</InputLabel>
                      <Select
                        value={horarioId}
                        label="Seleccionar Horario"
                        onChange={(e) => setHorarioId(e.target.value)}
                      >
                        <MenuItem value="">
                          {cargandoHorarios ? 'Cargando horarios...' : 'Selecciona primero una fecha'}
                        </MenuItem>
                        {horariosDisponibles.map(h => (
                          <MenuItem key={h.id} value={h.id}>
                            {h.hora_inicio} - {h.hora_fin}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {fechaEvento && horariosDisponibles.length === 0 && !cargandoHorarios && (
                      <Typography variant="caption" sx={{ color: '#FF6348', display: 'block', mt: 1 }}>
                        ⚠️ No hay horarios disponibles para esta fecha
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Dirección del Evento"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      required
                      fullWidth
                      multiline
                      rows={2}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Total ($)"
                      type="number"
                      value={total}
                      onChange={(e) => setTotal(e.target.value)}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
                      color: '#fff',
                      fontWeight: 'bold',
                      borderRadius: '15px',
                      py: 1.5,
                      fontSize: '16px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF8C94 0%, #FF6B9D 100%)',
                      },
                    }}
                  >
                    ✅ Confirmar Reserva
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: '#FFC74F',
                      color: '#FFC74F',
                      fontWeight: 'bold',
                      borderRadius: '15px',
                      py: 1.5,
                      minWidth: '120px',
                    }}
                    onClick={() => navigate('/reservas')}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default CrearReservaForm;
