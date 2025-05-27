import axios from "axios";

const API_URL =  'http://localhost:4000/api'  // 'https://trading-platform-backend-zpv4.onrender.com/api'

const axiosInstance = axios.create({baseURL: API_URL, withCredentials: true}) 

export default axiosInstance
