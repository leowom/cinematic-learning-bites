
import { useEffect } from 'react';

// Simplified preloading for better performance
export const usePreloadComponents = () => {
  useEffect(() => {
    // Only preload on onboarding page and use simpler logic
    if (window.location.pathname === '/onboarding') {
      // Reduced timeout and simplified preloading
      const timer = setTimeout(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = '/src/workers/assessmentWorker.ts';
        document.head.appendChild(link);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);
};
