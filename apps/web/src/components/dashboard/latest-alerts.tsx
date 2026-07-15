"use client";

import React from "react";
import { AlertTriangle, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AlertItem {
  id: string;
  severity: "critical" | "high" | "medium" | "low" | string;
  category: string;
  time: string;
  location: string;
  status: string;
}

interface LatestAlertsProps {
  alerts?: AlertItem[];
}

export function LatestAlerts({ alerts = [] }: LatestAlertsProps) {
  const getSeverityColor = (sev: string) => {
    switch ((sev || "").toLowerCase()) {
      case "critical":
        return "bg-danger/10 border-danger/25 text-danger";
      case "high":
        return "bg-danger/5 border-danger/15 text-danger/90";
      case "medium":
        return "bg-warning/10 border-warning/25 text-warning";
      default:
        return "bg-info/10 border-info/25 text-info";
    }
  };

  return (
    <div className="border border-border bg-surface rounded-xl p-6 flex flex-col h-full min-h-[350px]">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-secondary uppercase tracking-widest font-mono mb-4">
        <AlertTriangle className="w-3.5 h-3.5 text-warning" />
        Latest Alerts
      </div>

      <div className="flex-1 flex flex-col justify-start">
        {alerts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border border-dashed border-border rounded-lg p-6 text-center text-xs text-ink-tertiary">
            No active alerts in this area.
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-lg border flex flex-col gap-2 text-left ${getSeverityColor(
                  item.severity
                )}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {item.category}
                  </span>
                  <Badge variant="outline" className="border-current/30 text-current text-[9px] px-2">
                    {item.status}
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-1 text-[11px] opacity-90 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
