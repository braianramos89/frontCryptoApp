import api from '../utils/api';

export const getCryptocurrencies = () => {
    return api.get('/api/v1/cryptos');
};

export const buyCryptocurrency = (buyRequest) => {
    return api.post('/api/v1/cryptos/buy', buyRequest);
};

export const sellCryptocurrency = (sellRequest) => {
    return api.post('/api/v1/cryptos/sell', sellRequest);
};

// Agrega más métodos según tus necesidades
