import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3444",
  withCredentials: true, 
    headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const customerToken = localStorage.getItem('customerToken');
    const vendorToken = localStorage.getItem('vendorToken');
    const token = customerToken || vendorToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('customerToken');
      localStorage.removeItem('vendorToken');
      window.location.href = '/login';
    
    }
    return Promise.reject(error);
  }
);

export default api;