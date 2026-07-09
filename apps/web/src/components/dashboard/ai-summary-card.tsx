"use client";

import React from "react";
import { Sparkles, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SummaryData {
  city: string;
  health_score: number;
  ai_summary: string;
  dominant_pollutant: string;
  aqi_category: string;
  confidence_score: number;
}

interface AISummaryCardProps {
  summary?: SummaryData;
}

export function AISummaryCard({ summary }: AISummaryCardProps) {
  if (!summary) return null;

  return (
    <div className="border border-accent/20 bg-accent-soft rounded-xl p-6 relative overflow-hidden flex flex-col gap-4 text-left shadow-sm">
      {/* Absolute background accent */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-accent/10 blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-[10px] font-bold text-canvas tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          {"Today's AI Summary"}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-ink-tertiary">
            Confidence: {summary.confidence_score}%
          </span>
        </div>
      </div>

      <p className="text-sm sm:text-base font-medium text-ink-primary leading-relaxed max-w-4xl">
        {"\""}{summary.ai_summary}{"\""}
      </p>

      <div className="flex flex-wrap items-center gap-6 mt-2 pt-4 border-t border-accent/10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          <span className="text-xs text-ink-secondary">
            City Health Score: <span className="font-bold text-ink-primary font-mono">{summary.health_score}</span>/100
          </span>
        </div>

        <div className="h-4 w-px bg-accent/20"></div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-secondary">
            Dominant Pollutant:
          </span>
          <Badge variant="outline" className="border-accent/30 text-accent font-mono px-2.5 py-0.5">
            {summary.dominant_pollutant}
          </Badge>
        </div>
      </div>
    </div>
  );
}
