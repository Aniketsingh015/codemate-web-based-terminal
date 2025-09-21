import { useState, useEffect } from 'react';
import { SystemStats } from '../types';

export const useSystemStats = () => {
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    disk: 0,
    timestamp: Date.now()
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/system-stats');
        if (response.ok) {
          const stats = await response.json();
          setSystemStats(stats);
        }
      } catch (error) {
        console.error('Failed to fetch system stats:', error);
      }
    };

    // Fetch immediately
    fetchStats();

    // Set up interval to fetch every 2 seconds
    const interval = setInterval(fetchStats, 2000);

    return () => clearInterval(interval);
  }, []);

  return { systemStats };
};
