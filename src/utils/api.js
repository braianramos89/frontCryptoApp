import axios from 'axios';
import keycloak from '../Keycloak';


const api = axios.create({
    baseURL: '/api', // URL de tu backend en Spring Boot
});

api.interceptors.request.use(
    (config) => {
        if (keycloak.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            keycloak.logout();
        }
        return Promise.reject(error);
    }
);
