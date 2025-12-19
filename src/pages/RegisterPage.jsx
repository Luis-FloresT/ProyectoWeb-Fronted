import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function RegisterPage() {
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [clave, setClave] = useState('');
  const [repetirClave, setRepetirClave] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (clave !== repetirClave) {
      setError('Las claves no coinciden');
      return;
    }

    setIsLoading(true);

    const payload = {
      nombre: usuario,
      email: correo,
      telefono: telefono,
      clave: clave
    };

    try {
      await axios.post(`${API_URL}/registro/`, payload);

      setSuccess(true);
      setIsLoading(false);

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setIsLoading(false);

      const errorMessage = err.response?.data?.error
        || err.response?.data?.message
        || err.response?.data?.detail
        || Object.values(err.response?.data || {})[0]
        || 'Error al registrar usuario';

      setError(errorMessage);
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <h2 style={styles.title}>Registrarse</h2>
        <form onSubmit={handleRegister}>
          <input
            style={styles.input}
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            required
            disabled={isLoading || success}
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            required
            disabled={isLoading || success}
          />
          <input
            style={styles.input}
            type="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            required
            disabled={isLoading || success}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Clave"
            value={clave}
            onChange={e => setClave(e.target.value)}
            required
            disabled={isLoading || success}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Repetir Clave"
            value={repetirClave}
            onChange={e => setRepetirClave(e.target.value)}
            required
            disabled={isLoading || success}
          />
          <button
            style={{
              ...styles.button,
              opacity: isLoading || success ? 0.7 : 1,
              cursor: isLoading || success ? 'not-allowed' : 'pointer'
            }}
            type="submit"
            disabled={isLoading || success}
          >
            {isLoading ? 'REGISTRANDO...' : success ? '¡REGISTRO EXITOSO!' : 'REGISTRARSE'}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>

        {isLoading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Registrando tu cuenta...</p>
          </div>
        )}

        {success && (
          <div style={styles.successOverlay}>
            <div style={styles.checkmark}>
              <svg style={styles.checkmarkSvg} viewBox="0 0 52 52">
                <circle style={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none" />
                <path style={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <p style={styles.successText}>¡Registro completado!</p>
            <div style={styles.verificationBox}>
              <svg
                style={styles.emailIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <p style={styles.verificationText}>Por favor, verifica tu cuenta</p>
              <p style={styles.verificationSubtext}>
                Hemos enviado un correo de verificación a tu email
              </p>
            </div>
            <p style={styles.successSubtext}>Redirigiendo al login...</p>
          </div>
        )}
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
    position: 'relative',
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  spinner: {
    width: 60,
    height: 60,
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #FF6B35',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: 20,
    fontSize: '1.1rem',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #FF6B35, #C724B1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  checkmark: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  checkmarkSvg: {
    width: '100%',
    height: '100%',
  },
  checkmarkCircle: {
    stroke: '#4CAF50',
    strokeWidth: 2,
    strokeDasharray: 166,
    strokeDashoffset: 166,
    animation: 'stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards',
  },
  checkmarkCheck: {
    stroke: '#4CAF50',
    strokeWidth: 3,
    strokeLinecap: 'round',
    strokeDasharray: 48,
    strokeDashoffset: 48,
    animation: 'stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards',
  },
  successText: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#4CAF50',
    margin: '10px 0',
  },
  successSubtext: {
    fontSize: '1rem',
    color: '#666',
    fontWeight: 500,
    marginTop: 16,
  },
  verificationBox: {
    background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(199, 36, 177, 0.1))',
    padding: '24px 32px',
    borderRadius: 16,
    margin: '20px 0',
    border: '2px solid rgba(199, 36, 177, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
  },
  emailIcon: {
    width: 48,
    height: 48,
    color: '#C724B1',
    marginBottom: 12,
  },
  verificationText: {
    fontSize: '1.4rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #FF6B35, #C724B1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '8px 0',
    textAlign: 'center',
  },
  verificationSubtext: {
    fontSize: '0.95rem',
    color: '#555',
    fontWeight: 500,
    textAlign: 'center',
    marginTop: 4,
  }
};

export default RegisterPage;
