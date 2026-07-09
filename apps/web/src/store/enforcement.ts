import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

export interface EnforcementSummary {
  city: string;
  critical_hotspots_count: number;
  high_priority_hotspots_count: number;
  total_active_hotspots: number;
  priority_alerts: string[];
}

export interface EnforcementHotspot {
  hotspot_id: string;
  latitude: number;
  longitude: number;
  severity: number;
  estimated_source: string;
  radius: number;
  confidence_score: number;
  priority_level: string;
  priority_score: number;
  suggested_visit_order: number;
}

export interface EnforcementRecommendation {
  recommendation_id: string;
  hotspot_id: string | null;
  priority: string;
  action_text: string;
  estimated_aqi_improvement: number;
  expected_duration: string;
  responsible_authority: string;
  required_resources: string;
  confidence_score: number;
  supporting_evidence: string;
}

export interface DispatchRoutePoint {
  hotspot_id: string;
  latitude: number;
  longitude: number;
  severity: number;
  estimated_source: string;
  radius: number;
  confidence_score: number;
  suggested_visit_order: number;
  distance_from_center_km: number;
}

export interface EvidenceCard {
  hotspot_id: string;
  severity: number;
  estimated_source: string;
  aqi_trend: number[];
  wind_dispersion: string;
  traffic_levels: string;
  historical_events: string;
}

interface EnforcementState {
  selectedHotspotId: string | null;
  enforcementSummary: EnforcementSummary | null;
  hotspots: EnforcementHotspot[];
  recommendations: EnforcementRecommendation[];
  dispatchRoutes: DispatchRoutePoint[];
  evidenceDetails: EvidenceCard | null;
  inspectionsCompleted: Record<string, boolean>; // workflow complete status trackers
  isLoading: boolean;
  error: string | null;

  selectHotspot: (hotspotId: string | null, city: string) => Promise<void>;
  fetchEnforcementData: (city: string) => Promise<void>;
  toggleInspectionCompleted: (recId: string) => void;
  resetEnforcementState: () => void;
}

export const useEnforcementStore = create<EnforcementState>((set, get) => ({
  selectedHotspotId: null,
  enforcementSummary: null,
  hotspots: [],
  recommendations: [],
  dispatchRoutes: [],
  evidenceDetails: null,
  inspectionsCompleted: {},
  isLoading: false,
  error: null,

  selectHotspot: async (hotspotId, city) => {
    set({ selectedHotspotId: hotspotId });
    if (!hotspotId) {
      set({ evidenceDetails: null });
      return;
    }
    try {
      const res = await apiClient.get<EvidenceCard>(
        `/enforcement/evidence?city=${city}&hotspot_id=${hotspotId}`
      );
      set({ evidenceDetails: res.data || null });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load evidence details.";
      set({ error: errMsg });
    }
  },

  fetchEnforcementData: async (city) => {
    set({ isLoading: true, error: null, selectedHotspotId: null, evidenceDetails: null });
    try {
      const [summaryRes, hotspotsRes, recsRes, routesRes] = await Promise.all([
        apiClient.get<EnforcementSummary>(`/enforcement?city=${city}`),
        apiClient.get<EnforcementHotspot[]>(`/enforcement/hotspots?city=${city}`),
        apiClient.get<EnforcementRecommendation[]>(`/enforcement/recommendations?city=${city}`),
        apiClient.get<DispatchRoutePoint[]>(`/enforcement/routes?city=${city}`)
      ]);

      // Initialize missing inspections progress trackers
      const currentCompleted = get().inspectionsCompleted;
      const nextCompleted = { ...currentCompleted };
      const recs = recsRes.data || [];
      recs.forEach((rec) => {
        if (nextCompleted[rec.recommendation_id] === undefined) {
          nextCompleted[rec.recommendation_id] = false;
        }
      });

      set({
        enforcementSummary: summaryRes.data || null,
        hotspots: hotspotsRes.data || [],
        recommendations: recs,
        dispatchRoutes: routesRes.data || [],
        inspectionsCompleted: nextCompleted,
        isLoading: false
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load enforcement matrices.";
      set({
        error: errMsg,
        isLoading: false
      });
    }
  },

  toggleInspectionCompleted: (recId) => {
    const nextVal = !get().inspectionsCompleted[recId];
    set((state) => ({
      inspectionsCompleted: {
        ...state.inspectionsCompleted,
        [recId]: nextVal
      }
    }));
  },

  resetEnforcementState: () => set({
    selectedHotspotId: null,
    enforcementSummary: null,
    hotspots: [],
    recommendations: [],
    dispatchRoutes: [],
    evidenceDetails: null,
    inspectionsCompleted: {},
    isLoading: false,
    error: null
  })
}));
