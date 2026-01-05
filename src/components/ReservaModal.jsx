import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import CloseIcon from '@mui/icons-material/Close';
import LocationPicker from './LocationPicker';

export default function ReservaModal({
  open,
  onClose,
  item,
  cartItems, // Nueva prop
  tipo,
  onReservaCreada
}) {
  const navigate = useNavigate();

  // ============ ESTADOS DE FORMULARIO ============
  const [fechaEvento, setFechaEvento] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
  const [direccion, setDireccion] = useState('');
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [metodoPago, setMetodoPago] = useState('transferencia');

  // ============ ESTADOS DE CONTROL ============
  const [loading, setLoading] = useState(false);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [error, setError] = useState(null);

  // ============ TODOS LOS HOOKS PRIMERO ============
  // ============ LIMPIAR CUANDO ABRE/CIERRA ============
  useEffect(() => {
    if (open) {
      setFechaEvento(null);
      setHorarioSeleccionado('');
      setDireccion('');
      setLatitud(null);
      setLongitud(null);
      setMetodoPago('transferencia');
      setHorarios([]);
      setError(null);
      setCargandoHorarios(false);
      setLoading(false);
    }
  }, [open]);

  // ============ CARGAR HORARIOS CUANDO CAMBIA FECHA ============
  useEffect(() => {
    if (!fechaEvento) {
      setHorarios([]);
      setHorarioSeleccionado('');
      setError(null);
      return;
    }

    setHorarioSeleccionado('');

    const cargarHorarios = async () => {
      setCargandoHorarios(true);
      setError(null);
      try {
        const { getHorariosDisponibles } = await import('../api/reservas');
        const fechaFormateada = fechaEvento.toISOString().split('T')[0];
        const res = await getHorariosDisponibles(fechaFormateada);

        if (res.data && res.data.length > 0) {
          setHorarios(res.data);
        } else {
          setHorarios([]);
          setError('No hay horarios disponibles para esta fecha. Intenta con otra.');
        }
      } catch (err) {
        console.error('Error cargando horarios:', err);
        setError('Error al cargar los horarios disponibles');
        setHorarios([]);
      } finally {
        setCargandoHorarios(false);
      }
    };

    cargarHorarios();
  }, [fechaEvento]);

  // ============ FUNCIONES ============
  // ============ CERRAR MODAL Y LIMPIAR ============
  const handleClose = () => {
    setFechaEvento(null);
    setHorarioSeleccionado('');
    setDireccion('');
    setLatitud(null);
    setLongitud(null);
    setMetodoPago('transferencia');
    setHorarios([]);
    setError(null);
    setLoading(false);
    setCargandoHorarios(false);
    onClose();
  };

  // ============ VALIDAR FORMULARIO ============
  const validarFormulario = () => {
    if (!fechaEvento) {
      setError('Selecciona una fecha para el evento');
      return false;
    }
    if (!horarioSeleccionado) {
      setError('Selecciona un horario disponible');
      return false;
    }
    if (!latitud || !longitud) {
      setError('Debes seleccionar una ubicación en el mapa');
      return false;
    }
    if (!direccion.trim()) {
      setError('Ingresa la dirección del evento');
      return false;
    }
    return true;
  };

  // ============ CALCULAR PRECIO ============
  const getPrecio = () => {
    if (!item) return 0;
    if (tipo === 'servicio') return item.precio_base;
    if (tipo === 'combo') return item.precio_combo || item.precio_total;
    if (tipo === 'promocion') return item.descuento_monto;
    return 0;
  };

  // ============ SI NO ESTÁ OPEN, NO RENDERIZAR NADA ============
  if (!open) return null;

  // ============ SUBMIT DEL FORMULARIO ============
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { createReserva } = await import('../api/reservas');
      const { checkoutPago } = await import('../api/reservas'); // Importar checkout explícitamente

      const fechaFormateada = fechaEvento.toISOString().split('T')[0];

      // Construcción del Payload con 'detalles'
      const payload = {
        fecha_evento: fechaFormateada,
        direccion_evento: direccion,
        latitud: latitud,
        longitud: longitud,
        horario: parseInt(horarioSeleccionado),
        estado: 'PENDIENTE',
        detalles: []
      };

      // Lógica de mapeo a Detalles (adaptada al Serializador)
      if (tipo === 'servicio' && item.id !== 'carrito') {
        const precio = item.precio_base || 0;
        payload.detalles.push({
          tipo: 'S',
          servicio: item.id,
          cantidad: 1,
          precio_unitario: precio,
          subtotal: precio
        });
        payload.total = precio;
      } else if (tipo === 'combo') {
        const precio = item.precio_combo || item.precio_total || 0;
        payload.detalles.push({
          tipo: 'C',
          combo: item.id,
          cantidad: 1,
          precio_unitario: precio,
          subtotal: precio
        });
        payload.total = precio;
      } else if (tipo === 'promocion') {
        const precio = item.descuento_monto || 0;
        payload.detalles.push({
          tipo: 'P',
          promocion: item.id,
          cantidad: 1,
          precio_unitario: precio,
          subtotal: precio
        });
        payload.total = precio;
      } else if (item.id === 'carrito') {
        // Lógica para el carrito completo
        if (cartItems && cartItems.length > 0) {
          payload.detalles = cartItems.map(cartItem => ({
            tipo: cartItem.servicio ? 'S' : (cartItem.combo ? 'C' : 'P'),
            servicio: cartItem.servicio,
            combo: cartItem.combo,
            promocion: cartItem.promocion,
            cantidad: cartItem.cantidad,
            precio_unitario: cartItem.precio_unitario,
            subtotal: cartItem.subtotal
          }));
          payload.total = item.precio_base || 0; // Total calculado en PaginaCarrito
        } else {
          throw new Error("El carrito está vacío o no se cargaron los items.");
        }
      }

      console.log("Enviando Reserva Payload:", payload); // Debug temporal

      const response = await createReserva(payload);
      const reservaId = response.data?.reserva?.id;

      if (!reservaId) {
        throw new Error('Error al obtener el ID de la reserva creada');
      }

      // 2. Llamar a checkoutPago
      await checkoutPago(reservaId, { metodo_pago: metodoPago });

      // Resetear y redirigir
      setLoading(false);
      navigate(`/confirmacion-pago/${reservaId}`);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error ||
        err.message ||
        'Error al crear la reserva. Intenta nuevamente.'
      );
      setLoading(false);
    }
  };

  // ============ RENDERIZAR CON CUSTOM MODAL (sin Dialog de MUI) ============
  return (
    <>
      {/* OVERLAY OSCURO */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1300,
        }}
        onClick={handleClose}
      />

      {/* MODAL CONTENT */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '500px',
          background: '#fff',
          borderRadius: '15px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          zIndex: 1301,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* TÍTULO */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
            color: '#fff',
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '15px 15px 0 0',
          }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>
            🎉 Reservar: {item?.nombre}
          </Typography>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: '#fff',
              minWidth: 'auto',
              p: 0.5,
              '&:hover': { background: 'rgba(255,255,255,0.2)' },
            }}
          >
            <CloseIcon />
          </Button>
        </Box>

        {/* CONTENIDO */}
        <Box sx={{ p: 3 }}>
          {/* FORMULARIO */}
          <Box component="form" id="reserva-form" onSubmit={handleSubmit}>
            {/* RESUMEN SERVICIO */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #FFF9E6 0%, #FFE6F0 100%)',
                borderRadius: '15px',
                p: 2.5,
                mb: 3,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FF6B9D', mb: 1 }}>
                Servicio Seleccionado
              </Typography>
              <Typography variant="h6" sx={{ color: '#333', mb: 1 }}>
                {item?.nombre}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                {item?.descripcion}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="h6" sx={{ color: '#FFC74F', fontWeight: 'bold' }}>
                💰 Precio: ${getPrecio()}
              </Typography>
            </Box>

            {/* FECHA */}
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <Box sx={{ mb: 2 }}>
                <DatePicker
                  label="Fecha del Evento"
                  value={fechaEvento}
                  onChange={(newValue) => setFechaEvento(newValue)}
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: 'Selecciona la fecha del evento',
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>

            {/* HORARIO */}
            {fechaEvento && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Horario Disponible</InputLabel>
                <Select
                  value={horarioSeleccionado}
                  onChange={(e) => setHorarioSeleccionado(e.target.value)}
                  label="Horario Disponible"
                  disabled={cargandoHorarios || horarios.length === 0}
                >
                  {cargandoHorarios ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} /> Cargando...
                    </MenuItem>
                  ) : horarios.length === 0 ? (
                    <MenuItem disabled>
                      Sin horarios disponibles
                    </MenuItem>
                  ) : (
                    horarios.map((h) => (
                      <MenuItem key={h.id} value={h.id}>
                        {h.hora_inicio} - {h.hora_fin}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}

            {/* UBICACIÓN CON MAPA */}
            <LocationPicker
              onLocationChange={({ latitud: lat, longitud: lng, direccion: dir }) => {
                setLatitud(lat);
                setLongitud(lng);
                setDireccion(dir);
              }}
              disabled={loading}
            />

            {/* MODO DE PAGO */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>¿Cómo desea pagar?</InputLabel>
              <Select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                label="¿Cómo desea pagar?"
                required
              >
                <MenuItem value="transferencia">Transferencia Bancaria (Pichincha/Guayaquil)</MenuItem>
                <MenuItem value="efectivo">Efectivo (Pago al llegar)</MenuItem>
              </Select>
              <Typography variant="caption" sx={{ mt: 1, color: '#666', px: 1 }}>
                * Al elegir transferencia, se le mostrarán los datos bancarios en el siguiente paso.
              </Typography>
            </FormControl>

            {/* ERROR */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Box>

        {/* BOTONES */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            p: 2,
            borderTop: '1px solid #eee',
          }}
        >
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              flex: 1,
              color: '#666',
              textTransform: 'none',
              fontSize: '16px',
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="reserva-form"
            variant="contained"
            disabled={loading}
            sx={{
              flex: 1,
              background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
              color: '#fff',
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '16px',
              borderRadius: '25px',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF8C94 0%, #FF6B9D 100%)',
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={18} sx={{ color: '#fff', mr: 1 }} />
                Reservando...
              </>
            ) : (
              'Confirmar Reserva'
            )}
          </Button>
        </Box>
      </Box>
    </>
  );
}
