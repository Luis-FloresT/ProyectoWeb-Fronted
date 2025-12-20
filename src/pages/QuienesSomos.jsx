import { Box, Typography } from "@mui/material";

export default function QuienesSomos() {
  return (
    <Box sx={{ padding: "60px", maxWidth: "900px", margin: "auto" }}>
      <Typography variant="h3" sx={{ mb: 3, color: "#FF6B9D", fontWeight: "bold" }}>
        ¿Quiénes somos?
      </Typography>

      <Typography variant="body1" sx={{ fontSize: "18px", lineHeight: 1.8 }}>
        Burbujitas de Colores es una empresa dedicada a crear experiencias
        inolvidables para fiestas infantiles y eventos especiales.  
        Ofrecemos servicios, combos y promociones diseñadas para llenar
        cada celebración de alegría, color y diversión.
      </Typography>
    </Box>
  );
}
