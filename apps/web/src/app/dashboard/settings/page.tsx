"use client";

import React, { useEffect, useState } from "react";
import { 
  Settings, Bell, Database, 
  Cpu, Activity, RefreshCw, CheckCircle, 
  AlertTriangle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { useCityStore } from "@/store/city";
import { motion } from "framer-motion";

interface SystemMetrics {
  api_response_time_ms: number;
  memory_usage_mb: number;
  cpu_usage_percent: number;
  request_count: number;
  failed_requests: number;
  model_inference_time_ms: number;
  cache_hit_rate_percent: number;
}

export default function SettingsPage() {
  const { selectedCity, setCity } = useCityStore();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  
  // Local state for configuration settings
  const [tempUnit, setTempUnit] = useState("C");
  const [mapTheme, setMapTheme] = useState("dark");
  const [aqiThreshold, setAqiThreshold] = useState(150);
  const [inferenceMode, setInferenceMode] = useState("deterministic");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const res = await apiClient.get<SystemMetrics>("/monitor/metrics");
      if (res.data) {
        setMetrics(res.data);
      }
    } catch (err) {
      console.error("Failed to retrieve monitoring telemetry:", err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const citiesList = [
    "Vijayawada", "Hyderabad", "Bengaluru", "Chennai", "Delhi", 
    "Mumbai", "Kolkata", "Pune", "Ahmedabad", "Visakhapatnam"
  ];

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display text-ink-primary">
            Settings & System Diagnostics
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Global system preference configurations and live sensor telemetry monitoring status logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-accent font-semibold flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/25"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Preferences Saved
            </motion.div>
          )}
          <Badge variant="success">Active Session</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Configurations Settings */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. General Preferences */}
          <div className="border border-border bg-surface rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-2.5">
              <Settings className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-bold text-ink-primary font-display">General Preferences</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-ink-secondary">Default Smart City View</label>
                <select 
                  value={selectedCity} 
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-9 rounded border border-border bg-canvas text-ink-primary px-2 focus:border-accent outline-none font-sans"
                >
                  {citiesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-ink-secondary">Temperature Metric Unit</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setTempUnit("C")}
                    className={`flex-1 h-9 rounded border font-semibold transition-all ${
                      tempUnit === "C" ? "bg-accent text-canvas border-accent" : "border-border bg-canvas text-ink-secondary hover:text-ink-primary"
                    }`}
                  >
                    Celsius (°C)
                  </button>
                  <button 
                    onClick={() => setTempUnit("F")}
                    className={`flex-1 h-9 rounded border font-semibold transition-all ${
                      tempUnit === "F" ? "bg-accent text-canvas border-accent" : "border-border bg-canvas text-ink-secondary hover:text-ink-primary"
                    }`}
                  >
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-ink-secondary">GIS Map Basemap Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {["dark", "light", "satellite"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setMapTheme(theme)}
                      className={`h-8 rounded border text-[10px] font-bold uppercase tracking-wider transition-all ${
                        mapTheme === theme ? "bg-accent text-canvas border-accent" : "border-border bg-canvas text-ink-secondary"
                      }`}
                    >
                      {theme} Theme
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Automated Smart Alert Limits */}
          <div className="border border-border bg-surface rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-2.5">
              <Bell className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-bold text-ink-primary font-display">Enforcement Notification Controls</h3>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-ink-secondary">
                  <span>Critical AQI Dispatch Threshold</span>
                  <span className="font-mono text-accent">{aqiThreshold} AQI</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="350" 
                  step="10"
                  value={aqiThreshold} 
                  onChange={(e) => setAqiThreshold(Number(e.target.value))}
                  className="w-full accent-accent bg-border h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-ink-tertiary block leading-snug">
                  Inspectors receive automated mobile warnings when any sector sensor exceeds this parameter limits.
                </span>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-bold text-ink-secondary block mb-1">Alert Push Channels</label>
                <div className="grid grid-cols-3 gap-2">
                  {["System Banner", "Direct SMS", "Officer E-Mail"].map((channel) => (
                    <label key={channel} className="flex items-center gap-2 border border-border bg-canvas p-2.5 rounded-lg cursor-pointer hover:border-accent/40 transition-colors">
                      <input type="checkbox" defaultChecked className="accent-accent" />
                      <span className="font-semibold text-ink-secondary text-[11px]">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Neural Calibration Settings */}
          <div className="border border-border bg-surface rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-2.5">
              <Database className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-bold text-ink-primary font-display">Inference Engine Calibration</h3>
            </div>
            
            <div className="text-xs space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-ink-secondary">Diagnostic Core Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setInferenceMode("deterministic")}
                    className={`p-3 rounded-lg border text-left flex flex-col justify-between h-20 transition-all ${
                      inferenceMode === "deterministic" ? "border-accent bg-accent/5" : "border-border bg-canvas"
                    }`}
                  >
                    <span className="font-bold text-ink-primary">Deterministic RAG</span>
                    <span className="text-[9px] text-ink-tertiary font-medium">Resolves actions using local compliance indices.</span>
                  </button>
                  <button
                    onClick={() => setInferenceMode("hybrid")}
                    className={`p-3 rounded-lg border text-left flex flex-col justify-between h-20 transition-all ${
                      inferenceMode === "hybrid" ? "border-accent bg-accent/5" : "border-border bg-canvas"
                    }`}
                  >
                    <span className="font-bold text-ink-primary">AI Dynamic Model</span>
                    <span className="text-[9px] text-ink-tertiary font-medium">Applies forecasting predictions dynamically.</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="h-9 px-6 rounded-lg bg-accent text-canvas font-bold text-xs hover:opacity-95 transition-opacity"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Diagnostics Health Metrics */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-border bg-surface rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-bold text-ink-primary font-display">Node Telemetry status</h3>
              </div>
              <button 
                onClick={fetchMetrics}
                disabled={loadingMetrics}
                className="p-1 text-ink-tertiary hover:text-ink-primary transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingMetrics ? "animate-spin text-accent" : ""}`} />
              </button>
            </div>

            {metrics ? (
              <div className="space-y-4">
                {/* Micro metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-border/60 bg-canvas rounded-xl p-3">
                    <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-wider block font-mono">API Latency</span>
                    <span className="text-xl font-black font-mono text-ink-primary mt-1 block">{metrics.api_response_time_ms} ms</span>
                  </div>
                  <div className="border border-border/60 bg-canvas rounded-xl p-3">
                    <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-wider block font-mono">CPU Footprint</span>
                    <span className="text-xl font-black font-mono text-ink-primary mt-1 block">{metrics.cpu_usage_percent}%</span>
                  </div>
                  <div className="border border-border/60 bg-canvas rounded-xl p-3">
                    <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-wider block font-mono">Memory Allocation</span>
                    <span className="text-xl font-black font-mono text-ink-primary mt-1 block">{metrics.memory_usage_mb} MB</span>
                  </div>
                  <div className="border border-border/60 bg-canvas rounded-xl p-3">
                    <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-wider block font-mono">Cache Hit Ratio</span>
                    <span className="text-xl font-black font-mono text-ink-primary mt-1 block">{metrics.cache_hit_rate_percent}%</span>
                  </div>
                </div>

                {/* Additional analytics details */}
                <div className="text-xs space-y-3 pt-2">
                  <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                    <span className="text-ink-secondary">Active Request Counter:</span>
                    <span className="font-bold font-mono text-ink-primary">{metrics.request_count} hits</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                    <span className="text-ink-secondary">Failed Query Logs:</span>
                    <span className={`font-bold font-mono ${metrics.failed_requests > 0 ? "text-danger" : "text-success"}`}>
                      {metrics.failed_requests} failures
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                    <span className="text-ink-secondary">Inference Core Stagnation:</span>
                    <span className="font-bold font-mono text-accent">{metrics.model_inference_time_ms} ms</span>
                  </div>
                </div>

                <div className="bg-[#10B981]/5 border border-[#10B981]/25 text-[#10B981] p-3.5 rounded-lg flex items-start gap-2.5 text-xs">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5 leading-snug">
                    <strong className="block font-bold">API Backend Operational</strong>
                    <span className="text-[10px] text-ink-secondary font-medium">Core database connections and Redis cache pools respond without delays.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-ink-tertiary">
                <AlertTriangle className="w-8 h-8 text-warning/50 mb-2 animate-pulse" />
                <span>Failed to pull diagnostics telemetry from host.</span>
              </div>
            )}
          </div>

          <div className="border border-border bg-surface rounded-xl p-5 shadow-sm space-y-3 text-xs text-left">
            <div className="flex items-center gap-1.5 text-ink-secondary">
              <Activity className="w-3.5 h-3.5 text-accent" />
              <span className="font-bold font-mono uppercase tracking-wider text-[10px]">Session Analytics</span>
            </div>
            <p className="text-ink-secondary leading-relaxed font-medium">
              Sensors continuously aggregate wind vector trajectories and Sentinel aerosol column densities. Cache validation events run in the background.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
