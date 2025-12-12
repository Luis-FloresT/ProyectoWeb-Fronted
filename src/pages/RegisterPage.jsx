import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function RegisterPage() {
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
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
    backgroundColor: '#111',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: '#232323',
    padding: '36px 32px',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    width: 350,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    margin: '0 0 24px 0',
    fontWeight: 700,
    fontSize: '2rem',
    textAlign: 'center'
  },
  input: {
    width: '100%',
    margin: '10px 0',
    padding: '14px',
    borderRadius: 6,
    border: 'none',
    background: '#484848',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    background: '#81bfff',
    color: '#232323',
    width: '100%',
    marginTop: 20,
    padding: '12px 0',
    border: 'none',
    borderRadius: 6,
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: 10,
    fontSize: '0.9rem'
  }
};

export default RegisterPage;
