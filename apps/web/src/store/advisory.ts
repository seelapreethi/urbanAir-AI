import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

export interface AdvisoryDetails {
  user_group: string;
  risk_level_mapped: string;
  outdoor_activity_advice: string;
  mask_recommendation: string;
  ventilation_advice: string;
}

export interface RiskClassification {
  aqi: number;
  risk_level: string;
  affected_population_pct: number;
  confidence_score: number;
}

export interface HealthAdvisorySummary {
  city: string;
  current_aqi: number;
  risk_classification: RiskClassification;
  advisory: AdvisoryDetails;
  dominant_pollutant: string;
  emergency_active: boolean;
}

export interface RiskDemographic {
  group: string;
  risk: string;
}

export interface RiskBreakdown {
  aqi: number;
  risk_level: string;
  affected_population_pct: number;
  confidence_score: number;
  population_demographics: RiskDemographic[];
}

export interface HealthNotification {
  id: string;
  alert_title: string;
  alert_content: string;
  severity: string;
  created_at: string;
}

interface AdvisoryState {
  selectedUserGroup: string;
  selectedLanguage: string;
  advisorySummary: HealthAdvisorySummary | null;
  riskBreakdown: RiskBreakdown | null;
  notifications: HealthNotification[];
  isLoading: boolean;
  error: string | null;

  setUserGroup: (group: string) => void;
  setLanguage: (lang: string) => void;
  fetchAdvisoryData: (city: string, group?: string) => Promise<void>;
  resetAdvisoryState: () => void;
}

export const useAdvisoryStore = create<AdvisoryState>((set, get) => ({
  selectedUserGroup: "General Public",
  selectedLanguage: "en",
  advisorySummary: null,
  riskBreakdown: null,
  notifications: [],
  isLoading: false,
  error: null,

  setUserGroup: (group) => {
    set({ selectedUserGroup: group });
  },

  setLanguage: (lang) => {
    set({ selectedLanguage: lang });
  },

  fetchAdvisoryData: async (city, group) => {
    const activeGroup = group || get().selectedUserGroup;
    set({ isLoading: true, error: null });
    try {
      const [summaryRes, riskRes, notificationsRes] = await Promise.all([
        apiClient.get<HealthAdvisorySummary>(`/advisory?city=${city}&user_group=${activeGroup}`),
        apiClient.get<RiskBreakdown>(`/advisory/risk?city=${city}`),
        apiClient.get<HealthNotification[]>(`/advisory/notifications?city=${city}`)
      ]);

      set({
        advisorySummary: summaryRes.data || null,
        riskBreakdown: riskRes.data || null,
        notifications: notificationsRes.data || [],
        isLoading: false
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load public health metrics.";
      set({
        error: errMsg,
        isLoading: false
      });
    }
  },

  resetAdvisoryState: () => set({
    selectedUserGroup: "General Public",
    selectedLanguage: "en",
    advisorySummary: null,
    riskBreakdown: null,
    notifications: [],
    isLoading: false,
    error: null
  })
}));
