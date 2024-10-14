import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import CryptoPage from './components/CryptoPage'; // Importar CryptoPage
import UserManagement from './components/UserManagement'; // Importar UserManagement
import PrivateRoute from './utils/PrivateRoute';
import './index.css';
import Spinner from "./components/Spinner";
import Transaction from "./components/Transaction";

function App() {
    const { keycloak, initialized } = useKeycloak();

    useEffect(() => {
        if (initialized && keycloak.authenticated) {
            const refreshToken = () => {
                keycloak
                    .updateToken(5)
                    .catch(() => {
                        keycloak.logout();
                    });
            };

            const tokenRefreshInterval = setInterval(refreshToken, 60000);
            return () => {
                clearInterval(tokenRefreshInterval);
            };
        }
    }, [keycloak, initialized]);

    if (!initialized) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner message="Cargando pagina ..." />
            </div>
        );
    }

    if (!keycloak.authenticated) {
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
                <Route
                    path="/cryptotarjetas"
                    element={
                        <PrivateRoute>
                            <CryptoPage />
                        </PrivateRoute>
                    }
                />
                {/* Nueva ruta para la gestión de usuarios */}
                <Route
                    path="/user-management"
                    element={
                        <PrivateRoute roles={['admin_client_role']}>
                            <UserManagement />
                        </PrivateRoute>
                    }
                />

            <Route
                    path="/admin/transactions"
                    element={
                        <PrivateRoute roles={['admin_client_role']}>
                            <Transaction />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
