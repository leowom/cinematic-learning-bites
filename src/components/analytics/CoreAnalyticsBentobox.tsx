
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

      <div className="stable-grid">
        {/* Engagement Metrics Panel */}
        <div className="analytics-container rounded-xl p-1" style={{ minHeight: '350px' }}>
          <EngagementChart />
        </div>

        {/* Learning Performance Panel */}
        <div className="analytics-container rounded-xl p-1" style={{ minHeight: '350px' }}>
          <LearningPerformanceChart />
        </div>

        {/* Business Impact Panel */}
        <div className="analytics-container rounded-xl p-1" style={{ minHeight: '350px' }}>
          <BusinessImpactChart />
        </div>
      </div>
    </div>
  );
};

export default CoreAnalyticsBentobox;
