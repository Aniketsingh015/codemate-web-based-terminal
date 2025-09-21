import React from "react";
import { cn } from "../../lib/utils";

interface TabsProps {
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ children, className }) => (
  <div className={cn("w-full", className)}>{children}</div>
);

export const TabsList: React.FC<TabsProps> = ({ children, className }) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
    {children}
  </div>
);

export const TabsTrigger: React.FC<TabsProps & { value: string; active?: boolean }> = ({
  children,
  className,
  active = false,
}) => (
  <button
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      active ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50",
      className
    )}
  >
    {children}
  </button>
);