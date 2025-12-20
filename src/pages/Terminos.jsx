import { Box, Typography } from "@mui/material";

export default function Terminos() {
  return (
    <Box sx={{ padding: "60px", maxWidth: "900px", margin: "auto" }}>
      <Typography variant="h3" sx={{ mb: 3, color: "#FF6B9D", fontWeight: "bold" }}>
        Términos y condiciones
      </Typography>

      <Typography variant="body1" sx={{ fontSize: "18px", lineHeight: 1.8 }}>
        Al utilizar nuestros servicios, el cliente acepta cumplir con los
        términos establecidos por Burbujitas de Colores.  
        Las reservas están sujetas a disponibilidad y confirmación previa.
      </Typography>
    </Box>
  );
}
