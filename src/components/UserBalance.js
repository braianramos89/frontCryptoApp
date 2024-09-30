import React from 'react';

const UserBalance = ({ usdBalance }) => {
    return (
        <div className="flex justify-center items-center bg-gray-800 text-white p-4 rounded-md mb-4">
            <div>
                <h2 className="text-lg font-bold">Balance del Usuario</h2>
                <p className="text-sm text-gray-300">Balance en USD: ${usdBalance}</p>
            </div>
        </div>
    );
};

export default UserBalance;
