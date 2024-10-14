import React from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useKeycloak } from '@react-keycloak/web';
import { Link } from 'react-router-dom';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
    const { keycloak } = useKeycloak();

    // Extraer información del token de Keycloak
    const userName = keycloak?.tokenParsed?.preferred_username || "Usuario";
    // Extraer el rol desde el token
    const roles = keycloak?.tokenParsed?.resource_access?.cryptoauth?.roles || [];
    const userRole = roles.includes("admin_client_role") ? "ADMIN" : roles.includes("user_client_role") ? "USER" : "Sin rol";

    return (
        <Disclosure as="nav" className="bg-gray-800 w-full h-16">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="h-8 w-auto"
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTD2flpLEB57KSledYGScntvnvSVQZCz0u9Q&s"
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        <Link
                                            to="/"
                                            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                        >
                                            Compra/Venta
                                        </Link>
                                        <Link
                                            to="/cryptotarjetas"
                                            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                        >
                                            CriptoTarjetas
                                        </Link>
                                        {/* Solo mostrar la pestaña de Gestión de Usuarios si el usuario tiene el rol `admin_client_role` */}
                                        {roles.includes('admin_client_role') && (
                                            <Link
                                                to="/user-management"
                                                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                            >
                                                Gestión de Usuarios
                                            </Link>


                                        )}
                                        <Link to="/admin/transactions"
                                                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                        >
                                        Transacciones
                                    </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-800">
                                            <span className="sr-only">Open user menu</span>
                                            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-400 text-white">
                                                {userName.charAt(0).toUpperCase()}
                                            </div>
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={React.Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                <span className="block px-4 py-2 text-sm text-gray-700">Usuario: {userName}</span>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <span className="block px-4 py-2 text-sm text-gray-700">Rol: {userRole}</span>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => keycloak.logout()}
                                                >
                                                    Cerrar Sesión
                                                </a>
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    );
};

export default Navbar;
