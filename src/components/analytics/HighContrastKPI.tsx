
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface HighContrastKPIProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  subtitle: string;
}

const HighContrastKPI: React.FC<HighContrastKPIProps> = ({
  title,
  value,
  change,
  trend,
  subtitle
}) => {
  return (
    <div className="kpi-card bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
          trend === 'up' 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          <span>{change}</span>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </div>
      
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

export default HighContrastKPI;
