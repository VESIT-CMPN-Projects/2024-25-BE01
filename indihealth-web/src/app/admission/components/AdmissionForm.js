"use client"
// src/app/admission/components/AdmissionForm.js
import React, { useState } from 'react';

const AdmissionForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        pname: '',
        pid: '',
        doctorId: '',
        status: 'registered',
        date: '',
        time: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="pname"
                value={formData.pname}
                onChange={handleChange}
                placeholder="Patient Name"
                className="w-full p-2 border rounded"
            />
            <input
                type="text"
                name="pid"
                value={formData.pid}
                onChange={handleChange}
                placeholder="Patient ID"
                className="w-full p-2 border rounded"
            />
            <input
                type="text"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                placeholder="Doctor ID"
                className="w-full p-2 border rounded"
            />
            <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            >
                <option value="registered">Registered</option>
                <option value="confirmed">Confirmed</option>
                <option value="waiting">Waiting</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>
            <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />
            <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />
            <button type="submit" className="bg-teal text-ivory p-2 rounded">
                Submit
            </button>
        </form>
    );
};

export default AdmissionForm;
