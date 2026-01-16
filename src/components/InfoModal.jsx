import React from 'react';
import { Modal, Box, Typography, Button, IconButton, Container } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function InfoModal({ open, onClose, title, children, icon }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="info-modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          background: 'linear-gradient(135deg, #fff9e6 0%, #ffe6f0 100%)',
          borderRadius: '20px',
          boxShadow: 24,
          maxHeight: '90vh',
          overflowY: 'auto',
          outline: 'none',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#FFE3ED',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #FF6B9D 0%, #FFC74F 100%)',
            borderRadius: '10px',
            '&:hover': {
              background: 'linear-gradient(135deg, #FF8C94 0%, #FFD54F 100%)',
            },
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #FF6B9D 0%, #FFC74F 100%)',
            color: '#fff',
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '20px 20px 0 0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '32px' }}>{icon}</Typography>
            <Typography id="info-modal-title" variant="h5" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: '#fff',
              '&:hover': { background: 'rgba(255,255,255,0.2)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* CONTENT */}
        <Box sx={{ p: 4 }}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
}
