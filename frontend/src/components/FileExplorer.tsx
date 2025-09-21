import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Home,
  ArrowUp,
  RefreshCw,
  Upload,
  Download,
} from "lucide-react";
import { FileInfo } from "../types";

interface FileExplorerProps {
  path: string;
  files: FileInfo[];
  onPathChange: (path: string) => void;
  onFileSelect: (file: FileInfo) => void;
  onFetchFiles: (path: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  path,
  files,
  onPathChange,
  onFileSelect,
  onFetchFiles,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    onFetchFiles(path);
  }, [path, onFetchFiles]);

  const handleFileClick = (file: FileInfo) => {
    setSelectedFile(file.path);
    if (file.is_directory) {
      onPathChange(file.path);
    } else {
      onFileSelect(file);
    }
  };

  const handleFolderToggle = (folderPath: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };

  const goUp = () => {
    const parentPath = path.split("/").slice(0, -1).join("/") || "/";
    onPathChange(parentPath);
  };

  const goHome = () => {
    onPathChange("/");
  };

  const formatFileSize = (size: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (size === 0) return "0 B";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const safeFiles = Array.isArray(files) ? files : [];

  const sortedFiles = [...safeFiles].sort((a, b) => {
    if (a.is_directory && !b.is_directory) return -1;
    if (!a.is_directory && b.is_directory) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="h-full flex flex-col bg-cyberpunk-darker">
      {/* Header */}
      <div className="p-4 border-b border-cyberpunk-primary/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-cyberpunk-primary flex items-center space-x-2">
            <Folder className="w-5 h-5" />
            <span>File Explorer</span>
          </h3>
          <motion.button
            className="p-2 text-cyberpunk-primary hover:text-cyberpunk-accent transition-colors"
            onClick={() => onFetchFiles(path)}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-2 mb-4">
          <motion.button
            className="p-2 text-cyberpunk-primary hover:text-cyberpunk-accent"
            onClick={goHome}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Home className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="p-2 text-cyberpunk-primary hover:text-cyberpunk-accent"
            onClick={goUp}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Current Path */}
        <div className="text-sm text-cyberpunk-accent font-mono bg-cyberpunk-gray/30 p-2 rounded">
          {path}
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto terminal-scrollbar">
        <AnimatePresence>
          {sortedFiles.map((file, index) => (
            <motion.div
              key={file.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`p-3 border-b border-cyberpunk-primary/10 cursor-pointer ${
                selectedFile === file.path
                  ? "bg-cyberpunk-primary/20 border-cyberpunk-primary/50"
                  : "hover:bg-cyberpunk-gray/30"
              }`}
              onClick={() => handleFileClick(file)}
            >
              <div className="flex items-center space-x-3">
                {file.is_directory ? (
                  <motion.div
                    className="text-cyberpunk-accent"
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFolderToggle(file.path);
                    }}
                  >
                    {expandedFolders.has(file.path) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </motion.div>
                ) : (
                  <div className="w-4 h-4" />
                )}

                <div className="flex items-center space-x-2 flex-1">
                  {file.is_directory ? (
                    <Folder className="w-5 h-5 text-cyberpunk-accent" />
                  ) : (
                    <File className="w-5 h-5 text-cyberpunk-primary" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="text-cyberpunk-primary font-mono text-sm truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-cyberpunk-accent">
                      {file.is_directory
                        ? "Directory"
                        : `${formatFileSize(file.size)} • ${formatDate(file.modified)}`}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {safeFiles.length === 0 && (
          <div className="flex items-center justify-center h-32 text-cyberpunk-accent">
            <div className="text-center">
              <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No files found</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-cyberpunk-primary/30">
        <div className="flex items-center justify-between text-xs text-cyberpunk-accent">
          <span>{safeFiles.length} items</span>
          <div className="flex items-center space-x-2">
            <motion.button
              className="p-1 hover:text-cyberpunk-primary"
              whileHover={{ scale: 1.1 }}
            >
              <Upload className="w-3 h-3" />
            </motion.button>
            <motion.button
              className="p-1 hover:text-cyberpunk-primary"
              whileHover={{ scale: 1.1 }}
            >
              <Download className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};