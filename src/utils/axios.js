import axios from "axios";

const API_URL =  'http://localhost:4000/api' //import.meta.env.MODE === 'development' ? 'http://localhost:4000/api' : '/api'

const axiosInstance = axios.create({baseURL: API_URL, withCredentials: true}) 

export default axiosInstance