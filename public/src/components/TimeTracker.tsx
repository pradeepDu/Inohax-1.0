import React, { useEffect } from 'react';

const TimeTracker: React.FC = () => {
  useEffect(() => {
    let startTime: number | null = null;
    let totalTimeSpent = parseInt(sessionStorage.getItem('timeSpent') || '0', 10);

    const startTimer = () => {
      startTime = Date.now();
      console.log("Timer started");
    };

    const stopTimer = () => {
      if (startTime !== null) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        totalTimeSpent += timeSpent;
        console.log(`Time spent: ${timeSpent} seconds`);
        sessionStorage.setItem('timeSpent', totalTimeSpent.toString());
        startTime = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    // Start the timer when the user enters the site
    startTimer();

    // Listen for visibility change (tab switching)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopTimer();
    };
  }, []);

  return null;
};

export default TimeTracker;
