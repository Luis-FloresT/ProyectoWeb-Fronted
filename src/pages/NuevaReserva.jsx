import React from "react";
import CrearReservaForm from "./CrearReservaForm";
import NuevaReservaCliente from "./NuevaReservaCliente";

function NuevaReserva() {
  const esAdmin = localStorage.getItem("is_admin") === "true";
  return esAdmin ? <CrearReservaForm /> : <NuevaReservaCliente />;
}

export default NuevaReserva;
