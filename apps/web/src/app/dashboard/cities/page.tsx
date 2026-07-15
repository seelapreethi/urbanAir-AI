"use client";

import React, { useState } from "react";
import { Table, ShieldAlert, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from "recharts";

export default function CitiesPage() {
  const [activeMetric, setActiveMetric] = useState<"aqi" | "pollutants">("aqi");

  // Dynamic city comparison stats
  const cityComparisonData = [
    { city: "Vijayawada", aqi: 95, pm25: 38, pm10: 55, status: "Satisfactory" },
    { city: "Hyderabad", aqi: 125, pm25: 52, pm10: 74, status: "Moderate" },
    { city: "Bengaluru", aqi: 68, pm25: 22, pm10: 42, status: "Satisfactory" },
    { city: "Chennai", aqi: 82, pm25: 28, pm10: 50, status: "Satisfactory" },
    { city: "Delhi", aqi: 245, pm25: 142, pm10: 198, status: "Poor" },
    { city: "Mumbai", aqi: 110, pm25: 45, pm10: 68, status: "Moderate" },
    { city: "Kolkata", aqi: 135, pm25: 58, pm10: 82, status: "Moderate" },
    { city: "Pune", aqi: 90, pm25: 34, pm10: 52, status: "Satisfactory" },
    { city: "Ahmedabad", aqi: 140, pm25: 62, pm10: 89, status: "Moderate" },
    { city: "Visakhapatnam", aqi: 88, pm25: 30, pm10: 48, status: "Satisfactory" }
  ];

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#10B981"; // Good
    if (aqi <= 100) return "#F59E0B"; // Moderate
    return "#EF4444"; // Poor
  };

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100 uppercase">
            Multi-City Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comparative air quality indices, compliance reports, and benchmark metrics across cities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMetric("aqi")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              activeMetric === "aqi"
                ? "bg-teal-950/20 border-teal-500/20 text-teal-400"
                : "border-border bg-slate-900/30 text-slate-400 hover:text-slate-200"
            }`}
          >
            AQI Benchmarks
          </button>
          <button
            onClick={() => setActiveMetric("pollutants")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              activeMetric === "pollutants"
                ? "bg-teal-950/20 border-teal-500/20 text-teal-400"
                : "border-border bg-slate-900/30 text-slate-400 hover:text-slate-200"
            }`}
          >
            PM2.5 & PM10 Details
          </button>
        </div>
      </div>

      {/* Primary Analytics Charts Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Analytics Chart */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeMetric === "aqi" ? "Cross-City AQI Benchmarking" : "Particulate Load Comparison (PM2.5 vs PM10)"}
              </CardTitle>
              <CardDescription>
                Live comparison chart analyzing dynamic telemetry values across municipal zones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full text-[10.5px] font-mono mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  {activeMetric === "aqi" ? (
                    <BarChart data={cityComparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                      <XAxis dataKey="city" stroke="var(--ink-secondary)" tickLine={false} />
                      <YAxis stroke="var(--ink-secondary)" tickLine={false} />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                      <Bar dataKey="aqi" name="Current AQI" radius={[4, 4, 0, 0]}>
                        {cityComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getAQIColor(entry.aqi)} fillOpacity={0.7} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <BarChart data={cityComparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                      <XAxis dataKey="city" stroke="var(--ink-secondary)" tickLine={false} />
                      <YAxis stroke="var(--ink-secondary)" tickLine={false} />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="pm25" name="PM2.5" fill="#3B82F6" fillOpacity={0.65} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pm10" name="PM10" fill="#8B5CF6" fillOpacity={0.65} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Key Takeaways / Stats */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Highlights</CardTitle>
              <CardDescription>Key diagnostic benchmarks derived from comparison sets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-border/60 bg-slate-900/30 p-3.5 rounded-lg flex items-start gap-2.5 text-xs text-left">
                <Award className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-slate-200">Cleanest Active Zone</strong>
                  <span className="text-slate-400 mt-0.5 block">Bengaluru reports optimal compliance levels (AQI: 68, Satisfactory) due to wet horizontal winds.</span>
                </div>
              </div>

              <div className="border border-border/60 bg-slate-900/30 p-3.5 rounded-lg flex items-start gap-2.5 text-xs text-left">
                <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-slate-200">Critical Dispatch Priority</strong>
                  <span className="text-slate-400 mt-0.5 block">Delhi continues to drift towards high risk bounds (AQI: 245, Poor). Incident dispatch levels are elevated.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="border border-border bg-[#111419]/50 p-4 rounded-xl text-xs space-y-2 text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-display">Inference Version</span>
            <p className="text-slate-400 leading-relaxed font-sans">
              Benchmark models match Sentinel column aerosol mapping grids. Retraining metrics execute comparison loops daily.
            </p>
          </div>
        </div>

      </div>

      {/* Benchmark Data Grid Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-teal-400" />
            <CardTitle>Benchmark Data Ledger</CardTitle>
          </div>
          <CardDescription>Detailed statistical comparison list of all tracked municipal zones.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="text-[9.5px] text-slate-500 uppercase tracking-widest bg-slate-900/40 border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-bold">Smart City Hub</th>
                  <th className="px-6 py-3 font-bold">Inference AQI</th>
                  <th className="px-6 py-3 font-bold">PM2.5 (µg/m³)</th>
                  <th className="px-6 py-3 font-bold">PM10 (µg/m³)</th>
                  <th className="px-6 py-3 font-bold">Regulatory Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {cityComparisonData.map((row) => (
                  <tr key={row.city} className="hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-200">{row.city}</td>
                    <td className="px-6 py-3.5 font-mono font-bold text-teal-400">{row.aqi}</td>
                    <td className="px-6 py-3.5 font-mono">{row.pm25}</td>
                    <td className="px-6 py-3.5 font-mono">{row.pm10}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.aqi <= 100 ? "bg-emerald-950/20 text-emerald-400 border border-emerald-500/10" : "bg-rose-950/20 text-rose-400 border border-rose-500/10"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
