// src/Keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
            url: 'http://localhost:8080', // Base URL de Keycloak sin '/auth'
            realm: 'cryptoapp', // Tu realm
            clientId: 'front-cryptoapp', // Tu clientId
});

export default keycloak;