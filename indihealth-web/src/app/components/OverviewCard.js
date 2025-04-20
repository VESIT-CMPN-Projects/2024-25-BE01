// src/app/components/OverviewCard.js
import React from 'react';

const OverviewCard = ({ title, value, icon }) => {
    return (
        <div className="bg-white shadow-lg p-1 flex items-center space-x-4 border-2 border-gray ">
            <div className="text-3xl text-teal">{icon}</div>
            <div>
                <h2 className="text-xl font-semibold text-black">{title}</h2>
                <p className="text-2xl font-bold text-teal">{value}</p>
            </div>
        </div>
    );
};

export default OverviewCard;
