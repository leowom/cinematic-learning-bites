
import React from 'react';
import HighContrastKPI from './HighContrastKPI';

const ExecutiveSummary = () => {
  const kpiData = [
    {
      title: "Active Users",
      value: "2,847",
      change: "+12.5%",
      trend: "up" as const,
      subtitle: "vs last month"
    },
    {
      title: "Completion Rate",
      value: "94%",
      change: "+8.3%",
      trend: "up" as const,
      subtitle: "avg course completion"
    },
    {
      title: "Productivity Increase",
      value: "12%",
      change: "+2.1%",
      trend: "up" as const,
      subtitle: "measured improvement"
    },
    {
      title: "ROI Achievement",
      value: "156%",
      change: "+18%",
      trend: "up" as const,
      subtitle: "return on investment"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Executive Summary</h2>
        <p className="text-blue-200/80">Key performance indicators and business metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <HighContrastKPI key={index} {...kpi} />
        ))}
      </div>
    </div>
  );
};

export default ExecutiveSummary;
