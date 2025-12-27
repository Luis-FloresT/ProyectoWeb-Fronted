import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Grid,
    Divider,
    Alert,
    CircularProgress,
    IconButton,
    Snackbar,
    Avatar,
    Tooltip,
} from '@mui/material';
import { ThemeProvider, alpha } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StarsIcon from '@mui/icons-material/Stars';
import { theme } from '../theme/theme';
import PageContainer from '../components/layout/PageContainer';
import { getReserva, checkoutPago, getBancos } from '../api/reservas';

// --- UTILIDADES DE LOGOS BANCARIOS ---
const getBankLogo = (bankName) => {
    const name = bankName.toLowerCase();
    if (name.includes('pichincha')) return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjKAQpynPPXHpSjfBEJSvqxeA3Z06tSabtAw&s';
    if (name.includes('guayaquil')) return 'https://play-lh.googleusercontent.com/4A7fREJ2S-XLcgvwPDd8jVQCODSz0mSgzJLCbVU_62jKeDWkaGytvMSFWVE_dDovOKnt';
    if (name.includes('produbanco')) return 'https://logovector.net/wp-content/uploads/2014/11/178553-produbanco-logo-vector.png';
    if (name.includes('pacifico')) return 'https://logovtor.com/wp-content/uploads/2019/11/banco-del-pacifico-logo-vector.png';
    return null; // Fallback
};

