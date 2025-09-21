import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CommandOutput, TerminalTab, WebSocketMessage, Theme } from "../types";
import {
  Mic,
  MicOff,
  Play,
  Square,
  ChevronDown,
  X,
  Maximize2,
  GripHorizontal,
} from "lucide-react";

interface TerminalProps {
  tab: TerminalTab;
  onUpdateTab: (tabId: string, updates: Partial<TerminalTab>) => void;
  onSendMessage: (message: WebSocketMessage) => void;
  onCloseTab: (tabId: string) => void;
  onMinimizeTab: (tabId: string) => void;
  onResizeTab: (tabId: string, height: number) => void;
  theme: Theme;
  isMinimized?: boolean;
  customHeight?: number;
}

export const Terminal: React.FC<TerminalProps> = ({
  tab,
  onUpdateTab,
  onSendMessage,
  onCloseTab,
  onMinimizeTab,
  onResizeTab,
  theme,
  isMinimized = false,
  customHeight = 400,
}) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartY, setResizeStartY] = useState(0);
  const [resizeStartHeight, setResizeStartHeight] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (terminalRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShowScrollButton(!isAtBottom);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [tab.output, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [tab.id]);

  // Execute command
  const handleCommand = useCallback(
    async (command: string) => {
      if (!command.trim()) return;

      const commandId = Date.now().toString();
      const newOutput: CommandOutput = {
        id: commandId,
        type: "command",
        content: command,
        timestamp: new Date(),
      };

      onUpdateTab(tab.id, {
        output: [...tab.output, newOutput],
        commandHistory: [...tab.commandHistory, command],
        historyIndex: tab.commandHistory.length,
      });

      setIsExecuting(true);

      try {
        const response = await fetch("/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            command,
            working_directory: tab.workingDirectory,
          }),
        });

        const result = await response.json();
        const outputMessages: CommandOutput[] = [];

        if (result.output) {
          outputMessages.push({
            id: `${commandId}-output`,
            type: "output",
            content: result.output,
            timestamp: new Date(),
          });
        }

        if (result.error) {
          outputMessages.push({
            id: `${commandId}-error`,
            type: "error",
            content: result.error,
            timestamp: new Date(),
          });
        }

        onUpdateTab(tab.id, {
          output: [...tab.output, newOutput, ...outputMessages],
          workingDirectory: result.working_directory,
        });
      } catch (error) {
        const errorMessage: CommandOutput = {
          id: `${commandId}-error`,
          type: "error",
          content: `Error executing command: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          timestamp: new Date(),
        };

        onUpdateTab(tab.id, {
          output: [...tab.output, newOutput, errorMessage],
        });
      } finally {
        setIsExecuting(false);
      }
    },
    [tab.id, tab.output, tab.workingDirectory, onUpdateTab]
  );

  // Handle input history navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleCommand(input);
        setInput("");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (tab.historyIndex > 0) {
          const newIndex = tab.historyIndex - 1;
          onUpdateTab(tab.id, { historyIndex: newIndex });
          setInput(tab.commandHistory[newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (tab.historyIndex < tab.commandHistory.length - 1) {
          const newIndex = tab.historyIndex + 1;
          onUpdateTab(tab.id, { historyIndex: newIndex });
          setInput(tab.commandHistory[newIndex]);
        } else {
          onUpdateTab(tab.id, { historyIndex: tab.commandHistory.length });
          setInput("");
        }
      }
    },
    [input, tab.historyIndex, tab.commandHistory, tab.id, onUpdateTab, handleCommand]
  );

  // Format terminal output
  const formatOutput = (output: CommandOutput) => {
    const lines = output.content.split("\n");
    return lines.map((line, i) => (
      <div key={i} className="whitespace-pre-wrap break-words">
        {line}
      </div>
    ));
  };

  // Minimized state
  if (isMinimized) {
    return (
      <motion.div
        initial={{ height: customHeight }}
        animate={{ height: 40 }}
        transition={{ duration: 0.3 }}
        className="bg-cyberpunk-dark border border-cyberpunk-primary/30 rounded-t-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-2 bg-cyberpunk-gray">
          <span className="ml-4 text-sm text-cyberpunk-primary font-mono">
            {tab.workingDirectory} (Minimized)
          </span>
          <div className="flex items-center space-x-2">
            <motion.button
              className="p-1 text-cyberpunk-primary hover:text-cyberpunk-accent"
              onClick={() => onMinimizeTab(tab.id)}
            >
              <Maximize2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              className="p-1 text-red-400 hover:text-red-300"
              onClick={() => onCloseTab(tab.id)}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ height: customHeight }}
      animate={{ height: customHeight }}
      transition={{ duration: 0.3 }}
      className="bg-cyberpunk-dark border border-cyberpunk-primary/30 rounded-t-lg overflow-hidden relative"
    >
      {/* Output area */}
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto terminal-scrollbar"
        onScroll={handleScroll}
      >
        <AnimatePresence>
          {tab.output.map((output) => (
            <motion.div
              key={output.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`font-mono text-sm ${
                output.type === "command"
                  ? "text-cyberpunk-accent"
                  : output.type === "error"
                  ? "text-red-400"
                  : "text-cyberpunk-primary"
              }`}
            >
              {output.type === "command" && (
                <span className="text-cyberpunk-primary">$ </span>
              )}
              {formatOutput(output)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="p-4 bg-cyberpunk-darker border-t border-cyberpunk-primary/30">
        <div className="flex items-center space-x-2">
          <span className="text-cyberpunk-accent font-mono">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-cyberpunk-primary font-mono"
            placeholder="Enter command..."
            disabled={isExecuting}
          />
          <motion.button
            className="p-2 text-cyberpunk-primary hover:text-cyberpunk-accent"
            onClick={() => handleCommand(input)}
            disabled={isExecuting || !input.trim()}
          >
            <Play className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};