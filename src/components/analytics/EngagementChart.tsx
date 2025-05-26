
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const EngagementChart = () => {
  const data = [
    { name: 'Mon', engagement: 85 },
    { name: 'Tue', engagement: 92 },
    { name: 'Wed', engagement: 78 },
    { name: 'Thu', engagement: 96 },
    { name: 'Fri', engagement: 89 },
    { name: 'Sat', engagement: 45 },
    { name: 'Sun', engagement: 52 },
  ];

  return (
    <div className="chart-area bg-white rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Daily Engagement</h3>
        <p className="text-sm text-gray-600">User activity throughout the week</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
            />
            <Bar 
              dataKey="engagement" 
              fill="#1e40af" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EngagementChart;
