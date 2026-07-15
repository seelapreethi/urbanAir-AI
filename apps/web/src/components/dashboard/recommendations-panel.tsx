"use client";

import React from "react";
import { Lightbulb, CheckSquare, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecommendationItem {
  id: string;
  action: string;
  impact: string;
  confidence: number;
  priority: "Critical" | "High" | "Medium" | "Low" | string;
}

interface RecommendationsPanelProps {
  recommendations?: RecommendationItem[];
}

export function RecommendationsPanel({ recommendations = [] }: RecommendationsPanelProps) {
  const getPriorityVariant = (priority: string) => {
    switch ((priority || "").toLowerCase()) {
      case "critical":
        return "danger";
      case "high":
        return "warning";
      case "medium":
        return "info";
      default:
        return "outline";
    }
  };

  return (
    <div className="border border-border bg-surface rounded-xl p-6 flex flex-col h-full">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-secondary uppercase tracking-widest font-mono mb-6">
        <Lightbulb className="w-3.5 h-3.5 text-accent" />
        AI Recommendations
      </div>

      <div className="flex-1 flex flex-col justify-start">
        {recommendations.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border border-dashed border-border rounded-lg p-6 text-center text-xs text-ink-tertiary">
            Generating action plans...
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((item) => (
              <div
                key={item.id}
                className="border border-border bg-canvas rounded-lg p-4 flex flex-col gap-3 text-left relative overflow-hidden"
              >
                {/* Background ambient accent */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent/2 blur-2xl pointer-events-none"></div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded bg-accent-soft flex items-center justify-center text-accent mt-0.5 flex-shrink-0">
                      <CheckSquare className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-ink-primary leading-normal pr-4">
                      {item.action}
                    </span>
                  </div>
                  <Badge variant={getPriorityVariant(item.priority)}>
                    {item.priority}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-ink-secondary border-t border-border/60 pt-3">
                  <div>
                    <span className="text-ink-tertiary uppercase mr-1">Impact:</span>
                    <span className="text-success font-bold">{item.impact}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-ink-tertiary uppercase">Confidence:</span>
                    <span className="text-ink-primary font-bold">{item.confidence}%</span>
                    <Sparkles className="w-3 h-3 text-accent" />
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
