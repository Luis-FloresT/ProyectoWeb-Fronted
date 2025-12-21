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

const serviceColors = [
  'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
  'linear-gradient(135deg, #FFC74F 0%, #FFE66D 100%)',
  'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
  'linear-gradient(135deg, #FF6348 0%, #FF8C42 100%)',
  'linear-gradient(135deg, #A8E6CF 0%, #56CCF2 100%)',
  'linear-gradient(135deg, #FFB997 0%, #FFB584 100%)',
];

export default function ProductCard({ item, tipo, index, onReservar, onAddToCarrito }) {
  const getIcon = () => {
    switch(tipo) {
      case 'servicio': return '🎈';
      case 'combo': return '🎁';
      case 'promocion': return '🎊';
      default: return '🎉';
    }
  };

  const getColor = () => {
    switch(tipo) {
      case 'servicio': return '#FF6B9D';
      case 'combo': return '#FFC74F';
      case 'promocion': return '#4ECDC4';
      default: return '#FF6B9D';
    }
  };

  const getGradient = () => {
    switch(tipo) {
      case 'servicio': return serviceColors[index % serviceColors.length];
      case 'combo': return 'linear-gradient(135deg, #FFC74F 0%, #FFE66D 100%)';
      case 'promocion': return 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)';
      default: return serviceColors[0];
    }
  };

  const precio = item.precio_base || item.precio_total || 0;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        border: tipo === 'promocion' ? "3px solid #4ECDC4" : "none",
        "&:hover": {
          transform: "translateY(-15px)",
          boxShadow: "0 20px 48px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Imagen/Fondo */}
      <Box
        sx={{
          height: 250,
          background: item.imagen 
            ? `url(${item.imagen}) center/cover no-repeat` 
            : getGradient(),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {tipo === 'promocion' && item.descuento && (
          <Chip
            label={`${item.descuento}% OFF`}
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              background: "#FF6348",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              padding: "5px",
            }}
          />
        )}
        {!item.imagen && (
          <span style={{
            fontSize: "100px",
            filter: "drop-shadow(3px 3px 6px rgba(0,0,0,0.2))",
          }}>
            {getIcon()}
          </span>
        )}
      </Box>

      {/* Contenido */}
      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Typography variant="h5" component="div" sx={{
          fontWeight: "bold",
          color: getColor(),
          marginBottom: "10px",
        }}>
          {item.nombre}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: "15px" }}>
          {item.descripcion || `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} especial para tu fiesta`}
        </Typography>
        {tipo === 'promocion' && item.fecha_fin && (
          <Typography variant="body2" sx={{ color: "#666", fontStyle: "italic", mb: 1 }}>
            Válido hasta: {new Date(item.fecha_fin).toLocaleDateString()}
          </Typography>
        )}
        <Typography variant="h6" sx={{
          color: tipo === 'combo' ? '#FF6B9D' : '#FFC74F',
          fontWeight: "bold",
          fontSize: "24px",
        }}>
          ${precio}
        </Typography>
      </CardContent>

      {/* Botones */}
      <CardActions sx={{ gap: "10px", pt: "20px", pb: "20px", px: "16px" }}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "15px",
            textTransform: "none",
            fontSize: "15px",
            "&:hover": {
              background: "linear-gradient(135deg, #FF8C94 0%, #FF6B9D 100%)",
            },
          }}
          onClick={() => onReservar(item, tipo)}
        >
          🎯 {tipo === 'promocion' ? 'Aprovechar Ahora' : tipo === 'combo' ? 'Reservar Combo' : 'Reservar'}
        </Button>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          sx={{
            background: "linear-gradient(135deg, #FFC74F 0%, #FFE66D 100%)",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "15px",
            textTransform: "none",
            fontSize: "15px",
            "&:hover": {
              background: "linear-gradient(135deg, #FFE66D 0%, #FFC74F 100%)",
            },
          }}
          onClick={() => onAddToCarrito(item, tipo)}
        >
          Agregar
        </Button>
      </CardActions>
    </Card>
  );
}
