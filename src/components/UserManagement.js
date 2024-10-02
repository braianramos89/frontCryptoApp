import React, { useState, useEffect, useRef } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import Navbar from './Navbar';
import Spinner from "./Spinner";

const UserManagement = () => {
    const { keycloak } = useKeycloak();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda
    const [showForm, setShowForm] = useState(false); // Muestra el formulario de creación/edición
    const [editingUser, setEditingUser] = useState(null); // Usuario en edición
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const itemsPerPage = 5; // Mostrar 7 usuarios por página

    // Referencia para el formulario
    const formRef = useRef(null);

    // Función para obtener todos los usuarios
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8081/keycloak/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }

            const data = await response.json();
            setUsers(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [keycloak]);

    // Filtrar los usuarios según el término de búsqueda
    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcular el número total de páginas
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Obtener usuarios de la página actual
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Funciones para cambiar de página
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Función para mostrar el formulario de creación de un nuevo usuario y desplazar hacia el formulario
    const handleCreateClick = () => {
        setShowForm(true);
        setEditingUser(null);
        setFormData({ username: "", email: "", password: "" }); // Limpiar el formulario
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Pequeño retraso para asegurar que se muestre el formulario antes del scroll
    };

    // Función para iniciar la edición de un usuario existente y desplazar hacia el formulario
    const handleEditClick = (user) => {
        setShowForm(true);
        setEditingUser(user);
        setFormData({ username: user.username, email: user.email, password: "" }); // Cargar los datos del usuario
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // Función para crear un nuevo usuario
    const handleCreateUser = async () => {
        try {
            const response = await fetch('http://localhost:8081/keycloak/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al crear el usuario');
            }

            alert("Usuario creado con éxito");
            fetchUsers(); // Refrescar la lista de usuarios
            setShowForm(false); // Cerrar el formulario
        } catch (error) {
            console.error("Error al crear usuario:", error);
            alert(`Error al crear usuario: ${error.message}`);
        }
    };

    // Función para actualizar un usuario existente
    const handleEditUser = async () => {
        try {
            const response = await fetch(`http://localhost:8081/keycloak/users/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el usuario');
            }

            alert("Usuario actualizado con éxito");
            fetchUsers(); // Refrescar la lista de usuarios
            setShowForm(false); // Cerrar el formulario
            setEditingUser(null); // Limpiar el estado de edición
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            alert(`Error al actualizar usuario: ${error.message}`);
        }
    };

    // Función para eliminar un usuario
    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8081/keycloak/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }

            alert("Usuario eliminado con éxito");
            fetchUsers(); // Refrescar la lista de usuarios
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert(`Error al eliminar usuario: ${error.message}`);
        }
    };

    if (loading) return <Spinner message="Cargando usuarios..." />;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div>
            <Navbar />
            <div className="container mx-auto mt-8 p-4">
                <h1 className="text-3xl font-bold mb-4 text-white">Gestión de Usuarios</h1>

                {/* Barra de búsqueda */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre de usuario o correo electrónico..."
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el término de búsqueda
                    />
                </div>

                {/* Botón para crear un nuevo usuario */}
                <div className="mb-4">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                        onClick={handleCreateClick}
                    >
                        Crear Usuario
                    </button>
                </div>

                {/* Tabla de usuarios filtrados */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 rounded-lg text-white">
                        <thead>
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Nombre de Usuario</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user.id} className="bg-gray-700 hover:bg-gray-600">
                                <td className="px-4 py-2">{user.id}</td>
                                <td className="px-4 py-2">{user.username}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2 flex space-x-2">
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded"
                                        onClick={() => handleEditClick(user)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="mt-4 flex items-center justify-center space-x-4">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="bg-gray-500 text-white py-2 px-4 rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-white">Página {currentPage} de {totalPages}</span>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="bg-gray-500 text-white py-2 px-4 rounded disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>

                {/* Formulario para crear/editar usuarios */}
                {showForm && (
                    <div ref={formRef} className="mt-8 p-4 bg-gray-800 rounded-lg text-white">
                        <h2 className="text-lg font-bold mb-4">{editingUser ? "Editar Usuario" : "Crear Usuario"}</h2>
                        <div className="mb-4">
                            <label className="block text-sm mb-2">Nombre de Usuario</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm mb-2">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            onClick={editingUser ? handleEditUser : handleCreateUser}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        >
                            {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
