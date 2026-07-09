"use client";

import React from "react";
import { Clock } from "lucide-react";
import { useMapStore } from "@/store/map";

const TIMELINE_STEPS = [
  { key: "today", label: "Today (Live)" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last_week", label: "Last Week" },
  { key: "last_month", label: "Last Month" }
];

export function TimeSlider() {
  const { timeSlider, setTimeSlider } = useMapStore();

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur border border-border rounded-full p-2.5 flex items-center gap-4 shadow-xl z-20 max-w-lg">
      <div className="flex items-center gap-1.5 pl-2.5 text-ink-secondary text-[11px] font-mono uppercase tracking-wider border-r border-border/60 pr-3.5">
        <Clock className="w-3.5 h-3.5 text-accent" />
        <span>Timeline</span>
      </div>
      <div className="flex items-center gap-1">
        {TIMELINE_STEPS.map((step) => {
          const isActive = timeSlider === step.key;
          return (
            <button
              key={step.key}
              onClick={() => setTimeSlider(step.key)}
              className={`h-7 px-3.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-accent text-canvas shadow-md scale-105"
                  : "text-ink-secondary hover:text-ink-primary hover:bg-surface-raised"
              }`}
            >
              {step.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
