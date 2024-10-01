import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import Pagination from './Pagination';
import Spinner from "./Spinner";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Importar estilos de DatePicker

const CryptoList = () => {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCrypto, setSelectedCrypto] = useState(null); // Criptomoneda seleccionada
    const [startDate, setStartDate] = useState(new Date()); // Fecha de inicio para DatePicker
    const [endDate, setEndDate] = useState(new Date()); // Fecha de fin para DatePicker
    const itemsPerPage = 9; // Mostrar 9 elementos por página
    const { keycloak, initialized } = useKeycloak();

    useEffect(() => {
        const fetchCryptos = async () => {
            if (!initialized) {
                return;
            }

            if (!keycloak.authenticated) {
                setError('Usuario no autenticado');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8081/api/cryptos/market-coins?vsCurrency=usd', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${keycloak.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCryptos(data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching data: ' + error.message);
                setLoading(false);
            }
        };

        fetchCryptos();
    }, [keycloak, initialized]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCryptos = cryptos.slice(indexOfFirstItem, indexOfLastItem);



    const formatNumber = (num) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    };

    const formatPercentage = (num) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num / 100);
    };

    const handleSelect = (crypto) => {
        setSelectedCrypto(crypto); // Marcar la criptomoneda seleccionada
    };

    const handlePredict = () => {
        if (selectedCrypto) {
            const cryptoId = selectedCrypto.id;
            const startDateFormatted = startDate.toISOString().split('T')[0];
            const endDateFormatted = endDate.toISOString().split('T')[0];

            fetch(`http://localhost:8081/api/cryptos/market/evaluate?cryptoId=${cryptoId}&shortPeriod=7&longPeriod=21&startDate=${startDateFormatted}&endDate=${endDateFormatted}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                },
            })
                .then(response => response.text())
                .then(data => {
                    alert(`Resultado de predicción para ${selectedCrypto.name}: ${data}`);
                })
                .catch(error => {
                    console.error('Error al predecir la tendencia:', error);
                    alert(`Error al predecir la tendencia: ${error.message}`);
                });
        }
    };

    if (!initialized) return <div className="text-center">Inicializando Keycloak...</div>;
    if (!keycloak.authenticated) return <div className="text-center">Por favor, inicia sesión para ver las criptomonedas.</div>;
    if (loading) return <div className="text-center"><Spinner message="Cargando..." /> </div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCryptos.map(crypto => (
                    <div
                        key={crypto.id}
                        onClick={() => handleSelect(crypto)}
                        className={`cursor-pointer bg-gray-800 shadow-md rounded-lg p-4 text-white ${
                            selectedCrypto && selectedCrypto.id === crypto.id ? 'border-4 border-blue-500' : ''
                        }`} // Cambiar estilo de tarjeta seleccionada
                    >
                        <div className="flex items-center mb-2">
                            <img src={crypto.image} alt={crypto.name} className="w-8 h-8 mr-2" />
                            <div>
                                <h2 className="text-lg font-bold">{crypto.name}</h2>
                                <p className="text-sm text-gray-400">{crypto.symbol.toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-2xl font-bold text-white">{formatNumber(crypto.current_price)}</p>
                                <div className={`flex items-center ${crypto.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-500'}`}>
                                    {crypto.price_change_percentage_24h > 0 ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                                    <span className="ml-1 text-sm">{formatPercentage(crypto.price_change_percentage_24h)} (24h)</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Cap. de mercado</p>
                                <p className="font-semibold text-white">{formatNumber(crypto.market_cap)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Componente de paginación */}
            <div className="flex justify-center mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(cryptos.length / itemsPerPage)}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Mostrar DatePicker cuando se seleccione una criptomoneda */}
            {selectedCrypto && (
                <div className="mt-8 p-4 bg-gray-800 rounded-lg text-white">
                    <h2 className="text-lg font-bold">Predicción de tendencia para {selectedCrypto.name}</h2>
                    <div className="flex items-center space-x-4 mt-4">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            className="p-2 rounded-md bg-gray-900 border border-gray-600 text-white"
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Fecha de inicio"
                        />
                        <span className="text-gray-400">a</span>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            className="p-2 rounded-md bg-gray-900 border border-gray-600 text-white"
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Fecha de fin"
                        />
                        <button
                            onClick={handlePredict}
                            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Predecir Tendencia
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CryptoList;