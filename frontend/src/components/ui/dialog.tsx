import React from "react";
import { cn } from "../../lib/utils";

interface DialogProps {
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({ children, className }) => (
  <div className={cn("fixed inset-0 z-50 flex items-center justify-center", className)}>
    {children}
  </div>
);

export const DialogContent: React.FC<DialogProps> = ({ children, className }) => (
  <div className={cn("bg-background border rounded-lg shadow-lg p-6", className)}>
    {children}
  </div>
);