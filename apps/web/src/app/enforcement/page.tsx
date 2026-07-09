"use client";

import React, { useEffect, useState } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useCityStore } from "@/store/city";
import { useEnforcementStore } from "@/store/enforcement";
import { EnforcementMap } from "@/components/maps/enforcement-map";
import { Loader2, Search, Activity, Sliders, ShieldAlert, CheckCircle, Info, X } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const CITY_CENTERS: Record<string, [number, number]> = {
  Vijayawada: [16.5062, 80.6480],
  Hyderabad: [17.3850, 78.4867],
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Delhi: [28.6139, 77.2090],
};

export default function EnforcementPage() {
  const { selectedCity } = useCityStore();
  const {
    recommendations,
    evidenceDetails,
    inspectionsCompleted,
    isLoading,
    error,
    fetchEnforcementData,
    selectHotspot,
    toggleInspectionCompleted
  } = useEnforcementStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchEnforcementData(selectedCity);
    }
  }, [selectedCity, fetchEnforcementData, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas text-ink-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const cityCenter = CITY_CENTERS[selectedCity] || CITY_CENTERS.Vijayawada;

  // Filter recommendations based on search
  const filteredRecs = recommendations.filter(
    (rec) =>
      rec.action_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.responsible_authority.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    if (priority === "Critical") return "bg-danger/10 text-danger border border-danger/20";
    if (priority === "High") return "bg-warning/10 text-warning border border-warning/20";
    return "bg-info/10 text-info border border-info/20";
  };

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
              <ShieldAlert className="w-4 h-4 text-accent animate-pulse" />
              <span className="font-bold text-ink-primary text-sm font-display">Enforcement Intelligence</span>
            </div>
            <span className="font-mono text-ink-tertiary uppercase tracking-wider">
              Enforcement Dashboard Matrix ({selectedCity})
            </span>
          </div>

          {/* Main Workspace Panels */}
          <div className="flex-1 flex relative overflow-hidden bg-canvas">
            {/* Left Panel - Recommended Actions and Checklist */}
            <div className="w-[320px] border-r border-border bg-surface flex flex-col h-full overflow-hidden z-20">
              <div className="p-4 border-b border-border flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-bold text-ink-primary font-display">Inspection Dispatch Tasks</h3>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recommended actions..."
                    className="w-full h-8 pl-8 pr-3 rounded border border-border bg-canvas text-xs text-ink-primary focus:border-accent outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-ink-tertiary absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Checklist list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {filteredRecs.map((rec) => {
                  const isCompleted = !!inspectionsCompleted[rec.recommendation_id];
                  return (
                    <div
                      key={rec.recommendation_id}
                      className={`border p-3.5 rounded-xl flex flex-col gap-3 hover:border-accent/40 transition-colors ${
                        isCompleted ? "bg-[#10B981]/5 border-[#10B981]/25 opacity-70" : "bg-canvas border-border"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                        <button
                          onClick={() => toggleInspectionCompleted(rec.recommendation_id)}
                          className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${
                            isCompleted
                              ? "bg-[#10B981] text-canvas"
                              : "bg-surface border border-border text-ink-secondary hover:bg-surface-raised"
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{isCompleted ? "Completed" : "Mark Complete"}</span>
                        </button>
                      </div>

                      <p className="text-xs text-ink-primary font-medium leading-relaxed">
                        {rec.action_text}
                      </p>

                      <div className="border-t border-border/40 pt-2.5 space-y-1 text-[10px] text-ink-tertiary font-mono">
                        <div className="flex justify-between">
                          <span>Dept:</span>
                          <span className="font-sans font-semibold text-ink-secondary">{rec.responsible_authority}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resources:</span>
                          <span className="font-sans text-ink-secondary">{rec.required_resources}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-border/20">
                          <span>Expected Impact:</span>
                          <span className="text-[#10B981] font-bold">-{rec.estimated_aqi_improvement} AQI</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Central Leaflet Map panel */}
            <div className="flex-1 h-full w-full relative">
              {isLoading && (
                <div className="absolute inset-0 bg-canvas/40 backdrop-blur-[1px] flex items-center justify-center z-30">
                  <div className="bg-surface border border-border p-4 rounded-xl flex items-center gap-3 shadow-2xl">
                    <Loader2 className="w-5 h-5 animate-spin text-accent" />
                    <span className="text-xs font-semibold text-ink-primary">Fetching dispatch routes...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-danger-soft border border-danger/20 text-danger text-xs p-3 rounded-lg z-30">
                  {error}
                </div>
              )}

              {/* Dynamic Leaflet Map */}
              <EnforcementMap cityCenter={cityCenter} />
            </div>

            {/* Right Panel - selected hotspot evidence panel */}
            {evidenceDetails ? (
              <div className="w-[320px] border-l border-border bg-surface flex flex-col h-full overflow-hidden text-left z-20 relative">
                <div className="p-4 border-b border-border flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-bold text-ink-primary font-display">Evidence File</h3>
                  </div>
                  <button
                    onClick={() => selectHotspot(null, selectedCity)}
                    className="p-1 rounded hover:bg-surface-raised text-ink-tertiary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-ink-primary leading-tight font-display">
                      Hotspot HS-{evidenceDetails.hotspot_id.substring(0, 4)}
                    </h4>
                    <span className="text-[10px] text-ink-tertiary uppercase block font-mono">{evidenceDetails.estimated_source}</span>
                  </div>

                  {/* Recharts Local Trend Sparkline */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">
                      5-Hour AQI Trend
                    </span>
                    <div className="h-[110px] w-full border border-border rounded-lg p-2 bg-canvas text-[9px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={evidenceDetails.aqi_trend.map((val, idx) => ({ hour: `${idx}h ago`, AQI: val }))}>
                          <XAxis dataKey="hour" stroke="var(--color-ink-tertiary)" tickLine={false} />
                          <YAxis stroke="var(--color-ink-tertiary)" tickLine={false} />
                          <Tooltip />
                          <Line type="monotone" dataKey="AQI" stroke="#EF4444" strokeWidth={2} dot={{ r: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-border/40 pt-3">
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Meteorological Factor</span>
                    <p className="text-xs text-ink-secondary leading-relaxed">{evidenceDetails.wind_dispersion}</p>
                  </div>

                  <div className="space-y-1.5 border-t border-border/40 pt-3">
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Traffic Activity</span>
                    <p className="text-xs text-ink-secondary leading-relaxed">{evidenceDetails.traffic_levels}</p>
                  </div>

                  <div className="space-y-1.5 border-t border-border/40 pt-3">
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Historical Compliance Logs</span>
                    <p className="text-xs text-ink-secondary leading-relaxed">{evidenceDetails.historical_events}</p>
                  </div>

                  <div className="border border-accent/20 bg-accent-soft rounded-xl p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-accent">
                      <Info className="w-3.5 h-3.5 animate-pulse" />
                      <span className="text-[9px] font-bold uppercase tracking-wider font-mono">AI Recommendation Basis</span>
                    </div>
                    <p className="text-xs text-ink-secondary leading-relaxed">
                      Generated recommendation priority rating is based on continuous particulate stagnation peaks interacting with localized schools/hospital zones.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-[320px] border-l border-border bg-surface flex flex-col h-full items-center justify-center p-6 text-center text-xs text-ink-secondary z-20">
                <Info className="w-8 h-8 text-accent/50 mb-3" />
                <h4 className="font-bold text-ink-primary mb-1">Evidence Files</h4>
                <p className="text-ink-tertiary">Select any inspection milestone (#1, #2...) on the map to audit localized evidence dossiers.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
