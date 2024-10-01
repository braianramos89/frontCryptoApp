import React, { useState } from 'react';
import Navbar from './Navbar';
import CryptoList from './CryptoList';

const CryptoPage = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda de criptomonedas
    const [selectedCrypto, setSelectedCrypto] = useState(null);

    return (
        <div>
            {/* Incluir la Navbar para la navegación entre las secciones */}
            <Navbar />

            {/* Contenedor principal con el formato adecuado */}
            <div className="home-container mt-8 flex flex-col items-center">
                <h1 className="text-2xl font-bold text-center text-blue-500 mb-4">CriptoTarjetas</h1>

                {/* Contenedor de búsqueda y tarjetas */}
                <div className="w-full max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-end items-center mb-1"> {/* Cambiado de `mb-4` a `mb-2` para reducir espacio */}{/* Cambiado de `mb-4` a `mb-2` para reducir espacio */}
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
                </div>

                {/* Mostrar la lista de tarjetas dentro del contenedor */}
                <div className="w-full max-w-6xl">
                    <CryptoList
                        searchTerm={searchTerm}
                        onSelectCrypto={(crypto) => setSelectedCrypto(crypto)} // Manejar la selección de una tarjeta
                    />
                </div>
            </div>
        </div>
    );
};

export default CryptoPage;
