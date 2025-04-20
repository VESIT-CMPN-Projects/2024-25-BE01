'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../components/AuthForm';
import Cookies from 'js-cookie';

export default function Login() {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store the token and user info in cookies
      Cookies.set('access_token', data.access_token, { expires: 1, secure: true, sameSite: 'Strict' });
      Cookies.set('user', JSON.stringify(data.user), { expires: 1, secure: true, sameSite: 'Strict' }); // Store user data

      // Redirect the user after successful login
      router.push('/'); // Redirect to a secure dashboard page
    } catch (error) {
      setError(error.message); // Set error message for display
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <AuthForm onSubmit={handleLogin} buttonLabel="Login" />
    </div>
  );
}
