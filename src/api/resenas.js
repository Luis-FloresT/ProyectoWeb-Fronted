import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getResenas = () => axios.get(`${API_URL}/resenas/`);
export const createResena = (data) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_URL}/resenas/`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
