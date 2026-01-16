import React, { useRef } from 'react';
import { Container, Typography, Box, CircularProgress, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
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

  const scrollRef = useRef(null);

  // === LÓGICA PARA EMOJIS DIFERENTES  ===
  const getSectionEmojis = (text) => {
    const val = text.toLowerCase();
    if (val.includes('navidad')) return { izq: '🎁', der: '🎄' };
    if (val.includes('año') || val.includes('fin')) return { izq: '🎊', der: '🥂' };
    if (val.includes('promocion')) return { izq: '📣', der: '🎉' };
    return { izq: '✨', der: '✨' };
  };

  const emojis = getSectionEmojis(title);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ paddingY: 4, marginBottom: "40px" }} id={id}>
      
      {/* === TÍTULO CENTRADO CON EMOJIS A LOS LADOS === */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: { xs: 2, md: 4 }, 
        marginBottom: "30px" 
      }}>
        <Typography sx={{ fontSize: { xs: '2rem', md: '3.5rem' } }}>
          {emojis.izq}
        </Typography>

        <Typography variant="h3" sx={{
          textAlign: "center",
          color: color,
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          fontSize: { xs: '2rem', md: '3.5rem' },
          fontFamily: "'Fredoka One', cursive, sans-serif" 
        }}>
          {title}
        </Typography>

        <Typography sx={{ fontSize: { xs: '2rem', md: '3.5rem' } }}>
          {emojis.der}
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress size={50} />
        </Box>
      )}

      {items.length > 0 && (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: items.length <= 3 ? 'center' : 'flex-start' }}>
          
          {items.length > 3 && (
            <IconButton 
              onClick={() => handleScroll('left')}
              sx={{ 
                position: 'absolute', left: -20, zIndex: 2, 
                backgroundColor: 'white', '&:hover': { backgroundColor: '#f0f0f0' },
                boxShadow: 3, display: { xs: 'none', md: 'flex' } 
              }}
            >
              <ChevronLeft />
            </IconButton>
          )}

          <Box 
            ref={scrollRef} 
            sx={{ 
              display: 'flex', 
              overflowX: items.length > 3 ? 'auto' : 'visible', 
              gap: 3,
              paddingX: 1,
              paddingY: 2,
              scrollBehavior: 'smooth',
              justifyContent: items.length <= 3 ? 'center' : 'flex-start',
              width: items.length <= 3 ? 'auto' : '100%',
              margin: items.length <= 3 ? '0 auto' : '0',
              '&::-webkit-scrollbar': { display: 'none' }, 
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {items.map((item, index) => (
              <Box 
                key={item.id} 
                sx={{ 
                  minWidth: { xs: '280px', sm: '320px' }, 
                  flexShrink: 0,
                }}
              >
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

          {items.length > 3 && (
            <IconButton 
              onClick={() => handleScroll('right')}
              sx={{ 
                position: 'absolute', right: -20, zIndex: 2, 
                backgroundColor: 'white', '&:hover': { backgroundColor: '#f0f0f0' },
                boxShadow: 3, display: { xs: 'none', md: 'flex' } 
              }}
            >
              <ChevronRight />
            </IconButton>
          )}

        </Box>
      )}

      {items.length === 0 && !loading && (
        <Box sx={{
          textAlign: "center",
          py: 5,
          background: `${color}1A`, 
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