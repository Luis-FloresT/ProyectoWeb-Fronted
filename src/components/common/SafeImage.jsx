import React, { useState, useEffect } from 'react';

/**
 * SafeImage Component
 * Fetches an image using the ngrok-skip-browser-warning header and displays it via a Blob URL.
 * This bypasses the persistent splash page warning on free ngrok accounts.
 */
const SafeImage = ({ src, alt, className, onClick }) => {
  // [ACTUALIZADO] En producción con Render, no necesitamos headers de ngrok.
  // Renderizamos la imagen directamente.
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onClick={onClick}
      onError={(e) => {
        // Fallback opcional o manejo de errores simple
        // e.target.src = '/placeholder.png'; // Ejemplo
        console.warn('Error loading image:', src);
      }}
    />
  );
};

export default SafeImage;
