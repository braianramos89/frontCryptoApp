// src/utils/PrivateRoute.js
import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { keycloak } = useKeycloak();

    if (keycloak && keycloak.authenticated) {
        return children;
    } else {
        return <Navigate to="/" />;
    }
};

export default PrivateRoute;

