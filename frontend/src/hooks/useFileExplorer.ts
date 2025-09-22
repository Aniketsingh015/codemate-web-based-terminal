import { useState, useEffect, useCallback } from 'react';
import { FileEntry } from '../types';

export const useFileExplorer = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async (path: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/files/${encodeURIComponent(path)}`);
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      } else {
        setError('Failed to fetch files');
      }
    } catch (err) {
      setError('Network error while fetching files');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const navigateToPath = useCallback((path: string) => {
    setCurrentPath(path);
    fetchFiles(path);
  }, [fetchFiles]);

  const goUp = useCallback(() => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    navigateToPath(parentPath);
  }, [currentPath, navigateToPath]);

  const goHome = useCallback(() => {
    navigateToPath('/');
  }, [navigateToPath]);

  const refresh = useCallback(() => {
    fetchFiles(currentPath);
  }, [currentPath, fetchFiles]);

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath, fetchFiles]);

  return {
    currentPath,
    files,
    isLoading,
    error,
    navigateToPath,
    goUp,
    goHome,
    refresh
  };
};
