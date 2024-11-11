# CryptoApp

CryptoApp es una aplicación basada en React que permite a los usuarios ver, comprar y vender criptomonedas. La aplicación utiliza Keycloak para la autenticación y autorización.

## Características

- Ver una lista de criptomonedas
- Buscar criptomonedas específicas
- Comprar y vender criptomonedas
- Paginación para la lista de criptomonedas
- Autenticación y autorización usando Keycloak

## Tecnologías Utilizadas

- React
- Keycloak
- JavaScript
- npm

## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/braianramos89/cryptoapp.git
    cd cryptoapp
    ```

2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Configura Keycloak:
    - Actualiza el archivo `src/Keycloak.js` con los detalles de tu servidor Keycloak.

4. Inicia el servidor de desarrollo:
    ```bash
    npm start
    ```

## Uso

1. Abre tu navegador y navega a `http://localhost:3000`.
2. Inicia sesión usando tus credenciales de Keycloak.
3. Ve la lista de criptomonedas, busca, compra y vende según sea necesario.

## Estructura del Proyecto

- `src/components`: Contiene los componentes de React utilizados en la aplicación.
- `src/hooks`: Contiene hooks personalizados utilizados en la aplicación.
- `src/Keycloak.js`: Archivo de configuración de Keycloak.
- `src/App.js`: Archivo principal de la aplicación.
- `src/index.js`: Punto de entrada de la aplicación.

## Contribuyendo

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature-branch`).
3. Realiza tus cambios.
4. Haz commit de tus cambios (`git commit -m 'Añadir alguna característica'`).
5. Empuja a la rama (`git push origin feature-branch`).
6. Abre un pull request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.