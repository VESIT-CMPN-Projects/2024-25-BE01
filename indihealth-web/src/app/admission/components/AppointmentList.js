"use client"

// src/app/admission/components/AppointmentList.js
import React, { useState } from 'react';

const AppointmentList = ({ appointments }) => {
    const [data, setData] = useState(appointments);

    const handleChange = (index, field, value) => {
        const newData = [...data];
        newData[index][field] = value;
        setData(newData);
    };

    return (
        <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Appointments</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2">Patient Name</th>
                        <th className="border p-2">Patient ID</th>
                        <th className="border p-2">Doctor ID</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Date</th>
                        <th className="border p-2">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((appt, index) => (
                        <tr key={index}>
                            <td className="border p-2">
                                <input
                                    type="text"
                                    value={appt.pname}
                                    onChange={(e) => handleChange(index, 'pname', e.target.value)}
                                    className="w-full border rounded"
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="text"
                                    value={appt.pid}
                                    onChange={(e) => handleChange(index, 'pid', e.target.value)}
                                    className="w-full border rounded"
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="text"
                                    value={appt.doctorId}
                                    onChange={(e) => handleChange(index, 'doctorId', e.target.value)}
                                    className="w-full border rounded"
                                />
                            </td>
                            <td className="border p-2">
                                <select
                                    value={appt.status}
                                    onChange={(e) => handleChange(index, 'status', e.target.value)}
                                    className="w-full border rounded"
                                >
                                    <option value="registered">Registered</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="waiting">Waiting</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td className="border p-2">
                                <input
                                    type="date"
                                    value={appt.date}
                                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                                    className="w-full border rounded"
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="time"
                                    value={appt.time}
                                    onChange={(e) => handleChange(index, 'time', e.target.value)}
                                    className="w-full border rounded"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentList;
