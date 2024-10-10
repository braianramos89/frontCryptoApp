import api from '../utils/api';

export const getUsdBalance = () => {
    return api.get('/api/v1/balance/current/usd');
};

export const getCryptoBalance = (cryptocurrencyId) => {
    return api.get(`/api/v1/balance/current/${cryptocurrencyId}`);
};
