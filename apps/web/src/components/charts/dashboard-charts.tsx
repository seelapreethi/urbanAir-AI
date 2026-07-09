"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { Maximize2 } from "lucide-react";

// Mock datasets for chart visual renders
const trendData = [
  { day: "Mon", AQI: 110, Forecast: 120 },
  { day: "Tue", AQI: 125, Forecast: 130 },
  { day: "Wed", AQI: 142, Forecast: 145 },
  { day: "Thu", AQI: 135, Forecast: 140 },
  { day: "Fri", AQI: 155, Forecast: 160 },
  { day: "Sat", AQI: 160, Forecast: 165 },
  { day: "Sun", AQI: 142, Forecast: 150 },
];

const pollutantData = [
  { name: "PM2.5", value: 45, color: "#3B82F6" },
  { name: "PM10", value: 30, color: "#10B981" },
  { name: "NO2", value: 15, color: "#F59E0B" },
  { name: "SO2", value: 10, color: "#EF4444" },
];

const sourceData = [
  { source: "Traffic", contribution: 38 },
  { source: "Industry", contribution: 25 },
  { source: "Construction", contribution: 20 },
  { source: "Biomass", contribution: 12 },
  { source: "Waste Burn", contribution: 5 },
];

export function AQITrendChart() {
  return (
    <div className="border border-border bg-surface rounded-xl p-6 flex flex-col h-[380px]">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-sm font-bold text-ink-primary font-display">AQI Trend (7 Days)</h4>
          <span className="text-[10px] text-ink-tertiary font-mono">Historical vs Forecast Prognosis</span>
        </div>
        <button className="p-1.5 rounded border border-border text-ink-secondary hover:bg-surface-raised transition-colors">
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
            <XAxis dataKey="day" stroke="var(--color-ink-tertiary)" tickLine={false} />
            <YAxis stroke="var(--color-ink-tertiary)" tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-ink-primary)"
              }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px" }} />
            <Line
              type="monotone"
              dataKey="AQI"
              stroke="#3B82F6"
              strokeWidth={3}
              activeDot={{ r: 6 }}
              name="Current AQI"
            />
            <Line
              type="monotone"
              dataKey="Forecast"
              stroke="#F59E0B"
              strokeDasharray="5 5"
              strokeWidth={2}
              name="Forecast AQI"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PollutantDistributionChart() {
  return (
    <div className="border border-border bg-surface rounded-xl p-6 flex flex-col h-[380px]">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-sm font-bold text-ink-primary font-display">Pollutant Share</h4>
          <span className="text-[10px] text-ink-tertiary font-mono">Dominant Parameter Breakdown</span>
        </div>
        <button className="p-1.5 rounded border border-border text-ink-secondary hover:bg-surface-raised transition-colors">
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 w-full flex items-center justify-center text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pollutantData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {pollutantData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-ink-primary)"
              }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function EmissionSourcesChart() {
  return (
    <div className="border border-border bg-surface rounded-xl p-6 flex flex-col h-[380px]">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-sm font-bold text-ink-primary font-display">Source Attribution</h4>
          <span className="text-[10px] text-ink-tertiary font-mono">Emission Sector Contributions %</span>
        </div>
        <button className="p-1.5 rounded border border-border text-ink-secondary hover:bg-surface-raised transition-colors">
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sourceData} layout="vertical" margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} horizontal={false} />
            <XAxis type="number" stroke="var(--color-ink-tertiary)" tickLine={false} />
            <YAxis dataKey="source" type="category" stroke="var(--color-ink-tertiary)" tickLine={false} width={80} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-ink-primary)"
              }}
            />
            <Bar dataKey="contribution" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
