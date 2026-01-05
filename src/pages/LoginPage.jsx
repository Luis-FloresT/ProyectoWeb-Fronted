import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // IMPORTANTE: los nombres de campo deben coincidir con tu API de Django.
      // Si en Django usas "username" y "password", cambia aquí los nombres.
      await login({ usuario, clave });

      // Redirigir después de login
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Usuario o clave incorrectos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            style={styles.input}
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Clave"
            value={clave}
            onChange={e => setClave(e.target.value)}
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
            {isLoading ? (
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                 <span className="spinner" style={styles.spinner}></span>
                 Iniciando...
               </div>
            ) : 'ENTRAR'}
          </button>
          <a style={styles.forgotLink} href="/forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
          {error && <p style={styles.error}>{error}</p>}
        </form>
        <a style={styles.link} href="/register">
          ¿No tienes cuenta? Regístrate
        </a>
      </div>
    </div>
  );
}

const styles = {
  background: {
    minHeight: '100vh',
    width: '100vw',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 25%, #C724B1 75%, #8B5CF6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    overflow: 'auto',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '48px 40px',
    borderRadius: 20,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  title: {
    background: 'linear-gradient(135deg, #FF6B35, #C724B1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 32px 0',
    fontWeight: 800,
    fontSize: '2.5rem',
    textAlign: 'center',
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
    marginTop: 24,
    padding: '16px 0',
    border: 'none',
    borderRadius: 12,
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 15px rgba(199, 36, 177, 0.3)',
  },
  error: {
    color: '#dc3545',
    marginTop: 16,
    fontSize: '0.95rem',
    fontWeight: 500,
    textAlign: 'center',
  },
  link: {
    background: 'linear-gradient(135deg, #FF6B35, #C724B1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginTop: 24,
    display: 'block',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '1rem',
  },
  forgotLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    fontWeight: 500,
    transition: 'color 0.2s ease',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTop: '3px solid #fff',
    animation: 'spin 1s linear infinite',
  }
};

// Add global keyframes for spinner if not present
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);

export default LoginPage;
