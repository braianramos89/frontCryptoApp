import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

const CryptoActions = ({ crypto, onBuy, onSell }) => {
    const { keycloak } = useKeycloak();
    const [usdBalance, setUsdBalance] = useState("0");
    const [cryptoBalance, setCryptoBalance] = useState("0");
    const [amount, setAmount] = useState(0);
    const [creditAmount, setCreditAmount] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showCreditInput, setShowCreditInput] = useState(false);

    // Función para obtener el balance en USD
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

            if (!response.ok) {
                throw new Error('Error al obtener el balance en USD');
            }
            setUsdBalance(data);
        } catch (error) {
            console.error(error.message);
            setUsdBalance("0");
        }
    };

    // Función para obtener el balance de la criptomoneda seleccionada
    const fetchCryptoBalance = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/balance/current/${crypto?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error('Error al obtener el balance de la criptomoneda');
            }
            setCryptoBalance(data);
        } catch (error) {
            console.error(error.message);
            setCryptoBalance("0");
        }
    };

    // UseEffect que se ejecuta cada vez que cambian `crypto` o `keycloak`
    useEffect(() => {
        if (keycloak && keycloak.authenticated && crypto) {
            fetchUsdBalance();
            fetchCryptoBalance();
        }
    }, [crypto, keycloak]);

    const handleAmountChange = (e) => {
        setAmount(parseFloat(e.target.value));
    };

    // Manejo de la carga de saldo
    const handleCredit = async () => {
        try {
            if (parseFloat(creditAmount) <= 0 || isNaN(parseFloat(creditAmount))) {
                alert("Por favor, ingresa un monto válido para cargar.");
                return;
            }

            await keycloak.updateToken(5); // Actualiza el token antes de la petición
            const response = await fetch('http://localhost:8081/api/balance/credit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`,
                },
                body: JSON.stringify({ amount: parseFloat(creditAmount) }),
            });

            if (!response.ok) {
                throw new Error('Error al cargar el saldo');
            }

            alert(`Se han cargado $${creditAmount} a tu saldo.`);
            setCreditAmount('');
            setShowCreditInput(false);

            // Actualizar los balances después de la carga exitosa
            await fetchUsdBalance();

        } catch (error) {
            alert(`Error al cargar el saldo: ${error.message}`);
            console.error(error.message);
        }
    };

    // Función para manejar la compra de criptomonedas
    const handleBuy = async () => {
        try {
            if (amount <= 0) {
                setErrorMessage("La cantidad debe ser mayor a 0");
                return;
            }

            await onBuy(crypto, amount);

            // Actualizar los balances después de la compra exitosa
            await fetchUsdBalance();
            await fetchCryptoBalance();
        } catch (error) {
            setErrorMessage("Error al comprar la criptomoneda");
        }
    };

    // Función para manejar la venta de criptomonedas
    const handleSell = async () => {
        if (amount <= 0) {
            setErrorMessage("La cantidad debe ser mayor a 0");
            return;
        }
        if (parseFloat(amount) > parseFloat(cryptoBalance)) {
            setErrorMessage(`No tienes suficiente ${crypto.name} para vender.`);
        } else {
            setErrorMessage("");
            await onSell(crypto, amount);

            // Actualizar los balances después de la venta exitosa
            await fetchUsdBalance();
            await fetchCryptoBalance();
        }
    };

    if (!crypto) {
        return <div className="text-red-500">Error: Criptomoneda no seleccionada.</div>;
    }

    return (
        <div className="mt-4 p-4 border border-gray-700 rounded-lg bg-gray-800 text-white">
            <h2 className="text-lg font-bold">Opciones para {crypto.name}</h2>
            <p className="text-sm text-gray-300 mb-2">Símbolo: {crypto.symbol.toUpperCase()}</p>
            <p className="text-sm text-gray-300 mb-2">
                Balance en USD: {usdBalance !== null && usdBalance !== undefined ? `$${usdBalance}` : "N/A"}
            </p>
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

            {!showCreditInput && (
                <button
                    onClick={() => setShowCreditInput(true)}
                    className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md"
                >
                    Cargar Saldo
                </button>
            )}

            {showCreditInput && (
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Monto a Cargar:</label>
                    <input
                        type="number"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        onClick={handleCredit}
                        className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-md"
                    >
                        Confirmar Carga de Saldo
                    </button>
                </div>
            )}

            <div className="flex justify-around">
                <button
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"
                    onClick={handleBuy}
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
