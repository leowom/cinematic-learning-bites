
import React, { useState, useEffect } from 'react';
import DashboardVertical from '@/components/DashboardVertical';
import DashboardSkeleton from '@/components/DashboardSkeleton';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula il caricamento della dashboard
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <DashboardVertical />
    </div>
  );
};

export default Dashboard;
