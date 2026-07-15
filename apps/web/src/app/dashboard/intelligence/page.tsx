"use client";

import React, { useEffect, useState } from "react";
import { useCityStore } from "@/store/city";
import { useIntelligenceStore } from "@/store/intelligence";
import { 
  Loader2, Brain, Compass, 
  ShieldAlert, Heart, Calendar, 
  RefreshCw, CheckCircle, Database 
} from "lucide-react";
import { motion } from "framer-motion";

export default function AIIntelligencePage() {
  const { selectedCity } = useCityStore();
  const {
    summary,
    rootCause,
    recommendations,
    timeline,
    risks,
    confidence,
    isLoading,
    error,
    fetchIntelligenceData
  } = useIntelligenceStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchIntelligenceData(selectedCity);
    }
  }, [selectedCity, fetchIntelligenceData, mounted]);

  const handleRefresh = async () => {
    await fetchIntelligenceData(selectedCity);
  };

  if (!mounted) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-rose-950/20 border-rose-500/25 text-rose-400";
      case "high":
        return "bg-amber-950/20 border-amber-500/25 text-amber-400";
      default:
        return "bg-teal-950/20 border-teal-500/25 text-teal-400";
    }
  };

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto select-none">
      {/* Subheader Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border/80 bg-[#111419]/90 backdrop-blur-md rounded-xl text-xs shadow-sm gap-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-teal-400 animate-pulse" />
          <span className="font-bold text-slate-100 text-sm font-display uppercase tracking-wider">AI Intelligence Workspace</span>
        </div>
        <span className="font-mono text-slate-500 uppercase tracking-widest text-[9.5px]">
          Diagnostic & Prognostic telemetry // {selectedCity.toUpperCase()}
        </span>
      </div>

      {/* Main Content Area */}
      {error && (
        <div className="border border-rose-500/25 bg-rose-950/5 rounded-xl p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-6">
          <ShieldAlert className="w-10 h-10 text-rose-500 mb-3 animate-bounce" />
          <h4 className="text-sm font-bold text-slate-100 mb-1">Inference Engine Connection Lost</h4>
          <p className="text-xs text-slate-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="h-8 px-4 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-950/60 transition-all inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Connection
          </button>
        </div>
      )}

      {isLoading && !error && (
        <div className="flex flex-col items-center justify-center p-12 bg-[#111419]/80 border border-border rounded-xl shadow-sm min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-4" />
          <span className="text-xs font-semibold text-slate-400">Compiling neural diagnostic reports...</span>
        </div>
      )}

      {!isLoading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Column: Summary, Root Causes, Recommendations */}
          <div className="lg:col-span-8 space-y-6">
            {/* Executive Summary Block */}
            {summary && (
              <div className="bg-[#111419]/80 border border-border rounded-xl p-5 shadow-sm text-left">
                <div className="flex items-center gap-1.5 border-b border-border/40 pb-2.5 mb-4">
                  <Brain className="w-4 h-4 text-teal-400" />
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-display">Executive Summary</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest font-display block">Situation</span>
                    <p className="text-slate-300 leading-relaxed font-sans font-medium">{summary.current_situation}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest font-display block">Primary Cause</span>
                    <p className="text-slate-300 leading-relaxed font-sans font-medium">{summary.major_cause}</p>
                  </div>
                  <div className="space-y-1 border-t border-border/40 pt-3 sm:border-t-0">
                    <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest font-display block">Expected Trend</span>
                    <p className="text-slate-300 leading-relaxed font-sans font-medium">{summary.expected_trend}</p>
                  </div>
                  <div className="space-y-1 border-t border-border/40 pt-3 sm:border-t-0">
                    <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest font-display block">Government Priority</span>
                    <p className="text-slate-300 leading-relaxed font-sans font-medium">{summary.government_priority}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Root Cause Cards */}
            {rootCause && (
              <div className="bg-[#111419]/80 border border-border rounded-xl p-5 shadow-sm text-left">
                <div className="flex items-center gap-1.5 border-b border-border/40 pb-2.5 mb-4">
                  <Compass className="w-4 h-4 text-teal-400" />
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-display">Root Cause Analysis</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {rootCause.root_causes.map((c, idx) => (
                    <div key={idx} className="border border-border/60 bg-slate-900/30 rounded-xl p-3.5 flex flex-col justify-between h-24">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-display block truncate">{c.name}</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black font-display text-slate-100">{c.percentage}%</span>
                        <span className="text-[9.5px] text-slate-500 font-mono">load</span>
                      </div>
                      <div className="w-full bg-border/40 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 rounded-full transition-all duration-500" 
                          style={{ width: `${c.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Government Policy Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-[#111419]/80 border border-border rounded-xl p-5 shadow-sm text-left">
                <div className="flex items-center justify-between border-b border-border/40 pb-2.5 mb-4">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-display">Government Recommendations</h3>
                  </div>
                  <span className="text-[9.5px] text-slate-500 font-mono">Ranked by expected gain</span>
                </div>
                <div className="space-y-3">
                  {recommendations.map((r, idx) => (
                    <div key={idx} className="border border-border/40 rounded-xl p-4 bg-slate-900/10 hover:border-teal-500/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                            r.priority === "High" ? "bg-rose-950/20 text-rose-400 border border-rose-500/25" : "bg-teal-950/20 text-teal-400 border border-teal-500/25"
                          }`}>
                            {r.priority} Priority
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Impact: -{r.expected_aqi_improvement} AQI</span>
                        </div>
                        <p className="text-xs font-bold text-slate-200">{r.action}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {r.affected_wards.map((w, wIdx) => (
                            <span key={wIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-[#111419] border border-border text-slate-400 font-medium">{w}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between border-t border-border/20 pt-2 sm:border-none sm:pt-0">
                        <span className="text-[10px] text-slate-500 font-mono">Confidence rating</span>
                        <span className="text-sm font-black font-mono text-teal-400">{r.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Timeline, Confidence Engine, Risks */}
          <div className="lg:col-span-4 space-y-6">
            {/* Confidence Engine Meter */}
            {confidence && (
              <div className="bg-[#111419]/80 border border-border rounded-xl p-5 shadow-sm text-left">
                <div className="flex items-center gap-1.5 border-b border-border/40 pb-2.5 mb-4">
                  <Database className="w-4 h-4 text-teal-400" />
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-display">Confidence Diagnostics</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full border-4 border-dashed border-teal-500/80 flex items-center justify-center font-mono font-black text-lg text-slate-100">
                      {confidence.confidence_percentage}%
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <span className="font-bold text-slate-200">Prediction Integrity</span>
                      <p className="text-slate-400 leading-snug">{confidence.reason}</p>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 bg-slate-900/30 border border-border/40 p-2.5 rounded-lg leading-relaxed">
                    <strong>Evidence:</strong> {confidence.supporting_evidence}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest block font-display">Data Feeds Audited</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {confidence.data_sources_used.map((s, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-1 rounded bg-[#111419] border border-border/45 text-slate-300 truncate font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Risks Intelligence Matrix */}
            {risks.length > 0 && (
              <div className="bg-[#111419]/80 border border-border rounded-xl p-5 shadow-sm text-left">
                <div className="flex items-center gap-1.5 border-b border-border/40 pb-2.5 mb-4">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-display">Risk Intelligence</h3>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
                  {risks.map((risk, idx) => (
                    <div key={idx} className="border border-border/40 rounded-xl p-3 bg-slate-900/30 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200">{risk.group}</span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded font-mono ${getSeverityStyle(risk.severity)}`}>
                          {risk.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{risk.reason}</p>
                      <div className="text-[10px] text-slate-500 border-t border-border/20 pt-1 mt-1 leading-snug">
                        <strong>Advice:</strong> {risk.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Projections */}
            {timeline.length > 0 && (
              <div className="bg-[#111419]/80 border border-border rounded-xl p-5 shadow-sm text-left">
                <div className="flex items-center gap-1.5 border-b border-border/40 pb-2.5 mb-4">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-display">Prognostic Timeline</h3>
                </div>
                <div className="space-y-4 relative pl-3.5 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
                  {timeline.map((t, idx) => (
                    <div key={idx} className="relative text-xs space-y-1">
                      <div className="absolute -left-[18px] top-1.5 w-2 h-2 rounded-full bg-teal-400 border border-canvas" />
                      <div className="flex justify-between items-center font-mono">
                        <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">{t.time_frame}</span>
                        <span className="font-bold text-teal-400">AQI {t.aqi}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{t.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
