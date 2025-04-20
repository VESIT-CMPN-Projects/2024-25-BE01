'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const DepartmentCard = ({ department }) => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const router = useRouter();


    // Fetch appointments and doctors for the department when the component mounts
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }

                const response = await fetch('http://127.0.0.1:5000/appointments', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }); // API to fetch appointments
                if (!response.ok) {
                    throw new Error('Failed to fetch appointments');
                }
                const data = await response.json();
                const filteredAppointments = data.filter(app => app.department_id === department.id);
                setAppointments(filteredAppointments); // Filtered appointments for this department
            } catch (error) {
                console.error('Error fetching appointments:', error);
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
                        'Authorization': `Bearer ${token}`,
                    }
                }); // API to fetch doctors
                if (!response.ok) {
                    throw new Error('Failed to fetch doctors');
                }
                const data = await response.json();
                const filteredDoctors = data.filter(doc => doc.department_id === department.id);
                setDoctors(filteredDoctors); // Filtered doctors for this department
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchAppointments();
        fetchDoctors();
    }, [department.id]);

    const availableDoctors = doctors.length;
    const opdWaitingCount = appointments.filter(app => app.status === 'registered').length;
    const appointmentWaitingCount = appointments.filter(app => app.status === 'scheduled').length;

    return (
        <Link href={`/admission/${department.name.toLowerCase()}`}>
            <div className="p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-zinc-100">
                <h3 className="text-xl font-bold mb-4">{department.name}</h3>
                <div className="space-y-2">
                    <div className="p-2 bg-green-100">
                        <p className="font-semibold text-green-800">
                            Available Doctors: {availableDoctors}
                        </p>
                    </div>
                    <div className="p-2 bg-red-100">
                        <p className="font-semibold text-red-800">
                            OPD Waiting Count: {opdWaitingCount}
                        </p>
                    </div>
                    <div className="p-2 bg-yellow-100">
                        <p className="font-semibold text-yellow-800">
                            Appointment Waiting Count: {appointmentWaitingCount}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default DepartmentCard;
