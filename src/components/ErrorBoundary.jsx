import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * ErrorBoundary: Captura errores de renderizado de React
 * Evita que toda la app se rompa mostrando pantalla negra/blanca
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualizar estado para renderizar UI alternativa
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Registrar el error
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    // Resetear el error y recargar
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // UI alternativa cuando hay error
      return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Box
            sx={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, #FFE6F0 0%, #FFF9E6 100%)',
              borderRadius: '20px',
              p: 5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <ErrorOutlineIcon
              sx={{ fontSize: 100, color: '#FF6348', mb: 2 }}
            />
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#FF6348', mb: 2 }}
            >
              ¡Oops! Algo salió mal
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              La aplicación encontró un error inesperado.
              No te preocupes, puedes volver al inicio.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  textAlign: 'left',
                  background: '#f5f5f5',
                  p: 2,
                  borderRadius: '10px',
                  mb: 3,
                  maxHeight: '200px',
                  overflow: 'auto',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontFamily: 'monospace', color: '#d32f2f' }}
                >
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              onClick={this.handleReset}
              sx={{
                background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
                color: '#fff',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: '25px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF8C94 0%, #FF6B9D 100%)',
                },
              }}
            >
              🏠 Volver al Inicio
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
