"use client";

import React from "react";
import { Activity } from "lucide-react";

interface ActivityItem {
  time: string;
  title: string;
  desc: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  return (
    <div className="border border-border bg-surface rounded-xl p-6 flex flex-col h-full min-h-[350px]">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-secondary uppercase tracking-widest font-mono mb-6">
        <Activity className="w-3.5 h-3.5" />
        Recent Activity
      </div>

      <div className="flex-1 flex flex-col justify-start">
        {activities.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border border-dashed border-border rounded-lg p-6 text-center text-xs text-ink-tertiary">
            No activity logs found.
          </div>
        ) : (
          <div className="relative border-l border-border pl-4 space-y-6">
            {activities.map((act, idx) => (
              <div key={idx} className="relative">
                {/* Timeline node dot */}
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-surface bg-accent"></div>
                
                <div className="flex flex-col text-left">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold text-ink-primary">
                      {act.title}
                    </span>
                    <span className="text-[10px] font-mono text-ink-tertiary">
                      {act.time}
                    </span>
                  </div>
                  <span className="text-xs text-ink-secondary mt-1 leading-normal">
                    {act.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
