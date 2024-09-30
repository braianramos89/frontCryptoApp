import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-800 px-4 py-3 w-full">
            <div className="flex justify-between w-full">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none ${
                        currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                >
                    Anterior
                </button>
                <p className="text-sm text-gray-300">
                    Mostrando <span className="font-medium">{(currentPage - 1) * 5 + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(currentPage * 5, totalPages * 5)}</span> de{' '}
                    <span className="font-medium">{totalPages * 5}</span> criptomonedas
                </p>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none ${
                        currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default Pagination;
