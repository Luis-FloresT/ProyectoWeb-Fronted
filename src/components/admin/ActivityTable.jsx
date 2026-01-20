import React from 'react';

const ActivityTable = () => {
  const activities = [
    { id: 1, time: '10:30 AM', user: 'admin_maria', action: 'EDIT', message: 'Actualizó precios del Combo Boda Premium', color: 'blue' },
    { id: 2, time: '09:45 AM', user: 'carlos_mod', action: 'DELETE', message: 'Eliminó servicio obsoleto "Payasos 2023"', color: 'red' },
    { id: 3, time: '08:15 AM', user: 'admin_maria', action: 'CREATE', message: 'Creó nueva promoción de San Valentín', color: 'green' },
    { id: 4, time: 'Ayer', user: 'system', action: 'INFO', message: 'Copia de seguridad semanal completada', color: 'gray' },
  ];

  const badges = {
    blue: "bg-blue-100 text-blue-600",
    red: "bg-rose-100 text-rose-600",
    green: "bg-emerald-100 text-emerald-600",
    gray: "bg-gray-100 text-gray-600"
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h4 className="text-xl font-bold text-gray-800">Actividad Reciente del Equipo</h4>
        <button className="text-sm font-bold text-pink-500 hover:text-pink-600 transition-colors">Ver todo</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha/Hora</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Acción</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Mensaje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activities.map((item) => (
              <tr key={item.id} className="hover:bg-pink-50/30 transition-colors cursor-default">
                <td className="px-6 py-4 text-sm text-gray-500 font-medium">{item.time}</td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-gray-800">{item.user}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${badges[item.color]}`}>
                    {item.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
