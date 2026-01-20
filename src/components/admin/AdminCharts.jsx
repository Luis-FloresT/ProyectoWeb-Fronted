import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';

const AdminCharts = () => {
  // Datos de ejemplo para tendencia
  const revenueData = [
    { name: 'Lun', value: 400 },
    { name: 'Mar', value: 300 },
    { name: 'Mie', value: 600 },
    { name: 'Jue', value: 800 },
    { name: 'Vie', value: 500 },
    { name: 'Sab', value: 900 },
    { name: 'Dom', value: 700 },
  ];

  // Datos para servicios estrella
  const pieData = [
    { name: 'Combo Boda Premium', value: 400 },
    { name: 'Cumpleaños Kids', value: 300 },
    { name: 'Graduación PRO', value: 200 },
    { name: 'Bautizo Standard', value: 100 },
  ];

  const COLORS = ['#ec4899', '#f97316', '#a78bfa', '#2dd4bf'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Tendencia de Ingresos */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20">
        <h4 className="text-xl font-bold text-gray-800 mb-6">Tendencia de Ingresos</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Servicios Estrella */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20">
        <h4 className="text-xl font-bold text-gray-800 mb-6">Servicios Estrella</h4>
        <div className="h-[300px] w-full flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 flex flex-col space-y-3 px-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-sm text-gray-600 truncate max-w-[120px]">{entry.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demanda Semanal */}
      <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20">
        <h4 className="text-xl font-bold text-gray-800 mb-6">Demanda por Día</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip cursor={{fill: '#fce7f3'}} contentStyle={{ borderRadius: '1rem', border: 'none' }} />
              <Bar dataKey="value" fill="#fb923c" radius={[10, 10, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;
