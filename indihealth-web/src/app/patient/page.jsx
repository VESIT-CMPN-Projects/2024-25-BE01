"use client"
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

function RegistrationPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        aadharNumber: '',
        email: '',
        phone: '',
        address: '',
        emergencyContact: '',
        medicalHistory: '',
        insuranceNumber: '',
        dob: '',
        gender: '',
        occupation: '',
        maritalStatus: '',
        bloodGroup: '',
        allergies: '',
        familyMedicalHistory: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = Cookies.get('access_token');
            if (!token) {
                router.push('/auth/login');
                return;
            }
            const response = await fetch('http://127.0.0.1:5000/create_patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    aadhar_number: formData.aadharNumber,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    emergency_contact: formData.emergencyContact,
                    medical_history: formData.medicalHistory,
                    insurance_number: formData.insuranceNumber,
                    dob: formData.dob,
                    gender: formData.gender,
                    occupation: formData.occupation,
                    marital_status: formData.maritalStatus,
                    blood_group: formData.bloodGroup,
                    allergies: formData.allergies,
                    family_medical_history: formData.familyMedicalHistory,
                }),
            });

            const data = await response.json();

            if (response.ok) {

                toast.success('Patient registered successfully!');
                // Optionally, reset the form
                setFormData({
                    name: '',
                    aadharNumber: '',
                    email: '',
                    phone: '',
                    address: '',
                    emergencyContact: '',
                    medicalHistory: '',
                    insuranceNumber: '',
                    dob: '',
                    gender: '',
                    occupation: '',
                    maritalStatus: '',
                    bloodGroup: '',
                    allergies: '',
                    familyMedicalHistory: ''
                });
            } else {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.message || 'Something went wrong!'}`);
                // alert(data.error || "An error occurred"); // Show error message
            }
        } catch (error) {
            console.error("Error during submission:", error);
            toast.error(`Network error: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <ToastContainer />
            <div className="w-full max-w-6xl p-8 rounded-lg shadow-lg bg-zinc-100">
                <h1 className="text-2xl font-semibold mb-6">Patient Registration</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 p-2 border block w-full border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                            <input
                                type="text"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleChange}
                                className="mt-1 p-2 border block w-full border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 p-2 border block w-full border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 p-2 border block w-full border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="mt-1 p-2 border block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="mt-1 p-2 border block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="mt-1 p-2 border block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                            <input
                                type="text"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                className="mt-1 p-2 border block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-4">Medical Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Medical History</label>
                                <textarea
                                    name="medicalHistory"
                                    value={formData.medicalHistory}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Family Medical History</label>
                                <textarea
                                    name="familyMedicalHistory"
                                    value={formData.familyMedicalHistory}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Insurance Number</label>
                                <input
                                    type="text"
                                    name="insuranceNumber"
                                    value={formData.insuranceNumber}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                                <input
                                    type="text"
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Allergies</label>
                                <textarea
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Occupation</label>
                                <input
                                    type="text"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                                <select
                                    name="maritalStatus"
                                    value={formData.maritalStatus}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                >
                                    <option value="">Select Marital Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            className="bg-teal-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegistrationPage;
