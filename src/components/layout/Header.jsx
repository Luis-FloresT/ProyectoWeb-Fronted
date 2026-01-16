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
      padding: "15px 30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      flexWrap: "nowrap",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "fit-content" }}>
        <CelebrationIcon sx={{ fontSize: 36, color: "#fff" }} />
        <div>
          <h1 style={{
            color: "#fff",
            margin: 0,
            fontSize: "22px",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap"
          }}>
            🎉 BURBUJITAS DE COLORES
          </h1>
          <p style={{ color: "#fff", margin: 0, fontSize: "11px", opacity: 0.9, whiteSpace: "nowrap" }}>
            Fiestas infantiles llenas de diversión
          </p>
        </div>
      </div>

      <nav style={{
        display: "flex",
        gap: "20px",
        fontWeight: "bold",
        fontSize: "14px",
        alignItems: "center",
        flexShrink: 0,
      }}>
        <a href="#servicios" style={{
          color: "#fff",
          textDecoration: "none",
          opacity: 0.9,
          transition: "all 0.3s",
          whiteSpace: "nowrap",
        }}>
          🎈 Servicios
        </a>
        <a href="#combos" style={{
          color: "#fff",
          textDecoration: "none",
          opacity: 0.9,
          whiteSpace: "nowrap",
        }}>
          🎁 Combos
        </a>
        <a href="#promociones" style={{
          color: "#fff",
          textDecoration: "none",
          opacity: 0.9,
          whiteSpace: "nowrap",
        }}>
          🎊 Promociones
        </a>
        {token && (
          <NavLink to="/reservas" style={({ isActive }) => ({
            color: "#fff",
            textDecoration: isActive ? "underline" : "none",
            opacity: isActive ? 1 : 0.9,
            whiteSpace: "nowrap",
          })}>
            📅 Mis Reservas
          </NavLink>
        )}
        {isAdmin && (
          <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noopener noreferrer" style={{
            color: "#fff",
            textDecoration: "none",
            opacity: 0.9,
            whiteSpace: "nowrap",
          }}>
            ⚙️ Admin
          </a>
        )}
      </nav>

      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
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
                padding: "8px 20px",
                background: "#fff",
                color: "#FF6B9D",
                border: "none",
                fontWeight: "bold",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "13px",
                transition: "all 0.3s",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                whiteSpace: "nowrap",
              }}
              onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.target.style.transform = "scale(1)"}
            >
              🔑 Iniciar
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: "8px 20px",
                background: "transparent",
                color: "#fff",
                border: "2px solid #fff",
                fontWeight: "bold",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "13px",
                transition: "all 0.3s",
                whiteSpace: "nowrap",
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
              padding: "8px 20px",
              background: "#fff",
              color: "#FF6B9D",
              border: "none",
              fontWeight: "bold",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "13px",
              transition: "all 0.3s",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              whiteSpace: "nowrap",
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
