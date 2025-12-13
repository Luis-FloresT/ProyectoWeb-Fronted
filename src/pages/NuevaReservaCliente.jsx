// src/pages/NuevaReservaCliente.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";

import {
  getCombos,
  getServicios,
  getPromociones,
  createReserva,
} from "../apiService";

const FUENTE = '"Comic Sans MS", "Trebuchet MS", cursive, sans-serif';

function NuevaReservaCliente() {
  const navigate = useNavigate();

  const [direccion, setDireccion] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [tipo, setTipo] = useState("");          // servicio | combo | promocion
  const [opcionId, setOpcionId] = useState("");  // id seleccionado

  const [combos, setCombos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    async function cargarOpciones() {
      try {
        const [resCombos, resServ, resPromos] = await Promise.all([
          getCombos(),
          getServicios(),
          getPromociones(),
        ]);
        setCombos(resCombos.data);
        setServicios(resServ.data);
        setPromos(resPromos.data);
      } catch (err) {
        console.error("Error cargando combos/servicios/promos", err);
      }
    }
    cargarOpciones();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clienteId = localStorage.getItem("id");

    const data = {
      cliente: clienteId,
      direccion_evento: direccion,
      fecha_evento: fechaHora,
      servicio: tipo === "servicio" ? opcionId : null,
      combo: tipo === "combo" ? opcionId : null,
      promocion: tipo === "promocion" ? opcionId : null,
      total: 0,
      estado: "PENDIENTE",
    };

    try {
      await createReserva(data);
      navigate("/reservas");
    } catch (err) {
      console.error("Error creando reserva", err);
      alert("No se pudo crear la reserva. Revisa los datos.");
    }
  };

  const inputCommon = {
    style: {
      fontFamily: FUENTE,
      fontSize: "1rem",
      color: "#444",
      textAlign: "left",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(135deg, #FF6B9D 0%, #FFD3E2 50%, #FFEFD5 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 6,
        overflow: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            color: "#FF6B9D",
            fontWeight: "bold",
            mb: 4,
            textAlign: "center",
            fontFamily: FUENTE,
          }}
        >
          Nueva Reserva
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            background: "#ffffff",
            borderRadius: "30px",
            boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
            px: 6,
            py: 5,
            maxWidth: "1100px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            fontFamily: FUENTE,
          }}
        >
          {/* Dirección */}
          <TextField
            label="Dirección del Evento *"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
            fullWidth
            InputLabelProps={{
              style: { color: "#FF6B9D", fontFamily: FUENTE },
            }}
            InputProps={inputCommon}
          />

          {/* Fecha y hora */}
          <TextField
            label="Fecha y hora del Evento *"
            type="datetime-local"
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
            required
            fullWidth
            InputLabelProps={{
              shrink: true,
              style: { color: "#FF6B9D", fontFamily: FUENTE },
            }}
            InputProps={inputCommon}
          />

          {/* Tipo de reserva */}
          <TextField
            select
            label="¿Qué quieres reservar? *"
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setOpcionId("");
            }}
            required
            fullWidth
            InputLabelProps={{
              style: { color: "#FF6B9D", fontFamily: FUENTE },
            }}
            InputProps={inputCommon}
            SelectProps={{
              MenuProps: { PaperProps: { style: { fontFamily: FUENTE } } },
            }}
          >
            <MenuItem value="servicio" sx={{ fontFamily: FUENTE }}>
              Servicio
            </MenuItem>
            <MenuItem value="combo" sx={{ fontFamily: FUENTE }}>
              Combo
            </MenuItem>
            <MenuItem value="promocion" sx={{ fontFamily: FUENTE }}>
              Promoción
            </MenuItem>
          </TextField>

          {/* Servicio */}
          {tipo === "servicio" && (
            <TextField
              select
              label="Servicio *"
              value={opcionId}
              onChange={(e) => setOpcionId(e.target.value)}
              required
              fullWidth
              InputLabelProps={{
                style: { color: "#FF6B9D", fontFamily: FUENTE },
              }}
              InputProps={inputCommon}
              SelectProps={{
                MenuProps: { PaperProps: { style: { fontFamily: FUENTE } } },
              }}
            >
              {servicios.map((s) => (
                <MenuItem
                  key={s.id}
                  value={s.id}
                  sx={{ fontFamily: FUENTE }}
                >
                  {s.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}

          {/* Combo */}
          {tipo === "combo" && (
            <TextField
              select
              label="Combo *"
              value={opcionId}
              onChange={(e) => setOpcionId(e.target.value)}
              required
              fullWidth
              InputLabelProps={{
                style: { color: "#FF6B9D", fontFamily: FUENTE },
              }}
              InputProps={inputCommon}
              SelectProps={{
                MenuProps: { PaperProps: { style: { fontFamily: FUENTE } } },
              }}
            >
              {combos.map((c) => (
                <MenuItem
                  key={c.id}
                  value={c.id}
                  sx={{ fontFamily: FUENTE }}
                >
                  {c.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}

          {/* Promoción */}
          {tipo === "promocion" && (
            <TextField
              select
              label="Promoción *"
              value={opcionId}
              onChange={(e) => setOpcionId(e.target.value)}
              required
              fullWidth
              InputLabelProps={{
                style: { color: "#FF6B9D", fontFamily: FUENTE },
              }}
              InputProps={inputCommon}
              SelectProps={{
                MenuProps: { PaperProps: { style: { fontFamily: FUENTE } } },
              }}
            >
              {promos.map((p) => (
                <MenuItem
                  key={p.id}
                  value={p.id}
                  sx={{ fontFamily: FUENTE }}
                >
                  {p.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              background:
                "linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "30px",
              py: 1.5,
              fontSize: "1.1rem",
              fontFamily: FUENTE,
              "&:hover": {
                background:
                  "linear-gradient(135deg, #FF8C94 0%, #FF6B9D 100%)",
              },
            }}
          >
            Confirmar reserva
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default NuevaReservaCliente;
