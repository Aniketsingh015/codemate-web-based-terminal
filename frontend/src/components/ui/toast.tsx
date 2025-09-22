import React from "react";
import { cn } from "../../lib/utils";

interface ToastProps {
  children: React.ReactNode;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({ children, className }) => (
  <div className={cn("bg-background border rounded-lg shadow-lg p-4", className)}>{children}</div>
);