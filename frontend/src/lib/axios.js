import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Axios Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Axios Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("Axios Response Error:", error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);
