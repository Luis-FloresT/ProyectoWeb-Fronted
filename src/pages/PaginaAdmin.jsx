import React, { useEffect, useState } from 'react';
import { getUsuarios, deleteUsuario, getServicios, deleteServicio } from '../apiService';

function PaginaAdmin() {
  // Estados para usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosLoading, setUsuariosLoading] = useState(true);
  const [usuariosError, setUsuariosError] = useState('');
  // Estados para servicios
  const [servicios, setServicios] = useState([]);
  const [serviciosLoading, setServiciosLoading] = useState(true);
  const [serviciosError, setServiciosError] = useState('');

  useEffect(() => {
    setUsuariosLoading(true);
    getUsuarios()
      .then(response => {
        setUsuarios(response.data);
        setUsuariosLoading(false);
      })
      .catch(() => {
        setUsuariosError('Error al cargar usuarios');
        setUsuariosLoading(false);
      });
  }, []);

  useEffect(() => {
    setServiciosLoading(true);
    getServicios()
      .then(response => {
        setServicios(response.data);
        setServiciosLoading(false);
      })
      .catch(() => {
        setServiciosError('Error al cargar servicios');
        setServiciosLoading(false);
      });
  }, []);

  const handleDeleteUsuario = id => {
    deleteUsuario(id)
      .then(() => setUsuarios(u => u.filter(user => user.id !== id)))
      .catch(() => setUsuariosError('Error eliminando usuario'));
  };

  const handleDeleteServicio = id => {
    deleteServicio(id)
      .then(() => setServicios(s => s.filter(servicio => servicio.id !== id)))
      .catch(() => setServiciosError('Error eliminando servicio'));
  };

  return (
    <div style={{padding: 32, maxWidth: 900, margin: '0 auto'}}>
      <h2>Panel de Administración</h2>
      <section style={{marginTop: 32}}>
        <h3>Usuarios</h3>
        {usuariosLoading ? <p>Cargando usuarios...</p> :
          usuariosError ? <p style={{color: 'red'}}>{usuariosError}</p> : (
            <ul>
              {usuarios.map(user => (
                <li key={user.id}>
                  {user.nombre} ({user.email})
                  <button onClick={() => handleDeleteUsuario(user.id)} style={{marginLeft: 8}}>Eliminar</button>
                </li>
              ))}
            </ul>
        )}
      </section>
      <section style={{marginTop: 48}}>
        <h3>Servicios</h3>
        {serviciosLoading ? <p>Cargando servicios...</p> :
          serviciosError ? <p style={{color: 'red'}}>{serviciosError}</p> : (
            <ul>
              {servicios.map(servicio => (
                <li key={servicio.id}>
                  {servicio.nombre} (Precio: ${servicio.precio})
                  <button onClick={() => handleDeleteServicio(servicio.id)} style={{marginLeft: 8}}>Eliminar</button>
                </li>
              ))}
            </ul>
        )}
      </section>
    </div>
  );
}

export default PaginaAdmin;
