import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, onClick, color = "pink" }) => {
  const colorClasses = {
    pink: "from-pink-500 to-rose-400",
    orange: "from-orange-400 to-amber-300",
    purple: "from-purple-500 to-indigo-400",
    green: "from-emerald-400 to-teal-500"
  };

  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer group bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          
          {trendValue && (
            <div className={`flex items-center mt-2 text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
              {trendValue}
              <span className="text-gray-400 font-normal ml-1">vs mes anterior</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg shadow-pink-200/50 group-hover:rotate-12 transition-transform`}>
          <Icon size={24} />
        </div>
      </div>
      
      {/* Decorative gradient blur */}
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${colorClasses[color]} opacity-10 blur-2xl rounded-full`}></div>
    </div>
  );
};

export default StatCard;
