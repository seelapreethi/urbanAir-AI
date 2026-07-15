"use client";

import React, { useEffect, useState } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useCityStore } from "@/store/city";
import { useSourceStore } from "@/store/source";
import { SourceMap } from "@/components/maps/source-map";
import { Loader2, Search, BarChart2, Compass, ShieldAlert, X } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const CITY_CENTERS: Record<string, [number, number]> = {
  Vijayawada: [16.5062, 80.6480],
  Hyderabad: [17.3850, 78.4867],
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Delhi: [28.6139, 77.2090],
};

const CHART_COLORS = ["#3B82F6", "#F59E0B", "#EC4899", "#EF4444", "#10B981", "#8B5CF6"];

export default function SourceAttributionPage() {
  const { selectedCity } = useCityStore();
  const {
    attributionSummary,
    mapSources,
    sourceDetails,
    contributors,
    isLoading,
    error,
    fetchSourceData,
    selectSource
  } = useSourceStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchSourceData(selectedCity);
    }
  }, [selectedCity, fetchSourceData, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas text-ink-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const cityCenter = CITY_CENTERS[selectedCity] || CITY_CENTERS.Vijayawada;

  // Filter sources based on search
  const filteredSources = mapSources.filter(
    (src) =>
      (src.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (src.type || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <Compass className="w-4 h-4 text-accent animate-spin-slow" />
              <span className="font-bold text-ink-primary text-sm font-display">Geospatial Source Attribution</span>
            </div>
            <span className="font-mono text-ink-tertiary uppercase tracking-wider">
              Dispersion Model: Localized Vector Grids ({selectedCity})
            </span>
          </div>

          {/* Main workspace panels */}
          <div className="flex-1 flex relative overflow-hidden bg-canvas">
            {/* Left Panel - Contributors and Search List */}
            <div className="w-[300px] border-r border-border bg-surface flex flex-col h-full overflow-hidden z-20">
              <div className="p-4 border-b border-border flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-bold text-ink-primary font-display">Contributors Breakdown</h3>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search emission sources..."
                    className="w-full h-8 pl-8 pr-3 rounded border border-border bg-canvas text-xs text-ink-primary focus:border-accent outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-ink-tertiary absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
                {/* Recharts Contributors Donut Chart */}
                {contributors.length > 0 && (
                  <div className="h-[160px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={contributors}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="percentage"
                          nameKey="source"
                        >
                          {contributors.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] uppercase font-mono text-ink-tertiary">Primary</span>
                      <span className="text-xs font-black text-accent">{attributionSummary?.dominant_source}</span>
                    </div>
                  </div>
                )}

                {/* Contributors List */}
                <div className="space-y-1.5 border-t border-border/40 pt-4">
                  <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">
                    Source Share Matrix
                  </span>
                  <div className="space-y-1">
                    {contributors.map((c, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-1.5 rounded hover:bg-surface-raised transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></div>
                          <span>{c.source}</span>
                        </div>
                        <span className="font-bold font-mono text-ink-primary">{c.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Localized point sources matches list */}
                <div className="space-y-2 border-t border-border/40 pt-4">
                  <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">
                    Emitter Point Clusters
                  </span>
                  <div className="space-y-1">
                    {filteredSources.map((src) => (
                      <button
                        key={src.id}
                        onClick={() => selectSource(src.id, selectedCity)}
                        className={`w-full flex items-center justify-between p-2 rounded text-xs text-left border transition-colors ${
                          sourceDetails?.id === src.id
                            ? "bg-accent/5 border-accent/25 text-ink-primary"
                            : "border-transparent text-ink-secondary hover:bg-surface-raised"
                        }`}
                      >
                        <div className="truncate max-w-[170px]">
                          <span className="font-semibold block truncate">{src.name}</span>
                          <span className="text-[10px] text-ink-tertiary font-mono">{src.type}</span>
                        </div>
                        <span className="font-mono text-ink-secondary">{src.confidence}%</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Central Leaflet Map panel */}
            <div className="flex-1 h-full w-full relative">
              {isLoading && (
                <div className="absolute inset-0 bg-canvas/40 backdrop-blur-[1px] flex items-center justify-center z-30">
                  <div className="bg-surface border border-border p-4 rounded-xl flex items-center gap-3 shadow-2xl">
                    <Loader2 className="w-5 h-5 animate-spin text-accent" />
                    <span className="text-xs font-semibold text-ink-primary">Fetching source coordinates...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-danger-soft border border-danger/20 text-danger text-xs p-3 rounded-lg z-30">
                  {error}
                </div>
              )}

              {/* Dynamic Leaflet Map */}
              <SourceMap cityCenter={cityCenter} />
            </div>

            {/* Right Panel - selected source diagnostics detail */}
            {sourceDetails ? (
              <div className="w-[320px] border-l border-border bg-surface flex flex-col h-full overflow-hidden text-left z-20 relative">
                <div className="p-4 border-b border-border flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-bold text-ink-primary font-display">Source Diagnostics</h3>
                  </div>
                  <button
                    onClick={() => selectSource(null, selectedCity)}
                    className="p-1 rounded hover:bg-surface-raised text-ink-tertiary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-ink-primary leading-tight font-display">{sourceDetails.name}</h4>
                    <span className="text-[10px] text-ink-tertiary uppercase tracking-wider block font-mono">{sourceDetails.type}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-surface-raised p-3 rounded-lg border border-border">
                    <div className="text-center p-1">
                      <span className="text-[9px] text-ink-tertiary font-mono uppercase block">Contribution</span>
                      <span className="text-sm font-black text-ink-primary font-mono mt-0.5 block">{sourceDetails.contribution_pct}%</span>
                    </div>
                    <div className="text-center p-1 border-l border-border/40">
                      <span className="text-[9px] text-ink-tertiary font-mono uppercase block">Confidence</span>
                      <span className="text-sm font-black text-accent font-mono mt-0.5 block">{sourceDetails.confidence_score}%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Attribution Evidence</span>
                    <p className="text-xs text-ink-secondary leading-relaxed">{sourceDetails.supporting_evidence}</p>
                  </div>

                  <div className="space-y-1.5 border-t border-border/40 pt-3">
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Weather Dispersion Impact</span>
                    <p className="text-xs text-ink-secondary leading-relaxed">{sourceDetails.weather_impact}</p>
                  </div>

                  <div className="space-y-1.5 border-t border-border/40 pt-3">
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Historical Stagnation Vector</span>
                    <p className="text-xs text-ink-secondary leading-relaxed">{sourceDetails.historical_trend}</p>
                  </div>

                  <div className="border border-[#10B981]/20 bg-[#10B981]/5 rounded-xl p-3.5 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider font-mono">Recommended Interventions</span>
                    <p className="text-xs text-ink-primary leading-relaxed font-semibold">{sourceDetails.suggested_action}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-[320px] border-l border-border bg-surface flex flex-col h-full items-center justify-center p-6 text-center text-xs text-ink-secondary z-20">
                <Compass className="w-8 h-8 text-accent/50 mb-3" />
                <h4 className="font-bold text-ink-primary mb-1">Source Telemetry</h4>
                <p className="text-ink-tertiary">Select any localized emitter pin cluster on the map to audit specific point attribution files.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
