// Exportar todo desde los módulos API para facilitar imports

export { login, register } from './auth';
export { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario } from './usuarios';
export { 
  getServicios, getServicio, createServicio, updateServicio, deleteServicio,
  getCategorias, getCategoria, createCategoria, updateCategoria, deleteCategoria,
  getCombos, getCombo, createCombo, updateCombo, deleteCombo,
  getPromociones, getPromocion, createPromocion, updatePromocion, deletePromocion,
} from './productos';
export {
  getHorarios, getHorario, getHorariosDisponibles, createHorario, updateHorario, deleteHorario,
  getReservas, getReserva, createReserva, updateReserva, deleteReserva,
  getPagos, getPago, createPago, updatePago, deletePago,
  getCancelaciones, getCancelacion, createCancelacion, updateCancelacion, deleteCancelacion,
} from './reservas';
export { getCarrito, addToCarrito, deleteItemCarrito, confirmarCarrito } from './carrito';
