import { useState, useEffect } from 'react';
import { SystemStats } from '../types';

export const useSystemStats = () => {
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu_percent: 0,
    memory_percent: 0,
    memory_used: 0,
    memory_total: 0,
    disk_percent: 0,
    disk_used: 0,
    disk_total: 0,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://codemate-web-based-terminal-1.onrender.com/api/system-stats');
        if (response.ok) {
          const stats: SystemStats = await response.json();
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