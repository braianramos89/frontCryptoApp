import api from '../utils/api';

export const getCryptocurrencies = () => {
    return api.get('/api/cryptos');
};

export const buyCryptocurrency = (buyRequest) => {
    return api.post('/api/cryptos/buy', buyRequest);
};

export const sellCryptocurrency = (sellRequest) => {
    return api.post('/api/cryptos/sell', sellRequest);
};

// Agrega más métodos según tus necesidades
