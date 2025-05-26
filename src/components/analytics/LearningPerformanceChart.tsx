
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const LearningPerformanceChart = () => {
  const data = [
    { month: 'Jan', completion: 85, retention: 92 },
    { month: 'Feb', completion: 88, retention: 94 },
    { month: 'Mar', completion: 92, retention: 89 },
    { month: 'Apr', completion: 85, retention: 96 },
    { month: 'May', completion: 96, retention: 98 },
    { month: 'Jun', completion: 94, retention: 95 },
  ];

  return (
    <div className="chart-area bg-white rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Learning Performance</h3>
        <p className="text-sm text-gray-600">Completion and retention rates</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
            />
            <Line 
              type="monotone" 
              dataKey="completion" 
              stroke="#1e40af" 
              strokeWidth={3}
              dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="retention" 
              stroke="#059669" 
              strokeWidth={3}
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LearningPerformanceChart;
