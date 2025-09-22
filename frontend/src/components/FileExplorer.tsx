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
import { FileEntry } from "../types";

interface FileExplorerProps {
  path: string;
  files: FileEntry[];
  onPathChange: (path: string) => void;
  onFileSelect: (file: FileEntry) => void;
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

  const handleToggleFolder = (folderPath: string) => {
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

  const handleSelectFile = (file: FileEntry) => {
    setSelectedFile(file.path);
    onFileSelect(file);
  };

  return (
    <div className="p-2 text-sm font-mono text-cyberpunk-primary">
      {/* Current path */}
      <div className="flex items-center mb-2 space-x-2">
        <button onClick={() => onPathChange("/")} title="Home">
          <Home className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            const parent = path.split("/").slice(0, -1).join("/") || "/";
            onPathChange(parent);
          }}
          title="Up"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <span className="truncate">{path}</span>
        <button onClick={() => onFetchFiles(path)} title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* File list */}
      <ul>
        <AnimatePresence>
          {files.map((file) => (
            <motion.li
              key={file.path}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`flex items-center cursor-pointer px-2 py-1 rounded ${
                selectedFile === file.path ? "bg-cyberpunk-gray" : ""
              }`}
              onClick={() =>
                file.is_directory
                  ? handleToggleFolder(file.path)
                  : handleSelectFile(file)
              }
            >
              {file.is_directory ? (
                <>
                  {expandedFolders.has(file.path) ? (
                    <ChevronDown className="w-4 h-4 mr-1" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-1" />
                  )}
                  <Folder className="w-4 h-4 mr-1" />
                </>
              ) : (
                <File className="w-4 h-4 mr-1" />
              )}
              <span>{file.name}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Action buttons */}
      <div className="flex justify-between mt-2">
        <button className="flex items-center space-x-1">
          <Upload className="w-4 h-4" /> <span>Upload</span>
        </button>
        <button className="flex items-center space-x-1">
          <Download className="w-4 h-4" /> <span>Download</span>
        </button>
      </div>
    </div>
  );
};