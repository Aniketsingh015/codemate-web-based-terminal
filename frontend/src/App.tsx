import  { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "./components/Terminal";
import { SystemMonitor } from "./components/SystemMonitor";
import { FileExplorer } from "./components/FileExplorer";
import { Header } from "./components/Header";
import { TerminalTab, FileEntry } from "./types"; // ✅ added FileEntry
import { useSystemStats } from "./hooks/useSystemStats";
import { useTheme } from "./hooks/useTheme";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: "1",
      name: "Terminal 1",
      output: [
        {
          id: Date.now().toString(),
          type: "output",
          content: "Welcome to CodeMate.Server 🚀",
          timestamp: new Date(),
        },
      ],
      commandHistory: [],
      historyIndex: 0,
      workingDirectory: ".",
      isMinimized: false,
      customHeight: 400,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("1");
  const { systemStats } = useSystemStats();
  const { theme, toggleTheme } = useTheme();

  // File explorer state
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [currentPath, setCurrentPath] = useState(".");

  const fetchSystemStats = async () => {
    try {
      const res = await fetch("/api/system-stats");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching system stats:", err);
      return null;
    }
  };

  const fetchFiles = async (path: string) => {
    try {
      const cleanPath = path === "." ? "" : path;
      const res = await fetch(`/api/files/${cleanPath}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setFiles(data);
      } else {
        setFiles([]);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath]);

  const addTab = useCallback(() => {
    const newTab: TerminalTab = {
      id: Date.now().toString(),
      name: `Terminal ${tabs.length + 1}`,
      output: [],
      commandHistory: [],
      historyIndex: 0,
      workingDirectory: ".",
      isMinimized: false,
      customHeight: 400,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs.length]);

  const closeTab = useCallback(
    (tabId: string) => {
      if (tabs.length <= 1) return; // Prevent closing last tab
      setTabs((prev) => prev.filter((tab) => tab.id !== tabId));
      if (activeTabId === tabId) {
        const remainingTabs = tabs.filter((tab) => tab.id !== tabId);
        setActiveTabId(remainingTabs[0]?.id || "");
      }
    },
    [tabs, activeTabId]
  );

  const minimizeTab = useCallback((tabId: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId ? { ...tab, isMinimized: !tab.isMinimized } : tab
      )
    );
  }, []);

  const resizeTab = useCallback((tabId: string, height: number) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId ? { ...tab, customHeight: height } : tab
      )
    );
  }, []);

  const updateTab = useCallback(
    (tabId: string, updates: Partial<TerminalTab>) => {
      setTabs((prev) =>
        prev.map((tab) => (tab.id === tabId ? { ...tab, ...updates } : tab))
      );
    },
    []
  );

  //  Keyboard shortcuts 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // New Tab -> Ctrl + N
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        addTab();
      }

      // Close Tab -> Ctrl + Shift + W (safer than Ctrl+W)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "w") {
        e.preventDefault();
        if (activeTabId) {
          closeTab(activeTabId);
        }
      }

      // Clear Terminal -> Ctrl + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === activeTabId
              ? { ...tab, output: tab.output.slice(0, 1) } // keep first message
              : tab
          )
        );
      }

      // Switch Tabs -> Alt + → / Alt + ←
      if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        const currentIndex = tabs.findIndex((t) => t.id === activeTabId);
        const newIndex = (currentIndex + 1) % tabs.length;
        setActiveTabId(tabs[newIndex].id);
      }
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        const currentIndex = tabs.findIndex((t) => t.id === activeTabId);
        const newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        setActiveTabId(tabs[newIndex].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tabs, activeTabId, addTab, closeTab]);

  return (
    <div
      className={`min-h-screen ${
        theme === "cyberpunk" ? "bg-cyberpunk-dark" : "bg-gray-900"
      }`}
    >
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
        onAddTab={addTab}
        onCloseTab={closeTab}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* File Explorer Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-cyberpunk-darker border-r border-cyberpunk-primary/30 flex-shrink-0"
        >
          <FileExplorer
            path={currentPath}
            files={files}
            onPathChange={setCurrentPath}
            onFileSelect={(file) => console.log("Selected file:", file)}
            onFetchFiles={fetchFiles}
          />
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* System Monitor */}
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="h-40 bg-cyberpunk-darker border-b border-cyberpunk-primary/30 flex-shrink-0 mb-10"
          >
            <SystemMonitor stats={systemStats} onFetchStats={fetchSystemStats} />
          </motion.div>

          {/* Terminal Area */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {tabs.map((tab) => (
                <motion.div
                  key={tab.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className={`${
                    activeTabId === tab.id
                      ? "ring-2 ring-cyberpunk-primary"
                      : "ring-1 ring-cyberpunk-primary/30"
                  } rounded-lg`}
                >
                  <Terminal
                    tab={tab}
                    onUpdateTab={updateTab}
                    onSendMessage={() => {}}
                    onCloseTab={closeTab}
                    onMinimizeTab={minimizeTab}
                    onResizeTab={resizeTab}
                    theme={theme}
                    isMinimized={tab.isMinimized}
                    customHeight={tab.customHeight}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default App;