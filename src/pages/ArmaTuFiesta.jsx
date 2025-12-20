import { Box, Typography } from "@mui/material";

export default function ArmaTuFiesta() {
  return (
    <Box sx={{ padding: "60px 20px", textAlign: "center" }}>
      <Typography variant="h3" sx={{ color: "#FFC74F", fontWeight: "bold", mb: 2 }}>
        Arma tu Fiesta 🎉
      </Typography>

      <Typography sx={{ maxWidth: 700, margin: "auto", color: "#555" }}>
        Diseña tu fiesta a tu manera. Elige servicios, combos y promociones
        que se adapten a tu presupuesto y tipo de evento.
      </Typography>
    </Box>
  );
}
