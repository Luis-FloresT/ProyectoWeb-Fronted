import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Box, CircularProgress, Typography, Alert, Container, Paper, Button } from '@mui/material';

const PaginaVerificacion = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verificando tu cuenta...');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No se encontró el token de verificación.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await api.get(`/verificar-correo/${token}/`);
        setStatus('success');
        setMessage(response.data.message || '¡Cuenta verificada con éxito!');
      } catch (error) {
        console.error("Error de verificación:", error);
        setStatus('error');
        const errorMsg = error.response?.data?.error || 'El enlace es inválido o ha expirado.';
        setMessage(errorMsg);
      }
    };

    verifyEmail();
  }, [token]);

  // Manejar el contador de redirección
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      navigate('/login');
    }
  }, [status, countdown, navigate]);

  return (
    <Container maxWidth={false} disableGutters sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FF6B9D 0%, #FFC74F 100%)',
      padding: { xs: 2, md: 4 }
    }}>
      <Paper elevation={24} sx={{ 
        p: { xs: 4, md: 8 }, 
        textAlign: 'center', 
        borderRadius: { xs: 6, md: 10 }, 
        width: '100%',
        maxWidth: { xs: '100%', sm: '550px', md: '750px' },
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: { md: 'translateY(-5px)' }
        }
      }}>
        
        <Box sx={{ mb: 4 }}>
          {status === 'verifying' && (
            <CircularProgress size={100} thickness={4} sx={{ color: '#FF6B9D' }} />
          )}
          {status === 'success' && (
            <Typography variant="h1" sx={{ fontSize: { xs: '5rem', md: '8rem' }, animation: 'bounce 1s infinite' }}>🎉</Typography>
          )}
          {status === 'error' && (
            <Typography variant="h1" sx={{ fontSize: { xs: '5rem', md: '8rem' } }}>⚠️</Typography>
          )}
        </Box>

        <Typography variant="h3" gutterBottom sx={{ 
          fontWeight: '900', 
          color: '#333', 
          mb: 2,
          fontSize: { xs: '1.8rem', md: '3rem' },
          background: 'linear-gradient(90deg, #FF6B9D, #FFC74F)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {status === 'verifying' && "Validando token..."}
          {status === 'success' && "¡Bienvenido a la diversión!"}
          {status === 'error' && "Ups, algo salió mal"}
        </Typography>

        <Typography variant="h6" sx={{ 
          mb: 4, 
          color: '#666', 
          fontSize: { xs: '1rem', md: '1.4rem' },
          lineHeight: 1.6
        }}>
          {message}
        </Typography>

        {status === 'success' && (
          <Box>
            <Typography variant="body1" sx={{ color: '#FF6B9D', fontWeight: 'bold', mb: 3 }}>
              Serás redirigido al inicio de sesión en {countdown} segundos...
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/login')}
              sx={{ 
                  background: 'linear-gradient(90deg, #FF6B9D 0%, #FFC74F 100%)',
                  borderRadius: '50px',
                  px: { xs: 4, md: 8 },
                  py: 2,
                  fontWeight: '900',
                  fontSize: '1.2rem',
                  textTransform: 'none',
                  boxShadow: '0 10px 20px rgba(255, 107, 157, 0.4)',
                  '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 15px 30px rgba(255, 107, 157, 0.6)',
                  }
              }}
            >
              Ir al Login ahora
            </Button>
          </Box>
        )}

        {status === 'error' && (
            <Box>
                <Alert severity="error" variant="outlined" sx={{ mb: 4, borderRadius: '20px', fontSize: '1.1rem', py: 2 }}>
                    Si el problema persiste, solicita un nuevo enlace o contacta a soporte.
                </Alert>
                <Button 
                    variant="outlined" 
                    onClick={() => navigate('/')}
                    sx={{ 
                      color: '#FF6B9D', 
                      borderColor: '#FF6B9D', 
                      borderRadius: '50px', 
                      px: 6, 
                      py: 1.5,
                      borderWidth: '2px',
                      fontWeight: 'bold',
                      '&:hover': {
                        borderWidth: '2px',
                        background: 'rgba(255,107,157,0.05)'
                      }
                    }}
                >
                    Volver al Inicio
                </Button>
            </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PaginaVerificacion;
