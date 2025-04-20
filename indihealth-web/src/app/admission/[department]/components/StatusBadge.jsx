import React from 'react';

const statusColors = {
    registered: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    waiting: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
};

const StatusBadge = ({ status }) => {
    const colorClass = statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${colorClass}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
