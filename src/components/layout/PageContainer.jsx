import React from 'react';
import { Box } from '@mui/material';

export default function PageContainer({ children }) {
  return (
    <Box sx={{
      // Pantalla completa fija para cubrir todo el viewport
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100vw",
      minHeight: "100vh",
      background: "linear-gradient(180deg, #fff9e6 0%, #ffe6f0 100%)",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      overflowY: "auto",
    }}>
      {children}
    </Box>
  );
}
