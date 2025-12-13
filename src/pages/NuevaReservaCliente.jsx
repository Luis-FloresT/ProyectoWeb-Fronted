// src/pages/NuevaReservaCliente.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import {
  getCombos,
  getServicios,
  getPromociones,
  createReserva,
} from "../apiService";

const FUENTE = '"Comic Sans MS", "Trebuchet MS", cursive, sans-serif';
const ROSA = "#FF6B9D";
const ROSA_CLARO = "#FF8C94";
const CREMA = "#FFF9E6";

function NuevaReservaCliente() {
  const navigate = useNavigate();

  const [direccion, setDireccion] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [tipo, setTipo] = useState("");
  const [opcionId, setOpcionId] = useState("");

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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FFE6F0 0%, #FFF9E6 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          sx={{
            color: ROSA,
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
            borderRadius: "25px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
            p: 4,
            maxWidth: "1000px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            fontFamily: FUENTE,
          }}
        >
          <TextField
            label="Dirección del Evento *"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
            fullWidth
            InputLabelProps={{ style: { fontFamily: FUENTE, color: "#FF7BAA" } }}
            InputProps={{
              style: { fontFamily: FUENTE, fontSize: "1rem", color: "#444" },
            }}
          />

          <TextField
            label="Fecha y hora del Evento *"
            type="datetime-local"
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
            required
            fullWidth
            InputLabelProps={{
              shrink: true,
              style: { fontFamily: FUENTE, color: "#FF7BAA" },
            }}
            InputProps={{
              style: { fontFamily: FUENTE, fontSize: "1rem", color: "#444" },
            }}
          />

          <FormControl fullWidth>
            <InputLabel
              id="tipo-label"
              sx={{ fontFamily: FUENTE, color: "#FF7BAA" }}
            >
              ¿Qué quieres reservar?
            </InputLabel>
            <Select
              labelId="tipo-label"
              value={tipo}
              label="¿Qué quieres reservar?"
              onChange={(e) => {
                setTipo(e.target.value);
                setOpcionId("");
              }}
              required
              sx={{ fontFamily: FUENTE, backgroundColor: CREMA }}
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
            </Select>
          </FormControl>

          {tipo === "servicio" && (
            <FormControl fullWidth>
              <InputLabel
                id="servicio-label"
                sx={{ fontFamily: FUENTE, color: "#FF7BAA" }}
              >
                Servicio
              </InputLabel>
              <Select
                labelId="servicio-label"
                value={opcionId}
                label="Servicio"
                onChange={(e) => setOpcionId(e.target.value)}
                required
                sx={{ fontFamily: FUENTE, backgroundColor: CREMA }}
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
              </Select>
            </FormControl>
          )}

          {tipo === "combo" && (
            <FormControl fullWidth>
              <InputLabel
                id="combo-label"
                sx={{ fontFamily: FUENTE, color: "#FF7BAA" }}
              >
                Combo
              </InputLabel>
              <Select
                labelId="combo-label"
                value={opcionId}
                label="Combo"
                onChange={(e) => setOpcionId(e.target.value)}
                required
                sx={{ fontFamily: FUENTE, backgroundColor: CREMA }}
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
              </Select>
            </FormControl>
          )}

          {tipo === "promocion" && (
            <FormControl fullWidth>
              <InputLabel
                id="promo-label"
                sx={{ fontFamily: FUENTE, color: "#FF7BAA" }}
              >
                Promoción
              </InputLabel>
              <Select
                labelId="promo-label"
                value={opcionId}
                label="Promoción"
                onChange={(e) => setOpcionId(e.target.value)}
                required
                sx={{ fontFamily: FUENTE, backgroundColor: CREMA }}
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
              </Select>
            </FormControl>
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              background: `linear-gradient(135deg, ${ROSA} 0%, ${ROSA_CLARO} 100%)`,
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "30px",
              py: 1.5,
              fontSize: "1.1rem",
              fontFamily: FUENTE,
              "&:hover": {
                background: `linear-gradient(135deg, ${ROSA_CLARO} 0%, ${ROSA} 100%)`,
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
