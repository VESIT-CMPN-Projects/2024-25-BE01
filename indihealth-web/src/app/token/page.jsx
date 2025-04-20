"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const DepartmentTokens = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }
                const response = await fetch('http://localhost:5000/counters_status', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch department tokens');
                const data = await response.json();
                setDepartments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="p-5 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 ">Token Dashboard</h1>
            <hr />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {departments.map((department) => (
                    <Link key={department.counter_id} href={`/token/${department.counter_id}`}>
                        <div
                            className={`p-6 rounded-lg shadow-lg border-2 transition duration-300 
                            ${department.first_token_id === 'None' ? 'bg-gray-300 cursor-not-allowed' : 'bg-white hover:shadow-xl'}`}
                            style={{
                                borderColor: department.first_token_id === 'None' ? '#d1d5db' : 'gray',
                                opacity: department.first_token_id === 'None' ? 0.5 : 1,
                            }}
                        >
                            <h3 className="text-xl font-bold text-[#FE6407] mb-4">
                                Counter: {department.counter_id} ({department.service_type})
                            </h3>
                            <hr className="mb-4 border-[#01F8E9]" />
                            <p className="text-xl font-semibold text-gray-700 mb-2">Current Token</p>
                            <p className="text-4xl font-extrabold text-[#FE6407] mb-4">
                                {department.first_token_id !== 'None' ? department.first_token_id : 'No tokens'}
                            </p>
                            <hr className="mb-4 border-[#01F8E9]" />
                            <p className="text-lg font-semibold text-gray-700 mb-2">Upcoming Tokens</p>
                            {/* <div className="space-y-2">
                                {department.allocated_tokens.slice(1, 4).map((token, index) => (
                                    <p key={index} className="text-base text-gray-600">
                                        Token ID: {token}
                                    </p>
                                ))}
                                {department.allocated_tokens.length > 4 && (
                                    <p className="text-base text-gray-500">+ {department.allocated_tokens.length - 4} more tokens</p>
                                )}
                            </div> */}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DepartmentTokens;
