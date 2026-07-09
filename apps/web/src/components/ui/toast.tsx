"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore, ToastNotification } from "@/store/ui";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { notifications, dismissNotification } = useUIStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissNotification} />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  // Variant icons and styling
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-danger flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-info flex-shrink-0" />,
  };

  const borders = {
    success: "border-success/20 bg-surface/95 shadow-md",
    error: "border-danger/20 bg-surface/95 shadow-md",
    warning: "border-warning/20 bg-surface/95 shadow-md",
    info: "border-border bg-surface/95 shadow-md",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={`pointer-events-auto border flex items-start gap-3 p-4 rounded-xl relative ${
        borders[toast.type]
      }`}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      
      <div className="flex-1 flex flex-col min-w-0 pr-6">
        <span className="text-sm font-semibold text-ink-primary truncate">
          {toast.title}
        </span>
        <span className="text-xs text-ink-secondary mt-1 leading-normal">
          {toast.message}
        </span>
      </div>

      {toast.dismissible && (
        <button
          onClick={() => onDismiss(toast.id)}
          className="absolute top-3 right-3 text-ink-tertiary hover:text-ink-primary transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
