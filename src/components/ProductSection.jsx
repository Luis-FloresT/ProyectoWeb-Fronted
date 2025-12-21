import React from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import ProductCard from './ProductCard';

export default function ProductSection({ 
  id, 
  title, 
  color, 
  items, 
  tipo, 
  loading, 
  emptyIcon,
  emptyMessage,
  onReservar, 
  onAddToCarrito 
}) {
  return (
    <Container maxWidth="lg" sx={{ paddingY: 4, marginBottom: "40px" }} id={id}>
      <Typography variant="h3" sx={{
        textAlign: "center",
        color: color,
        fontWeight: "bold",
        marginBottom: "30px",
        textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
      }}>
        {title}
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress size={50} />
        </Box>
      )}

      {items.length > 0 && (
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}>
          {items.map((item, index) => (
            <Box key={item.id}>
              <ProductCard
                item={item}
                tipo={tipo}
                index={index}
                onReservar={onReservar}
                onAddToCarrito={onAddToCarrito}
              />
            </Box>
          ))}
        </Box>
      )}

      {items.length === 0 && !loading && (
        <Box sx={{
          textAlign: "center",
          py: 5,
          background: `${color}1A`, // 10% opacity
          borderRadius: "15px",
          padding: "40px",
        }}>
          <Typography variant="h5" sx={{ color: color, fontWeight: "bold" }}>
            {emptyIcon} {emptyMessage}
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", mt: 2 }}>
            Vuelve pronto para ver nuestras ofertas
          </Typography>
        </Box>
      )}
    </Container>
  );
}
