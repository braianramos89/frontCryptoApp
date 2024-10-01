// src/components/CryptoPage.js
import React from 'react';
import Navbar from './Navbar';
import CryptoList from './CryptoList';

const CryptoPage = () => {
    return (
        <div>
            {/* Incluir la Navbar para la navegación entre las secciones */}
            <Navbar />
            {/* Contenedor principal con el formato adecuado */}
            <div className="home-container mt-8 flex flex-col items-center">
                <h1 className="text-2xl font-bold text-center text-blue-500 ">CriptoTarjetas</h1>

                {/* Mostrar la lista de tarjetas dentro del contenedor */}
                <div className="w-full max-w-6xl">
                    <CryptoList />
                </div>
            </div>
        </div>
    );
};

export default CryptoPage;
