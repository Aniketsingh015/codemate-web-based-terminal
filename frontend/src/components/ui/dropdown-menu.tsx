import React from "react";
import { cn } from "../../lib/utils";

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, className }) => (
  <div className={cn("relative inline-block", className)}>{children}</div>
);

export const DropdownMenuContent: React.FC<DropdownMenuProps> = ({ children, className }) => (
  <div className={cn("absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg z-50", className)}>
    {children}
  </div>
);