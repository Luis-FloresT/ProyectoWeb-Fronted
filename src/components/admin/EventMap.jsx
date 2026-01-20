import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corregir problema de iconos de Leaflet en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const EventMap = () => {
  // Coordenadas de Manta, Ecuador
  const events = [
    { id: 1, pos: [-0.9537, -80.7089], title: 'Reserva 102 - Paul', address: 'Av. Flavio Reyes y Calle 15', color: '#ec4899' },
    { id: 2, pos: [-0.9620, -80.7150], title: 'Reserva 105 - Maria', address: 'Malecón Escénico, Barrio Los Esteros', color: '#f97316' },
    { id: 3, pos: [-0.9480, -80.7020], title: 'Reserva 108 - Carlos', address: 'Av. 4 de Noviembre y Calle 12', color: '#a78bfa' },
    { id: 4, pos: [-0.9590, -80.7200], title: 'Reserva 112 - Ana', address: 'Urbanización El Palmar, Calle Principal', color: '#10b981' },
    { id: 5, pos: [-0.9450, -80.7100], title: 'Reserva 115 - Luis', address: 'Av. 24 de Mayo y Calle 105', color: '#f59e0b' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20">
      <h4 className="text-xl font-bold text-gray-800 mb-4">Ubicación de Eventos de la Semana</h4>
      <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-gray-100">
        <MapContainer 
          center={[-0.9537, -80.7089]} 
          zoom={13} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {events.map(event => (
            <Marker key={event.id} position={event.pos}>
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-pink-500">{event.title}</p>
                  <p className="text-xs text-gray-600">{event.address}</p>
                  <p className="text-xs text-gray-400">Manta, Ecuador</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default EventMap;
