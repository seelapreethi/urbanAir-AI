"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, FileText, CheckCircle, ShieldAlert, Heart, TrendingUp, AlertCircle } from "lucide-react";
import { useCityStore } from "@/store/city";
import { apiClient } from "@/lib/api-client";

interface SummaryData {
  city: string;
  health_score: number;
  ai_summary: string;
  dominant_pollutant: string;
  aqi_category: string;
  confidence_score: number;
}

interface IntelligenceSummary {
  current_situation: string;
  major_cause: string;
  expected_trend: string;
  recommended_action: string;
  health_impact: string;
  government_priority: string;
}

interface AISummaryCardProps {
  summary?: SummaryData;
}

export function AISummaryCard({}: AISummaryCardProps) {
  const { selectedCity } = useCityStore();
  const [intelSummary, setIntelSummary] = useState<IntelligenceSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSummary() {
      setLoading(true);
      try {
        const res = await apiClient.get<{ data: IntelligenceSummary }>(`/intelligence/summary?city=${selectedCity}`);
        if (res.data?.data) {
          setIntelSummary(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load intelligence summary:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, [selectedCity]);

  if (loading) {
    return (
      <div className="h-44 rounded-xl border border-border/80 bg-[#111419]/90 animate-pulse flex items-center justify-center text-xs text-slate-500 font-medium">
        Analyzing air quality trends...
      </div>
    );
  }

  const data = intelSummary;
  if (!data) return null;

  return (
    <div className="border border-border/80 bg-[#111419]/80 backdrop-blur-md rounded-xl p-5 relative overflow-hidden flex flex-col gap-4 text-left shadow-lg shadow-black/10">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500/80" />
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-3 pl-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-950/30 border border-teal-500/25 text-[10px] font-bold text-teal-400 tracking-wider uppercase font-display">
          <Sparkles className="w-3.5 h-3.5" />
          {"Environmental Intelligence Audit"}
        </div>
        <span className="text-[9px] font-mono text-slate-500 font-bold tracking-widest uppercase">
          MUNICIPAL REPORT // {selectedCity.toUpperCase()}
        </span>
      </div>

      {/* Structured Government Report Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs pl-1">
        {/* Situation */}
        <div className="space-y-1">
          <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest block font-display flex items-center gap-1">
            <FileText className="w-3 h-3 text-teal-500" />
            Current Situation
          </span>
          <p className="text-slate-300 leading-relaxed font-sans font-medium">{data.current_situation}</p>
        </div>

        {/* Cause */}
        <div className="space-y-1">
          <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest block font-display flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            Major Cause
          </span>
          <p className="text-slate-300 leading-relaxed font-sans font-medium">{data.major_cause}</p>
        </div>

        {/* Trend */}
        <div className="space-y-1">
          <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest block font-display flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-sky-400" />
            Expected Trend
          </span>
          <p className="text-slate-300 leading-relaxed font-sans font-medium">{data.expected_trend}</p>
        </div>

        {/* Action */}
        <div className="space-y-1 border-t border-border/40 pt-3 md:border-t-0">
          <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest block font-display flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            Recommended Action
          </span>
          <p className="text-slate-300 leading-relaxed font-sans font-medium">{data.recommended_action}</p>
        </div>

        {/* Health */}
        <div className="space-y-1 border-t border-border/40 pt-3 md:border-t-0">
          <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest block font-display flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-500" />
            Health Impact
          </span>
          <p className="text-slate-300 leading-relaxed font-sans font-medium">{data.health_impact}</p>
        </div>

        {/* Priority */}
        <div className="space-y-1 border-t border-border/40 pt-3 md:border-t-0">
          <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest block font-display flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-teal-400" />
            Government Priority
          </span>
          <p className="text-slate-300 leading-relaxed font-sans font-medium">{data.government_priority}</p>
        </div>
      </div>
    </div>
  );
}
