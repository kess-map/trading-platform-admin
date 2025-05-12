import axios from "axios";

const API_URL =  'https://trading-platform-backend-zpv4.onrender.com/api'  //   'http://localhost:4000/api'

const axiosInstance = axios.create({baseURL: API_URL, withCredentials: true}) 

export default axiosInstance
