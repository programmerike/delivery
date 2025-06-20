import axios from 'axios';

const BASE_URL = '/shipday-backend' //change as needed

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, //if using cookis/auth
});

export default axiosInstance;