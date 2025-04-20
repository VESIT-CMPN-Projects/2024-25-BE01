"use client"
// src/app/admission/components/DepartmentTable.js
import React from 'react';
import Link from 'next/link';

const DepartmentTable = ({ departments }) => {
    return (
        <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Departments</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2">Department</th>
                        <th className="border p-2">Doctors Available</th>
                        <th className="border p-2">OPD Count</th>
                        <th className="border p-2">Appointments</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map((dept, index) => (
                        <tr key={index}>
                            <td className="border p-2">
                                <Link href={`/admissions/${dept.id}`}>
                                    <a className="text-teal hover:underline">{dept.name}</a>
                                </Link>
                            </td>
                            <td className="border p-2">{dept.doctorsAvailable}</td>
                            <td className="border p-2">{dept.opdCount.remaining} / {dept.opdCount.total}</td>
                            <td className="border p-2">{dept.appointments.remaining} / {dept.appointments.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DepartmentTable;
