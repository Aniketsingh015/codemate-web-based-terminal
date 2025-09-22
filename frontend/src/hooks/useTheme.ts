import { useState, useEffect } from 'react';
import { Theme } from '../types';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('cyberpunk-terminal-theme');
    return (savedTheme as Theme) || 'cyberpunk';
  });

  useEffect(() => {
    localStorage.setItem('cyberpunk-terminal-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'cyberpunk' ? 'minimal' : 'cyberpunk');
  };

  return { theme, toggleTheme };
};
