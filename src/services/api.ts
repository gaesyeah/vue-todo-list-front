import axios from 'axios';
import router from '@/router';

const api = axios.create({
  //TODO mudar para pegar a url do .env
  baseURL: 'http://localhost:3000/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');

      router.push({ name: 'signin' });
    }

    return Promise.reject(error);
  },
);

export default api;
