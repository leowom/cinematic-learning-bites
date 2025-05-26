
import React from 'react';

const DetailedAnalyticsSection = () => {
  const userData = [
    { name: 'Marketing Team', users: 127, completion: 94, avgScore: 87 },
    { name: 'Engineering', users: 245, completion: 89, avgScore: 92 },
    { name: 'Sales', users: 98, completion: 96, avgScore: 85 },
    { name: 'HR', users: 45, completion: 91, avgScore: 89 },
    { name: 'Finance', users: 67, completion: 88, avgScore: 91 },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Detailed Analytics</h2>
        <p className="text-blue-200/80">Department performance and user insights</p>
      </div>

      <div className="analytics-container bg-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="data-table bg-white rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
            <p className="text-sm text-gray-600">Team-by-team learning analytics</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Users</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Completion</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((row, index) => (
                  <tr key={index} className={`data-row ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                    <td className="py-3 px-4 font-medium text-gray-900">{row.name}</td>
                    <td className="py-3 px-4 text-gray-700">{row.users}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {row.completion}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{row.avgScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalyticsSection;
