'use client';

import React, { useState, useEffect } from 'react';
import { User, Key, Sliders, Bell } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        language: 'English',
        theme: 'Light',
        emailNotifications: false,
        smsNotifications: false,
    });
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null); // State for user data

    // Fetch user data from cookies
    useEffect(() => {
        const userData = Cookies.get('user');
        if (userData) {
            setUser(JSON.parse(userData)); // Parse and set user data
            setFormData((prevData) => ({
                ...prevData,
                name: JSON.parse(userData).name,
                email: JSON.parse(userData).email,
            }));
        }
    }, []);

    // Handle form input change
    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [id]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle form submission for Profile and Security
    const handleSubmit = async (e, type) => {
        e.preventDefault();
        try {
            let response;
            if (type === 'profile') {
                response = await axios.post('http://127.0.0.1:5000/update-profile', {
                    name: formData.name,
                    email: formData.email,
                });
            } else if (type === 'security') {
                response = await axios.post('http://127.0.0.1:5000/update-password', {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                });
            }
            setMessage(response.data.message || 'Settings updated successfully!');
        } catch (error) {
            setMessage(error.response?.data?.error || 'An error occurred');
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/logout');
            Cookies.remove('access_token'); // Remove the access_token from cookies
            Cookies.remove('user'); // Remove user data from cookies
            setMessage('Logged out successfully!');
            window.location.href = '/auth/login'; // Change to your desired route
        } catch (error) {
            setMessage(error.response?.data?.error || 'Logout failed');
        }
    };

    // Define the settings components
    const ProfileSettings = () => (
        <div>
            <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
            <form onSubmit={(e) => handleSubmit(e, 'profile')}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-border rounded-md"
                        placeholder="Enter your name"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium" >Email</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-border rounded-md"
                        placeholder="Enter your email"
                        
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md">Save</button>
            </form>
        </div>
    );

    // The other settings components (SecuritySettings, Preferences, Notifications) remain unchanged...
    const SecuritySettings = () => (
        <div>
            <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
            <form onSubmit={(e) => handleSubmit(e, 'security')}>
                <div className="mb-4">
                    <label htmlFor="currentPassword" className="block text-sm font-medium">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-border rounded-md"
                        placeholder="Enter current password"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-border rounded-md"
                        placeholder="Enter new password"
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md">Change Password</button>
            </form>
        </div>
    )

    const Preferences = () => (
        <div>
            <h2 className="text-2xl font-bold mb-4">Preferences</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium">Language</label>
                <select
                    id="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-border rounded-md"
                >
                    <option>English</option>
                    <option>French</option>
                    <option>Spanish</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium">Theme</label>
                <select
                    id="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-border rounded-md"
                >
                    <option>Light</option>
                    <option>Dark</option>
                </select>
            </div>
        </div>
    )

    const Notifications = () => (
        <div>
            <h2 className="text-2xl font-bold mb-4">Notification Settings</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium">Email Notifications</label>
                <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleInputChange}
                    className="mr-2"
                /> Enable email notifications
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium">SMS Notifications</label>
                <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={formData.smsNotifications}
                    onChange={handleInputChange}
                    className="mr-2"
                /> Enable SMS notifications
            </div>
        </div>
    )

    // Render the correct settings tab based on activeTab
    const renderSettings = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings />;
            case 'security':
                return <SecuritySettings />;
            case 'preferences':
                return <Preferences />;
            case 'notifications':
                return <Notifications />;
            default:
                return <ProfileSettings />;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* User Info Display */}
            {user && (
                <div className="mb-4 p-4 border border-border rounded-md">
                    <h2 className="text-xl font-bold">User Details</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            )}

            {/* Tabs */}
            <div className="flex justify-between items-center border-b border-border mb-6">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`py-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}
                    >
                        <User className="inline mr-2 h-4 w-4" />Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`py-2 px-4 ${activeTab === 'security' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}
                    >
                        <Key className="inline mr-2 h-4 w-4" />Security
                    </button>
                    <button
                        onClick={() => setActiveTab('preferences')}
                        className={`py-2 px-4 ${activeTab === 'preferences' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}
                    >
                        <Sliders className="inline mr-2 h-4 w-4" />Preferences
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`py-2 px-4 ${activeTab === 'notifications' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}
                    >
                        <Bell className="inline mr-2 h-4 w-4" />Notifications
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 my-1 py-1 bg-red-600 text-white rounded-md"
                >
                    Logout
                </button>
            </div>

            {/* Content Area */}
            <div className="p-4 border border-border rounded-md">
                {message && <div className="mb-4 text-green-600">{message}</div>}
                {renderSettings()}
            </div>
        </div>
    );
}
