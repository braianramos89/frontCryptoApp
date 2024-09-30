import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

const CryptoActions = ({ crypto, onBuy, onSell }) => {
    const { keycloak } = useKeycloak();
    const [usdBalance, setUsdBalance] = useState("0"); // Guardar como string inicialmente
    const [cryptoBalance, setCryptoBalance] = useState("0");
    const [amount, setAmount] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (keycloak && keycloak.authenticated) {
            // Obtener el balance en USD
            const fetchUsdBalance = async () => {
                try {
                    const response = await fetch('http://localhost:8081/api/balance/current/usd', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${keycloak.token}`,
                        },
                    });

                    const data = await response.json();
                    console.log("Respuesta USD Balance Completa:", data);



                    if (!response.ok) {
                        throw new Error('Error al obtener el balance en USD');
                    }

                    setUsdBalance(data);
                } catch (error) {
                    console.error(error.message);
                    setUsdBalance("0"); // Asignar valor por defecto en caso de error
                }
            };

            // Obtener el balance de la criptomoneda seleccionada
            const fetchCryptoBalance = async () => {
                try {
                    const response = await fetch(`http://localhost:8081/api/balance/current/${crypto.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${keycloak.token}`,
                        },
                    });

                    const data = await response.json();
                    console.log("Respuesta Crypto Balance Completa:", data);

                    if (!response.ok) {
                        throw new Error('Error al obtener el balance de la criptomoneda');
                    }

                    setCryptoBalance(data);
                } catch (error) {
                    console.error(error.message);
                    setCryptoBalance("0");
                }
            };

            fetchUsdBalance();
            fetchCryptoBalance();
        }
    }, [crypto, keycloak]);

    const handleAmountChange = (e) => {
        setAmount(parseFloat(e.target.value));
    };

    const handleSell = () => {
        if (amount <= 0) {
            setErrorMessage("La cantidad debe ser mayor a 0");
            return;
        }
        if (parseFloat(amount) > parseFloat(cryptoBalance)) {
            setErrorMessage(`No tienes suficiente ${crypto.name} para vender.`);
        } else {
            setErrorMessage("");
            onSell(crypto, amount);
        }
    };

    return (
        <div className="mt-4 p-4 border border-gray-700 rounded-lg bg-gray-800 text-white">
            <h2 className="text-lg font-bold">Opciones para {crypto.name}</h2>
            <p className="text-sm text-gray-300 mb-2">Símbolo: {crypto.symbol.toUpperCase()}</p>

            {/* Mostrar el balance en USD con formato adecuado */}
            <p className="text-sm text-gray-300 mb-2">
                Balance en USD: {usdBalance !== null && usdBalance !== undefined ? `$${usdBalance}` : "N/A"}
            </p>

            {/* Mostrar el balance de la criptomoneda con formato adecuado */}
            <p className="text-sm text-gray-300 mb-4">
                Balance en {crypto.symbol.toUpperCase()}: {cryptoBalance !== null && cryptoBalance !== undefined ? `${cryptoBalance}` : "N/A"}
            </p>

            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

            <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Cantidad a Operar:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.0"
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="flex justify-around">
                <button
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"
                    onClick={() => onBuy(crypto, amount)}
                    disabled={amount <= 0}
                >
                    Comprar
                </button>
                <button
                    className={`px-4 py-2 ${amount > 0 && parseFloat(amount) <= parseFloat(cryptoBalance) ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-500 cursor-not-allowed'} rounded-md`}
                    onClick={handleSell}
                    disabled={amount <= 0 || parseFloat(amount) > parseFloat(cryptoBalance)}
                >
                    Vender
                </button>
            </div>
        </div>
    );
};

export default CryptoActions;
