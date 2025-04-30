import axios from "axios";

const API_URL =  'https://trading-platform-backend-zpv4.onrender.com' //import.meta.env.MODE === 'development' ? 'http://localhost:4000/api' : '/api'

const axiosInstance = axios.create({baseURL: API_URL, withCredentials: true}) 

export default axiosInstance
