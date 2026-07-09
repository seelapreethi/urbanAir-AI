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
    setSearchQuery
  } = useMapStore();

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
    <div className="w-[300px] border-r border-border bg-surface flex flex-col h-full overflow-hidden text-left z-20">
      {/* Header Search */}
      <div className="p-4 border-b border-border flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-ink-primary font-display">Map Layers</h3>
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search layers or stations..."
            className="w-full h-8 pl-8 pr-3 rounded border border-border bg-canvas text-xs text-ink-primary focus:border-accent outline-none font-sans"
          />
          <Search className="w-3.5 h-3.5 text-ink-tertiary absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Layer Groups List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
        {Object.entries(categories).map(([catKey, catLayers]) => {
          if (catLayers.length === 0) return null;
          return (
            <div key={catKey} className="space-y-2">
              <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">
                {getCategoryLabel(catKey)}
              </span>
              <div className="space-y-1">
                {catLayers.map((layer) => {
                  const isVisible = visibleLayers.includes(layer.layer_key);
                  return (
                    <button
                      key={layer.layer_key}
                      onClick={() => toggleLayer(layer.layer_key)}
                      className={`w-full flex items-center justify-between p-2 rounded text-xs transition-colors text-left ${
                        isVisible
                          ? "bg-accent/5 border border-accent/25 text-ink-primary"
                          : "border border-transparent text-ink-secondary hover:bg-surface-raised"
                      }`}
                    >
                      <span className="truncate max-w-[200px]">{layer.layer_name}</span>
                      <span className="text-ink-tertiary flex items-center">
                        {isVisible ? <Eye className="w-3.5 h-3.5 text-accent" /> : <EyeOff className="w-3.5 h-3.5" />}
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
      <div className="p-4 border-t border-border bg-surface-raised space-y-3 text-xs">
        <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">
          AQI Pollution Index Scale
        </span>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
              <span>Good (0 - 50)</span>
            </div>
            <span className="text-[10px] text-ink-tertiary">Safe</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
              <span>Moderate (51 - 100)</span>
            </div>
            <span className="text-[10px] text-ink-tertiary">Acceptable</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
              <span>Poor (101 - 200)</span>
            </div>
            <span className="text-[10px] text-ink-tertiary">Unhealthy</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EC4899]"></div>
              <span>Very Poor (201 - 300)</span>
            </div>
            <span className="text-[10px] text-ink-tertiary">Dangerous</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
              <span>Severe (&gt; 300)</span>
            </div>
            <span className="text-[10px] text-ink-tertiary">Hazardous</span>
          </div>
        </div>
      </div>
    </div>
  );
}
