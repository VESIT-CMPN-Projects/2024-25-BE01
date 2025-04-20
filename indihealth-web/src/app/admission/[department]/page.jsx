"use client";

import React, { useState, useEffect } from 'react';
import AppointmentsSection from './components/AppointmentsSection';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const DepartmentDetailPage = ({ params }) => {
    const { department } = params;

    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [departments, setDepartments] = useState([]); // New state for departments
    const [loading, setLoading] = useState(true);
    const [showAppointments, setShowAppointments] = useState(true);
    const [currentDepartmentId, setCurrentDepartmentId] = useState(null); // State for current department ID
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
                        'Content-Type': 'application/json'
                    }
                }); // Call your backend API for departments
                if (!response.ok) {
                    throw new Error('Failed to fetch departments');
                }
                const data = await response.json();
                setDepartments(data); // Set the departments in state

                // Find the department ID based on the department name
                const departmentData = data.find(dep => dep.name.toLowerCase() === department.toLowerCase());
                if (departmentData) {
                    setCurrentDepartmentId(departmentData.id); // Set the current department ID
                } else {
                    console.error('Department not found');
                }
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        const fetchAppointments = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }

                const response = await fetch('http://127.0.0.1:5000/appointments', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }); // Call your backend API
                if (!response.ok) {
                    throw new Error('Failed to fetch appointments');
                }
                const data = await response.json();
                setAppointments(data); // Set the appointments in state
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        const fetchDoctors = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }

                const response = await fetch('http://127.0.0.1:5000/doctors', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }); // Call your backend API
                if (!response.ok) {
                    throw new Error('Failed to fetch doctors');
                }
                const data = await response.json();
                setDoctors(data); // Set the doctors in state
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        const fetchPatients = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }

                const response = await fetch('http://127.0.0.1:5000/patients', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }); // Call your backend API
                if (!response.ok) {
                    throw new Error('Failed to fetch patients');
                }
                const data = await response.json();
                setPatients(data); // Set the patients in state
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        const fetchData = async () => {
            await Promise.all([fetchDepartments(), fetchAppointments(), fetchDoctors(), fetchPatients()]);
            setLoading(false); // Stop loading after all fetches are complete
        };

        fetchData();
    }, []); // Fetch data on component mount

    const handleStatusChange = (e, category, id) => {
        // Implement logic for updating status in the database if needed
    };

    return (
        <div className="min-h-screen p-8 overflow-x-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 capitalize">
                {department} Department
            </h1>

            {/* Appointments Section */}
            {loading ? (
                <p>Loading appointments...</p>
            ) : (
                <AppointmentsSection
                    appointments={appointments} // Pass the appointments as a prop
                    doctors={doctors} // Pass doctors as a prop
                    patients={patients} // Pass patients as a prop
                    showAppointments={showAppointments}
                    setShowAppointments={setShowAppointments}
                    handleStatusChange={handleStatusChange}
                    currentDepartmentId={currentDepartmentId} // Pass the current department ID
                />
            )}
        </div>
    );
};

export default DepartmentDetailPage;
