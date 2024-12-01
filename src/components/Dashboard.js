import React, {useEffect, useState} from 'react';

import SellCrypto from "./SellCrypto";
import BuyCrypto from "./BuyCrypto";
import Balance from "./Balance";
import {Typography, List, ListItem, ListItemText} from '@mui/material';
import {useFetchWithAuth} from "../hooks/useFetchWithAuth";

function Dashboard() {
    const [cryptos, setCryptos] = useState([]);
    const fetchWithAuth = useFetchWithAuth();
    const [data, setData] = useState(null);
    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const response = await fetchWithAuth('http://cryptoapp:8081/api/v1/cryptos/fetch');
                const responseData = await response.json();
                setData(responseData);
            } catch (error) {
                console.error('Error al obtener los datos del dashboard:', error);
            }
        };
        obtenerDatos();
    }, []);

    return (
        <div>
            <Balance/>
            <Typography variant="h4" gutterBottom>
                Listado de Criptomonedas
            </Typography>
            <List>
                {cryptos.map((crypto) => (
                    <ListItem key={crypto.id}>
                        <ListItemText
                            primary={`${crypto.name} (${crypto.symbol})`}
                            secondary={`Precio: ${crypto.currentPrice} USD`}
                        />
                    </ListItem>
                ))}
            </List>
            <BuyCrypto/>
            <SellCrypto/>
        </div>
    );
}

export default Dashboard;
