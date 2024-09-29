import { useKeycloak } from '@react-keycloak/web';

export const useFetchWithAuth = () => {
    const { keycloak } = useKeycloak();

    const fetchWithAuth = async (url, options = {}) => {
        if (keycloak && keycloak.authenticated) {
            try {
                await keycloak.updateToken(5);

                const headers = {
                    'Content-Type': 'application/json',
                    ...options.headers,
                    'Authorization': `Bearer ${keycloak.token}`,
                };

                const response = await fetch(url, {
                    ...options,
                    headers,
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                return response;
            } catch (error) {
                console.error('Error en fetchWithAuth:', error);
                throw error;
            }
        } else {
            throw new Error('Usuario no autenticado');
        }
    };

    return fetchWithAuth;
};
