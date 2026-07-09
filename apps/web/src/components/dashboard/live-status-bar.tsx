"use client";

import React from "react";
import { Wifi, ShieldCheck, Database, HardDrive, RefreshCw } from "lucide-react";

export function LiveStatusBar() {
  const statuses = [
    { name: "API Gateway", status: "operational", icon: <Wifi className="w-3.5 h-3.5" /> },
    { name: "AI Inference", status: "operational", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { name: "Forecast Pipeline", status: "operational", icon: <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> },
    { name: "PostgreSQL DB", status: "operational", icon: <Database className="w-3.5 h-3.5" /> },
    { name: "IoT Sensors", status: "operational", icon: <HardDrive className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="border border-border bg-surface rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
      {/* Left side: System Connection Health */}
      <div className="flex items-center gap-2 text-xs font-semibold text-ink-secondary">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
        <span className="font-mono uppercase tracking-wider">System Status: Excellent (99.8% SLA)</span>
      </div>

      {/* Statuses Grid */}
      <div className="flex flex-wrap items-center gap-6">
        {statuses.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-[11px] font-mono text-ink-tertiary">
            <span className="text-ink-tertiary/60">{item.icon}</span>
            <span>{item.name}:</span>
            <span className="text-success font-semibold lowercase">{item.status}</span>
          </div>
        ))}
        
        {/* Last sync info */}
        <div className="text-[10px] font-mono text-ink-tertiary border-l border-border pl-6">
          Updated: Just Now
        </div>
      </div>
    </div>
  );
}
