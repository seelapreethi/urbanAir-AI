"use client";

import React, { useEffect, useState } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useCityStore } from "@/store/city";
import { useExplainStore } from "@/store/explain";
import { Loader2, Brain, Database, ShieldAlert, Activity, GitCommit, FileSpreadsheet } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const CHART_COLORS = ["#3B82F6", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6"];

export default function ExplainPage() {
  const { selectedCity } = useCityStore();
  const {
    featureImportances,
    decisionTrace,
    modelDetails,
    accuracyScore,
    lastCalibration,
    isLoading,
    error,
    fetchExplainData
  } = useExplainStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchExplainData(selectedCity);
    }
  }, [selectedCity, fetchExplainData, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas text-ink-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <RouteGuard>
      <div className="h-screen w-screen bg-canvas text-ink-primary flex overflow-hidden font-sans">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Workspace */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header onOpenMobileDrawer={() => {}} />

          {/* Subheader Toolbar */}
          <div className="flex items-center justify-between p-3.5 border-b border-border bg-surface text-xs z-20">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-accent" />
              <span className="font-bold text-ink-primary text-sm font-display">Explainable AI Center</span>
            </div>
            <span className="font-mono text-ink-tertiary uppercase tracking-wider">
              XAI Telemetry Workspace ({selectedCity})
            </span>
          </div>

          {/* Main Workspace panels */}
          <div className="flex-1 flex relative overflow-hidden bg-canvas">
            
            {/* Column 1 - Model details and training resources */}
            <div className="w-[300px] border-r border-border bg-surface flex flex-col h-full overflow-hidden z-20">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <Database className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">Data Sources Logs</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
                {modelDetails && (
                  <div className="space-y-4">
                    {/* Sources listing */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Input Feeds</span>
                      <div className="space-y-1.5">
                        {modelDetails.data_sources.map((s, idx) => (
                          <div key={idx} className="flex gap-2 items-start p-2 rounded bg-canvas border border-border/40">
                            <GitCommit className="w-4 h-4 text-accent mt-0.5" />
                            <span className="text-ink-secondary text-[11px] leading-snug">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="w-full h-px bg-border/40"></div>

                    {/* Quality parameters */}
                    <div className="space-y-2 text-xs">
                      <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Accuracy Diagnostics</span>
                      
                      <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                        <span>Calibration:</span>
                        <span className="font-mono text-ink-secondary font-semibold">{lastCalibration}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                        <span>Inference Lag:</span>
                        <span className="font-mono text-ink-secondary font-semibold">{modelDetails.inference_time_ms} ms</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                        <span>Target R2:</span>
                        <span className="font-mono text-[#10B981] font-bold">{accuracyScore}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2 - Central Feature Importance Chart */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 space-y-6 scrollbar-thin">
              {error && (
                <div className="bg-danger-soft border border-danger/20 text-danger text-xs p-3.5 rounded-xl">
                  {error}
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center p-8 bg-surface border border-border rounded-xl">
                  <Loader2 className="w-6 h-6 animate-spin text-accent mr-3" />
                  <span className="text-xs font-semibold text-ink-secondary">Loading feature coefficients...</span>
                </div>
              )}

              {!isLoading && featureImportances.length > 0 && (
                <div className="space-y-6 text-left">
                  {/* Model specifications cards */}
                  {modelDetails && (
                    <div className="bg-surface border border-border rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-6 relative shadow-sm">
                      <div className="flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Active Classifier</span>
                          <span className="text-sm font-extrabold text-ink-primary mt-1 block leading-snug">{modelDetails.model_name}</span>
                        </div>
                        <span className="text-[10px] text-ink-tertiary font-mono block mt-4">Version: {modelDetails.version}</span>
                      </div>

                      <div className="flex flex-col justify-between border-y sm:border-y-0 sm:border-x border-border/40 py-4 sm:py-0 sm:px-6">
                        <div>
                          <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Training Date</span>
                          <span className="text-sm font-extrabold text-ink-primary mt-1 block font-mono">{modelDetails.training_date}</span>
                        </div>
                        <span className="text-[10px] text-ink-tertiary font-mono block mt-4">Calibration frequency: Hourly</span>
                      </div>

                      <div className="flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Inference Accuracy</span>
                          <span className="text-2xl font-black font-mono text-[#10B981] mt-1 block">{(accuracyScore * 100).toFixed(1)}%</span>
                        </div>
                        <span className="text-[10px] text-ink-tertiary font-mono block mt-4">R2 score metric</span>
                      </div>
                    </div>
                  )}

                  {/* Recharts horizontal feature importance chart */}
                  <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-accent" />
                      <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">XGBoost Feature Importance Weights</h4>
                    </div>
                    <div className="h-[240px] w-full text-[10px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={featureImportances} layout="vertical" margin={{ top: 5, right: 10, left: 45, bottom: 5 }}>
                          <XAxis type="number" stroke="var(--color-ink-tertiary)" tickLine={false} />
                          <YAxis type="category" dataKey="feature" stroke="var(--color-ink-tertiary)" tickLine={false} />
                          <Tooltip />
                          <Bar dataKey="importance" radius={[0, 4, 4, 0]} barSize={20}>
                            {featureImportances.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Feature explanation decipher panel */}
                  <div className="bg-surface border border-border rounded-xl p-5 space-y-3.5 text-left">
                    <div className="flex items-center gap-2 border-b border-border/40 pb-2.5">
                      <Brain className="w-4 h-4 text-accent" />
                      <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">AI Feature Interpretation Guide</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-200">Particulate Concentrations (PM2.5 / PM10)</span>
                        <p className="text-slate-450 leading-relaxed">Tracks ambient fine dust. Higher coefficients indicate heavy industrial stack emissions, burning events, or vehicle combustion exhausts.</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-200">Meteorological Stagnation (Relative Humidity)</span>
                        <p className="text-slate-450 leading-relaxed">High humidity indexes trap pollutants near the surface, blocking vertical column dispersal. Accelerates condensation and particulate clustering.</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-200">Dispersal Vectors (Wind Speed)</span>
                        <p className="text-slate-450 leading-relaxed">Stronger horizontal winds sweep particulates out of urban centers. Low speed boundaries (&lt; 8 km/h) trigger severe air stagnation warnings.</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-200">Atmospheric Conversion (Temperature)</span>
                        <p className="text-slate-450 leading-relaxed">Triggers chemical transformation of precursors like nitrogen oxides (NOx) and volatile organic compounds (VOCs) into secondary ozone (O3).</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Column 3 - Right Panel Decision Trace */}
            {!isLoading && decisionTrace && (
              <div className="w-[320px] border-l border-border bg-surface flex flex-col h-full overflow-hidden text-left z-20">
                <div className="p-4 border-b border-border flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-bold text-ink-primary font-display">Decision Audit Trail</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-ink-primary leading-tight font-display">Trace Dossier</h4>
                    <span className="text-[10px] text-ink-tertiary uppercase block font-mono">Target Area: {decisionTrace.target}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">AI Reasoning Trigger</span>
                    <p className="text-xs text-ink-secondary leading-relaxed bg-canvas p-3 rounded-lg border border-border">
                      {decisionTrace.why_generated}
                    </p>
                  </div>

                  <div className="space-y-1.5 border-t border-border/40 pt-3">
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Primary Evidence</span>
                    <p className="text-xs text-ink-secondary leading-relaxed font-semibold">{decisionTrace.evidence_used}</p>
                  </div>

                  <div className="space-y-1.5 border-t border-border/40 pt-3">
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Confidence Level</span>
                    <span className="text-xs font-black font-mono text-accent block">{decisionTrace.confidence}%</span>
                  </div>

                  <div className="border border-accent/20 bg-accent-soft rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1 text-accent">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Alternative Options Evaluated</span>
                    </div>
                    <p className="text-xs text-ink-secondary leading-relaxed font-semibold">
                      {decisionTrace.alternatives}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
