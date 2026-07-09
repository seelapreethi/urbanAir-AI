"use client";

import React, { useEffect, useState } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useCityStore } from "@/store/city";
import { useForecastStore } from "@/store/forecast";
import {
  TrendingUp,
  Brain,
  Sliders,
  Wind,
  Droplets,
  CheckCircle,
  Clock,
  Sparkles,
  Info,
  Loader2
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function ForecastPage() {
  const { selectedCity } = useCityStore();
  const {
    selectedModel,
    forecastSummary,
    hourlyForecast,
    dailyForecast,
    wardForecasts,
    weatherForecast,
    recommendations,
    confidenceMetrics,
    isLoading,
    error,
    setModel,
    fetchForecastData
  } = useForecastStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchForecastData(selectedCity, selectedModel);
    }
  }, [selectedCity, selectedModel, fetchForecastData, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas text-ink-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    if (risk === "Low") return "bg-[#10B981]/15 text-[#10B981]";
    if (risk === "Moderate") return "bg-[#F59E0B]/15 text-[#F59E0B]";
    if (risk === "High") return "bg-[#EF4444]/15 text-[#EF4444]";
    return "bg-[#8B5CF6]/15 text-[#8B5CF6]";
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "High") return "bg-danger/10 text-danger border border-danger/20";
    if (priority === "Medium") return "bg-warning/10 text-warning border border-warning/20";
    return "bg-info/10 text-info border border-info/20";
  };

  return (
    <RouteGuard>
      <div className="h-screen w-screen bg-canvas text-ink-primary flex overflow-hidden font-sans">
        {/* Left Side App Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Right Dashboard Workspace */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <Header onOpenMobileDrawer={() => {}} />

          {/* Sub-Header Toolbar */}
          <div className="flex items-center justify-between gap-4 p-4 border-b border-border bg-surface text-xs z-20">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent animate-pulse" />
              <span className="font-bold text-ink-primary text-sm font-display">Hyperlocal Forecasting Engine</span>
            </div>
            
            {/* Model Selector Selector */}
            <div className="flex items-center gap-2">
              <span className="text-ink-tertiary font-mono uppercase tracking-wider">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setModel(e.target.value)}
                className="h-8 px-3 rounded border border-border bg-canvas text-ink-primary outline-none focus:border-accent font-semibold transition-colors"
              >
                <option value="xgboost">XGBoost Regressor (Complex Intersections)</option>
                <option value="prophet">Prophet additive model (Seasonality/Holidays)</option>
                <option value="random_forest">RandomForest Ensemble (Stable averages)</option>
              </select>
            </div>
          </div>

          {/* Scrolling Main Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {error && (
              <div className="bg-danger-soft border border-danger/20 text-danger text-xs p-3.5 rounded-xl">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center p-8 bg-surface border border-border rounded-xl">
                <Loader2 className="w-6 h-6 animate-spin text-accent mr-3" />
                <span className="text-xs font-semibold text-ink-secondary">Predicting upcoming air metrics...</span>
              </div>
            )}

            {!isLoading && forecastSummary && (
              <>
                {/* 1. Overview Prediction Timelines cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(forecastSummary.predictions).map(([periodKey, value]) => (
                    <div
                      key={periodKey}
                      className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px] shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">
                            Forecast {periodKey}
                          </span>
                          <span className="text-2xl font-black font-mono text-ink-primary mt-1 block">
                            AQI {value.aqi}
                          </span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${getRiskColor(value.risk)}`}>
                          {value.risk} Risk
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-ink-secondary">Dominant Pollutant:</span>
                          <span className="font-bold text-accent font-mono">{value.pollutant}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-ink-secondary">Confidence rating:</span>
                          <span className="font-semibold font-mono text-ink-primary">{value.confidence}%</span>
                        </div>
                        <div className="flex justify-between text-xs border-t border-border/40 pt-1.5">
                          <span className="text-ink-tertiary">Interval range (95% CI):</span>
                          <span className="font-mono text-ink-tertiary">{value.interval[0]} - {value.interval[1]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. AI Explanation Panel */}
                <div className="border border-accent/20 bg-accent-soft rounded-xl p-5 flex gap-4 items-start shadow-sm">
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-accent flex-shrink-0">
                    <Brain className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider font-mono">Cognitive Explanations</span>
                      <span className="text-[10px] text-ink-tertiary font-mono">| Active engine: {forecastSummary.model_selected}</span>
                    </div>
                    <p className="text-sm text-ink-primary leading-relaxed font-sans font-medium">
                      {forecastSummary.ai_explanation}
                    </p>
                  </div>
                </div>

                {/* 3. Recharts Hourly predictions area curve & Daily range intervals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Hourly area curve */}
                  <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">24-Hour Projected Trend</h4>
                    </div>
                    <div className="h-[250px] w-full text-[10px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={hourlyForecast} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                          <defs>
                            <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
                          <XAxis dataKey="timestamp" stroke="var(--color-ink-tertiary)" tickLine={false} />
                          <YAxis stroke="var(--color-ink-tertiary)" tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--color-surface)",
                              borderColor: "var(--color-border)",
                              fontSize: "11px",
                              color: "var(--color-ink-primary)"
                            }}
                          />
                          <Area type="monotone" dataKey="predicted_aqi" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorAqi)" name="Predicted AQI" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Daily 7-day range */}
                  <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-accent" />
                      <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">7-Day Weekly Intervals</h4>
                    </div>
                    <div className="h-[250px] w-full text-[10px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyForecast} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
                          <XAxis dataKey="date" stroke="var(--color-ink-tertiary)" tickLine={false} />
                          <YAxis stroke="var(--color-ink-tertiary)" tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--color-surface)",
                              borderColor: "var(--color-border)",
                              fontSize: "11px",
                              color: "var(--color-ink-primary)"
                            }}
                          />
                          <Line type="monotone" dataKey="max_aqi" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Max Range" />
                          <Line type="monotone" dataKey="mean_aqi" stroke="#10B981" strokeWidth={2.5} name="Mean AQI" />
                          <Line type="monotone" dataKey="min_aqi" stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Min Range" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* 4. Explainable AI Feature importances and Validation Accuracies */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Feature Importance weights */}
                  <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">Model Feature Importances (XAI)</h4>
                    </div>
                    {confidenceMetrics && (
                      <div className="h-[200px] w-full text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={confidenceMetrics.feature_importances} layout="vertical" margin={{ top: 5, right: 5, left: 45, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
                            <XAxis type="number" stroke="var(--color-ink-tertiary)" tickLine={false} />
                            <YAxis dataKey="name" type="category" stroke="var(--color-ink-tertiary)" tickLine={false} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "var(--color-surface)",
                                borderColor: "var(--color-border)",
                                fontSize: "11px",
                                color: "var(--color-ink-primary)"
                              }}
                            />
                            <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Weights" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* Historical Validation runs accuracy */}
                  <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-accent" />
                      <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">Prediction Reliability Validation</h4>
                    </div>
                    {confidenceMetrics && (
                      <div className="h-[200px] w-full text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={confidenceMetrics.historical_accuracy} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
                            <XAxis dataKey="date" stroke="var(--color-ink-tertiary)" tickLine={false} />
                            <YAxis stroke="var(--color-ink-tertiary)" tickLine={false} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "var(--color-surface)",
                                borderColor: "var(--color-border)",
                                fontSize: "11px",
                                color: "var(--color-ink-primary)"
                              }}
                            />
                            <Line type="monotone" dataKey="predicted" stroke="#3B82F6" strokeWidth={2} name="Predicted AQI" />
                            <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" name="Actual validation" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. 5-day Weather Forecast parameters */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">
                    5-Day Meteorological Forecast
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {weatherForecast.map((day, idx) => (
                      <div
                        key={idx}
                        className="bg-surface border border-border rounded-xl p-4 flex flex-col items-center justify-between text-center space-y-2"
                      >
                        <span className="text-xs font-bold text-ink-primary font-display">{day.date}</span>
                        <span className="text-lg font-black text-ink-primary font-mono">{day.temp}°C</span>
                        
                        <div className="w-full space-y-1 border-t border-border/40 pt-2 text-[10px] text-ink-secondary">
                          <div className="flex justify-between">
                            <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-accent" /> Wind</span>
                            <span className="font-semibold font-mono text-ink-primary">{day.wind_speed} km/h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-info" /> Humid</span>
                            <span className="font-semibold font-mono text-ink-primary">{day.humidity}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rain Prob</span>
                            <span className="font-semibold font-mono text-ink-primary">{day.rain_probability}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Ward Forecast Grid table list */}
                <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-accent" />
                    <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">Municipal Ward Predictions Grid</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border text-ink-tertiary">
                          <th className="py-2.5 font-bold">Ward Area</th>
                          <th className="py-2.5 font-bold font-mono text-center">Current</th>
                          <th className="py-2.5 font-bold font-mono text-center">24h Projection</th>
                          <th className="py-2.5 font-bold font-mono text-center">48h Projection</th>
                          <th className="py-2.5 font-bold font-mono text-center">72h Projection</th>
                          <th className="py-2.5 font-bold text-center">Trend Vector</th>
                          <th className="py-2.5 font-bold text-center">Confidence</th>
                          <th className="py-2.5 font-bold text-right">Risk Factor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wardForecasts.map((ward) => (
                          <tr key={ward.ward_id} className="border-b border-border/40 hover:bg-surface-raised transition-colors">
                            <td className="py-3 font-semibold text-ink-primary">{ward.ward_name}</td>
                            <td className="py-3 text-center font-bold font-mono text-ink-secondary">{ward.current_aqi}</td>
                            <td className="py-3 text-center font-bold font-mono text-accent">{ward.forecast_24h}</td>
                            <td className="py-3 text-center font-bold font-mono text-ink-primary">{ward.forecast_48h}</td>
                            <td className="py-3 text-center font-bold font-mono text-ink-primary">{ward.forecast_72h}</td>
                            <td className="py-3 text-center">
                              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                                ward.trend === "Improving"
                                  ? "bg-success/10 text-success"
                                  : "bg-danger/10 text-danger"
                              }`}>
                                {ward.trend}
                              </span>
                            </td>
                            <td className="py-3 text-center font-mono text-ink-tertiary">{ward.confidence_score}%</td>
                            <td className="py-3 text-right">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${getRiskColor(ward.risk_level)}`}>
                                {ward.risk_level}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 7. Action recommendations cards list */}
                <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">Forecasting Recommendations Engine</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.recommendation_id}
                        className="border border-border rounded-xl p-4 flex flex-col justify-between gap-3 hover:border-accent/40 transition-colors"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-xs text-ink-primary leading-relaxed font-semibold">
                            {rec.action_text}
                          </p>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider font-mono flex-shrink-0 ${getPriorityColor(rec.priority)}`}>
                            {rec.priority}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] border-t border-border/40 pt-2.5">
                          <span className="text-ink-tertiary">Confidence: <span className="font-semibold text-ink-secondary">{rec.confidence_score}%</span></span>
                          <span className="text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full font-bold">
                            -{rec.expected_aqi_improvement} AQI reduction
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
