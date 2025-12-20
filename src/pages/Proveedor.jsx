import { Box, Typography } from "@mui/material";

export default function Proveedor() {
  return (
    <Box sx={{ padding: "60px 20px", textAlign: "center" }}>
      <Typography variant="h3" sx={{ color: "#FF6B9D", fontWeight: "bold", mb: 2 }}>
        Quiero ser Proveedor 🤝
      </Typography>

      <Typography sx={{ maxWidth: 700, margin: "auto", color: "#555" }}>
        ¿Tienes servicios para fiestas o eventos?
        Únete a Burbujitas de Colores y forma parte de nuestra red de proveedores.
        Escribenos al 0981362088 para más información.

      </Typography>
    </Box>
  );
}
