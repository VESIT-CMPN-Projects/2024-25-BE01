// src/app/components/RecentActivities.js
import React from 'react';

const RecentActivities = () => {
  const activities = [
    { id: 1, text: 'New patient admitted - ID 12345', time: '10 minutes ago' },
    { id: 2, text: 'Appointment scheduled for Dr. Smith', time: '1 hour ago' },
    { id: 3, text: 'Inventory stock updated', time: '3 hours ago' },
    // Add more activities as needed
  ];

  return (
    <div className="bg-white shadow-md rounded p-4 border border-light-gray">
      <h2 className="text-xl font-semibold text-slate-gray mb-4">Recent Activities</h2>
      <ul className="space-y-2">
        {activities.map(activity => (
          <li key={activity.id} className="text-slate-gray">
            <p>{activity.text}</p>
            <span className="text-sm text-gray-500">{activity.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
