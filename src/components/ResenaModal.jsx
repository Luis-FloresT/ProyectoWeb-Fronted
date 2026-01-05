import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Rating,
  TextField,
  Alert
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export default function ResenaModal({ open, onClose, onSubmit, reserva, servicio }) {
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        reserva: reserva.id,
        servicio: servicio.id,
        calificacion,
        comentario
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al enviar la reseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth sx={{ borderRadius: '20px' }}>
      <DialogTitle sx={{ fontWeight: 'bold', color: '#FF6B9D' }}>
        ¡Califica tu Servicio! 🎈
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
          Cuéntanos qué te pareció el servicio <strong>{servicio?.nombre}</strong> en tu evento.
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, my: 3 }}>
          <Rating
            name="calificacion-servicio"
            value={calificacion}
            onChange={(event, newValue) => setCalificacion(newValue)}
            size="large"
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          <Typography variant="h6" sx={{ color: '#FFC74F', fontWeight: 'bold' }}>
            {calificacion} {calificacion === 1 ? 'Estrella' : 'Estrellas'}
          </Typography>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Tu comentario (opcional)"
          variant="outlined"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Ej: ¡Excelente animación, los niños se divirtieron mucho!"
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ color: '#999' }}>Cancelar</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          sx={{ 
            background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
            borderRadius: '15px'
          }}
        >
          {loading ? 'Enviando...' : 'Enviar Reseña'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
