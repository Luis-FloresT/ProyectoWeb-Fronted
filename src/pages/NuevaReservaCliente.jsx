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
} from "../api";

const FUENTE = '"Comic Sans MS", "Trebuchet MS", cursive, sans-serif';

// Formatear en USD [web:159][web:169]
const formatUSD = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

function NuevaReservaCliente() {
  const navigate = useNavigate();

  const [direccion, setDireccion] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [tipo, setTipo] = useState("");          // servicio | combo | promocion
  const [opcionId, setOpcionId] = useState("");  // id seleccionado

  const [combos, setCombos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [promos, setPromos] = useState([]);

  // Precio y carrito
  const [precioSeleccionado, setPrecioSeleccionado] = useState(0);
  const [carrito, setCarrito] = useState([]);
  const [totalCarrito, setTotalCarrito] = useState(0);

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
      total: totalCarrito || precioSeleccionado || 0,
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

  const handleChangeTipo = (e) => {
    setTipo(e.target.value);
    setOpcionId("");
    setPrecioSeleccionado(0);
  };

  // Calcula precio usando los campos reales: precio_base / precio_combo [file:194]
  const handleChangeOpcion = (e, lista) => {
    const id = e.target.value;
    setOpcionId(id);

    const item = lista.find((x) => String(x.id) === String(id));
    if (!item) {
      setPrecioSeleccionado(0);
      return;
    }

    let precio = 0;
    if (tipo === "servicio") {
      precio = Number(item.precio_base);
    } else if (tipo === "combo") {
      precio = Number(item.precio_combo);
    } else if (tipo === "promocion") {
      // ajusta esto según cómo manejes el precio de la promo
      precio = Number(item.descuento_monto || 0);
    }

    setPrecioSeleccionado(precio);
  };

  const handleAgregarCarrito = () => {
    if (!tipo || !opcionId) return;

    let lista;
    if (tipo === "servicio") lista = servicios;
    if (tipo === "combo") lista = combos;
    if (tipo === "promocion") lista = promos;

    const item = lista.find((x) => String(x.id) === String(opcionId));
    if (!item) return;

    let precio = 0;
    if (tipo === "servicio") {
      precio = Number(item.precio_base);
    } else if (tipo === "combo") {
      precio = Number(item.precio_combo);
    } else if (tipo === "promocion") {
      precio = Number(item.descuento_monto || 0);
    }

    const nuevoItem = {
      id: `${tipo}-${item.id}`,
      tipo,
      refId: item.id,
      nombre: item.nombre,
      precio,
    };

    setCarrito((prev) => [...prev, nuevoItem]);
    setTotalCarrito((prev) => prev + precio);
    setPrecioSeleccionado(precio);
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
            onChange={handleChangeTipo}
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
              onChange={(e) => handleChangeOpcion(e, servicios)}
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
                <MenuItem key={s.id} value={s.id} sx={{ fontFamily: FUENTE }}>
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
              onChange={(e) => handleChangeOpcion(e, combos)}
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
                <MenuItem key={c.id} value={c.id} sx={{ fontFamily: FUENTE }}>
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
              onChange={(e) => handleChangeOpcion(e, promos)}
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
                <MenuItem key={p.id} value={p.id} sx={{ fontFamily: FUENTE }}>
                  {p.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}

          {/* Precio actual */}
          <Typography
            sx={{
              mt: 1,
              fontFamily: FUENTE,
              fontSize: "1.05rem",
              color: "#444",
              textAlign: "right",
            }}
          >
            Precio seleccionado: {formatUSD(precioSeleccionado)}
          </Typography>

          {/* Botón Agregar al carrito */}
          <Button
            type="button"
            onClick={handleAgregarCarrito}
            sx={{
              mt: 1,
              mb: 1,
              alignSelf: "flex-end",
              background:
                "linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "25px",
              px: 4,
              fontFamily: FUENTE,
              "&:hover": {
                background:
                  "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
              },
            }}
          >
            Agregar al carrito
          </Button>

          {/* Botón Confirmar */}
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

          {/* Resumen de carrito */}
          {carrito.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography
                sx={{
                  fontFamily: FUENTE,
                  fontWeight: "bold",
                  mb: 1,
                  color: "#FF6B9D",
                }}
              >
                Carrito
              </Typography>
              {carrito.map((item) => (
                <Typography
                  key={item.id}
                  sx={{
                    fontFamily: FUENTE,
                    fontSize: "0.95rem",
                    color: "#444",
                  }}
                >
                  {item.tipo.toUpperCase()}: {item.nombre} -{" "}
                  {formatUSD(item.precio)}
                </Typography>
              ))}
              <Typography
                sx={{
                  mt: 1,
                  fontFamily: FUENTE,
                  fontWeight: "bold",
                  color: "#444",
                }}
              >
                Total: {formatUSD(totalCarrito)}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default NuevaReservaCliente;
