import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import Navbar from './Navbar';
import CryptoTable from './CryptoTable';
import Pagination from './Pagination';
import CryptoActions from './CryptoActions';
import Spinner from './Spinner';  // Importa el nuevo componente
import './Home.css';

const Home = () => {
    const { keycloak } = useKeycloak();
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCryptos = cryptos.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => {
        if (currentPage < Math.ceil(cryptos.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

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
                <h1 className="text-2xl font-bold text-center">Lista de Criptomonedas</h1>
                <div className="w-full max-w-4xl">
                    <CryptoTable cryptos={currentCryptos} onSelectCrypto={setSelectedCrypto} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(cryptos.length / itemsPerPage)}
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
