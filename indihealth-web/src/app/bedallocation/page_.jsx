// bedallocation/page.jsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const AvailableBeds = () => {
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
        const response = await fetch('http://localhost:5000/departments' , {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }); // Change this to your actual endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }
        const data = await response.json();
        setDepartments(data); // Assume the API returns an array of department objects
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">
        Available Departments
      </h1>
      <div className="flex flex-wrap justify-between gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id} // Use a unique identifier from your department object
            className="bg-green-100 rounded-lg shadow-md p-5 transition-transform transform hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col justify-between"
            onClick={() => router.push(`/bedallocation/${dept.name}`)} // Assuming the department object has a 'name' property
          >
            <h3 className="text-xl text-blue-600 mb-2">{dept.name}</h3> {/* Display department name */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableBeds;
