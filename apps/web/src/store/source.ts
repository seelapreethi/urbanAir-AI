import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

export interface SourceAttributionSummary {
  city: string;
  latitude: number;
  longitude: number;
  contributions: Record<string, number>;
  dominant_source: string;
  confidence_score: number;
  evidence: string;
}

export interface MapSourcePoint {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  intensity: number;
  influence_radius: number;
  confidence: number;
}

export interface SourceDetailCard {
  id: string;
  name: string;
  type: string;
  contribution_pct: number;
  confidence_score: number;
  supporting_evidence: string;
  weather_impact: string;
  historical_trend: string;
  suggested_action: string;
}

export interface ContributorItem {
  source: string;
  percentage: number;
}

interface SourceState {
  selectedSourceId: string | null;
  attributionSummary: SourceAttributionSummary | null;
  mapSources: MapSourcePoint[];
  sourceDetails: SourceDetailCard | null;
  contributors: ContributorItem[];
  isLoading: boolean;
  error: string | null;

  selectSource: (sourceId: string | null, city: string) => Promise<void>;
  fetchSourceData: (city: string) => Promise<void>;
  resetSourceState: () => void;
}

export const useSourceStore = create<SourceState>((set) => ({
  selectedSourceId: null,
  attributionSummary: null,
  mapSources: [],
  sourceDetails: null,
  contributors: [],
  isLoading: false,
  error: null,

  selectSource: async (sourceId, city) => {
    set({ selectedSourceId: sourceId });
    if (!sourceId) {
      set({ sourceDetails: null });
      return;
    }
    try {
      const res = await apiClient.get<SourceDetailCard>(
        `/source-attribution/details?city=${city}&source_id=${sourceId}`
      );
      set({ sourceDetails: res.data || null });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load source details.";
      set({ error: errMsg });
    }
  },

  fetchSourceData: async (city) => {
    set({ isLoading: true, error: null, selectedSourceId: null, sourceDetails: null });
    try {
      const [summaryRes, mapRes, contributorsRes] = await Promise.all([
        apiClient.get<SourceAttributionSummary>(`/source-attribution?city=${city}`),
        apiClient.get<MapSourcePoint[]>(`/source-attribution/map?city=${city}`),
        apiClient.get<ContributorItem[]>(`/source-attribution/contributors?city=${city}`)
      ]);

      set({
        attributionSummary: summaryRes.data || null,
        mapSources: mapRes.data || [],
        contributors: contributorsRes.data || [],
        isLoading: false
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to retrieve attribution metrics.";
      set({
        error: errMsg,
        isLoading: false
      });
    }
  },

  resetSourceState: () => set({
    selectedSourceId: null,
    attributionSummary: null,
    mapSources: [],
    sourceDetails: null,
    contributors: [],
    isLoading: false,
    error: null
  })
}));
