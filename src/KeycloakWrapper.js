// src/KeycloakWrapper.js
import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './Keycloak';

const KeycloakWrapper = ({ children }) => {
    const [keycloakInitialized, setKeycloakInitialized] = React.useState(false);

    if (!keycloakInitialized) {
        keycloak.onReady = () => {
            setKeycloakInitialized(true);
        };
    }

    return (
        <ReactKeycloakProvider authClient={keycloak}>
            {keycloakInitialized ? children : null}
        </ReactKeycloakProvider>
    );
};

export default KeycloakWrapper;
