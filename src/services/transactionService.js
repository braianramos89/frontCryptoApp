import axios from 'axios';
import Keycloak from '../KeycloakWrapper';

const API_URL = '/api/v1/cryptocurrency';

const transactionService = {
    getAllTransactions: async () => {
        const token = Keycloak.token;
        const response = await axios.get(`${API_URL}/transactions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    getAverageSales: async (userId) => {
        const token = Keycloak.token;
        const response = await axios.get(`${API_URL}/transactions/average/sales`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                userId: userId,
            },
        });
        return response.data;
    },

    getAveragePurchases: async (userId) => {
        const token = Keycloak.token;
        const response = await axios.get(`${API_URL}/transactions/average/purchases`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                userId: userId,
            },
        });
        return response.data;
    },
};

export default transactionService;
