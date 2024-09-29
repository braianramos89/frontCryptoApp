import React, { useEffect, useState } from 'react';
import { getUsdBalance } from '../services/balanceService';
import { useKeycloak } from '@react-keycloak/web';

function Balance() {
    const { keycloak } = useKeycloak();
    const token = keycloak.token;
    const [usdBalance, setUsdBalance] = useState(0);

    useEffect(() => {
        getUsdBalance()
            .then((response) => {
                setUsdBalance(response.data.amount);
            })
            .catch((error) => {
                console.error('Error al obtener el balance en USD:', error);
            });
    }, []);

    return (
        <div>
            <h2>Balance en USD: ${usdBalance}</h2>
        </div>
    );
}

export default Balance;