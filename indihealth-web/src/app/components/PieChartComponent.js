// src/app/components/PieChartComponent.js
"use client";

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
    { name: '18-25', value: 400 },
    { name: '26-35', value: 300 },
    { name: '36-45', value: 300 },
    { name: '46-60', value: 200 },
    { name: '60+', value: 100 },
];

const COLORS = ['#008080', '#20B2AA', '#3CB371', '#90EE90', '#A0522D'];

const PieChartComponent = () => (
    <PieChart width={400} height={400}>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
        </Pie>
        <Tooltip />
        <Legend />
    </PieChart>
);

export default PieChartComponent;
