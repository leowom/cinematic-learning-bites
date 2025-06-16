
import React, { useState } from 'react';
import DashboardVertical from '@/components/DashboardVertical';
import LoadingScreen from '@/components/LoadingScreen';
import ScreensaverEasterEgg from '@/components/ScreensaverEasterEgg';
import { useIdleDetector } from '@/hooks/useIdleDetector';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isIdle, resetTimer } = useIdleDetector(60000); // 1 minuto

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleScreensaverDeactivate = () => {
    resetTimer();
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <DashboardVertical />
      </div>
      
      <ScreensaverEasterEgg 
        isActive={isIdle} 
        onDeactivate={handleScreensaverDeactivate} 
      />
    </>
  );
};

export default Dashboard;
