"use client"
import { useState } from 'react';

const AllocateBedForm = () => {
    const [patientId, setPatientId] = useState('');
    const [severity, setSeverity] = useState('low');
    const [equipment, setEquipment] = useState('');
    const [roomType, setRoomType] = useState('shared');
    const [isolation, setIsolation] = useState(false);
    const [deallocateDate, setDeallocateDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:5000/allocate_bed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patient_id: patientId,
                severity,
                equipment,
                room_type: roomType,
                isolation,
                deallocate_date: deallocateDate,
            }),
        });

        const data = await response.json();
        alert(data.message || 'Bed allocation request sent!');
    };

    // Inline styles for form elements
    const formGroupStyle = {
        marginBottom: '15px',
    };

    const formLabelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#333',
    };

    const formInputStyle = {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        boxSizing: 'border-box',
    };

    const formSelectStyle = {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        boxSizing: 'border-box',
    };

    const formButtonStyle = {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#0070f3',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
                <label style={formLabelStyle}>
                    Patient ID:
                    <input
                        type="text"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        required
                        style={formInputStyle}
                    />
                </label>
            </div>
            <div style={formGroupStyle}>
                <label style={formLabelStyle}>
                    Severity:
                    <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        required
                        style={formSelectStyle}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </label>
            </div>
            <div style={formGroupStyle}>
                <label style={formLabelStyle}>
                    Equipment Needed (comma-separated):
                    <input
                        type="text"
                        value={equipment}
                        onChange={(e) => setEquipment(e.target.value)}
                        style={formInputStyle}
                    />
                </label>
            </div>
            <div style={formGroupStyle}>
                <label style={formLabelStyle}>
                    Room Type:
                    <select
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        style={formSelectStyle}
                    >
                        <option value="shared">Shared</option>
                        <option value="private">Private</option>
                    </select>
                </label>
            </div>
            <div style={formGroupStyle}>
                <label style={formLabelStyle}>
                    Isolation Needed:
                    <input
                        type="checkbox"
                        checked={isolation}
                        onChange={(e) => setIsolation(e.target.checked)}
                    />
                </label>
            </div>
            <div style={formGroupStyle}>
                <label style={formLabelStyle}>
                    Deallocate Date (YYYY-MM-DD):
                    <input
                        type="date"
                        value={deallocateDate}
                        onChange={(e) => setDeallocateDate(e.target.value)}
                        required
                        style={formInputStyle}
                    />
                </label>
            </div>
            <button type="submit" style={formButtonStyle}>Allocate Bed</button>
        </form>
    );
};

export default AllocateBedForm;
