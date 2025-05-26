
import React from 'react';

const BusinessImpactChart = () => {
  const impactData = [
    { metric: 'Productivity', current: 156, target: 150, unit: '%' },
    { metric: 'Skills Assessment', current: 94, target: 85, unit: '%' },
    { metric: 'Course Completion', current: 89, target: 80, unit: '%' },
    { metric: 'Employee Satisfaction', current: 4.8, target: 4.5, unit: '/5' },
  ];

  return (
    <div className="chart-area bg-white rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Business Impact</h3>
        <p className="text-sm text-gray-600">ROI and performance metrics</p>
      </div>
      
      <div className="space-y-4">
        {impactData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{item.metric}</span>
                <span className="text-sm font-bold text-gray-900">
                  {item.current}{item.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(item.current / (item.target * 1.2)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">Target: {item.target}{item.unit}</span>
                <span className={`text-xs font-medium ${
                  item.current >= item.target ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {item.current >= item.target ? 'Above Target' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessImpactChart;
