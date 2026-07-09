"use client";

import React from "react";
import { TrendingUp, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ForecastPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display text-ink-primary">
            Hyperlocal AQI Forecast
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Predictive hourly timelines and 72-hour air quality prognostic vectors.
          </p>
        </div>
        <div>
          <Badge variant="info">Sprint 3 Module</Badge>
        </div>
      </div>

      {/* Main Area Map Container Placeholder */}
      <div className="border border-border bg-surface rounded-xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.15] pointer-events-none"></div>

        <div className="w-16 h-16 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 z-10">
          <TrendingUp className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold font-display text-ink-primary mb-2 z-10">
          Predictive Time Series Graphs
        </h3>
        <p className="text-sm text-ink-secondary max-w-md mx-auto leading-relaxed mb-6 z-10">
          Neural network predictions (LSTM, Prophet, and XGBoost timelines) modeling upcoming weather variables and pollution vectors will load here in Sprint 3.
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-canvas border border-border text-xs text-ink-tertiary font-mono z-10">
          <Info className="w-4 h-4 text-accent" />
          Integrates with open weather sensors & historical trends.
        </div>
      </div>
    </div>
  );
}
