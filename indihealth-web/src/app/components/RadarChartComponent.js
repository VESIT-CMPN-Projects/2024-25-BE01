// src/app/components/RadarChartComponent.js
"use client";

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';

const data = [
    { subject: 'Quality', A: 120, B: 110 },
    { subject: 'Speed', A: 98, B: 130 },
    { subject: 'Accuracy', A: 86, B: 130 },
    { subject: 'Efficiency', A: 99, B: 100 },
    { subject: 'Satisfaction', A: 85, B: 90 },
];

const RadarChartComponent = () => (
    <RadarChart outerRadius={150} width={600} height={300} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 150]} />
        <Radar name="Metric A" dataKey="A" stroke="var(--teal)" fill="var(--teal)" fillOpacity={0.3} />
        <Radar name="Metric B" dataKey="B" stroke="#FF7F50" fill="#FF7F50" fillOpacity={0.3} />
        <Tooltip />
    </RadarChart>
);

export default RadarChartComponent;
