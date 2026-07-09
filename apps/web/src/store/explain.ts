import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
}

export interface DecisionTraceDetails {
  target: string;
  why_generated: string;
  evidence_used: string;
  confidence: number;
  alternatives: string;
}

export interface ModelDetails {
  model_name: string;
  version: string;
  training_date: string;
  inference_time_ms: number;
  training_accuracy_r2: number;
  data_sources: string[];
}

export interface ExplainabilitySummary {
  feature_importances: FeatureImportanceItem[];
  decision_trace: DecisionTraceDetails;
  accuracy_score_r2: number;
  last_calibration: string;
}

interface ExplainState {
  featureImportances: FeatureImportanceItem[];
  decisionTrace: DecisionTraceDetails | null;
  modelDetails: ModelDetails | null;
  accuracyScore: number;
  lastCalibration: string;
  isLoading: boolean;
  error: string | null;

  fetchExplainData: (area: string) => Promise<void>;
  resetExplainState: () => void;
}

export const useExplainStore = create<ExplainState>((set) => ({
  featureImportances: [],
  decisionTrace: null,
  modelDetails: null,
  accuracyScore: 0.942,
  lastCalibration: "2 hours ago",
  isLoading: false,
  error: null,

  fetchExplainData: async (area) => {
    set({ isLoading: true, error: null });
    try {
      const [summaryRes, detailsRes] = await Promise.all([
        apiClient.get<ExplainabilitySummary>(`/explain?area=${area}`),
        apiClient.get<ModelDetails>("/explain/model")
      ]);

      set({
        featureImportances: summaryRes.data?.feature_importances || [],
        decisionTrace: summaryRes.data?.decision_trace || null,
        modelDetails: detailsRes.data || null,
        accuracyScore: summaryRes.data?.accuracy_score_r2 || 0.942,
        lastCalibration: summaryRes.data?.last_calibration || "2 hours ago",
        isLoading: false
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load explainability telemetry.";
      set({ error: errMsg, isLoading: false });
    }
  },

  resetExplainState: () => set({
    featureImportances: [],
    decisionTrace: null,
    modelDetails: null,
    accuracyScore: 0.942,
    lastCalibration: "2 hours ago",
    isLoading: false,
    error: null
  })
}));
