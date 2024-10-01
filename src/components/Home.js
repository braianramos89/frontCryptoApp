import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import Navbar from './Navbar';
import CryptoTable from './CryptoTable';
import Pagination from './Pagination';
import CryptoActions from './CryptoActions';
import './Home.css';
import Spinner from "./Spinner";

const Home = () => {
    const { keycloak } = useKeycloak();
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda
    const itemsPerPage = 5;

    useEffect(() => {
        if (keycloak && keycloak.authenticated) {
            const fetchCryptos = async () => {
                try {
                    await keycloak.updateToken(5);
                    const response = await fetch('http://localhost:8081/api/cryptos', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${keycloak.token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }

                    const data = await response.json();
                    setCryptos(data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error al obtener las criptomonedas:', error);
                    setLoading(false);
                }
            };

            fetchCryptos();
        } else {
            keycloak.login();
        }
    }, [keycloak]);

    // Filtrar las criptomonedas según el término de búsqueda
    const filteredCryptos = cryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCryptos = filteredCryptos.slice(indexOfFirstItem, indexOfLastItem);


    // Función para manejar la compra de una criptomoneda con cantidad específica
    const handleBuy = async (crypto, amount) => {
        try {
            const response = await fetch('http://localhost:8081/api/cryptos/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`,
                },
                body: JSON.stringify({
                    cryptocurrencyId: crypto.id,
                    amount: amount,
                }),
            });

            if (response.status === 400) {
                const errorText = await response.text();
                if (errorText === "Saldo insuficiente") {
                    alert(`Error: ${errorText}`);
                    return;
                }
            }

            if (!response.ok) {
                throw new Error('Error al comprar la criptomoneda');
            }

            alert(`Has comprado ${amount} de ${crypto.name}`);
        } catch (error) {
            alert(`Error al realizar la compra: ${error.message}`);
            console.error(error.message);
        }
    };

    // Función para manejar la venta de una criptomoneda con cantidad específica
    const handleSell = async (crypto, amount) => {
        try {
            const response = await fetch('http://localhost:8081/api/cryptos/sell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`,
                },
                body: JSON.stringify({
                    cryptocurrencyId: crypto.id,
                    amount: amount,
                }),
            });

            if (response.status === 400) {
                const errorText = await response.text();
                if (errorText === "Saldo insuficiente") {
                    alert(`Error: ${errorText}`);
                    return;
                }
            }

            if (!response.ok) {
                throw new Error('Error al vender la criptomoneda');
            }

            alert(`Has vendido ${amount} de ${crypto.name}`);
        } catch (error) {
            console.error(error.message);
            alert(`Error al realizar la venta: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner message="Cargando criptomonedas..." />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="home-container mt-8 flex flex-col items-center">
                <h1 className="text-2xl font-bold text-center mb-4">Lista de Criptomonedas</h1>

                {/* Contenedor de búsqueda y tabla */}
                <div className="w-full max-w-4xl">
                    <div className="flex justify-end mb-1"> {/* Cambiado de `mb-4` a `mb-2` para reducir espacio */}
                        <form className="max-w-sm">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    id="crypto-search"
                                    className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Buscar criptomonedas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>

                    <CryptoTable cryptos={currentCryptos} onSelectCrypto={setSelectedCrypto} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredCryptos.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                    />
                    {selectedCrypto && (
                        <CryptoActions
                            crypto={selectedCrypto}
                            onBuy={handleBuy}
                            onSell={handleSell}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
