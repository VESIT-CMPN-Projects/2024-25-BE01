"use client";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const statusOptions = ["registered", "scheduled"];
const priorityLevels = ["normal", "high", "low"];
const slotOptions = [
    { id: 1, name: "Morning" },
    { id: 2, name: "Afternoon" },
];

const FormInput = ({ id, name, value, onChange, disabled = false, type = 'text', ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium mb-1">{name}</label>
        <input
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            type={type}
            className="block w-full p-2 border border-gray-300"
            {...props}
        />
    </div>
);

const FormSelect = ({ id, name, value, onChange, options }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium mb-1">{name}</label>
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className="block w-full p-2 border border-gray-300"
        >
            <option value="" disabled>Select {name}</option>
            {options.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
            ))}
        </select>
    </div>
);

const PatientAdmissionForm = () => {
    const [patientIdSearch, setPatientIdSearch] = useState('');
    const [patientData, setPatientData] = useState(null);
    const [formData, setFormData] = useState({
        patientName: '',
        patientId: '',
        doctorId: '',
        departmentId: '',
        status: 'registered',
        priorityLevel: 'normal',
        slotId: '',
        date: '',
        time: '',
        createdAt: new Date().toISOString().slice(0, 16),
    });
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [tokenId, setTokenId] = useState(null);  // To store and display the token_id

    const router = useRouter();

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
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
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                setError('Failed to fetch doctors: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchDepartments = async () => {
            setLoading(true);
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
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setDepartments(data);
            } catch (error) {
                setError('Failed to fetch departments: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
        fetchDepartments();
    }, []);

    const handleSearch = async () => {
        try {
            const token = Cookies.get('access_token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(`http://127.0.0.1:5000/patients/${patientIdSearch}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const fetchedPatient = await response.json();
            if (fetchedPatient) {
                setPatientData(fetchedPatient);
                setFormData(prev => ({
                    ...prev,
                    patientName: fetchedPatient.name,
                    patientId: fetchedPatient.patient_id,
                }));
                setError('');
            } else {
                throw new Error('Patient not found');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDepartmentChange = (e) => {
        const selectedDepartmentId = e.target.value;
        setFormData(prev => ({
            ...prev,
            departmentId: selectedDepartmentId,
            doctorId: '', // Reset doctor when department changes
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const appointmentData = {
            patient_id: formData.patientId,
            doctor_id: formData.doctorId,
            date_time: new Date(`${formData.date}T${formData.time}`).toISOString(),
            status: formData.status,
            priority_level: formData.priorityLevel,
            service_type: 'General',
            mobile_number: 123456789,
            slot_id: formData.slotId,
        };

        console.log(appointmentData)

        try {
            const token = Cookies.get('access_token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch('http://127.0.0.1:5000/create_appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(appointmentData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create appointment');
            }

            // Store token_id in state to display it
            setTokenId(result.token_id);
            console.log('Appointment and Token created:', result);

        } catch (error) {
            setError(error.message); // Set the error message to display
        }
    };

    const filteredDoctors = doctors.filter(doctor => doctor.department_id === Number(formData.departmentId));

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Patient Admission Form</h2>
            <div className="mb-4">
                <label htmlFor="patientIdSearch" className="block text-sm font-medium mb-1">Search Patient by ID</label>
                <div className='flex space-x-3'>
                    <FormInput
                        id="patientIdSearch"
                        name="patientIdSearch"
                        value={patientIdSearch}
                        onChange={(e) => setPatientIdSearch(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="p-2 bg-blue-500 text-white mt-6"
                    >
                        Search
                    </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {patientData ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput id="patientName" name="patientName" value={formData.patientName} onChange={handleChange} disabled />
                        <FormInput id="patientId" name="patientId" value={formData.patientId} onChange={handleChange} disabled />
                        <FormSelect
                            id="departmentId"
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={handleDepartmentChange}
                            options={departments}
                        />
                        <FormSelect
                            id="doctorId"
                            name="doctorId"
                            value={formData.doctorId}
                            onChange={handleChange}
                            options={filteredDoctors}
                        />
                        <FormInput
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            type="date"
                        />
                        <FormInput
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            type="time"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <FormSelect
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            options={statusOptions.map(status => ({ id: status, name: status }))}
                        />
                        <FormSelect
                            id="priorityLevel"
                            name="priorityLevel"
                            value={formData.priorityLevel}
                            onChange={handleChange}
                            options={priorityLevels.map(level => ({ id: level, name: level }))}
                        />
                        <FormSelect
                            id="slotId"
                            name="slotId"
                            value={formData.slotId}
                            onChange={handleChange}
                            options={slotOptions}
                        />
                    </div>
                    <button type="submit" className="p-2 bg-green-500 text-white">Create Appointment</button>
                </form>
            ) : null}

            {tokenId && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold">Token Created Successfully!</h3>
                    <p className="text-lg">Your token ID: <span className="font-mono">{tokenId}</span></p>
                </div>
            )}
        </div>
    );
};

export default PatientAdmissionForm;
