"use client";
import React, { useState } from 'react';
import Pagination from 'react-paginate';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import Cookies from 'js-cookie';

const statusOptions = ['registered', 'completed', 'canceled', 'scheduled'];
const priorityOptions = ['low', 'normal', 'high'];

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'registered':
            return 'bg-yellow-100 text-yellow-800';
        case 'confirmed':
            return 'bg-green-100 text-green-800';
        case 'waiting':
            return 'bg-blue-100 text-blue-800';
        case 'completed':
            return 'bg-gray-100 text-gray-800';
        case 'canceled':
            return 'bg-red-100 text-red-800';
        case 'scheduled':
            return 'bg-orange-100 text-orange-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const AppointmentsSection = ({
    appointments,
    doctors,
    patients,
    showAppointments,
    setShowAppointments,
    postsPerPage = 25,
    currentDepartmentId
}) => {
    const [currentAppointmentPage, setCurrentAppointmentPage] = useState(0);
    const [searchAppointments, setSearchAppointments] = useState('');
    const router = useRouter();

    const paginateAppointments = ({ selected }) => {
        setCurrentAppointmentPage(selected);
    };

    const handleBedAllocation = (patientId) => {
        router.push(`/bedallocation?pid=${patientId}`);
    };

    const getPatientName = (id) => {
        const patient = patients.find(patient => patient.patient_id === id);
        return patient ? patient.name : 'Unknown';
    };

    const getDoctorName = (id) => {
        const doctor = doctors.find(doctor => doctor.id === id);
        return doctor ? doctor.name : 'Unknown';
    };

    const getSlotLabel = (slotId) => {
        return slotId === 1 ? 'Morning' : slotId === 2 ? 'Afternoon' : 'Unknown';
    };

    const filteredAppointments = appointments.filter(appointment => {
        const patientName = getPatientName(appointment.patient_id).toLowerCase();
        const doctorName = getDoctorName(appointment.doctor_id).toLowerCase();
        const serviceType = appointment.service_type.toLowerCase();

        return (
            appointment.department_id === currentDepartmentId &&
            (
                appointment.patient_id.toString().includes(searchAppointments) ||
                appointment.status.toLowerCase().includes(searchAppointments.toLowerCase()) ||
                patientName.includes(searchAppointments.toLowerCase()) ||
                doctorName.includes(searchAppointments.toLowerCase()) ||
                serviceType.includes(searchAppointments.toLowerCase())
            )
        );
    });

    const indexOfLastAppointment = (currentAppointmentPage + 1) * postsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - postsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

    const handleStatusChange = async (e, type, appointmentId) => {
        const newValue = e.target.value;

        try {
            const token = Cookies.get('access_token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(`http://127.0.0.1:5000/appointments/${appointmentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    [type]: newValue,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update appointment');
            }

            // Optionally, update the local state here if the API is successful
            // Here, you might want to re-fetch or optimistically update your appointments
            // For simplicity, you can just log a success message
            alert("updated");
            router.reload();
            console.log('Appointment updated successfully');
        } catch (error) {
            console.error("Error updating appointment:", error);
        }
    };

    return (
        <div className="p-4 rounded-lg shadow-md mb-8 bg-zinc-100">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowAppointments(!showAppointments)}>
                <h2 className="text-xl font-semibold">Appointments</h2>
                {showAppointments ? (
                    <ChevronUpIcon className="h-6 w-6 text-gray-500" />
                ) : (
                    <ChevronDownIcon className="h-6 w-6 text-gray-500" />
                )}
            </div>
            {showAppointments && (
                <>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by Patient ID, Patient Name, Doctor Name, Status, Service Type, or Token ID..."
                            value={searchAppointments}
                            onChange={(e) => setSearchAppointments(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 w-full mt-2"
                        />
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 mt-4">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slot</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentAppointments.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.patient_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPatientName(appointment.patient_id)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getDoctorName(appointment.doctor_id)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(appointment.date_time).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select
                                            value={appointment.status}
                                            onChange={(e) => handleStatusChange(e, 'status', appointment.id)}
                                            className={`border border-gray-300 rounded-md px-2 py-1 ${getStatusColor(appointment.status)}`}
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select
                                            value={appointment.priority_level}
                                            onChange={(e) => handleStatusChange(e, 'priority_level', appointment.id)} // Changed to use priority_level
                                            className="border border-gray-300 rounded-md px-2 py-1"
                                        >
                                            {priorityOptions.map((priority) => (
                                                <option key={priority} value={priority}>
                                                    {priority}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.service_type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.mobile_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSlotLabel(appointment.slot_id)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.token_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button onClick={() => handleBedAllocation(appointment.patient_id)} className="text-blue-500 hover:underline">
                                            Allocate Bed
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        pageCount={Math.ceil(filteredAppointments.length / postsPerPage)}
                        onPageChange={paginateAppointments}
                        containerClassName="flex justify-center mt-4"
                        activeClassName="bg-blue-500 text-white"
                        pageClassName="mx-1 cursor-pointer"
                    />
                </>
            )}
        </div>
    );
};

export default AppointmentsSection;
