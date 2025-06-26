import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://weimoodapi.hizkiajonathanbudiana.my.id",
  withCredentials: true,
});

export default axiosInstance;
