import React from 'react';
import { motion } from 'framer-motion';
import { TerminalTab, Theme } from '../types';
import { Zap, Plus, RefreshCw, Moon, Sun, X } from 'lucide-react';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  tabs: TerminalTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  onAddTab: () => void;
  onCloseTab: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  tabs,
  activeTabId,
  onTabChange,
  onAddTab,
  onCloseTab,
}) => {
  return (
    <header className="h-16 bg-cyberpunk-darker border-b border-cyberpunk-primary/30 flex items-center justify-between px-6">
      {/* Left Side - Logo and Tabs */}
      <div className="flex items-center space-x-6">
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <Zap className="w-8 h-8 text-cyberpunk-primary" />
          <h1 className="text-2xl font-bold text-cyberpunk-primary font-mono">
            CODEMATE TERMINAL
          </h1>
        </motion.div>

        {/* Terminal Tabs */}
        <div className="flex items-center space-x-2">
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg cursor-pointer transition-all ${
                activeTabId === tab.id
                  ? 'bg-cyberpunk-primary text-cyberpunk-dark'
                  : 'bg-cyberpunk-gray text-cyberpunk-primary hover:bg-cyberpunk-primary/20'
              } ${tab.isMinimized ? 'opacity-50' : ''}`}
              onClick={() => onTabChange(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-mono text-sm">{tab.name}</span>
              <div className="flex items-center space-x-1">
                {tab.isMinimized && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-2 h-2 bg-yellow-400 rounded-full"
                  />
                )}
                <motion.button
                  className="p-1 hover:bg-cyberpunk-primary/20 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                    
                    // Handle tab-specific close if needed
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-3 h-3" />
                </motion.button>
              </div>
            </motion.div>
          ))}
          
          {/* Add Tab Button */}
          <motion.button
            className="p-2 text-cyberpunk-primary hover:text-cyberpunk-accent transition-colors"
            onClick={onAddTab}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            title="Add New Terminal"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Right Side - Controls */}
      <div className="flex items-center space-x-4">
        <motion.button
          className="p-2 text-cyberpunk-primary hover:text-cyberpunk-accent transition-colors"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>

        <motion.button
          className="p-2 text-cyberpunk-primary hover:text-cyberpunk-accent transition-colors"
          onClick={onToggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={`Switch to ${theme === 'cyberpunk' ? 'minimal' : 'cyberpunk'} theme`}
        >
          {theme === 'cyberpunk' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </motion.button>

        <motion.div
          className="flex items-center space-x-2 px-3 py-1 bg-cyberpunk-primary/20 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-cyberpunk-primary rounded-full" />
          <span className="text-sm text-cyberpunk-primary font-mono">Live</span>
        </motion.div>
      </div>
    </header>
  );
};