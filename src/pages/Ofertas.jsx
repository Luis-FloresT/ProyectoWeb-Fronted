import { Box, Typography } from "@mui/material";

export default function Ofertas() {
  return (
    <Box sx={{ padding: "60px 20px", textAlign: "center" }}>
      <Typography variant="h3" sx={{ color: "#4ECDC4", fontWeight: "bold", mb: 2 }}>
        Ofertas Especiales 🎁
      </Typography>

      <Typography sx={{ maxWidth: 700, margin: "auto", color: "#555" }}>
        Descubre nuestras promociones activas y combos especiales pensados
        para que disfrutes más pagando menos.
      </Typography>
    </Box>
  );
}
