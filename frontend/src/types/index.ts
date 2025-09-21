export interface CommandOutput {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export interface SystemStats {
  cpu_percent: number;
  memory_percent: number;
  memory_used: number;
  memory_total: number;
  disk_percent: number;
  disk_used: number;
  disk_total: number;
  timestamp: string; // since backend returns ISO string
}

export interface FileEntry {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: Date;
}

export interface TerminalTab {
  id: string;
  name: string;
  output: CommandOutput[];
  commandHistory: string[];
  historyIndex: number;
  workingDirectory: string;
  isMinimized?: boolean;
  customHeight?: number;
}

export interface WebSocketMessage {
  type: 'command' | 'output' | 'error' | 'system_stats';
  data: any;
}

export type Theme = 'cyberpunk' | 'minimal';

export interface TerminalControls {
  onCloseTab: (tabId: string) => void;
  onMinimizeTab: (tabId: string) => void;
  onResizeTab: (tabId: string, height: number) => void;
}
