import React, { useState } from 'react';
import { sellCryptocurrency } from '../services/cryptoService';

function SellCrypto() {
    const [cryptocurrencyId, setCryptocurrencyId] = useState('');
    const [amount, setAmount] = useState('');

    const handleSell = (e) => {
        e.preventDefault();
        sellCryptocurrency({ cryptocurrencyId, amount: parseFloat(amount) })
            .then(() => {
                alert('Venta realizada con éxito');
            })
            .catch((error) => {
                console.error('Error al vender criptomoneda:', error);
            });
    };

    return (
        <div>
            <h2>Vender Criptomoneda</h2>
            <form onSubmit={handleSell}>
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
                <button type="submit">Vender</button>
            </form>
        </div>
    );
}

export default SellCrypto;
