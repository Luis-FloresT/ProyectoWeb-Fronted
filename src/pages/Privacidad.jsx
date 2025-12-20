import { Box, Typography } from "@mui/material";

export default function Privacidad() {
  return (
    <Box sx={{ padding: "60px", maxWidth: "900px", margin: "auto" }}>
      <Typography variant="h3" sx={{ mb: 3, color: "#FF6B9D", fontWeight: "bold" }}>
        Política de privacidad
      </Typography>

      <Typography variant="body1" sx={{ fontSize: "18px", lineHeight: 1.8 }}>
        Burbujitas de Colores protege la información personal de sus clientes.
        Los datos recopilados se utilizan únicamente para la gestión de reservas
        y comunicación con el usuario.
      </Typography>
    </Box>
  );
}