function PaginaConfirmacion() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reserva, setReserva] = useState(null);
    const [bancos, setBancos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [infoCopiado, setInfoCopiado] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReservaYBancos();
    }, [id]);

    const fetchReservaYBancos = async () => {
        try {
            setLoading(true);
            const res = await getReserva(id);
            setReserva(res.data);

            if (res.data.metodo_pago === 'transferencia' || !res.data.metodo_pago) {
                const resBancos = await getBancos();
                setBancos(resBancos.data);
            }

            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('No se pudo cargar la información de la reserva.');
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setInfoCopiado(true);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Formato no permitido. Por favor sube una imagen.');
            return;
        }

        const formData = new FormData();
        formData.append('metodo_pago', 'transferencia');
        formData.append('comprobante_pago', file);

        try {
            setUploading(true);
            setMensaje(null);
            setError(null);
            const response = await checkoutPago(id, formData);
            setMensaje('¡Comprobante subido con éxito! Validaremos su pago pronto.');
            setReserva({ ...reserva, estado: response.data.estado });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al subir el comprobante.');
        } finally {
            setUploading(false);
            event.target.value = null;
        }
    };

    if (loading) {
        return (
            <PageContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress color="primary" thickness={5} size={60} />
                </Box>
            </PageContainer>
        );
    }

    const isTransferencia = reserva?.metodo_pago === 'transferencia';

    return (
        <ThemeProvider theme={theme}>
            <PageContainer>
                <Container maxWidth="lg" sx={{ py: 6 }}>
                    {/* Cabecera Premium */}
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        {/* Icono reducido para mantener proporción con el nuevo título */}
                        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#4CAF50', filter: 'drop-shadow(0 4px 10px rgba(76, 175, 80, 0.3))', mb: 2 }} />
                        {/* Título ajustado a h4 (más pequeño) */}
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#FF6B9D', mb: 1, letterSpacing: '-1px' }}>
                            ¡Casi Listos!
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#666', fontWeight: 500 }}>
                            Reserva: <span style={{ color: '#FFB800', fontWeight: 800 }}>#{reserva.codigo_reserva}</span>
                        </Typography>
                    </Box>

                    {mensaje && <Alert severity="success" sx={{ mb: 4, borderRadius: '20px', fontWeight: 'bold' }}>{mensaje}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '20px', fontWeight: 'bold' }}>{error}</Alert>}

                    <Grid container spacing={5} justifyContent={reserva.estado === 'APROBADA' ? 'center' : 'flex-start'}>
                        {/* COLUMNA IZQUIERDA: Resumen del Pedido */}
                        <Grid item xs={12} md={reserva.estado === 'APROBADA' ? 8 : 6}>
                            <Card sx={{
                                borderRadius: '24px',
                                border: '1px solid #FFE3ED',
                                boxShadow: '0 20px 40px rgba(255, 107, 157, 0.08)',
                                overflow: 'visible',
                                position: 'relative'
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#333', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <ReceiptLongIcon sx={{ color: '#FF6B9D' }} /> Detalles del Evento
                                        </Typography>
                                        <Box sx={{
                                            px: 2.5, py: 0.8,
                                            borderRadius: '50px',
                                            bgcolor: reserva.estado === 'APROBADA' ? '#E8F5E9' : '#FFF4CC',
                                            color: reserva.estado === 'APROBADA' ? '#2E7D32' : '#B28900',
                                            fontWeight: '900',
                                            fontSize: '0.8rem',
                                            boxShadow: reserva.estado === 'APROBADA' ? 'none' : '0 4px 12px rgba(255, 199, 79, 0.2)',
                                            border: `1px solid ${reserva.estado === 'APROBADA' ? '#C8E6C9' : '#FFD54F'}`,
                                            textTransform: 'uppercase'
                                        }}>
                                            {reserva.estado === 'APROBADA' ? '✓ Confirmado' : `⏳ ${reserva.estado}`}
                                        </Box>
                                    </Box>

                                    {/* Información del evento */}
                                    <Grid container spacing={3} sx={{ mb: 4 }}>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ bgcolor: alpha('#FFB800', 0.1), color: '#FFB800', width: 45, height: 45 }}>
                                                    <StarsIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#999', fontWeight: 700, textTransform: 'uppercase' }}>Nombre del Evento</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#333', textTransform: 'capitalize' }}>
                                                        {reserva.nombre_evento}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ bgcolor: alpha('#FF6B9D', 0.1), color: '#FF6B9D', width: 45, height: 45 }}>
                                                    <EventIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#999', fontWeight: 700, textTransform: 'uppercase' }}>Fecha</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#444' }}>{reserva.fecha_evento}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ bgcolor: alpha('#FF6B9D', 0.1), color: '#FF6B9D', width: 45, height: 45 }}>
                                                    <LocationOnIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#999', fontWeight: 700, textTransform: 'uppercase' }}>Dirección</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#444', lineHeight: 1.2 }}>{reserva.direccion_evento}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    {/* Detalle del pedido */}
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <ShoppingBagIcon sx={{ color: '#FFB800' }} /> Tu Pedido
                                    </Typography>

                                    <Box sx={{ pl: 1, mb: 3 }}>
                                        {reserva.detalles?.map((item, index) => (
                                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                                <Typography variant="body1" sx={{ color: '#555', fontWeight: 500 }}>
                                                    {item.nombre_item} <span style={{ color: '#FF6B9D', fontWeight: 800, fontSize: '0.8rem' }}>x{item.cantidad}</span>
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 800, color: '#333' }}>
                                                    ${parseFloat(item.subtotal).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Resumen de precios */}
                                    <Box sx={{ mt: 3, p: 3, bgcolor: '#FFF9FB', borderRadius: '20px', border: '2px dashed #FFE3ED' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Typography variant="body1" sx={{ color: '#666', fontWeight: 600 }}>Subtotal</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 700 }}>${parseFloat(reserva.subtotal).toFixed(2)}</Typography>
                                        </Box>
                                        {parseFloat(reserva.impuestos) > 0 && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                                <Typography variant="body1" sx={{ color: '#666', fontWeight: 600 }}>Impuestos (IVA)</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 700 }}>${parseFloat(reserva.impuestos).toFixed(2)}</Typography>
                                            </Box>
                                        )}
                                        <Divider sx={{ my: 2, opacity: 0.5 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#FF6B9D' }}>Total</Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#FF6B9D' }}>
                                                ${parseFloat(reserva.total).toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Mensaje de pago verificado */}
                                    {reserva.estado === 'APROBADA' && (
                                        <Alert
                                            icon={false}
                                            sx={{
                                                mt: 4,
                                                bgcolor: '#4CAF50',
                                                color: 'white',
                                                borderRadius: '18px',
                                                p: 2,
                                                boxShadow: '0 8px 16px rgba(76, 175, 80, 0.2)',
                                                '& .MuiAlert-message': { width: '100%', textAlign: 'center', fontSize: '1rem', fontWeight: 800 }
                                            }}
                                        >
                                            🎉 ¡PAGO VERIFICADO! EVENTO CONFIRMADO.
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* COLUMNA DERECHA: Instrucciones de Pago */}
                        {reserva.estado !== 'APROBADA' && (
                            <Grid item xs={12} md={6}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, color: '#333', textAlign: { xs: 'center', md: 'left' } }}>
                                        💳 Paso Final: Pago
                                    </Typography>

                                    {isTransferencia ? (
                                        <Box>
                                            <Grid container spacing={2}>
                                                {bancos.map((banco) => (
                                                    <Grid item xs={12} sm={6} key={banco.id}>
                                                        <Card sx={{
                                                            borderRadius: '24px',
                                                            border: '1px solid #FFE3ED',
                                                            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                                                            height: '100%',
                                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            '&:hover': {
                                                                transform: 'translateY(-5px)',
                                                                boxShadow: '0 20px 40px rgba(255, 107, 157, 0.12)',
                                                                borderColor: '#FF6B9D'
                                                            }
                                                        }}>
                                                            <CardContent sx={{ p: 2.5 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                                    <Avatar
                                                                        src={getBankLogo(banco.banco_nombre)}
                                                                        sx={{
                                                                            width: 44,
                                                                            height: 44,
                                                                            bgcolor: '#fff',
                                                                            border: '1.5px solid #f0f0f0',
                                                                            p: 1
                                                                        }}
                                                                    >
                                                                        <AccountBalanceIcon color="action" fontSize="small" />
                                                                    </Avatar>
                                                                    <Box>
                                                                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#333', mb: -0.5, fontSize: '0.95rem', textTransform: 'capitalize' }}>
                                                                            {banco.banco_nombre}
                                                                        </Typography>
                                                                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>
                                                                            {banco.ruc}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>

                                                                <Box sx={{
                                                                    p: 1.5,
                                                                    bgcolor: '#fcfcfc',
                                                                    borderRadius: '16px',
                                                                    border: '1px solid #eee',
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    <Box>
                                                                        <Typography variant="caption" sx={{ color: '#999', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                                                            {banco.tipo_cuenta}
                                                                        </Typography>
                                                                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#FF6B9D', letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                                                                            {banco.numero_cuenta}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Tooltip title="Copiar" arrow>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => handleCopy(banco.numero_cuenta)}
                                                                            sx={{
                                                                                bgcolor: alpha('#FFB800', 0.1),
                                                                                color: '#FFB800',
                                                                                '&:hover': { bgcolor: '#FFB800', color: '#fff' }
                                                                            }}
                                                                        >
                                                                            <ContentCopyIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>

                                                                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#777', fontWeight: 600, px: 0.5 }}>
                                                                    Titular: <span style={{ color: '#444', textTransform: 'capitalize' }}>{banco.beneficiario}</span>
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>

                                            <Box sx={{
                                                mt: 6,
                                                p: 4,
                                                textAlign: 'center',
                                                background: 'linear-gradient(135deg, #FFF9FB 0%, #FFF4CC 100%)',
                                                borderRadius: '30px',
                                                border: '2px solid #FFF',
                                                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
                                            }}>
                                                <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 800 }}>
                                                    📸 ¿Ya pagaste? Sube tu captura
                                                </Typography>
                                                <Button
                                                    component="label"
                                                    variant="contained"
                                                    startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                                                    disabled={uploading}
                                                    sx={{
                                                        background: 'linear-gradient(45deg, #FF6B9D 30%, #FFD54F 90%)',
                                                        color: '#fff',
                                                        borderRadius: '50px',
                                                        px: 6,
                                                        py: 2,
                                                        fontSize: '1.1rem',
                                                        textTransform: 'none',
                                                        fontWeight: 900,
                                                        boxShadow: '0 10px 25px rgba(255, 107, 157, 0.4)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(45deg, #FF8C94 30%, #FFB800 90%)',
                                                            transform: 'scale(1.02)'
                                                        },
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {uploading ? 'Subiendo...' : 'SUBIR COMPROBANTE'}
                                                    <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                                                </Button>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Card sx={{
                                            borderRadius: '24px',
                                            bgcolor: alpha('#4CAF50', 0.05),
                                            border: '2px solid #E8F5E9',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <CardContent sx={{ textAlign: 'center', p: 6 }}>
                                                <AccountBalanceIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
                                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>Pago en Efectivo</Typography>
                                                <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                                                    Por favor, asegúrate de tener el monto exacto de <span style={{ fontWeight: 900 }}>${parseFloat(reserva.total).toFixed(2)}</span> el día del evento.
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => navigate('/reservas')}
                                                    sx={{ borderRadius: '50px', px: 4, color: '#FF6B9D', borderColor: '#FF6B9D', fontWeight: 800 }}
                                                >
                                                    Ir a mis Reservas
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}
                                </Box>
                            </Grid>
                        )}
                    </Grid>

                    <Box sx={{ mt: 8, textAlign: 'center' }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/')}
                            sx={{ color: '#999', textTransform: 'none', fontWeight: 600, '&:hover': { color: '#FF6B9D' } }}
                        >
                            Volver al Inicio
                        </Button>
                    </Box>

                    <Snackbar
                        open={infoCopiado}
                        autoHideDuration={2000}
                        onClose={() => setInfoCopiado(false)}
                        message="✅ Número copiado al portapapeles"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        sx={{ '& .MuiSnackbarContent-root': { borderRadius: '12px', bgcolor: '#333' } }}
                    />
                </Container>
            </PageContainer>
        </ThemeProvider>
    );
}

export default PaginaConfirmacion;