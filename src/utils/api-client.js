import axios from "axios";
import { SERVER_URL } from "../../constants";

// Single axios instance for the whole app
const API = axios.create({
    baseURL: SERVER_URL.development,
    timeout: 12000,
});

// Intercept request to add the token if available
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.replace("/login");
        }
        return Promise.reject(error);
    }
);

export default API;