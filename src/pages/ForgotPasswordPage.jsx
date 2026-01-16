import React, { useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/password-reset/request/', { email });
      setMessage(response.data.message);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Ocurrió un error al procesar tu solicitud.');
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <h2 style={styles.title}>Recuperar Clave</h2>
        <p style={styles.subtitle}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {isLoading ? 'Enviando...' : 'ENVIAR ENLACE'}
          </button>
        </form>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <button 
          onClick={() => navigate('/login')} 
          style={styles.backButton}
        >
          Volver al Login
        </button>
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
    color: '#594040ff',
    fontSize: '0.9rem',
    textAlign: 'center',
    marginBottom: '20px',
    lineHeight: '1.4',
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
  backButton: {
    background: 'none',
    border: 'none',
    color: '#C724B1',
    marginTop: '20px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.9rem',
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

export default ForgotPasswordPage;
