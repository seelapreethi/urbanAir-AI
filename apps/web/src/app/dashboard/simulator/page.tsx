"use client";

import React from "react";
import { Sliders, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SimulatorPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display text-ink-primary">
            Scenario Simulator
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Model upcoming emission policy restrictions and project AQI dispersion impacts.
          </p>
        </div>
        <div>
          <Badge variant="info">Sprint 5 Module</Badge>
        </div>
      </div>

      {/* Main Container Placeholder */}
      <div className="border border-border bg-surface rounded-xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.15] pointer-events-none"></div>

        <div className="w-16 h-16 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 z-10">
          <Sliders className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold font-display text-ink-primary mb-2 z-10">
          AI Scenario Sandbox
        </h3>
        <p className="text-sm text-ink-secondary max-w-md mx-auto leading-relaxed mb-6 z-10">
          Interactive levers modeling {"\"What-If\""} parameters (reducing traffic congestion by 20%, restricting concrete mixing grids, simulating odd-even schedules) will mount here in Sprint 5.
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-canvas border border-border text-xs text-ink-tertiary font-mono z-10">
          <Info className="w-4 h-4 text-accent" />
          Restricted to City Officers & Administrators.
        </div>
      </div>
    </div>
  );
}
