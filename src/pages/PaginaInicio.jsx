import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const logoLeft = "/logo.png"; // Cambia a tu logo real

export default function PaginaInicio() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(90deg,#e0876a 55%,#f9dbc7 100%)",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      overflowX: "hidden"
    }}>
      {/* Header barra */}
      <header style={{
        width: "100vw",
        position: "static",
        top: 0,
        left: 0,
        zIndex: 10,
        background: "#fff",
        borderBottom: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "30px 4vw 30px 3vw",
        boxSizing: "border-box",
        margin: 0
      }}>
        <img src={logoLeft} alt="Logo" style={{height: "44px"}} />
        <nav style={{
          display: "flex", gap: "42px", fontWeight: "bold", fontSize: "20px"
        }}>
          <NavLink to="/reservas" style={({isActive})=>({
            color: isActive ? "#e64646" : "#241e48", textDecoration: isActive ? "underline":"none"
          })}>Reservas</NavLink>
          <NavLink to="/categorias" style={({isActive})=>({
            color: isActive ? "#e64646" : "#241e48", textDecoration: isActive ? "underline":"none"
          })}>Categorías</NavLink>
          <NavLink to="/promociones" style={({isActive})=>({
            color: isActive ? "#e64646" : "#241e48", textDecoration: isActive ? "underline":"none"
          })}>Promociones</NavLink>
          <NavLink to="/combos" style={({isActive})=>({
            color: isActive ? "#e64646" : "#241e48", textDecoration: isActive ? "underline":"none"
          })}>Combos</NavLink>
          <NavLink to="/horarios" style={({isActive})=>({
            color: isActive ? "#e64646" : "#241e48", textDecoration: isActive ? "underline":"none"
          })}>Horarios</NavLink>
          {isAdmin && (
            <NavLink to="/admin" style={({isActive})=>({
              color: isActive ? "#e64646" : "#241e48", textDecoration: isActive ? "underline" : "none"
            })}>Admin</NavLink>
          )}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('is_admin');
            navigate('/login');
          }}
          style={{
            padding: "13px 32px", background: "none", color: "#e64646",
            border: "2px solid #e64646", fontWeight: "bold", borderRadius: "22px",
            fontSize: "17px", cursor: "pointer"
          }}
        >Cerrar sesión</button>
      </header>

      <div style={{
        width: "100vw",
        minHeight: "calc(100vh - 104px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <h1 style={{
          fontSize: "4vw", color: "#fff", fontWeight: "bold", letterSpacing: "1px",
          textShadow:"2px 4px 16px #0007", marginBottom:"12px", marginTop:"3vw"
        }}>BURBUJITAS DE COLORES</h1>
        <p style={{
          color: "#fff", fontSize: "2vw", maxWidth: "900px", fontWeight: 500, textAlign:"center",
          textShadow: "1px 1px 7px #0007", marginBottom: "38px"
        }}>
          Ofrecemos servicios de fiestas infantiles llenos de diversión y entretenimiento para niños.
        </p>
        <button style={{
          padding: "16px 48px", borderRadius: "13px",
          background: "#fff", color: "#e64646", border: "2px solid #fff",
          fontWeight: "bold", fontSize: "22px", cursor: "pointer", boxShadow: "1px 8px 36px #bb887370"
        }}>Contáctanos</button>
      </div>
    </div>
  );
}
