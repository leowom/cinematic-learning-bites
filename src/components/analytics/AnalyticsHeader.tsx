
import React from 'react';
import { BarChart3, Download, Calendar, Filter } from 'lucide-react';

const AnalyticsHeader = () => {
  return (
    <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Analytics Identity */}
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <BarChart3 className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-blue-200/80 text-sm">Learning Bites Performance Intelligence</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <Calendar className="w-4 h-4 text-blue-200" />
              <span className="text-blue-100 text-sm">Last 30 Days</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <Filter className="w-4 h-4 text-blue-200" />
              <span className="text-blue-100 text-sm">Filters</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Download className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
