"use client";

import React, { useEffect, useState } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useCityStore } from "@/store/city";
import { useScenarioStore } from "@/store/scenario";
import { Loader2, Sliders, Play, TrendingDown, ShieldAlert, Award, Compass, RefreshCw } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

export default function ScenarioPage() {
  const { selectedCity } = useCityStore();
  const {
    scenarios,
    trafficReduction,
    constructionReduction,
    industrialEmission,
    greenCover,
    windSpeed,
    rainfall,
    simulationResult,
    isLoading,
    error,
    setTrafficReduction,
    setConstructionReduction,
    setIndustrialEmission,
    setGreenCover,
    setWindSpeed,
    setRainfall,
    fetchScenarios,
    runSimulation,
    resetScenarioState
  } = useScenarioStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchScenarios(selectedCity);
    }
  }, [selectedCity, fetchScenarios, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas text-ink-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const handleApplyPreset = (scenId: string) => {
    // Apply slider parameters values matching templates
    if (scenId === "scen-1") { // Restrict heavy vehicles
      setTrafficReduction(50);
      setConstructionReduction(10);
      setIndustrialEmission(0);
      setGreenCover(0);
    } else if (scenId === "scen-2") { // Close construction sites
      setTrafficReduction(10);
      setConstructionReduction(80);
      setIndustrialEmission(0);
      setGreenCover(0);
    } else if (scenId === "scen-3") { // Greening
      setTrafficReduction(15);
      setConstructionReduction(0);
      setIndustrialEmission(10);
      setGreenCover(35);
    } else if (scenId === "scen-4") { // Odd-Even traffic rule
      setTrafficReduction(60);
      setConstructionReduction(0);
      setIndustrialEmission(0);
      setGreenCover(5);
    }
  };

  const handleRun = async () => {
    await runSimulation(selectedCity);
  };

  // Recharts before vs after column chart data mapping
  const chartData = simulationResult ? [
    { name: "Current Baseline", AQI: simulationResult.before_aqi, fill: "#EF4444" },
    { name: "Simulated Model", AQI: simulationResult.after_aqi, fill: "#10B981" }
  ] : [];

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
              <Sliders className="w-4 h-4 text-accent" />
              <span className="font-bold text-ink-primary text-sm font-display">AI Scenario Simulator</span>
            </div>
            <span className="font-mono text-ink-tertiary uppercase tracking-wider">
              Policy Sandboxing Workspace ({selectedCity})
            </span>
          </div>

          {/* Main simulator workspace panel */}
          <div className="flex-1 flex relative overflow-hidden bg-canvas">
            
            {/* Column 1 - Presets and Parameters Sliders */}
            <div className="w-[320px] border-r border-border bg-surface flex flex-col h-full overflow-hidden z-20">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">Preset Scenarios</span>
                <button
                  onClick={() => { resetScenarioState(); fetchScenarios(selectedCity); }}
                  className="p-1 rounded hover:bg-surface-raised text-ink-tertiary transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
                {/* Predefined preset templates */}
                <div className="space-y-1.5">
                  {scenarios.map((scen) => (
                    <button
                      key={scen.id}
                      onClick={() => handleApplyPreset(scen.id)}
                      className="w-full text-left p-3 border border-border rounded-xl bg-canvas hover:border-accent transition-all text-xs space-y-1"
                    >
                      <span className="font-bold text-ink-primary block">{scen.name}</span>
                      <span className="text-[10px] text-ink-tertiary leading-relaxed block">{scen.description}</span>
                    </button>
                  ))}
                </div>

                <div className="w-full h-px bg-border/40"></div>

                {/* Slider parameters controls */}
                <div className="space-y-4 text-xs">
                  <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Sliders Parameters</span>
                  
                  {/* Traffic reduction slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono">
                      <span>Traffic Reduction:</span>
                      <span className="font-bold text-accent">{trafficReduction}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={trafficReduction}
                      onChange={(e) => setTrafficReduction(Number(e.target.value))}
                      className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Construction reduction slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono">
                      <span>Construction Halt:</span>
                      <span className="font-bold text-accent">{constructionReduction}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={constructionReduction}
                      onChange={(e) => setConstructionReduction(Number(e.target.value))}
                      className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Industrial Emission reduction slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono">
                      <span>Industrial Drop:</span>
                      <span className="font-bold text-accent">{industrialEmission}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={industrialEmission}
                      onChange={(e) => setIndustrialEmission(Number(e.target.value))}
                      className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Green Cover slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono">
                      <span>Green Cover Addition:</span>
                      <span className="font-bold text-accent">{greenCover}%</span>
                    </div>
                    <input
                      type="range" min="0" max="50" value={greenCover}
                      onChange={(e) => setGreenCover(Number(e.target.value))}
                      className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Wind speed slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono">
                      <span>Wind Speed:</span>
                      <span className="font-bold text-accent">{windSpeed} km/h</span>
                    </div>
                    <input
                      type="range" min="0" max="40" value={windSpeed}
                      onChange={(e) => setWindSpeed(Number(e.target.value))}
                      className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Rainfall slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono">
                      <span>Rainfall:</span>
                      <span className="font-bold text-accent">{rainfall} mm</span>
                    </div>
                    <input
                      type="range" min="0" max="50" value={rainfall}
                      onChange={(e) => setRainfall(Number(e.target.value))}
                      className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Simulation launcher button */}
              <div className="p-4 border-t border-border">
                <button
                  onClick={handleRun}
                  disabled={isLoading}
                  className="w-full h-10 rounded-lg bg-accent text-canvas flex items-center justify-center gap-1.5 text-xs font-semibold shadow hover:bg-accent/90 disabled:opacity-50 transition-colors"
                >
                  <Play className="w-4 h-4 fill-canvas" />
                  <span>Run Sandbox Simulation</span>
                </button>
              </div>
            </div>

            {/* Column 2 - Central Simulation Outcomes before vs after panel */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 space-y-6 scrollbar-thin">
              {error && (
                <div className="bg-danger-soft border border-danger/20 text-danger text-xs p-3.5 rounded-xl">
                  {error}
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center p-8 bg-surface border border-border rounded-xl">
                  <Loader2 className="w-6 h-6 animate-spin text-accent mr-3" />
                  <span className="text-xs font-semibold text-ink-secondary">Recalibrating forecast vectors...</span>
                </div>
              )}

              {!isLoading && simulationResult && (
                <div className="space-y-6 text-left">
                  {/* Before vs After columns comparisons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col items-center justify-center relative shadow-sm min-h-[140px]">
                      <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Current Baseline</span>
                      <span className="text-4xl font-black font-mono text-danger mt-2">{simulationResult.before_aqi} AQI</span>
                    </div>

                    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col items-center justify-center relative shadow-sm min-h-[140px]">
                      <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Simulated Model Projection</span>
                      <span className="text-4xl font-black font-mono text-success mt-2">{simulationResult.after_aqi} AQI</span>
                      <div className="absolute top-3 right-3 flex items-center gap-0.5 text-xs text-success bg-[#10B981]/15 px-2 py-0.5 rounded-full font-bold">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>-{simulationResult.expected_improvement}</span>
                      </div>
                    </div>
                  </div>

                  {/* Outcomes stats details */}
                  <div className="bg-surface border border-border rounded-xl p-5 grid grid-cols-3 gap-6 text-center shadow-sm">
                    <div>
                      <span className="text-[9px] text-ink-tertiary font-mono uppercase block">Expected Improvement</span>
                      <span className="text-lg font-black text-[#10B981] font-mono mt-0.5 block">-{simulationResult.expected_improvement} AQI</span>
                    </div>
                    <div className="border-x border-border/40">
                      <span className="text-[9px] text-ink-tertiary font-mono uppercase block">Population Shielded</span>
                      <span className="text-lg font-black text-ink-primary font-mono mt-0.5 block">+{simulationResult.affected_population_saved_pct}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-ink-tertiary font-mono uppercase block">Confidence Score</span>
                      <span className="text-lg font-black text-accent font-mono mt-0.5 block">{simulationResult.confidence_score}%</span>
                    </div>
                  </div>

                  {/* Recharts side-by-side columns bar chart */}
                  <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-accent animate-spin-slow" />
                      <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">AQI Delta Comparison Columns</h4>
                    </div>
                    <div className="h-[200px] w-full text-[10px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                          <XAxis dataKey="name" stroke="var(--color-ink-tertiary)" tickLine={false} />
                          <YAxis stroke="var(--color-ink-tertiary)" tickLine={false} />
                          <Tooltip />
                          <Bar dataKey="AQI" radius={[4, 4, 0, 0]} barSize={50}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Policy recommendations cards */}
                  <div className="border border-[#10B981]/20 bg-[#10B981]/5 rounded-xl p-4.5 space-y-2 flex gap-3.5 items-start">
                    <Award className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider font-mono">AI Intervention Advisory</span>
                      <p className="text-xs text-ink-primary leading-relaxed font-semibold">
                        {simulationResult.recommendation_text}
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {!simulationResult && !isLoading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-xs text-ink-secondary">
                  <Sliders className="w-8 h-8 text-accent/50 mb-3" />
                  <h4 className="font-bold text-ink-primary mb-1">Scenario Workspace Empty</h4>
                  <p className="text-ink-tertiary">Adjust custom parameters sliders on the left and click Run Simulation to test policy options.</p>
                </div>
              )}
            </div>

            {/* Column 3 - Right Panel comparative listings */}
            {simulationResult && (
              <div className="w-[280px] border-l border-border bg-surface flex flex-col h-full overflow-hidden text-left z-20">
                <div className="p-4 border-b border-border flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-bold text-ink-primary font-display">Simulations Log</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                  <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Run History</span>
                  
                  {/* Simulated list details */}
                  <div className="border border-border rounded-xl p-3.5 space-y-2 bg-canvas">
                    <span className="text-[9px] text-ink-tertiary font-mono block">Run #1 (Current Sandbox)</span>
                    <div className="flex justify-between text-xs font-bold">
                      <span>Resulting AQI:</span>
                      <span className="text-[#10B981]">{simulationResult.after_aqi}</span>
                    </div>
                    <p className="text-[10px] text-ink-secondary leading-normal">
                      Greening: {greenCover}%, Traffic: -{trafficReduction}%
                    </p>
                  </div>

                  <div className="border border-border rounded-xl p-3.5 space-y-2 bg-canvas/40 opacity-70">
                    <span className="text-[9px] text-ink-tertiary font-mono block">Run #0 (Initial baseline)</span>
                    <div className="flex justify-between text-xs font-bold">
                      <span>Resulting AQI:</span>
                      <span>{simulationResult.before_aqi}</span>
                    </div>
                    <p className="text-[10px] text-ink-secondary leading-normal">
                      Standard settings. No active sliders offsets applied.
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
