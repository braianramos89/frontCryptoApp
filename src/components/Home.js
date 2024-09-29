// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import LogoutButton from "./LogoutButton";

const Home = () => {
    const { keycloak } = useKeycloak();
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificamos si el usuario está autenticado
        if (keycloak && keycloak.authenticated) {
            const fetchCryptos = async () => {
                try {
                    // Actualizamos el token si es necesario
                    await keycloak.updateToken(5);

                    // Realizamos la solicitud al backend
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
            // Si el usuario no está autenticado, lo redirigimos al inicio de sesión
            keycloak.login();
        }
    }, [keycloak]);

    if (loading) {
        return <div>Cargando criptomonedas...</div>;
    }

    return (
        <div>
            <LogoutButton />
            <h1>Lista de Criptomonedas</h1>
            {cryptos.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Símbolo</th>
                        <th>Precio Actual</th>
                        <th>Imagen</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cryptos.map((crypto) => (
                        <tr key={crypto.id}>
                            <td>{crypto.id}</td>
                            <td>{crypto.name}</td>
                            <td>{crypto.symbol}</td>
                            <td>{crypto.currentPrice}</td>
                            <td>
                                <img src={crypto.image} alt={crypto.name} width="50" />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div>No se encontraron criptomonedas.</div>
            )}
        </div>
    );
};

export default Home;

