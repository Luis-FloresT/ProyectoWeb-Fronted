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
import DeleteIcon from '@mui/icons-material/Delete';
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
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

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

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Formato no permitido. Por favor sube una imagen.');
            return;
        }

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('metodo_pago', 'transferencia');
        formData.append('comprobante_pago', selectedFile);

        try {
            setUploading(true);
            setMensaje(null);
            setError(null);
            const response = await checkoutPago(id, formData);
            setMensaje('¡Comprobante subido con éxito! Validaremos su pago pronto.');
            setReserva({ ...reserva, estado: response.data.estado });
            setPreview(null);
            setSelectedFile(null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al subir el comprobante.');
        } finally {
            setUploading(false);
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
                <Container maxWidth="lg" sx={{ py: 2 }}>
                    {/* Cabecera Compacta */}
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 0.5 }} />
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#FF6B9D', mb: 0, letterSpacing: '-0.5px' }}>
                            ¡Casi Listos!
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block' }}>
                            Reserva: <span style={{ color: '#FFB800' }}>#{reserva.codigo_reserva}</span>
                        </Typography>
                    </Box>

                    {mensaje && <Alert severity="success" sx={{ mb: 2, py: 0, borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>{mensaje}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2, py: 0, borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>{error}</Alert>}

                    <Grid container spacing={2} justifyContent="center">
                        {/* COLUMNA IZQUIERDA: Resumen del Pedido */}
                        <Grid item xs={12} md={reserva.estado === 'APROBADA' ? 8 : 5}>
                            <Card sx={{
                                borderRadius: '24px',
                                border: '1px solid #FFE3ED',
                                boxShadow: '0 10px 30px rgba(255, 107, 157, 0.05)',
                                position: 'relative'
                            }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <ReceiptLongIcon sx={{ color: '#FF6B9D', fontSize: 18 }} /> Detalles
                                        </Typography>
                                        <Box sx={{
                                            px: 1, py: 0.2,
                                            borderRadius: '50px',
                                            bgcolor: reserva.estado === 'APROBADA' ? '#E8F5E9' : '#FFF4CC',
                                            color: reserva.estado === 'APROBADA' ? '#2E7D32' : '#B28900',
                                            fontWeight: '900',
                                            fontSize: '0.65rem',
                                            border: `1px solid ${reserva.estado === 'APROBADA' ? '#C8E6C9' : '#FFD54F'}`,
                                            textTransform: 'uppercase'
                                        }}>
                                            {reserva.estado === 'APROBADA' ? '✓ Confirmado' : reserva.estado}
                                        </Box>
                                    </Box>

                                    {/* Información del evento compacta */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <StarsIcon sx={{ color: '#FFB800', fontSize: 16 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#333', textTransform: 'capitalize' }}>
                                                {reserva.nombre_evento}
                                            </Typography>
                                        </Box>
                                        <Grid container rowSpacing={0.5} columnSpacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <EventIcon sx={{ color: '#FF6B9D', fontSize: 14 }} />
                                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#666' }}>{reserva.fecha_evento}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <LocationOnIcon sx={{ color: '#FF6B9D', fontSize: 14 }} />
                                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#666' }}>{reserva.direccion_evento}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/* Detalle del pedido */}
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ShoppingBagIcon sx={{ color: '#FFB800', fontSize: 18 }} /> Tu Pedido
                                    </Typography>

                                    <Box sx={{ pl: 0.5, mb: 2 }}>
                                        {reserva.detalles?.map((item, index) => (
                                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="caption" sx={{ color: '#555', fontWeight: 500 }}>
                                                    {item.nombre_item} <span style={{ color: '#FF6B9D', fontWeight: 800, fontSize: '0.7rem' }}>x{item.cantidad}</span>
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#333' }}>
                                                    ${parseFloat(item.subtotal).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Resumen de precios compacto */}
                                    <Box sx={{ p: 1.5, bgcolor: '#FFF9FB', borderRadius: '12px', border: '1px dashed #FFE3ED' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
                                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, fontSize: '0.65rem' }}>Subtotal</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem' }}>${parseFloat(reserva.subtotal).toFixed(2)}</Typography>
                                        </Box>
                                        {parseFloat(reserva.impuestos) > 0 && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
                                                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, fontSize: '0.65rem' }}>IVA</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem' }}>${parseFloat(reserva.impuestos).toFixed(2)}</Typography>
                                            </Box>
                                        )}
                                        <Divider sx={{ my: 0.5, opacity: 0.3 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#FF6B9D' }}>Total</Typography>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#FF6B9D' }}>
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
                            <Grid item xs={12} md={7}>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.5, color: '#333' }}>
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
                                                            <CardContent sx={{ p: 2 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                                    <Avatar
                                                                        src={getBankLogo(banco.banco_nombre)}
                                                                        sx={{
                                                                            width: 28,
                                                                            height: 28,
                                                                            bgcolor: '#fff',
                                                                            border: '1px solid #f0f0f0',
                                                                            p: 0.3
                                                                        }}
                                                                    >
                                                                        <AccountBalanceIcon color="action" sx={{ fontSize: 14 }} />
                                                                    </Avatar>
                                                                    <Box>
                                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#333', lineHeight: 1.2 }}>
                                                                            {banco.banco_nombre}
                                                                        </Typography>
                                                                        <Typography variant="caption" sx={{ color: '#888', fontSize: '0.65rem' }}>
                                                                            {banco.ruc}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>

                                                                <Box sx={{
                                                                    p: 1,
                                                                    bgcolor: '#fcfcfc',
                                                                    borderRadius: '12px',
                                                                    border: '1px solid #eee',
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    <Box>
                                                                        <Typography variant="caption" sx={{ color: '#999', fontWeight: 700, fontSize: '0.55rem' }}>
                                                                            {banco.tipo_cuenta}
                                                                        </Typography>
                                                                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#FF6B9D' }}>
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
                                                mt: 2,
                                                p: 2,
                                                textAlign: 'center',
                                                background: 'linear-gradient(135deg, #FFF9FB 0%, #FFF4CC 100%)',
                                                borderRadius: '20px',
                                                border: '1px solid #FFE3ED'
                                            }}>
                                                <Typography variant="body2" sx={{ 
                                                    mb: 1.5, 
                                                    color: '#333', 
                                                    fontWeight: 800,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 1
                                                }}>
                                                    📸 ¿Ya pagaste? Sube tu captura
                                                </Typography>

                                                {preview && (
                                                    <Box sx={{ 
                                                        mb: 2, 
                                                        position: 'relative', 
                                                        display: 'flex', 
                                                        justifyContent: 'center', 
                                                        alignItems: 'center',
                                                        bgcolor: '#fff',
                                                        p: 1.5,
                                                        borderRadius: '20px',
                                                        border: '1px dashed #FFE3ED',
                                                        maxWidth: '250px',
                                                        mx: 'auto'
                                                    }}>
                                                        <img 
                                                            src={preview} 
                                                            alt="Vista previa" 
                                                            style={{ 
                                                                maxWidth: '100%', 
                                                                maxHeight: '150px',
                                                                borderRadius: '12px', 
                                                                objectFit: 'contain'
                                                            }} 
                                                        />
                                                        <IconButton 
                                                            onClick={(e) => { 
                                                                e.preventDefault();
                                                                setPreview(null); 
                                                                setSelectedFile(null); 
                                                            }}
                                                            sx={{ 
                                                                position: 'absolute', 
                                                                top: -10, 
                                                                right: -10, 
                                                                bgcolor: '#FF4757', 
                                                                color: 'white',
                                                                width: 28,
                                                                height: 28,
                                                                '&:hover': { bgcolor: '#FF6B81' }
                                                            }}
                                                            size="small"
                                                        >
                                                            <DeleteIcon sx={{ fontSize: '1rem' }} />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                                {!preview ? (
                                                    <Button
                                                        component="label"
                                                        variant="contained"
                                                        startIcon={<CloudUploadIcon />}
                                                        sx={{
                                                            background: 'linear-gradient(45deg, #FF6B9D 30%, #FFD54F 90%)',
                                                            color: '#fff',
                                                            borderRadius: '50px',
                                                            px: 3,
                                                            py: 1,
                                                            fontSize: '0.8rem',
                                                            textTransform: 'none',
                                                            fontWeight: 900,
                                                            boxShadow: '0 4px 10px rgba(255, 107, 157, 0.2)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(45deg, #FF8C94 30%, #FFB800 90%)',
                                                                transform: 'translateY(-1px)'
                                                            }
                                                        }}
                                                    >
                                                        SUBIR COMPROBANTE
                                                        <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleUpload}
                                                        disabled={uploading}
                                                        startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                                                        sx={{
                                                            background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                                                            color: '#fff',
                                                            borderRadius: '50px',
                                                            px: 3,
                                                            py: 1,
                                                            fontSize: '0.8rem',
                                                            textTransform: 'none',
                                                            fontWeight: 900,
                                                            boxShadow: '0 4px 10px rgba(76, 175, 80, 0.2)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(45deg, #66BB6A 30%, #9CCC65 90%)',
                                                                transform: 'translateY(-1px)'
                                                            }
                                                        }}
                                                    >
                                                        {uploading ? 'ENVIANDO...' : 'ENVIAR AHORA'}
                                                    </Button>
                                                )}
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

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/')}
                            sx={{ color: '#999', textTransform: 'none', fontWeight: 600, '&:hover': { color: '#FF6B9D' } }}
                        >
                            Volver al Inicio
                        </Button>
                    </Box>

                    {infoCopiado && (
                        <Alert 
                            severity="success" 
                            onClose={() => setInfoCopiado(false)}
                            sx={{ mb: 2, borderRadius: '12px' }}
                        >
                            ✅ Número copiado al portapapeles
                        </Alert>
                    )}

                    <Snackbar
                        open={false}
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