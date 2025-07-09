
import axios from 'axios';

const API_BASE_URL = axios.create({
  baseURL: 'https://hastin-container.com/staging/api',
  headers: {
    'Content-Type': 'application/json',
    'ApplicationLabel': 'demo',
  },
});


API_BASE_URL.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `BslogiKey ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API_BASE_URL;
