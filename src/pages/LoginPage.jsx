import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../apiService';

function LoginPage({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // IMPORTANTE: los nombres de campo deben coincidir con tu API de Django.
      // Si en Django usas "username" y "password", cambia aquí los nombres.
  const res = await login({
  usuario,
  clave,
});
      // Se asume que la API devuelve { token, is_admin, username }
      const { token, is_admin, username } = res.data;

      // Guardar datos en localStorage para que los use el interceptor de apiService.js
      if (token) {
        localStorage.setItem('token', token);
      }
      localStorage.setItem('is_admin', String(is_admin ?? false));
      if (username) {
        localStorage.setItem('username', username);
      }

      if (onLogin) onLogin();

      // Redirigir después de login
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Usuario o clave incorrectos');
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
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Clave"
            value={clave}
            onChange={e => setClave(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">
            ENTRAR
          </button>
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
    textAlign: 'center',
  },
  input: {
    width: '100%',
    margin: '10px 0',
    padding: '14px',
    borderRadius: 6,
    border: 'none',
    background: '#3775a4',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    background: '#a647b9',
    color: '#fff',
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
    fontSize: '0.9rem',
  },
  link: {
    color: '#69b6ff',
    marginTop: 18,
    display: 'block',
    textDecoration: 'none',
  },
};

export default LoginPage;
