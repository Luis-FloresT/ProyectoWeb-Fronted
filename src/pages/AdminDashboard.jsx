import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Wallet, 
  Bell, 
  XCircle, 
  Lightbulb,
  Settings,
  User
} from 'lucide-react';
import StatCard from '../components/admin/StatCard';
import AdminCharts from '../components/admin/AdminCharts';
import ActivityTable from '../components/admin/ActivityTable';
import EventMap from '../components/admin/EventMap';
import PendingReservationsModal from '../components/admin/PendingReservationsModal';

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [todayIncome, setTodayIncome] = useState(0);

  // Cargar contador real de pendientes e ingresos de hoy
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await import('../api/reservas').then(m => m.getReservas());
        
        // Contar pendientes
        const count = data.filter(r => r.estado === 'PENDIENTE').length;
        setPendingCount(count);
        
        // Calcular ingresos de hoy (reservas aprobadas hoy)
        const today = new Date().toISOString().split('T')[0];
        const todayApproved = data.filter(r => {
          if (r.estado === 'APROBADA' && r.fecha_confirmacion) {
            const confirmDate = new Date(r.fecha_confirmacion).toISOString().split('T')[0];
            return confirmDate === today;
          }
          return false;
        });
        
        const income = todayApproved.reduce((sum, r) => sum + parseFloat(r.total || 0), 0);
        setTodayIncome(income);
      } catch (e) {
        console.error("Error al cargar estadísticas:", e);
      }
    };
    fetchStats();
  }, [isModalOpen]); // Recargar cuando se cierra el modal (por si se aprobaron)

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#FF6B35_0%,#F7931E_25%,#C724B1_75%,#8B5CF6_100%)] p-4 md:p-8 font-sans transition-all duration-700">
      
      {/* Navbar Superior */}
      <nav className="flex justify-between items-center mb-10 bg-white/20 backdrop-blur-xl p-4 rounded-[2rem] border border-white/30 shadow-2xl">
        <div className="flex items-center space-x-3 ml-4">
          <div className="bg-white p-2 rounded-2xl shadow-inner">
            <span className="text-2xl">🎈</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
            BURBUJITAS <span className="font-light opacity-80">ADMIN</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4 mr-4">
          <button className="p-3 bg-white/40 rounded-2xl text-white hover:bg-white hover:text-pink-500 transition-all duration-300">
            <Bell size={20} />
          </button>
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 border-2 border-white/50 flex items-center justify-center text-white font-bold cursor-pointer">
            A
          </div>
        </div>
      </nav>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Ingresos Totales" 
          value="$12,450.00" 
          icon={DollarSign} 
          trend="up" 
          trendValue="+50%" 
          color="pink"
        />
        <StatCard 
          title="Utilidad Neta" 
          value="$300.00" 
          icon={TrendingUp} 
          color="green"
        />
        <StatCard 
          title="Reservas Pendientes" 
          value={pendingCount} 
          icon={Calendar} 
          onClick={() => setIsModalOpen(true)}
          color="orange"
        />
        <StatCard 
          title="Ingresos Hoy" 
          value={`$${todayIncome.toFixed(2)}`} 
          icon={Wallet} 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
        {/* Columna Izquierda: Gráficos */}
        <div className="xl:col-span-2 space-y-8">
          <AdminCharts />
          <ActivityTable />
        </div>

        {/* Columna Derecha: Alertas, Sugerencias y Mapa */}
        <div className="space-y-8">
          
          {/* Tarjeta de Alerta Cancelaciones */}
          <div className="bg-rose-500/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-rose-400 text-white flex items-center justify-between group cursor-pointer hover:bg-rose-600 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <XCircle size={28} />
              </div>
              <div>
                <h5 className="font-black text-xl">Cancelaciones (30d)</h5>
                <p className="text-rose-100 text-sm opacity-80">3 eventos cancelados hoy</p>
              </div>
            </div>
            <TrendingUp size={24} className="opacity-50 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Banner de Sugerencia */}
          <div className="bg-amber-400/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-amber-300 text-amber-900 flex items-start space-x-4">
            <div className="p-3 bg-white/30 rounded-2xl mt-1">
              <Lightbulb size={24} className="text-amber-800" />
            </div>
            <div>
              <h5 className="font-bold text-lg mb-1">Sugerencia de Crecimiento</h5>
              <p className="text-amber-900/80 leading-snug">
                Para febrero, intenta lanzar una promoción de combos familiares para aprovechar el feriado de Carnaval.
              </p>
            </div>
          </div>

          <EventMap />
          
          {/* Quick Actions Card */}
          <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/40">
            <h4 className="text-white font-black mb-4 flex items-center">
              <Settings size={18} className="mr-2" /> AJUSTES RÁPIDOS
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-white text-pink-500 font-bold rounded-2xl shadow-sm active:scale-95 transition-transform">Categorías</button>
              <button className="p-3 bg-white text-orange-500 font-bold rounded-2xl shadow-sm active:scale-95 transition-transform">Personal</button>
            </div>
          </div>

        </div>
      </div>

      {/* Modal de Reservas */}
      <PendingReservationsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />

      <footer className="mt-20 py-10 text-center text-white/60 text-sm font-medium">
        &copy; 2026 Burbujitas de Colores Dashboard | Diseñado con 💖 para Fiestas Increíbles
      </footer>
    </div>
  );
};

export default AdminDashboard;
