import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

export interface IntelligenceSummary {
  current_situation: string;
  major_cause: string;
  expected_trend: string;
  recommended_action: string;
  health_impact: string;
  government_priority: string;
}

export interface RootCauseItem {
  name: string;
  percentage: number;
}

export interface RootCauseData {
  city: string;
  root_causes: RootCauseItem[];
  dominant_cause: string;
}

export interface RecommendationItem {
  action: string;
  priority: string;
  expected_aqi_improvement: number;
  affected_wards: string[];
  confidence: number;
  estimated_impact: string;
}

export interface TimelineItem {
  time_frame: string;
  aqi: number;
  summary: string;
}

export interface RiskItem {
  group: string;
  severity: string;
  reason: string;
  recommendation: string;
}

export interface ConfidenceData {
  confidence_percentage: number;
  reason: string;
  supporting_evidence: string;
  data_sources_used: string[];
}

interface IntelligenceState {
  summary: IntelligenceSummary | null;
  rootCause: RootCauseData | null;
  recommendations: RecommendationItem[];
  timeline: TimelineItem[];
  risks: RiskItem[];
  confidence: ConfidenceData | null;
  isLoading: boolean;
  error: string | null;

  fetchIntelligenceData: (city: string) => Promise<void>;
  resetIntelligenceState: () => void;
}

export const useIntelligenceStore = create<IntelligenceState>((set) => ({
  summary: null,
  rootCause: null,
  recommendations: [],
  timeline: [],
  risks: [],
  confidence: null,
  isLoading: false,
  error: null,

  fetchIntelligenceData: async (city) => {
    set({ isLoading: true, error: null });
    try {
      const [summaryRes, rootCauseRes, recsRes, timelineRes, risksRes, confidenceRes] = await Promise.all([
        apiClient.get<{ data: IntelligenceSummary }>(`/intelligence/summary?city=${city}`),
        apiClient.get<{ data: RootCauseData }>(`/intelligence/root-cause?city=${city}`),
        apiClient.get<{ data: RecommendationItem[] }>(`/intelligence/recommendations?city=${city}`),
        apiClient.get<{ data: TimelineItem[] }>(`/intelligence/timeline?city=${city}`),
        apiClient.get<{ data: RiskItem[] }>(`/intelligence/risks?city=${city}`),
        apiClient.get<{ data: ConfidenceData }>(`/intelligence/confidence?city=${city}`)
      ]);

      set({
        summary: summaryRes.data?.data || null,
        rootCause: rootCauseRes.data?.data || null,
        recommendations: recsRes.data?.data || [],
        timeline: timelineRes.data?.data || [],
        risks: risksRes.data?.data || [],
        confidence: confidenceRes.data?.data || null,
        isLoading: false
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load intelligence metrics.";
      set({ error: errMsg, isLoading: false });
    }
  },

  resetIntelligenceState: () => set({
    summary: null,
    rootCause: null,
    recommendations: [],
    timeline: [],
    risks: [],
    confidence: null,
    isLoading: false,
    error: null
  })
}));
