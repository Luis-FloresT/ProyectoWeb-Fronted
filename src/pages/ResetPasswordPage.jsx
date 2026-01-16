import React, { useState } from 'react';
import api from '../api/client';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación local: Coincidencia de contraseñas
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/password-reset/confirm/', { 
        token, 
        password 
      });
      setMessage(response.data.message);
      setIsLoading(false);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'El enlace es inválido o ha expirado.');
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <h2 style={styles.title}>Nueva Contraseña</h2>
        <p style={styles.subtitle}>Ingresa tu nueva clave de acceso.</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          
          <button
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : 'CAMBIAR CONTRASEÑA'}
          </button>
        </form>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  background: {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 25%, #C724B1 75%, #8B5CF6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: 20,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  title: {
    background: 'linear-gradient(135deg, #FF6B35, #C724B1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 800,
    fontSize: '2rem',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    fontSize: '0.9rem',
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    width: '100%',
  },
  input: {
    width: '100%',
    margin: '10px 0',
    padding: '16px 20px',
    borderRadius: 12,
    border: '2px solid transparent',
    background: '#f8f9fa',
    color: '#1a1a1a',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontWeight: 500,
  },
  button: {
    background: 'linear-gradient(135deg, #FF6B35, #C724B1)',
    color: '#fff',
    width: '100%',
    marginTop: '20px',
    padding: '16px 0',
    border: 'none',
    borderRadius: 12,
    fontWeight: 700,
    fontSize: '1rem',
    boxShadow: '0 4px 15px rgba(199, 36, 177, 0.3)',
  },
  success: {
    color: '#28a745',
    marginTop: '20px',
    fontSize: '0.9rem',
    textAlign: 'center',
    fontWeight: 500,
  },
  error: {
    color: '#dc3545',
    marginTop: '20px',
    fontSize: '0.9rem',
    textAlign: 'center',
  }
};

export default ResetPasswordPage;
