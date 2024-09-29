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
            onLoad: 'login-required', // Asegúrate de que esto está presente
            checkLoginIframe: false,
        }}
    >
        <App />
    </ReactKeycloakProvider>
);
