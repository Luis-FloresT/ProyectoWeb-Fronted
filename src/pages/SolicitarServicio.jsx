import { Box, Typography, Button } from "@mui/material";

export default function SolicitarServicio() {
  return (
    <Box sx={{ padding: "60px 20px", textAlign: "center" }}>
      <Typography variant="h3" sx={{ color: "#FF6B9D", fontWeight: "bold", mb: 2 }}>
        Solicitar Servicio 🎈
      </Typography>

      <Typography sx={{ maxWidth: 700, margin: "auto", color: "#555", mb: 4 }}>
        Aquí puedes solicitar cualquiera de nuestros servicios para hacer tu evento
        inolvidable. Contamos con animación, decoración, juegos y mucho más.
      </Typography>

     
    </Box>
  );
}
