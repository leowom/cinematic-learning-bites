
import React from 'react';
import EngagementChart from './EngagementChart';
import LearningPerformanceChart from './LearningPerformanceChart';
import BusinessImpactChart from './BusinessImpactChart';

const CoreAnalyticsBentobox = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Core Analytics</h2>
        <p className="text-blue-200/80">Detailed performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Engagement Metrics Panel */}
        <div className="analytics-container bg-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-1">
          <EngagementChart />
        </div>

        {/* Learning Performance Panel */}
        <div className="analytics-container bg-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-1">
          <LearningPerformanceChart />
        </div>

        {/* Business Impact Panel */}
        <div className="analytics-container bg-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-1 lg:col-span-2 xl:col-span-1">
          <BusinessImpactChart />
        </div>
      </div>
    </div>
  );
};

export default CoreAnalyticsBentobox;
