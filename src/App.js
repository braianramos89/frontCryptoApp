// src/App.js
import React, {useEffect} from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import PrivateRoute from './utils/PrivateRoute';
import './index.css';



function App() {
    const { keycloak, initialized } = useKeycloak();

    useEffect(() => {
        if (initialized && keycloak.authenticated) {
            const refreshToken = () => {
                keycloak
                    .updateToken(5) // Renueva el token si faltan menos de 5 segundos para expirar
                    .catch(() => {
                        keycloak.logout();
                    });
            };

            const tokenRefreshInterval = setInterval(refreshToken, 60000); // Verifica cada minuto
            return () => {
                clearInterval(tokenRefreshInterval);
            };
        }
    }, [keycloak, initialized]);

            if (!initialized) {
        return <div>Cargando...</div>;
    }

    if (!keycloak.authenticated) {
        // Redirigir al inicio de sesión de Keycloak
        keycloak.login();
        return <div>Redirigiendo al inicio de sesión...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;

