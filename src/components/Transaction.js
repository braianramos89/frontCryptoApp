import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import Pagination from './Pagination';
import Spinner from "./Spinner";
import Navbar from './Navbar'; // Asegúrate de tener importada la Navbar
import { format } from 'date-fns';
import './Home.css';

const Transaction = () => {
    const { keycloak } = useKeycloak();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [averageSales, setAverageSales] = useState(0);
    const [averagePurchases, setAveragePurchases] = useState(0);
    const isAdmin = keycloak?.tokenParsed?.resource_access?.cryptoauth?.roles?.includes('admin_client_role');
    const userId = keycloak?.tokenParsed?.sub;

    // Cargar todas las transacciones al inicio
    useEffect(() => {
        fetchTransactions();
    }, []);

    // Cada vez que cambian las fechas, se aplicará el filtro de transacciones
    useEffect(() => {
        filterTransactionsByDate();
    }, [startDate, endDate]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const endpoint = isAdmin
                ? `http://localhost:8081/api/v1/cryptos/transactions`
                : `http://localhost:8081/api/v1/cryptos/transactionsId?userId=${userId}`;

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener transacciones');
            }

            const data = await response.json();
            setTransactions(data);
            setFilteredTransactions(data);  // Inicialmente, todas las transacciones están filtradas
            setLoading(false);

            // Llamar también a los endpoints de promedios
            fetchAverageSales();
            fetchAveragePurchases();
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    // Filtrar transacciones por rango de fechas en el frontend
    const filterTransactionsByDate = () => {
        if (startDate && endDate) {
            const filtered = transactions.filter((transaction) => {
                const transactionDate = new Date(transaction.timestamp);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return transactionDate >= start && transactionDate <= end;
            });
            setFilteredTransactions(filtered);
            setCurrentPage(1);  // Reiniciar la paginación al aplicar el filtro
        } else {
            setFilteredTransactions(transactions);  // Si no hay fechas, mostrar todas las transacciones
        }
    };

    const fetchAverageSales = async () => {
        const endpoint = isAdmin
            ? `http://localhost:8081/api/v1/cryptos/transactions/average/sales`
            : `http://localhost:8081/api/v1/cryptos/transactions/average/salesId?userId=${userId}`;
        try {
            const response = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${keycloak.token}` }
            });
            const result = await response.json();
            setAverageSales(result);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchAveragePurchases = async () => {
        const endpoint = isAdmin
            ? `http://localhost:8081/api/v1/cryptos/transactions/average/sells`
            : `http://localhost:8081/api/v1/cryptos/transactions/average/sellsId?userId=${userId}`;
        try {
            const response = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${keycloak.token}` }
            });
            const result = await response.json();
            setAveragePurchases(result);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDateChange = (event) => {
        const { name, value } = event.target;
        if (name === 'start') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <Spinner message="Cargando Transacciones..."/>
        </div>;
    }



    return (
        <div className="transaction-container min-h-screen">
            <Navbar/>
            <div className="container mx-auto py-4 px-6 justify-center">

                <h1 className="text-2xl font-bold text-blue-500">Transacciones</h1>

                {/* Date range picker */}
                <div id="date-range-picker" className="flex items-center my-4 space-x-4">
                    <div className="relative">
                        <input
                            id="datepicker-range-start"
                            name="start"
                            type="date"
                            value={startDate}
                            onChange={handleDateChange}
                            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5"
                            placeholder="Fecha de inicio"
                        />
                    </div>
                    <span className="mx-4 text-gray-500">a</span>
                    <div className="relative">
                        <input
                            id="datepicker-range-end"
                            name="end"
                            type="date"
                            value={endDate}
                            onChange={handleDateChange}
                            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5"
                            placeholder="Fecha de fin"
                        />
                    </div>
                </div>

                {/* Mostrar promedios */}
                <div className="flex space-x-8 mb-8">
                    <p className="text-blue-400 text-xl">Promedio de ventas: {averageSales.toFixed(2)} US$</p>
                    <p className="text-green-400 text-xl">Promedio de compras: {averagePurchases.toFixed(2)} US$</p>
                </div>

                {/* Tabla de transacciones */}
                <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                        <tr>
                            <th scope="col" className="py-3 px-6">ID</th>
                            <th scope="col" className="py-3 px-6">MONTO</th>
                            <th scope="col" className="py-3 px-6">TIPO</th>
                            <th scope="col" className="py-3 px-6">FECHA</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentTransactions.map((transaction) => (
                            <tr key={transaction.id} className="bg-gray-800 border-b border-gray-700">
                                <td className="py-4 px-6">{transaction.id}</td>
                                <td className="py-4 px-6">{transaction.amount.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}</td>
                                <td className="py-4 px-6">{transaction.transactionType}</td>
                                <td className="py-4 px-6">{new Date(transaction.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="flex justify-between items-center py-2">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredTransactions.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Transaction;
