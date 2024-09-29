import React, { useState } from 'react';
import { buyCryptocurrency } from '../services/cryptoService';

function BuyCrypto() {
    const [cryptocurrencyId, setCryptocurrencyId] = useState('');
    const [amount, setAmount] = useState('');

    const handleBuy = (e) => {
        e.preventDefault();
        buyCryptocurrency({ cryptocurrencyId, amount: parseFloat(amount) })
            .then(() => {
                alert('Compra realizada con éxito');
            })
            .catch((error) => {
                console.error('Error al comprar criptomoneda:', error);
            });
    };

    return (
        <div>
            <h2>Comprar Criptomoneda</h2>
            <form onSubmit={handleBuy}>
                <div>
                    <label>ID de la Criptomoneda:</label>
                    <input
                        type="text"
                        value={cryptocurrencyId}
                        onChange={(e) => setCryptocurrencyId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Cantidad:</label>
                    <input
                        type="number"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Comprar</button>
            </form>
        </div>
    );
}

export default BuyCrypto;
