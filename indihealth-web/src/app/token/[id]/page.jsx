"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Cookies from "js-cookie"
import { Clock } from "lucide-react"

const DepartmentTokenDetails = () => {
    const pathname = usePathname()
    const departmentId = pathname.split("/").pop() // Extract department ID from the URL
    const [counterDetails, setCounterDetails] = useState(null)
    const [error, setError] = useState(null)
    const [estimatedWaitTimes, setEstimatedWaitTimes] = useState({})
    const [selectedToken, setSelectedToken] = useState(null) // For token details modal
    const [tokenDetails, setTokenDetails] = useState(null)

    useEffect(() => {
        if (!departmentId) return

        const fetchCounterDetails = async () => {
            try {
                const token = Cookies.get("access_token")
                if (!token) {
                    window.location.href = "/auth/login" // Redirect to login if no token
                    return
                }
                const response = await fetch(`http://localhost:5000/counters/${departmentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!response.ok) throw new Error("Failed to fetch counter details")
                const data = await response.json()
                setCounterDetails(data)

                // Fetch estimated wait times for each token
                const waitTimePromises = data.allocated_tokens.map(async (tokenId) => {
                    try {
                        const waitTimeResponse = await fetch(`http://localhost:5000/estimate_wait_time/${tokenId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                        if (!waitTimeResponse.ok) throw new Error("Failed to fetch estimated wait time")
                        const waitTimeData = await waitTimeResponse.json()
                        return { [tokenId]: waitTimeData.estimated_wait_time }
                    } catch (err) {
                        console.error(`Error fetching wait time for token ${tokenId}:`, err)
                        return { [tokenId]: null }
                    }
                })

                const waitTimes = await Promise.all(waitTimePromises)
                const combinedWaitTimes = Object.assign({}, ...waitTimes)
                setEstimatedWaitTimes(combinedWaitTimes)
            } catch (err) {
                setError(err.message)
            }
        }

        fetchCounterDetails()
    }, [departmentId])

    const handleDestroyToken = async (tokenId) => {
        try {
            const token = Cookies.get("access_token")
            if (!token) {
                window.location.href = "/auth/login" // Redirect to login if no token
                return
            }
            const response = await fetch(`http://localhost:5000/destroy_token/${tokenId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.ok) {
                alert(`Token ${tokenId} destroyed successfully`)
                window.location.reload() // Reload the page to refresh the token list
            } else {
                throw new Error("Failed to destroy token")
            }
        } catch (err) {
            alert(`Error: ${err.message}`)
        }
    }

    const handleViewDetails = async (tokenId) => {
        setSelectedToken(tokenId)
        try {
            const token = Cookies.get("access_token")
            if (!token) {
                window.location.href = "/auth/login"
                return
            }
            const response = await fetch(`http://localhost:5000/token/${tokenId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (!response.ok) throw new Error("Failed to fetch token details")
            const data = await response.json()
            setTokenDetails(data)
        } catch (err) {
            setError(err.message)
        }
    }

    if (!counterDetails) return <div>Loading...</div>
    if (error) return <div className="text-red-500">Error: {error}</div>

    const { allocated_tokens } = counterDetails

    return (
        <div className="p-5 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 text-[#FE6407]">Counter {departmentId} Token Management</h1>

            {/* Token List Table */}
            <h2 className="text-2xl font-bold mb-4">Upcoming Tokens</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="border px-4 py-2">Token ID</th>
                            <th className="border px-4 py-2">Estimated Wait Time</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allocated_tokens.length > 0 ? (
                            allocated_tokens.map((token, index) => (
                                <tr key={token} className="text-center">
                                    <td className="border px-4 py-2">{token}</td>
                                    <td className="border px-4 py-2">
                                        {estimatedWaitTimes[token] ? `${estimatedWaitTimes[token]} mins` : "Calculating..."}
                                    </td>
                                    <td className="border px-4 py-2 flex gap-2 justify-center">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            onClick={() => handleViewDetails(token)}
                                        >
                                            View Details
                                        </button>
                                        {index === 0 && (
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                onClick={() => handleDestroyToken(token)}
                                            >
                                                Destroy
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-gray-600">No upcoming tokens</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Token Details */}
            {selectedToken && tokenDetails && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
                        <h2 className="text-2xl font-bold mb-4 text-center">Token Details</h2>
                        <table className="min-w-full border border-gray-300">
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2 font-bold">Token ID:</td>
                                    <td className="border px-4 py-2">{tokenDetails.token_id}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-bold">Patient ID:</td>
                                    <td className="border px-4 py-2">{tokenDetails.patient_id}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-bold">Patient Name:</td>
                                    <td className="border px-4 py-2">{tokenDetails.patient_name}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-bold">Counter ID:</td>
                                    <td className="border px-4 py-2">{tokenDetails.counter_id}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-bold">Counter Name:</td>
                                    <td className="border px-4 py-2">{tokenDetails.counter_name}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-bold">Service Type:</td>
                                    <td className="border px-4 py-2">{tokenDetails.service_type}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-bold">Status:</td>
                                    <td className="border px-4 py-2">{tokenDetails.status}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-bold">Created At:</td>
                                    <td className="border px-4 py-2">{tokenDetails.token_created_at}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full" onClick={() => setSelectedToken(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DepartmentTokenDetails
