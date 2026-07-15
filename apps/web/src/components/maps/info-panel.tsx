"use client";

import React from "react";
import { Info, ShieldAlert, Sparkles, Wind, CloudRain, Sun, X } from "lucide-react";
import { useMapStore, AQIStation, PollutionSource, HospitalZone, SchoolZone } from "@/store/map";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

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
        <p className="text-ink-tertiary">Select any monitoring station, ward boundary, pollution source, hospital, or school on the map to inspect live environmental readings.</p>
      </div>
    );
  }

  const type = selectedMarkerType;

  return (
    <div className="w-[320px] border-l border-border bg-surface flex flex-col h-full overflow-hidden text-left z-20 relative">
      {/* Header Panel */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-ink-primary font-display">
            {type === "station" && "Station Diagnostics"}
            {type === "hotspot" && "Ward Intelligence"}
            {type === "source" && "Source Attribution"}
            {type === "hospital" && "Hospital Risk Alert"}
            {type === "school" && "School Safety Index"}
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
        
        {/* CASE 1: AQI Station Details */}
        {type === "station" && (() => {
          const station = selectedMarker as AQIStation;
          return (
            <>
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

              <div className="border border-accent/20 bg-accent-soft rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-accent">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">AI Intervention Guide</span>
                </div>
                <p className="text-xs text-ink-primary leading-relaxed">
                  Dominant pollutant is <span className="font-bold font-mono text-accent">{station.dominant_pollutant}</span>. Traffic emissions are contributing significantly. Enforce diesel truck detour regulations.
                </p>
              </div>
            </>
          );
        })()}

        {/* CASE 2: Ward Boundaries (Hotspot Object Casted) */}
        {type === "hotspot" && (() => {
          const hotspot = selectedMarker as unknown as {
            aqi?: number;
            ward_name?: string;
            ward_code?: string;
            population?: number;
            estimated_source?: string;
            radius?: number;
            risk_level?: string;
            hotspot_id?: string;
          };
          const aqi = hotspot.aqi || 120;
          return (
            <>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1 bg-danger/10 border border-danger/25 text-danger px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono uppercase tracking-wider">
                  {hotspot.risk_level} Risk Zone
                </div>
                <h4 className="text-sm font-extrabold text-ink-primary leading-tight font-display mt-2">
                  {hotspot.ward_name || `Hotspot Region HS-${(hotspot.hotspot_id || "").substring(0, 4)}`}
                </h4>
                {hotspot.ward_code && (
                  <span className="text-[10px] text-ink-tertiary font-mono block">Code: {hotspot.ward_code}</span>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/40">
                  <span className="text-ink-secondary">Current AQI:</span>
                  <span className="font-bold font-mono text-ink-primary">{aqi}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/40">
                  <span className="text-ink-secondary">Population Grid:</span>
                  <span className="font-bold font-mono text-ink-primary">{hotspot.population?.toLocaleString() || "45,000"}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/40">
                  <span className="text-ink-secondary">Dominant Source:</span>
                  <span className="font-bold text-ink-primary">{hotspot.estimated_source}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/40">
                  <span className="text-ink-secondary">Nearby Hospitals:</span>
                  <span className="font-bold text-ink-primary">2 Active Facilities</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/40">
                  <span className="text-ink-secondary">Nearby Schools:</span>
                  <span className="font-bold text-ink-primary">4 Vulnerable Zones</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5">
                  <span className="text-ink-secondary">Inspection Priority:</span>
                  <span className="font-bold font-mono text-danger">High Priority</span>
                </div>
              </div>

              <div className="border border-danger/20 bg-danger/5 rounded-lg p-3 space-y-1">
                <span className="text-[10px] font-bold text-danger uppercase tracking-wider font-mono">Recommended Actions</span>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Enforce strict dust barriers on active construction nodes. Sprinkling sweepers deployed immediately to mitigate coarse PM10.
                </p>
              </div>
            </>
          );
        })()}

        {/* CASE 3: Pollution Source Details */}
        {type === "source" && (() => {
          const source = selectedMarker as PollutionSource;
          return (
            <>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1 bg-warning/10 border border-warning/25 text-warning px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono uppercase tracking-wider">
                  Pollution Source
                </div>
                <h4 className="text-sm font-extrabold text-ink-primary leading-tight font-display mt-2">
                  {source.name}
                </h4>
                <span className="text-[10px] text-ink-tertiary font-mono block">Category: {source.type}</span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/40">
                  <span className="text-ink-secondary">Contribution:</span>
                  <span className="font-bold font-mono text-danger">{source.contribution}%</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/40">
                  <span className="text-ink-secondary">Trace Confidence:</span>
                  <span className="font-bold font-mono text-accent">{source.confidence}%</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5">
                  <span className="text-ink-secondary">Trend Direction:</span>
                  <span className="font-bold text-ink-primary">{source.trend}</span>
                </div>
              </div>

              <div className="border border-accent/20 bg-accent-soft rounded-lg p-3 space-y-1">
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider font-mono">Supporting Evidence</span>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {source.evidence}
                </p>
              </div>
            </>
          );
        })()}

        {/* CASE 4: Hospital Details */}
        {type === "hospital" && (() => {
          const hospital = selectedMarker as HospitalZone;
          return (
            <>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1 bg-[#EF4444]/10 border border-[#EF4444]/25 text-[#EF4444] px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono uppercase tracking-wider">
                  Sensitive Facility
                </div>
                <h4 className="text-sm font-extrabold text-ink-primary leading-tight font-display mt-2">
                  {hospital.name}
                </h4>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/40">
                  <span className="text-ink-secondary">Current Risk Level:</span>
                  <span className="font-bold text-[#EF4444]">{hospital.current_risk}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5">
                  <span className="text-ink-secondary">72h Forecast Risk:</span>
                  <span className="font-bold text-warning">{hospital.forecast_risk}</span>
                </div>
              </div>

              <div className="border border-accent/20 bg-accent-soft rounded-lg p-3 space-y-1">
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider font-mono">Suggested Protocol</span>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {hospital.suggested_action}
                </p>
              </div>
            </>
          );
        })()}

        {/* CASE 5: School Details */}
        {type === "school" && (() => {
          const school = selectedMarker as SchoolZone;
          return (
            <>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1 bg-[#3B82F6]/10 border border-[#3B82F6]/25 text-[#3B82F6] px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono uppercase tracking-wider">
                  Vulnerable Receptor Zone
                </div>
                <h4 className="text-sm font-extrabold text-ink-primary leading-tight font-display mt-2">
                  {school.name}
                </h4>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/40">
                  <span className="text-ink-secondary">Receptor Risk:</span>
                  <span className="font-bold text-[#3B82F6]">{school.current_risk}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5">
                  <span className="text-ink-secondary">72h Exposure Risk:</span>
                  <span className="font-bold text-[#3B82F6]">{school.forecast_risk}</span>
                </div>
              </div>

              <div className="border border-accent/20 bg-accent-soft rounded-lg p-3 space-y-1">
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider font-mono">Exposure Guidelines</span>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {school.suggested_action}
                </p>
              </div>
            </>
          );
        })()}

      </div>
    </div>
  );
}
