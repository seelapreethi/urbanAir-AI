"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useCityStore } from "@/store/city";
import { useDashboardStore } from "@/store/dashboard";
import { useUIStore } from "@/store/ui";
import { StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LiveStatusBar } from "@/components/dashboard/live-status-bar";
import { QuickActionPanel } from "@/components/dashboard/quick-action-panel";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { LatestAlerts } from "@/components/dashboard/latest-alerts";
import { RecommendationsPanel } from "@/components/dashboard/recommendations-panel";
import { AISummaryCard } from "@/components/dashboard/ai-summary-card";
import { AQITrendChart, PollutantDistributionChart, EmissionSourcesChart } from "@/components/charts/dashboard-charts";
import { MapPreview } from "@/components/maps/map-preview";
import { Activity, ShieldAlert, Users, TrendingUp, RefreshCw, AlertCircle } from "lucide-react";

interface DashboardData {
  summary: {
    city: string;
    health_score: number;
    ai_summary: string;
    dominant_pollutant: string;
    aqi_category: string;
    confidence_score: number;
  };
  stats: {
    current_aqi?: number;
    forecast_aqi?: number;
    high_risk_zones?: number;
    critical_hotspots?: number;
    population_at_risk?: number;
    inspection_priority?: string;
    citizen_alerts?: number;
    pollution_trend?: string;
    improvement_pct?: string;
    prediction_confidence?: string;
  };
  weather: {
    temp?: number;
    humidity?: number;
    wind_speed?: number;
    visibility?: number;
    pressure?: number;
  };
  alerts: Array<{
    id: string;
    severity: string;
    category: string;
    time: string;
    location: string;
    status: string;
  }>;
  recommendations: Array<{
    id: string;
    action: string;
    impact: string;
    confidence: number;
    priority: string;
  }>;
  activity: Array<{
    time: string;
    title: string;
    desc: string;
  }>;
}

