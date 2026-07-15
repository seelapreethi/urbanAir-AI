"use client";

import React from "react";
import { Clock } from "lucide-react";
import { useMapStore } from "@/store/map";
import { useCityStore } from "@/store/city";

const TIMELINE_STEPS = [
  { key: "past_24h", label: "Past 24 Hours" },
  { key: "current", label: "Current (Live)" },
  { key: "next_24h", label: "Next 24 Hours" },
  { key: "next_48h", label: "Next 48 Hours" },
  { key: "next_72h", label: "Next 72 Hours" }
];

export function TimeSlider() {
  const { timeSlider, setTimeSlider } = useMapStore();
  const { selectedCity } = useCityStore();

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur border border-border rounded-full p-2.5 flex items-center gap-4 shadow-xl z-20 max-w-xl">
      <div className="flex items-center gap-1.5 pl-2.5 text-ink-secondary text-[11px] font-mono uppercase tracking-wider border-r border-border/60 pr-3.5 whitespace-nowrap">
        <Clock className="w-3.5 h-3.5 text-accent" />
        <span>Timeline</span>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto">
        {TIMELINE_STEPS.map((step) => {
          const isActive = timeSlider === step.key;
          return (
            <button
              key={step.key}
              onClick={() => setTimeSlider(step.key, selectedCity)}
              className={`h-7 px-3 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
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
