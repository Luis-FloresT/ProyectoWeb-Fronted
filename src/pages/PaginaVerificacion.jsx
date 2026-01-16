import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Box, CircularProgress, Typography, Alert, Container, Paper } from '@mui/material';

const PaginaVerificacion = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verificando tu correo electrónico...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No se encontró el token de verificación.');
      return;
    }

    const verifyEmail = async () => {
      try {
        // Usamos el cliente centralizado que ya tiene el header ngrok-skip-browser-warning
        await api.get(`/verificar-email/?token=${token}`);
        
        setStatus('success');
        setMessage('¡Correo verificado con éxito! Redirigiendo al login...');
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate('/login?status=success');
        }, 2000);
        
      } catch (error) {
        console.error("Error de verificación:", error);
        setStatus('error');
        const errorMsg = error.response?.data?.error || 'El enlace es inválido o ha expirado.';
        setMessage(errorMsg);
        
        // Opcional: Redirigir con error después de un tiempo
        setTimeout(() => {
            navigate('/login?status=error');
        }, 3000);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4, width: '100%' }}>
        
        <Box sx={{ mb: 3 }}>
          {status === 'verifying' && (
            <CircularProgress color="primary" size={60} />
          )}
          {status === 'success' && (
            <Typography variant="h1" sx={{ fontSize: '4rem' }}>✅</Typography>
          )}
          {status === 'error' && (
            <Typography variant="h1" sx={{ fontSize: '4rem' }}>❌</Typography>
          )}
        </Box>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          {status === 'verifying' && "Verificando..."}
          {status === 'success' && "¡Verificado!"}
          {status === 'error' && "Error de Verificación"}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>

        {status === 'error' && (
           <Alert severity="error" sx={{ justifyContent: 'center' }}>
             Por favor solicita un nuevo enlace o contacta a soporte.
           </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default PaginaVerificacion;
