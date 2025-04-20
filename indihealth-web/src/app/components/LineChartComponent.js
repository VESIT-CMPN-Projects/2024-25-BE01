// src/app/components/LineChartComponent.js
"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
    { date: 'Jan', appointments: 40 },
    { date: 'Feb', appointments: 30 },
    { date: 'Mar', appointments: 20 },
    { date: 'Apr', appointments: 27 },
    { date: 'May', appointments: 18 },
    { date: 'Jun', appointments: 23 },
    { date: 'Jul', appointments: 35 },
];

const LineChartComponent = () => (
    <LineChart width={400} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="appointments" stroke="var(--teal)" />
    </LineChart>
);

export default LineChartComponent;
