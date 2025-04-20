// pages/dashboard/page.jsx
'use client'
import React, { useEffect, useState } from 'react';
import DepartmentCard from './components/DepartmentCard';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }

                const response = await fetch('http://127.0.0.1:5000/departments', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setDepartments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    if (loading) {
        return <div className="text-center">Loading departments...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Appointment and OPD Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {departments.map((department) => (
                    <DepartmentCard key={department.id} department={department} />
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
