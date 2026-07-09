"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import {
  FileText,
  Sliders,
  TrendingUp,
  Map,
  HeartPulse,
  ShieldAlert,
  BarChart2,
  Sparkles
} from "lucide-react";

export function QuickActionPanel() {
  const router = useRouter();
  const { user } = useAuthStore();
  const role = user?.role_name || "Citizen";

  const actions = [
    {
      name: "Generate Report",
      icon: <FileText className="w-4 h-4 text-accent" />,
      action: () => router.push("/dashboard/reports"),
      roles: ["Administrator", "City Officer"],
    },
    {
      name: "Run Simulation",
      icon: <Sliders className="w-4 h-4 text-accent" />,
      action: () => router.push("/dashboard/simulator"),
      roles: ["Administrator", "City Officer"],
    },
    {
      name: "View Forecast",
      icon: <TrendingUp className="w-4 h-4 text-accent" />,
      action: () => router.push("/dashboard/forecast"),
      roles: ["Administrator", "City Officer", "Citizen"],
    },
    {
      name: "View Map",
      icon: <Map className="w-4 h-4 text-accent" />,
      action: () => router.push("/dashboard/source-map"),
      roles: ["Administrator", "City Officer", "Citizen"],
    },
    {
      name: "Citizen Advisory",
      icon: <HeartPulse className="w-4 h-4 text-accent" />,
      action: () => router.push("/dashboard/advisory"),
      roles: ["Administrator", "City Officer", "Citizen"],
    },
    {
      name: "Enforcement Panel",
      icon: <ShieldAlert className="w-4 h-4 text-accent" />,
      action: () => router.push("/dashboard/enforcement"),
      roles: ["Administrator", "City Officer"],
    },
    {
      name: "Compare Cities",
      icon: <BarChart2 className="w-4 h-4 text-accent" />,
      action: () => router.push("/dashboard/cities"),
      roles: ["Administrator", "City Officer", "Citizen"],
    },
  ];

  // Filter actions user role permits
  const allowedActions = actions.filter((act) => act.roles.includes(role));

  return (
    <div className="border border-border bg-surface rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-secondary uppercase tracking-widest font-mono">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        Quick Actions
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {allowedActions.map((act) => (
          <button
            key={act.name}
            onClick={act.action}
            className="flex items-center gap-2.5 px-4 h-11 rounded-lg border border-border bg-canvas hover:bg-surface-raised transition-colors text-xs font-semibold text-ink-primary hover:text-accent shadow-sm active:scale-[0.98]"
          >
            <span>{act.icon}</span>
            <span className="truncate">{act.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
