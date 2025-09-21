import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cpu, HardDrive, MemoryStick, Activity } from 'lucide-react';
import { SystemStats } from '../types';

interface SystemMonitorProps {
  stats: SystemStats | null;
  onFetchStats: () => void;
}

export const SystemMonitor: React.FC<SystemMonitorProps> = ({
  stats,
  onFetchStats
}) => {
  const [chartData, setChartData] = React.useState<Array<{
    time: string;
    cpu: number;
    memory: number;
    disk: number;
  }>>([]);

  useEffect(() => {
    if (stats) {
      const now = new Date().toLocaleTimeString();
      setChartData(prev => {
        const newData = [
          ...prev,
          {
            time: now,
            cpu: stats.cpu_percent || 0,
            memory: stats.memory_percent || 0,
            disk: stats.disk_percent || 0,
          },
        ];
        return newData.slice(-20); // Keep only last 20 points
      });
    }
  }, [stats]);

  useEffect(() => {
    const interval = setInterval(onFetchStats, 2000);
    return () => clearInterval(interval);
  }, [onFetchStats]);

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (value: number) => {
    if (value < 50) return 'text-green-400';
    if (value < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-cyberpunk-primary flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>System Monitor</span>
        </h3>
        <div className="flex items-center space-x-2 text-sm text-cyberpunk-accent">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* CPU Usage */}
        <motion.div
          className="bg-cyberpunk-darker/50 rounded-lg p-4 border border-cyberpunk-primary/20"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyberpunk-accent" />
              <span className="text-sm font-mono text-cyberpunk-primary">CPU</span>
            </div>
            <span
              className={`text-lg font-bold ${getStatusColor(stats?.cpu_percent || 0)}`}
            >
              {typeof stats?.cpu_percent === 'number'
                ? stats.cpu_percent.toFixed(1)
                : '0.0'}
              %
            </span>
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stroke="#00ff88"
                  fill="#00ff88"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Memory Usage */}
        <motion.div
          className="bg-cyberpunk-darker/50 rounded-lg p-4 border border-cyberpunk-primary/20"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <MemoryStick className="w-4 h-4 text-cyberpunk-accent" />
              <span className="text-sm font-mono text-cyberpunk-primary">
                Memory
              </span>
            </div>
            <span
              className={`text-lg font-bold ${getStatusColor(stats?.memory_percent || 0)}`}
            >
              {typeof stats?.memory_percent === 'number'
                ? stats.memory_percent.toFixed(1)
                : '0.0'}
              %
            </span>
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area
                  type="monotone"
                  dataKey="memory"
                  stroke="#00d4ff"
                  fill="#00d4ff"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-cyberpunk-accent mt-1">
            {stats
              ? `${formatBytes(stats.memory_used || 0)} / ${formatBytes(
                  stats.memory_total || 0
                )}`
              : ''}
          </div>
        </motion.div>

        {/* Disk Usage */}
        <motion.div
          className="bg-cyberpunk-darker/50 rounded-lg p-4 border border-cyberpunk-primary/20"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-cyberpunk-accent" />
              <span className="text-sm font-mono text-cyberpunk-primary">Disk</span>
            </div>
            <span
              className={`text-lg font-bold ${getStatusColor(stats?.disk_percent || 0)}`}
            >
              {typeof stats?.disk_percent === 'number'
                ? stats.disk_percent.toFixed(1)
                : '0.0'}
              %
            </span>
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area
                  type="monotone"
                  dataKey="disk"
                  stroke="#ff0080"
                  fill="#ff0080"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-cyberpunk-accent mt-1">
            {stats
              ? `${formatBytes(stats.disk_used || 0)} / ${formatBytes(
                  stats.disk_total || 0
                )}`
              : ''}
          </div>
        </motion.div>
      </div>
    </div>
  );
};