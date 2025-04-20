"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const DepartmentBeds = () => {
    const pathname = usePathname();
    const department = pathname.split('/').pop(); // Extract the department from the pathname
    const [beds, setBeds] = useState([]);
    const [availableBedsCount, setAvailableBedsCount] = useState(0);
    const [occupiedBedsCount, setOccupiedBedsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!department) return; // Skip if no department is present

        const fetchBedsByDepartment = async () => {
            try {
                const response = await fetch(`http://localhost:5000/beds?department=${department}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch beds for the department');
                }
                const data = await response.json();
                setBeds(data.beds);
                setAvailableBedsCount(data.available_beds_count);
                setOccupiedBedsCount(data.occupied_beds_count);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBedsByDepartment();
    }, [department]);

    if (loading) {
        return <div className="text-center text-lg">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">Error: {error}</div>;
    }

    return (
        <div className="p-5 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4 text-gray-700">
                Beds in {department} Department
            </h1>
            <div className="text-center mb-8">
                <p className="text-lg text-green-600">Available Beds: {availableBedsCount}</p>
                <p className="text-lg text-red-600">Occupied Beds: {occupiedBedsCount}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {beds.map((bed) => (
                    <div
                        key={bed.bed_id}
                        className={`border rounded-lg p-5 shadow-md ${bed.available ? 'bg-green-100' : 'bg-red-100'}`}
                    >
                        <h3 className="text-xl font-semibold">Bed ID: {bed.bed_id}</h3>
                        <p className="mt-2"><strong>Proximity:</strong> {bed.proximity}</p>
                        <p><strong>Priority:</strong> {bed.priority}</p>
                        <p><strong>Room Type:</strong> {bed.room_type}</p>
                        <p><strong>Isolation:</strong> {bed.isolation ? 'Yes' : 'No'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DepartmentBeds;
