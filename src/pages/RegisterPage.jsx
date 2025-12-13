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
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (clave !== repetirClave) {
      setError('Las claves no coinciden');
      return;
    }
    try {
      await axios.post(`${API_URL}/registro/`, {
        nombre: usuario,        // <- Aquí usa "nombre" porque así lo espera tu backend
        email: correo,          // <- Aquí usa "email" por compatibilidad backend
        telefono: telefono,     // <- Campo de teléfono
        clave: clave
      });
      // Redirige directamente al login después del registro exitoso
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
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
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Clave"
            value={clave}
            onChange={e => setClave(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Repetir Clave"
            value={repetirClave}
            onChange={e => setRepetirClave(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">REGISTRARSE</button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
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
  }
};

export default RegisterPage;
