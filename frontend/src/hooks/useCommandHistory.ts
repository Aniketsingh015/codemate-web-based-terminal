import { useState, useCallback } from 'react';

export const useCommandHistory = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  const addCommand = useCallback((command: string) => {
    if (command.trim()) {
      setHistory(prev => [...prev, command]);
      setIndex(prev => prev + 1);
    }
  }, []);

  const getPreviousCommand = useCallback(() => {
    if (index > 0) {
      const newIndex = index - 1;
      setIndex(newIndex);
      return history[newIndex];
    }
    return '';
  }, [history, index]);

  const getNextCommand = useCallback(() => {
    if (index < history.length) {
      const newIndex = index + 1;
      setIndex(newIndex);
      return history[newIndex] || '';
    }
    return '';
  }, [history, index]);

  const resetIndex = useCallback(() => {
    setIndex(history.length);
  }, [history.length]);

  return {
    history,
    index,
    addCommand,
    getPreviousCommand,
    getNextCommand,
    resetIndex
  };
};
