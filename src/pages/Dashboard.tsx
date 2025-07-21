
import React, { useState } from 'react';
import DashboardVertical from '@/components/DashboardVertical';
import LoadingScreen from '@/components/LoadingScreen';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <DashboardVertical />
    </div>
  );
};

export default Dashboard;
