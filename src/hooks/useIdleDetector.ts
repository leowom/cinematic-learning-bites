
import { useState, useEffect, useCallback } from 'react';

export const useIdleDetector = (timeoutMs: number = 60000) => {
  const [isIdle, setIsIdle] = useState(false);

  const resetTimer = useCallback(() => {
    setIsIdle(false);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleActivity = () => {
      clearTimeout(timeoutId);
      setIsIdle(false);
      
      timeoutId = setTimeout(() => {
        setIsIdle(true);
      }, timeoutMs);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Inizializza il timer
    handleActivity();

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [timeoutMs]);

  return { isIdle, resetTimer };
};
