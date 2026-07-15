"use client";

import React from "react";
import { Wifi, ShieldCheck, Database, HardDrive, RefreshCw } from "lucide-react";

export function LiveStatusBar() {
  const statuses = [
    { name: "API GATEWAY", status: "operational", icon: <Wifi className="w-3.5 h-3.5" /> },
    { name: "ML INFERENCE", status: "operational", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { name: "DATA PIPELINE", status: "operational", icon: <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> },
    { name: "TIMESCALE DB", status: "operational", icon: <Database className="w-3.5 h-3.5" /> },
    { name: "CPCB STATIONS", status: "operational", icon: <HardDrive className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="border border-border/60 bg-[#111419]/40 backdrop-blur-sm rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm select-none">
      {/* Left side: System Connection Health */}
      <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-400">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-display tracking-widest uppercase">SYSTEM STATUS: OPTIMAL (99.9% SLA)</span>
      </div>

      {/* Statuses Grid */}
      <div className="flex flex-wrap items-center gap-6">
        {statuses.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-[10.5px] font-mono text-slate-500">
            <span className="text-slate-600">{item.icon}</span>
            <span>{item.name}:</span>
            <span className="text-emerald-400 font-bold uppercase text-[9px] bg-emerald-950/20 border border-emerald-500/10 px-1.5 py-0.5 rounded">{item.status}</span>
          </div>
        ))}
        
        {/* Last sync info */}
        <div className="text-[10px] font-mono text-slate-600 border-l border-border/60 pl-6 hidden xl:block">
          SYS_SYNC: OK
        </div>
      </div>
    </div>
  );
}
