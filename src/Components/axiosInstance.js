
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://hastin-container.com/staging/app', // change if needed
  headers: {
    'Content-Type': 'application/json',
    'ApplicationLabel': 'demo',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `BslogiKey ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
