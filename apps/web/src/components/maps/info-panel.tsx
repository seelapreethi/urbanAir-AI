"use client";

import React from "react";
import { Info, ShieldAlert, Sparkles, Wind, CloudRain, Sun, X } from "lucide-react";
import { useMapStore, AQIStation, Hotspot } from "@/store/map";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

// Mock trend history dataset for the selected station
const mockTrend = [
  { day: "Mon", AQI: 120 },
  { day: "Tue", AQI: 130 },
  { day: "Wed", AQI: 145 },
  { day: "Thu", AQI: 140 },
  { day: "Fri", AQI: 155 },
  { day: "Sat", AQI: 160 },
  { day: "Sun", AQI: 142 },
];

export function InfoPanel() {
  const { selectedMarker, selectedMarkerType, selectMarker } = useMapStore();

  if (!selectedMarker) {
    return (
      <div className="w-[320px] border-l border-border bg-surface flex flex-col h-full items-center justify-center p-6 text-center text-xs text-ink-secondary z-20">
        <Info className="w-8 h-8 text-accent/50 mb-3" />
        <h4 className="font-bold text-ink-primary mb-1">GIS Telemetry Layer</h4>
        <p className="text-ink-tertiary">Select any monitoring station marker or hotspot region on the map to inspect live environmental readings.</p>
      </div>
    );
  }

  const isStation = selectedMarkerType === "station";
  const station = selectedMarker as AQIStation;
  const hotspot = selectedMarker as Hotspot;

  return (
    <div className="w-[320px] border-l border-border bg-surface flex flex-col h-full overflow-hidden text-left z-20 relative">
      {/* Header Panel */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-ink-primary font-display">
            {isStation ? "Station Diagnostics" : "Hotspot Analytics"}
          </h3>
        </div>
        <button
          onClick={() => selectMarker(null, null)}
          className="p-1 rounded hover:bg-surface-raised text-ink-tertiary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Scroller */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
        {isStation ? (
          <>
            {/* 1. Station Basics */}
            <div className="space-y-2">
              <h4 className="text-sm font-extrabold text-ink-primary leading-tight font-display">
                {station.station_name}
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={station.aqi <= 100 ? "success" : "warning"}>
                  AQI {station.aqi}
                </Badge>
                <span className="text-[10px] text-ink-tertiary font-mono">
                  Updated: {station.last_updated}
                </span>
              </div>
            </div>

            {/* 2. Meteorological Readings */}
            <div className="grid grid-cols-3 gap-2 bg-surface-raised p-3 rounded-lg border border-border">
              <div className="flex flex-col items-center justify-center p-1 text-center">
                <Sun className="w-4 h-4 text-warning mb-1" />
                <span className="text-[9px] text-ink-tertiary font-mono uppercase">Temp</span>
                <span className="text-xs font-bold text-ink-primary font-mono mt-0.5">{station.temp}°C</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1 text-center border-x border-border/40">
                <CloudRain className="w-4 h-4 text-info mb-1" />
                <span className="text-[9px] text-ink-tertiary font-mono uppercase">Humid</span>
                <span className="text-xs font-bold text-ink-primary font-mono mt-0.5">{station.humidity}%</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1 text-center">
                <Wind className="w-4 h-4 text-accent mb-1" />
                <span className="text-[9px] text-ink-tertiary font-mono uppercase">Wind</span>
                <span className="text-xs font-bold text-ink-primary font-mono mt-0.5">{station.wind_speed} km/h</span>
              </div>
            </div>

            {/* 3. Recharts Sparkline Trend */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">
                AQI Weekly Trend
              </span>
              <div className="h-[120px] w-full text-[10px] border border-border rounded-lg p-2 bg-canvas">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockTrend} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <XAxis dataKey="day" stroke="var(--color-ink-tertiary)" tickLine={false} />
                    <YAxis stroke="var(--color-ink-tertiary)" tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        fontSize: "10px",
                        color: "var(--color-ink-primary)"
                      }}
                    />
                    <Line type="monotone" dataKey="AQI" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4. Action Recommendation */}
            <div className="border border-accent/20 bg-accent-soft rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-accent">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">AI Intervention Guide</span>
              </div>
              <p className="text-xs text-ink-primary leading-relaxed">
                Dominant pollutant is <span className="font-bold font-mono text-accent">{station.dominant_pollutant}</span>. Traffic emissions are contributing significantly. Schedule an immediate inspector dispatch to inspect nearby commercial construction buffers.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Hotspot Basics */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 bg-danger/10 border border-danger/25 text-danger px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono uppercase tracking-wider">
                {hotspot.risk_level} Risk Zone
              </div>
              <h4 className="text-sm font-extrabold text-ink-primary leading-tight font-display mt-2">
                Hotspot Area HS-{hotspot.hotspot_id.substring(0, 4)}
              </h4>
            </div>

            {/* Parameters Diagnostics */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/40">
                <span className="text-ink-secondary">Estimated Source:</span>
                <span className="font-bold text-ink-primary">{hotspot.estimated_source}</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/40">
                <span className="text-ink-secondary">Severity Index:</span>
                <span className="font-bold font-mono text-danger">{hotspot.severity.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/40">
                <span className="text-ink-secondary">Confidence Score:</span>
                <span className="font-bold font-mono text-accent">{hotspot.confidence_score}%</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1.5">
                <span className="text-ink-secondary">Affected Radius:</span>
                <span className="font-bold font-mono text-ink-primary">{hotspot.radius} meters</span>
              </div>
            </div>

            {/* Warning alerts */}
            <div className="border border-danger/20 bg-danger/5 rounded-lg p-3 space-y-1">
              <span className="text-[10px] font-bold text-danger uppercase tracking-wider font-mono">Enforcement Priority</span>
              <p className="text-xs text-ink-secondary leading-relaxed">
                This area falls within municipal ward zones that host hospitals and school buffers. Scheduling traffic routing restrictions is recommended.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
