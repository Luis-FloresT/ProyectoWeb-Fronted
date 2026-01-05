import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { IconButton, Badge } from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function Header({ token, isAdmin, carritoCount, onLogout }) {
  const navigate = useNavigate();

  return (
    <header style={{
      background: "linear-gradient(90deg, #FF6B9D 0%, #FFC74F 100%)",
      padding: "20px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <CelebrationIcon sx={{ fontSize: 40, color: "#fff" }} />
        <div>
          <h1 style={{
            color: "#fff",
            margin: 0,
            fontSize: "28px",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
          }}>
            🎉 BURBUJITAS DE COLORES 🎉
          </h1>
          <p style={{ color: "#fff", margin: 0, fontSize: "12px", opacity: 0.9 }}>
            Fiestas infantiles llenas de diversión
          </p>
        </div>
      </div>

      <nav style={{
        display: "flex",
        gap: "30px",
        fontWeight: "bold",
        fontSize: "16px",
      }}>
        <a href="#servicios" style={{
          color: "#fff",
          textDecoration: "none",
          opacity: 0.9,
          transition: "all 0.3s",
        }}>
          🎈 Servicios
        </a>
        <a href="#combos" style={{
          color: "#fff",
          textDecoration: "none",
          opacity: 0.9,
        }}>
          🎁 Combos
        </a>
        <a href="#promociones" style={{
          color: "#fff",
          textDecoration: "none",
          opacity: 0.9,
        }}>
          🎊 Promociones
        </a>
        {token && (
          <NavLink to="/reservas" style={({ isActive }) => ({
            color: "#fff",
            textDecoration: isActive ? "underline" : "none",
            opacity: isActive ? 1 : 0.9,
          })}>
            📅 Mis Reservas
          </NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin-dashboard" style={({ isActive }) => ({
            color: "#fff",
            textDecoration: isActive ? "underline" : "none",
            opacity: isActive ? 1 : 0.9,
          })}>
            📊 Dashboard
          </NavLink>
        )}
      </nav>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {token && (
          <IconButton 
            onClick={() => navigate('/carrito')}
            sx={{ 
              color: '#fff',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <Badge badgeContent={carritoCount} color="error">
              <ShoppingCartIcon sx={{ fontSize: 32 }} />
            </Badge>
          </IconButton>
        )}
        
        {!token ? (
          <>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: "10px 25px",
                background: "#fff",
                color: "#FF6B9D",
                border: "none",
                fontWeight: "bold",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.3s",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.target.style.transform = "scale(1)"}
            >
              🔑 Iniciar Sesión
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: "10px 25px",
                background: "transparent",
                color: "#fff",
                border: "2px solid #fff",
                fontWeight: "bold",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
              onMouseOut={(e) => e.target.style.background = "transparent"}
            >
              📝 Registrarse
            </button>
          </>
        ) : (
          <button
            onClick={onLogout}
            style={{
              padding: "10px 25px",
              background: "#fff",
              color: "#FF6B9D",
              border: "none",
              fontWeight: "bold",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            🚪 Salir
          </button>
        )}
      </div>
    </header>
  );
}
