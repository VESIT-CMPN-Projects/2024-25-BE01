// src/app/components/ScatterPlotComponent.js
"use client";

import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
    { time: '8AM', visits: 50 },
    { time: '9AM', visits: 70 },
    { time: '10AM', visits: 60 },
    { time: '11AM', visits: 90 },
    { time: '12PM', visits: 100 },
    { time: '1PM', visits: 80 },
    { time: '2PM', visits: 75 },
];

const ScatterPlotComponent = () => (
    <ScatterChart width={600} height={300} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Scatter name="Visits" data={data} fill="var(--teal)" />
    </ScatterChart>
);

export default ScatterPlotComponent;
