"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Pagination from 'react-paginate';
import { useRouter } from 'next/navigation'; // Import useRouter
import Cookies from 'js-cookie';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [currentPatientPage, setCurrentPatientPage] = useState(0);
    const [postsPerPage] = useState(10);
    const [searchInput, setSearchInput] = useState('');
    const router = useRouter(); // Initialize useRouter

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) {
                    router.push('/auth/login'); 
                    return;
                }
                const response = await fetch('http://127.0.0.1:5000/patients', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch patients');
                }

                const data = await response.json();
                setPatients(data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchPatients();
    }, []);

    const paginatePatients = ({ selected }) => {
        setCurrentPatientPage(selected);
    };

    // Filter patients based on search input, including patient_id
    const filteredPatients = useMemo(() =>
        patients.filter(patient =>
            patient.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            patient.aadhar_number.includes(searchInput) ||
            patient.email.toLowerCase().includes(searchInput.toLowerCase()) ||
            patient.phone.includes(searchInput) ||
            patient.patient_id.toLowerCase().includes(searchInput.toLowerCase()) // Add patient_id filter
        ),
        [patients, searchInput]
    );

    const indexOfLastPatient = (currentPatientPage + 1) * postsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - postsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

    return (
        <div className="p-4 rounded-lg shadow-md mb-8 bg-zinc-100">
            <h2 className="text-xl font-semibold">Patient List</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 w-full mt-2"
                />
            </div>
            <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhar Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentPatients.map((patient) => (
                        <tr
                            key={patient.id}
                            className='hover:bg-zinc-100 cursor-pointer'
                            onClick={() => router.push(`/patient/${patient.patient_id}`)} // Navigate to the patient details page
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.patient_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.aadhar_number}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.gender}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                pageCount={Math.ceil(filteredPatients.length / postsPerPage)}
                onPageChange={paginatePatients}
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
            />
        </div>
    );
};

export default PatientList;
