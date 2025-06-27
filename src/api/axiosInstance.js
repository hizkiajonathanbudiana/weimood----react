import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5173",
  baseURL: "https://weimoodapi.hizkiajonathanbudiana.my.id",
  withCredentials: true,
});

export default axiosInstance;
