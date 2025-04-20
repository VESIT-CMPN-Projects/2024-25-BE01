"use client"

import { useEffect, useState } from "react"

export default function AvailableBeds() {
    const [departments, setDepartments] = useState([])
    const [hoveredBed, setHoveredBed] = useState(null)

    useEffect(() => {
        async function fetchBeds() {
            try {
                const res = await fetch("http://localhost:5000/available_beds")
                const data = await res.json()
                if (Array.isArray(data)) {
                    const grouped = data.reduce((acc, bed) => {
                        acc[bed.department] = acc[bed.department] || []
                        acc[bed.department].push(bed)
                        return acc
                    }, {})
                    setDepartments(Object.entries(grouped))
                }
            } catch (error) {
                console.error("Error fetching beds:", error)
            }
        }
        fetchBeds()
    }, [])

    return (
        <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Available Beds</h1>

            {departments.length === 0 ? (
                <p className="text-center text-gray-600">No available beds found.</p>
            ) : (
                departments.map(([department, beds]) => (
                    <div
                        key={department}
                        className="w-full bg-white shadow-lg rounded-lg border border-gray-300 p-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-blue-800">{department}</h2>
                        </div>

                        <div className="w-full overflow-x-auto">
                            <div className="inline-flex space-x-4 pb-4">
                                {beds.map((bed) => (
                                    <div
                                        key={bed.bed_id}
                                        className="flex-none"
                                    >
                                        <div
                                            className={`p-4 shadow rounded-lg w-[250px] border ${bed.available ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"
                                                }`}
                                            onMouseEnter={() => setHoveredBed(bed.bed_id)}
                                            onMouseLeave={() => setHoveredBed(null)}
                                        >
                                            <p className="text-sm font-medium text-blue-900">Bed ID: {bed.bed_id}</p>
                                            <p className="text-sm font-medium text-blue-900">Available: {bed.available ? "Yes" : "No"}</p>
                                            {hoveredBed === bed.bed_id && (
                                                <div className="mt-2 text-sm text-gray-800 font-semibold">
                                                    <p>Priority: {bed.priority}</p>
                                                    <p>Proximity: {bed.proximity}</p>
                                                    <p>Room Type: {bed.room_type}</p>
                                                    <p>Isolation: {bed.isolation ? "Yes" : "No"}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
