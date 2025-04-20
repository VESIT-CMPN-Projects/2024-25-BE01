// src/app/components/AreaChartComponent.js
"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
    { month: 'Jan', beds: 30 },
    { month: 'Feb', beds: 35 },
    { month: 'Mar', beds: 32 },
    { month: 'Apr', beds: 28 },
    { month: 'May', beds: 25 },
    { month: 'Jun', beds: 27 },
    { month: 'Jul', beds: 30 },
];

const AreaChartComponent = () => (
    <AreaChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="beds" stroke="var(--teal)" fill="var(--teal)" fillOpacity={0.3} />
    </AreaChart>
);

export default AreaChartComponent;
