// src/components/LogoutButton.js
import React from 'react';
import { useKeycloak } from '@react-keycloak/web';

const LogoutButton = () => {
    const { keycloak } = useKeycloak();

    const logout = () => {
        keycloak.logout();
    };

    return <button onClick={logout}>Cerrar Sesión</button>;
};

export default LogoutButton;
