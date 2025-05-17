import axios from "axios";
import { API_URL } from "./env";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na API:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosInstance;
