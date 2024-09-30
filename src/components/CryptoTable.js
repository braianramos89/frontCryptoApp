import React from 'react';

const CryptoTable = ({ cryptos, onSelectCrypto }) => {
    return (
        <div className="overflow-hidden border border-gray-600 rounded-lg shadow-md w-full">
            <table className="min-w-full divide-y divide-gray-600 bg-gray-800">
                <thead className="bg-gray-700">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        Nombre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        Símbolo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        Precio Actual
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        Imagen
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                {cryptos.map((crypto) => (
                    <tr
                        key={crypto.id}
                        className="hover:bg-gray-700 cursor-pointer"
                        onClick={() => onSelectCrypto(crypto)} // Maneja el evento de clic
                    >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{crypto.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{crypto.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{crypto.symbol.toUpperCase()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{crypto.currentPrice.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <img src={crypto.image} alt={crypto.name} className="h-10 w-10 rounded-full" />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CryptoTable;
