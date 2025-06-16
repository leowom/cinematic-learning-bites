
import { useEffect } from 'react';

// Preload critical components for better INP
export const usePreloadComponents = () => {
  useEffect(() => {
    const preloadComponent = (componentPath: string) => {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = componentPath;
      document.head.appendChild(link);
    };

    // Preload next step components when user is on onboarding
    if (window.location.pathname === '/onboarding') {
      // Delay preloading to avoid blocking main thread
      requestIdleCallback(() => {
        preloadComponent('/src/components/onboarding/ProfileBuilderStep.tsx');
        preloadComponent('/src/components/onboarding/AssessmentStep.tsx');
        preloadComponent('/src/components/onboarding/PersonalizationStep.tsx');
        preloadComponent('/src/workers/assessmentWorker.ts');
      }, { timeout: 2000 });
    }
  }, []);
};
