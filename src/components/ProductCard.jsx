import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export default function ProductCard({ item, tipo, index, onReservar, onAddToCarrito }) {
  
  
  const getIcon = () => {
    const name = item.nombre?.toLowerCase() || "";
    if (name.includes('navidad')) return '🎄'; 
    if (name.includes('año') || name.includes('fin')) return '🎁'; 
    
    switch (tipo) {
      case 'servicio': return '🎈';
      case 'combo': return '🎁';
      case 'promocion': return '🎊';
      default: return '🎉';
    }
  };

  const getColor = () => {
    switch (tipo) {
      case 'servicio': return '#FF6B9D';
      case 'combo': return '#FFC74F';
      case 'promocion': return '#4ECDC4';
      default: return '#FF6B9D';
    }
  };

  const precio = item.precio || item.precio_base || item.precio_combo || item.precio_total || 0;

  return (
    <Card
      sx={{
        width: '320px',      
        height: '520px',     
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
        mx: 'auto',          
        transition: "transform 0.3s ease",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        "&:hover": {
          transform: "translateY(-10px)",
        },
      }}
    >
      {/* SECCIÓN DE IMAGEN / ICONO */}
      <Box
        sx={{
          width: '100%',
          height: '220px',     
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
          // Centrado para el icono cuando no hay imagen
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {item.imagen ? (
          <Box
            component="img"
            src={item.imagen}
            alt={item.nombre}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        ) : (
          
          <Typography sx={{ 
            fontSize: "100px", 
            filter: "drop-shadow(3px 3px 6px rgba(0,0,0,0.15))" 
          }}>
            {getIcon()}
          </Typography>
        )}
        
        {tipo === 'promocion' && item.descuento_porcentaje && (
          <Chip
            label={`${item.descuento_porcentaje}% OFF`}
            sx={{
              position: "absolute", top: 10, right: 10,
              background: "#FF6348", color: "#fff", fontWeight: "bold"
            }}
          />
        )}
      </Box>

      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        p: 2 
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: "bold", 
            color: getColor(),
            height: '64px',      
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.2,
            mb: 1
          }}
        >
          {item.nombre}
        </Typography>

        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ 
            height: '40px',      
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2
          }}
        >
          {item.descripcion || `Especial para tu fiesta de colores`}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
            ${precio}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onReservar(item, tipo)}
          sx={{ 
            bgcolor: getColor(), 
            borderRadius: '10px',
            textTransform: 'none',
            '&:hover': { bgcolor: getColor(), filter: 'brightness(0.9)' }
          }}
        >
          Reservar
        </Button>
        <Button
          variant="outlined"
          onClick={() => onAddToCarrito(item, tipo)}
          sx={{ 
            minWidth: '50px', 
            borderRadius: '10px', 
            color: getColor(), 
            borderColor: getColor() 
          }}
        >
          <AddShoppingCartIcon fontSize="small" />
        </Button>
      </CardActions>
    </Card>
  );
}