export default function CommandCenterPage() {
  const { selectedCity } = useCityStore();
  const {
    filters,
    dashboardData,
    isLoading,
    error,
    setFilter,
    fetchDashboardData
  } = useDashboardStore();
  const { notifySuccess } = useUIStore();
  const [lastUpdated, setLastUpdated] = React.useState<string | null>(null);

  // Fetch dashboard payload when selected city context switches
  useEffect(() => {
    fetchDashboardData(selectedCity);
  }, [selectedCity, fetchDashboardData]);

  // Track the timestamp when dashboard data updates successfully
  useEffect(() => {
    if (dashboardData) {
      setLastUpdated(new Date().toLocaleTimeString());
    }
  }, [dashboardData]);

  const handleRefresh = async () => {
    await fetchDashboardData(selectedCity);
    notifySuccess("Dashboard Refreshed", `Loaded latest environmental data for ${selectedCity}.`);
  };

  const getAQISeverityClass = (aqi: number) => {
    if (aqi <= 50) return "text-aqi-good border-aqi-good/20 bg-aqi-good/5";
    if (aqi <= 100) return "text-aqi-moderate border-aqi-moderate/20 bg-aqi-moderate/5";
    if (aqi <= 150) return "text-aqi-unhealthySensitive border-aqi-unhealthySensitive/20 bg-aqi-unhealthySensitive/5";
    if (aqi <= 200) return "text-aqi-unhealthy border-aqi-unhealthy/20 bg-aqi-unhealthy/5";
    if (aqi <= 300) return "text-aqi-veryUnhealthy border-aqi-veryUnhealthy/20 bg-aqi-veryUnhealthy/5";
    return "text-aqi-hazardous border-aqi-hazardous/20 bg-aqi-hazardous/5";
  };

  const getAQIPulseClass = (aqi: number) => {
    if (aqi <= 50) return "border-aqi-good/20";
    if (aqi <= 100) return "border-aqi-moderate/20";
    if (aqi <= 150) return "border-aqi-unhealthySensitive/20";
    if (aqi <= 200) return "border-aqi-unhealthy/20";
    if (aqi <= 300) return "border-aqi-veryUnhealthy/20";
    return "border-aqi-hazardous/20";
  };

  if (error) {
    return (
      <div className="min-h-[400px] border border-danger/25 bg-danger/5 rounded-xl p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-danger mb-4" />
        <h3 className="text-lg font-bold text-ink-primary mb-2">Failed to load Dashboard data</h3>
        <p className="text-sm text-ink-secondary mb-6">{error}</p>
        <button
          onClick={handleRefresh}
          className="h-10 px-5 flex items-center gap-2 rounded-lg bg-danger text-canvas font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  // Safe casting dynamic stats from API or mock fallbacks
  const data = dashboardData as unknown as DashboardData | null;
  const stats = data?.stats || {};
  const currentAQI = Number(stats.current_aqi) || 0;
  const weather = data?.weather || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight font-display text-ink-primary">
              AI Command Center
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              LIVE DATA
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-ink-secondary">
            <span>Real-time smart city environmental parameters.</span>
            {lastUpdated && (
              <>
                <span className="text-ink-tertiary font-mono">|</span>
                <span className="font-mono text-ink-tertiary">Last updated: {lastUpdated}</span>
                <span className="text-ink-tertiary font-mono">|</span>
                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-surface-raised border border-border text-ink-tertiary">
                  Source: Open-Meteo & CPCB
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            disabled={isLoading}
            onClick={handleRefresh}
            className="h-9 px-4 rounded-lg border border-border bg-surface text-xs font-semibold hover:bg-surface-raised active:scale-[0.98] transition-all inline-flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh data
          </button>
          <button className="h-9 px-4 rounded-lg bg-accent text-canvas text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all">
            Export Report
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border border-border bg-surface rounded-xl p-4 flex flex-wrap items-center gap-4 justify-between">
        <div className="flex flex-wrap items-center gap-3.5">
          {/* Date range filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-wider">Date range</span>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilter("dateRange", e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-canvas text-xs text-ink-secondary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Pollutant selector */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-wider">Pollutant</span>
            <select
              value={filters.pollutant}
              onChange={(e) => setFilter("pollutant", e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-canvas text-xs text-ink-secondary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            >
              <option value="all">All Pollutants</option>
              <option value="PM2.5">PM2.5</option>
              <option value="PM10">PM10</option>
              <option value="NO2">NO2</option>
              <option value="SO2">SO2</option>
            </select>
          </div>

          {/* Risk Level filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-wider">Risk threshold</span>
            <select
              value={filters.riskLevel}
              onChange={(e) => setFilter("riskLevel", e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-canvas text-xs text-ink-secondary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            >
              <option value="all">All Risks</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High / Critical</option>
            </select>
          </div>
        </div>
        
        {/* Quick Weather Snapshot */}
        {weather.temp !== undefined && (
          <div className="flex items-center gap-4 text-xs text-ink-secondary font-mono border-t md:border-t-0 border-border/40 pt-2.5 md:pt-0">
            <div>
              <span>Temp:</span> <span className="font-bold text-ink-primary">{weather.temp}°C</span>
            </div>
            <div>
              <span>Humidity:</span> <span className="font-bold text-ink-primary">{weather.humidity}%</span>
            </div>
            <div>
              <span>Wind:</span> <span className="font-bold text-ink-primary">{weather.wind_speed} km/h</span>
            </div>
          </div>
        )}
      </div>

      {/* Live Status Bar */}
      <LiveStatusBar />

      {/* AI Generated Text Summary Card */}
      {isLoading ? (
        <div className="h-28 rounded-xl border border-border bg-surface animate-pulse flex items-center justify-center text-xs text-ink-tertiary">
          Analyzing air quality trends...
        </div>
      ) : (
        <AISummaryCard summary={data?.summary} />
      )}

      {/* Quick Statistics KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-28 rounded-xl border border-border bg-surface animate-pulse" />
          ))
        ) : (
          <>
            <StatCard
              title="Current AQI"
              value={stats.current_aqi || "--"}
              icon={<Activity className="w-4 h-4" />}
              trend={{
                value: stats.pollution_trend || "0%",
                direction: stats.pollution_trend?.includes("+") ? "up" : "down",
                label: "vs yesterday"
              }}
            />
            <StatCard
              title="Forecast AQI (72h)"
              value={stats.forecast_aqi || "--"}
              icon={<TrendingUp className="w-4 h-4" />}
              trend={{
                value: "High Risk",
                direction: "neutral",
                label: "expected peak"
              }}
            />
            <StatCard
              title="Population at Risk"
              value={stats.population_at_risk?.toLocaleString() || "--"}
              icon={<Users className="w-4 h-4" />}
              trend={{
                value: stats.high_risk_zones || "0",
                direction: "neutral",
                label: "hotspot zones"
              }}
            />
            <StatCard
              title="Inspection Priority"
              value={stats.inspection_priority || "--"}
              icon={<ShieldAlert className="w-4 h-4" />}
              trend={{
                value: stats.citizen_alerts || "0",
                direction: "neutral",
                label: "active user complaints"
              }}
            />
          </>
        )}
      </div>

      {/* Main Grid: Pulse Ring & Leaflet Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AQI Pulse Ring Live Monitor */}
        <div className="lg:col-span-4 border border-border bg-surface rounded-xl p-6 flex flex-col items-center justify-center relative min-h-[380px]">
          <div className="absolute top-4 left-6 flex items-center gap-1.5 text-xs text-ink-secondary uppercase tracking-widest font-mono">
            <Activity className="w-3.5 h-3.5" />
            Live Status
          </div>
          
          {isLoading ? (
            <div className="w-40 h-40 rounded-full border border-border bg-canvas flex items-center justify-center animate-pulse text-xs text-ink-tertiary">
              Reading sensor...
            </div>
          ) : (
            <div className={`w-40 h-40 rounded-full border-4 border-dashed flex items-center justify-center aqi-pulse-ring-active mt-6 ${getAQIPulseClass(currentAQI)}`}>
              <div className="w-32 h-32 rounded-full border border-border bg-canvas flex flex-col items-center justify-center">
                <span className="text-[10px] text-ink-tertiary uppercase tracking-widest font-mono">AQI</span>
                <span className="text-4xl font-extrabold tracking-tighter font-mono mt-1 text-ink-primary">
                  {stats.current_aqi}
                </span>
                <Badge
                  variant="outline"
                  className={`mt-2 text-[9px] border-current/25 ${getAQISeverityClass(currentAQI)}`}
                >
                  {data?.summary?.aqi_category || "Moderate"}
                </Badge>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-ink-secondary font-medium">
            Dominant Parameter: <span className="font-bold text-accent font-mono">{data?.summary?.dominant_pollutant}</span>
          </div>
        </div>

        {/* Right: Map Preview */}
        <div className="lg:col-span-8">
          <MapPreview />
        </div>
      </div>

      {/* Chart Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AQITrendChart />
        <PollutantDistributionChart />
        <EmissionSourcesChart />
      </div>

      {/* Bottom Layout: Recommendations, Alerts & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recommendations */}
        <div className="lg:col-span-4">
          <RecommendationsPanel recommendations={data?.recommendations} />
        </div>

        {/* Middle: Alerts */}
        <div className="lg:col-span-4">
          <LatestAlerts alerts={data?.alerts} />
        </div>

        {/* Right: Activity timeline */}
        <div className="lg:col-span-4">
          <RecentActivity activities={data?.activity} />
        </div>
      </div>

      {/* Quick Actions Shortcuts */}
      <QuickActionPanel />
    </motion.div>
  );
}
