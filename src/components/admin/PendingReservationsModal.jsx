import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Trash2, 
  Calendar, 
  User, 
  DollarSign, 
  Search, 
  AlertCircle,
  Clock,
  Ban,
  Maximize2
} from 'lucide-react';
import { getReservas, aprobarReserva, anularReserva, eliminarReserva } from '../../api/reservas';
import { BASE_URL } from '../../api/client';

const PendingReservationsModal = ({ isOpen, onClose }) => {
  const [pendingReservations, setPendingReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transaccionIds, setTransaccionIds] = useState({});
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchPendingReservations();
    }
  }, [isOpen]);

  const fetchPendingReservations = async () => {
    setLoading(true);
    try {
      const res = await getReservas();
      // Filtrar por estado PENDIENTE
      const pending = res.data.filter(r => r.estado === 'PENDIENTE');
      setPendingReservations(pending);
      // Inicializar los inputs de transaccion_id
      const ids = {};
      pending.forEach(r => {
        ids[r.id] = '';
      });
      setTransaccionIds(ids);
    } catch (err) {
      console.error("Error cargando reservas:", err);
      setError("No se pudieron cargar las reservas pendientes.");
    } finally {
      setLoading(false);
    }
  };

  const handleTransaccionIdChange = (id, value) => {
    setTransaccionIds(prev => ({ ...prev, [id]: value }));
  };

  const handleApprove = async (id) => {
    const tid = transaccionIds[id];
    if (!tid) {
      alert("Por favor, ingresa el ID de transacción antes de aprobar.");
      return;
    }

    try {
      await aprobarReserva(id, tid);
      alert("Reserva aprobada con éxito.");
      fetchPendingReservations();
    } catch (err) {
      alert(err.response?.data?.error || "Error al aprobar la reserva.");
    }
  };

  const handleAnnul = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas ANULAR esta reserva?")) return;
    try {
      await anularReserva(id);
      alert("Reserva anulada.");
      fetchPendingReservations();
    } catch (err) {
      alert("Error al anular la reserva.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas ELIMINAR/OCULTAR esta reserva?")) return;
    try {
      await eliminarReserva(id);
      alert("Reserva marcada como eliminada.");
      fetchPendingReservations();
    } catch (err) {
      alert("Error al eliminar la reserva.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white/95 backdrop-blur-2xl w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50 overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="p-8 flex justify-between items-center border-b border-gray-100 bg-white/50">
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                Control de Pagos
              </h2>
              <p className="text-gray-400 text-sm font-medium">Validación antifraude y aprobación de eventos</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 hover:bg-rose-50 rounded-2xl transition-all duration-300 text-gray-400 hover:text-rose-500 hover:rotate-90 group"
            >
              <X size={28} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto space-y-6 custom-scrollbar">
            {loading ? (
              <div className="py-20 text-center">
                <div className="animate-spin w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="font-bold text-gray-400">Sincronizando con el servidor...</p>
              </div>
            ) : error ? (
              <div className="py-10 text-center bg-rose-50 rounded-3xl border border-rose-100 mx-4">
                <AlertCircle className="mx-auto text-rose-500 mb-2" size={40} />
                <p className="text-rose-600 font-bold">{error}</p>
              </div>
            ) : pendingReservations.length === 0 ? (
              <div className="py-20 text-center bg-emerald-50 rounded-3xl border border-emerald-100 mx-4">
                <Check className="mx-auto text-emerald-500 mb-2" size={48} />
                <h3 className="text-emerald-700 font-black text-xl">¡Todo al día!</h3>
                <p className="text-emerald-600/70">No hay pagos pendientes de revisión.</p>
              </div>
            ) : (
              pendingReservations.map((reserva) => (
                <div key={reserva.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-pink-200">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    
                    {/* Visualizador de Comprobante */}
                    <div className="md:col-span-4 relative group aspect-video md:aspect-auto">
                      {reserva.comprobante_pago ? (
                        <>
                          <img 
                            src={reserva.comprobante_pago.startsWith('http') ? reserva.comprobante_pago : `${BASE_URL}${reserva.comprobante_pago}`} 
                            alt="Comprobante" 
                            className="w-full h-full object-cover cursor-zoom-in group-hover:scale-110 transition-transform duration-500"
                            onClick={() => setZoomImage(reserva.comprobante_pago.startsWith('http') ? reserva.comprobante_pago : `${BASE_URL}${reserva.comprobante_pago}`)}
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <Maximize2 className="text-white" size={32} />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4">
                          <Ban size={32} className="text-gray-300 mb-2" />
                          <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-widest">Sin imagen cargada</p>
                        </div>
                      )}
                    </div>

                    {/* Datos y Acciones */}
                    <div className="md:col-span-8 p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center space-x-2 text-gray-400 mb-1">
                            <Clock size={14} />
                            <span className="text-xs font-bold uppercase">{reserva.fecha_evento} | {reserva.fecha_inicio}</span>
                          </div>
                          <h4 className="text-xl font-black text-gray-800 uppercase tracking-tight">#{reserva.codigo_reserva}</h4>
                          <p className="text-pink-500 font-bold flex items-center mt-1">
                            <User size={16} className="mr-1" /> {reserva.cliente_nombre}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">REV. MANUAL</span>
                          <p className="text-2xl font-black text-gray-900 mt-2">${reserva.total}</p>
                        </div>
                      </div>

                      {/* Control Antifraude */}
                      <div className="mb-6">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">ID Transacción / Referencia Bancaria</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Ingrese código de validación..."
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold text-gray-700 focus:border-emerald-400 focus:bg-white transition-all outline-none pl-11"
                            value={transaccionIds[reserva.id] || ''}
                            onChange={(e) => handleTransaccionIdChange(reserva.id, e.target.value)}
                          />
                          <Search size={18} className="absolute left-4 top-3.5 text-gray-300" />
                        </div>
                      </div>

                      {/* Botones */}
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => handleApprove(reserva.id)}
                          disabled={!transaccionIds[reserva.id]}
                          className={`flex-1 min-w-[120px] font-black py-3 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 active:scale-95 shadow-lg border-b-4 ${
                            transaccionIds[reserva.id] 
                              ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-teal-700 shadow-emerald-200' 
                              : 'bg-gray-100 text-gray-300 border-gray-300 cursor-not-allowed shadow-none'
                          }`}
                        >
                          <Check size={18} />
                          <span>APROBAR</span>
                        </button>
                        
                        <button 
                          onClick={() => handleAnnul(reserva.id)}
                          className="px-4 bg-orange-400 text-white font-black py-3 rounded-2xl flex items-center justify-center space-x-2 hover:bg-orange-500 transition-colors active:scale-95 shadow-lg shadow-orange-100 border-b-4 border-orange-600"
                        >
                          <Ban size={18} />
                          <span className="hidden sm:inline">ANULAR</span>
                        </button>

                        <button 
                          onClick={() => handleDelete(reserva.id)}
                          className="px-4 bg-white border-2 border-rose-100 text-rose-500 font-black py-3 rounded-2xl flex items-center justify-center space-x-2 hover:bg-rose-50 transition-colors active:scale-95"
                          title="Eliminar registro"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Image */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-in zoom-in-95 duration-200"
          onClick={() => setZoomImage(null)}
        >
          <button className="absolute top-8 right-8 text-white hover:text-rose-400 transition-colors">
            <X size={40} />
          </button>
          <img 
            src={zoomImage} 
            alt="Comprobante Full" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  );
};

export default PendingReservationsModal;
