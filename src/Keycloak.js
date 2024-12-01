// src/Keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
            url: process.env.REACT_APP_AUTH_URL, // Base URL de Keycloak sin '/auth'
            realm: 'cryptoapp', // Tu realm
            clientId: 'front-cryptoapp', // Tu clientId
});

export default keycloak;