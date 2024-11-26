// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import keycloak from './Keycloak';
import { ReactKeycloakProvider } from '@react-keycloak/web';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
            onLoad: 'login-required', // Indica que el usuario debe iniciar sesión antes de cargar la aplicación
            checkLoginIframe: false,
        }}
    >
        <App />
    </ReactKeycloakProvider>
);
