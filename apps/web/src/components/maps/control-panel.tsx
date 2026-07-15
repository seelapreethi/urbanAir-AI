"use client";

import React from "react";
import { Search, Layers, Eye, EyeOff } from "lucide-react";
import { useMapStore } from "@/store/map";

export function ControlPanel() {
  const {
    layers,
    visibleLayers,
    toggleLayer,
    searchQuery,
    setSearchQuery,
    setMapViewport
  } = useMapStore();

  const CITY_COORDS: Record<string, [number, number]> = {
    delhi: [28.6139, 77.2090],
    mumbai: [19.0760, 72.8777],
    hyderabad: [17.3850, 78.4867],
    bengaluru: [12.9716, 77.5946],
    chennai: [13.0827, 80.2707],
    kolkata: [22.5726, 88.3639],
    pune: [18.5204, 73.8567],
    ahmedabad: [23.0225, 72.5714],
    vijayawada: [16.5062, 80.6480],
    visakhapatnam: [17.6868, 83.2185]
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (CITY_COORDS[query]) {
      setMapViewport(CITY_COORDS[query], 13);
    }
  };

  // Group layers by categories
  const categories = {
    base: layers.filter((l) => l.category === "base"),
    environmental: layers.filter((l) => l.category === "environmental"),
    infrastructure: layers.filter((l) => l.category === "infrastructure"),
    social: layers.filter((l) => l.category === "social")
  };

  const getCategoryLabel = (cat: string) => {
    if (cat === "base") return "Base Layers";
    if (cat === "environmental") return "Air Quality & Climate";
    if (cat === "infrastructure") return "Urban Infrastructure";
    return "Sensitive & Social Density";
  };

  return (
    <div className="w-[300px] border-r border-border bg-[#0B0E14] flex flex-col h-full overflow-hidden text-left z-20 select-none">
      {/* Header Search */}
      <div className="p-4 border-b border-border/60 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-500" />
          <h3 className="text-[12px] font-bold text-slate-100 font-display uppercase tracking-widest">Map Layers</h3>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city (e.g. Delhi, Mumbai)..."
            className="w-full h-8.5 pl-8 pr-3 rounded-lg border border-border/80 bg-slate-900/40 text-xs text-slate-200 focus:border-teal-500/50 outline-none font-sans placeholder-slate-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </form>
      </div>

      {/* Layer Groups List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
        {Object.entries(categories).map(([catKey, catLayers]) => {
          if (catLayers.length === 0) return null;
          return (
            <div key={catKey} className="space-y-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-display">
                {getCategoryLabel(catKey)}
              </span>
              <div className="space-y-1">
                {catLayers.map((layer) => {
                  const isVisible = visibleLayers.includes(layer.layer_key);
                  return (
                    <button
                      key={layer.layer_key}
                      onClick={() => toggleLayer(layer.layer_key)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-[11.5px] transition-all duration-200 text-left border ${
                        isVisible
                          ? "bg-teal-950/20 border-teal-500/25 text-teal-400 font-medium"
                          : "border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                      }`}
                    >
                      <span className="truncate max-w-[200px]">{layer.layer_name}</span>
                      <span className="text-slate-500 flex items-center">
                        {isVisible ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Static Legend Panel */}
      <div className="p-4 border-t border-border bg-[#0E121A] space-y-3.5 text-xs">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-display">
          AQI Pollution Index Scale
        </span>
        <div className="space-y-2 font-mono text-[10.5px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
              <span className="text-slate-300">Good (0 - 50)</span>
            </div>
            <span className="text-[9px] text-emerald-400 bg-emerald-950/25 px-1 py-0.2 rounded border border-emerald-500/10 font-bold uppercase">Safe</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
              <span className="text-slate-300">Moderate (51 - 100)</span>
            </div>
            <span className="text-[9px] text-amber-400 bg-amber-950/25 px-1 py-0.2 rounded border border-amber-500/10 font-bold uppercase">Accept</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
              <span className="text-slate-300">Poor (101 - 200)</span>
            </div>
            <span className="text-[9px] text-rose-400 bg-rose-950/25 px-1 py-0.2 rounded border border-rose-500/10 font-bold uppercase">Poor</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EC4899]"></div>
              <span className="text-slate-300">Very Poor (201 - 300)</span>
            </div>
            <span className="text-[9px] text-pink-400 bg-pink-950/25 px-1 py-0.2 rounded border border-pink-500/10 font-bold uppercase">Warn</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></div>
              <span className="text-slate-300">Severe (&gt; 300)</span>
            </div>
            <span className="text-[9px] text-violet-400 bg-violet-950/25 px-1 py-0.2 rounded border border-violet-500/10 font-bold uppercase">Severe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
