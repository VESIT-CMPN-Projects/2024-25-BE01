'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../components/AuthForm'; // Shared form component

export default function Signup() {
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSignup = async (email, password) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            // Handle successful signup
            localStorage.setItem('token', data.access_token);

            // Redirect to login or dashboard
            router.push('/login');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <AuthForm onSubmit={handleSignup} buttonLabel="Signup" />
        </div>
    );
}
