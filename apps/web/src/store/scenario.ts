import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
}

export interface SimulationResultDetails {
  before_aqi: number;
  after_aqi: number;
  expected_improvement: number;
  affected_population_saved_pct: number;
  confidence_score: number;
  recommendation_text: string;
  environmental_gain: string;
}

export interface SimulationApiResponse {
  status: string;
  inputs: Record<string, unknown>;
  results: SimulationResultDetails;
}

interface ScenarioState {
  scenarios: ScenarioDefinition[];
  trafficReduction: number;
  constructionReduction: number;
  industrialEmission: number;
  greenCover: number;
  windSpeed: number;
  rainfall: number;
  simulationResult: SimulationResultDetails | null;
  isLoading: boolean;
  error: string | null;

  setTrafficReduction: (val: number) => void;
  setConstructionReduction: (val: number) => void;
  setIndustrialEmission: (val: number) => void;
  setGreenCover: (val: number) => void;
  setWindSpeed: (val: number) => void;
  setRainfall: (val: number) => void;
  fetchScenarios: (city: string) => Promise<void>;
  runSimulation: (city: string) => Promise<void>;
  resetScenarioState: () => void;
}

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  scenarios: [],
  trafficReduction: 0,
  constructionReduction: 0,
  industrialEmission: 0,
  greenCover: 0,
  windSpeed: 12,
  rainfall: 0,
  simulationResult: null,
  isLoading: false,
  error: null,

  setTrafficReduction: (val) => set({ trafficReduction: val }),
  setConstructionReduction: (val) => set({ constructionReduction: val }),
  setIndustrialEmission: (val) => set({ industrialEmission: val }),
  setGreenCover: (val) => set({ greenCover: val }),
  setWindSpeed: (val) => set({ windSpeed: val }),
  setRainfall: (val) => set({ rainfall: val }),

  fetchScenarios: async (city) => {
    set({ isLoading: true, error: null });
    try {
      const [listRes, resultsRes] = await Promise.all([
        apiClient.get<ScenarioDefinition[]>("/scenario"),
        apiClient.get<SimulationResultDetails>(`/scenario/results?city=${city}`)
      ]);
      set({
        scenarios: listRes.data || [],
        simulationResult: resultsRes.data || null,
        isLoading: false
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load scenarios list.";
      set({ error: errMsg, isLoading: false });
    }
  },

  runSimulation: async (city) => {
    const state = get();
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.post<SimulationApiResponse>("/scenario/run", {
        city,
        traffic_reduction: state.trafficReduction,
        construction_reduction: state.constructionReduction,
        industrial_emission: state.industrialEmission,
        green_cover: state.greenCover,
        wind_speed: state.windSpeed,
        rainfall: state.rainfall
      });
      set({
        simulationResult: res.data?.results || null,
        isLoading: false
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to run scenario simulation.";
      set({ error: errMsg, isLoading: false });
    }
  },

  resetScenarioState: () => set({
    scenarios: [],
    trafficReduction: 0,
    constructionReduction: 0,
    industrialEmission: 0,
    greenCover: 0,
    windSpeed: 12,
    rainfall: 0,
    simulationResult: null,
    isLoading: false,
    error: null
  })
}));
