"use client";
// src/app/patient/[id]/page.jsx

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; // Use usePathname for app router
import VHC from '../components/VHC';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const PatientPage = () => {
    const pathname = usePathname();
    const id = pathname.split('/').pop(); // Extracting the ID from the pathname

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    // Fetch patient data when the component mounts or ID changes
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const token = Cookies.get('access_token');
                    if (!token) {
                        router.push('/auth/login');
                        return;
                    }
                    const response = await fetch(`http://127.0.0.1:5000/patients/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`, // Add the Authorization header
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const patientData = await response.json();
                    setData(patientData);
                } catch (error) {
                    console.error('Error fetching patient data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [id]);  // Fetch data whenever id changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('access_token');
            if (!token) {
                router.push('/auth/login');
                return;
            }
            const response = await fetch(`http://127.0.0.1:5000/patients/${data.patient_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update patient data');
            }

            console.log('Updated data:', data);
            alert('Patient data updated successfully!');
        } catch (error) {
            console.error('Error updating patient data:', error);
            alert('Error updating patient data. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>No patient found.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Patient Details</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div>
                                <label className="font-medium">Full Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={data.name || ''}
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="font-medium">Aadhar Number:</label>
                                <input
                                    type="text"
                                    name="aadhar_number"
                                    value={data.aadhar_number || ''}
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="font-medium">Date of Birth:</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={data.dob ? data.dob.split('T')[0] : ''}
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                />
                            </div>
                        </div>
                        <div className='p-2 border-2 rounded-lg border-black'>
                            <VHC patient={data} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                            <label className="font-medium">Gender:</label>
                            <select
                                name="gender"
                                value={data.gender || ''}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-medium">Phone Number:</label>
                            <input
                                type="tel"
                                name="phone"
                                value={data.phone || ''}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="font-medium">Email Address:</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email || ''}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="font-medium">Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={data.address || ''}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="font-medium">Emergency Contact:</label>
                            <input
                                type="text"
                                name="emergency_contact"
                                value={data.emergency_contact || ''}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="font-medium">Medical History:</label>
                            <textarea
                                name="medical_history"
                                value={data.medical_history || ''}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="font-medium">Insurance Number:</label>
                            <input
                                type="text"
                                name="insurance_number"
                                value={data.insurance_number || ''}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="font-medium">Occupation:</label>
                            <input
                                type="text"
                                name="occupation"
                                value={data.occupation || ''}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="font-medium">Marital Status:</label>
                            <select
                                name="marital_status"
                                value={data.marital_status || ''}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            >
                                <option value="">Select Marital Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-medium">Blood Group:</label>
                            <select
                                name="blood_group"
                                value={data.blood_group || ''}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-medium">Allergies:</label>
                            <textarea
                                name="allergies"
                                value={data.allergies || ''}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="font-medium">Family Medical History:</label>
                            <textarea
                                name="family_medical_history"
                                value={data.family_medical_history || ''}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Save
                </button>
            </form>
        </div>
    );
}

export default PatientPage;
