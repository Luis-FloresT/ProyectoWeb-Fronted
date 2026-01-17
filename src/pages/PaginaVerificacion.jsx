import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Box, CircularProgress, Typography, Alert, Container, Paper, Button } from '@mui/material';

const PaginaVerificacion = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verificando tu cuenta...');

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
        setMessage(response.data.message || '¡Cuenta verificada con éxito! Ya puedes iniciar sesión');
        
      } catch (error) {
        console.error("Error de verificación:", error);
        setStatus('error');
        const errorMsg = error.response?.data?.error || 'El enlace es inválido o ha expirado.';
        setMessage(errorMsg);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FF6B9D 0%, #FFC74F 100%)',
    }}>
      <Paper elevation={10} sx={{ p: 5, textAlign: 'center', borderRadius: 6, width: '100%', background: 'rgba(255, 255, 255, 0.95)' }}>
        
        <Box sx={{ mb: 4 }}>
          {status === 'verifying' && (
            <CircularProgress size={80} thickness={4} sx={{ color: '#FF6B9D' }} />
          )}
          {status === 'success' && (
            <Typography variant="h1" sx={{ fontSize: '6rem', animation: 'bounce 1s infinite' }}>🎉</Typography>
          )}
          {status === 'error' && (
            <Typography variant="h1" sx={{ fontSize: '6rem' }}>⚠️</Typography>
          )}
        </Box>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: '800', color: '#333', mb: 2 }}>
          {status === 'verifying' && "Validando token..."}
          {status === 'success' && "¡Excelente!"}
          {status === 'error' && "Ups, algo salió mal"}
        </Typography>

        <Typography variant="h6" sx={{ mb: 4, color: '#555' }}>
          {message}
        </Typography>

        {status === 'success' && (
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/login')}
            sx={{ 
                background: 'linear-gradient(90deg, #FF6B9D 0%, #FFC74F 100%)',
                borderRadius: '30px',
                px: 5,
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 4px 15px rgba(255, 107, 157, 0.4)',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 20px rgba(255, 107, 157, 0.6)',
                }
            }}
          >
            Ir al Inicio de Sesión
          </Button>
        )}

        {status === 'error' && (
            <Box>
                <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', textAlign: 'left' }}>
                    Si el problema persiste, solicita un nuevo enlace desde la página de inicio o contacta a nuestro equipo de soporte.
                </Alert>
                <Button 
                    variant="outlined" 
                    onClick={() => navigate('/')}
                    sx={{ color: '#FF6B9D', borderColor: '#FF6B9D', borderRadius: '30px', px: 4 }}
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
