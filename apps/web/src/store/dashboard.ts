import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

interface DashboardFilters {
  dateRange: string; // e.g. "today", "7d", "30d"
  pollutant: string; // e.g. "all", "PM2.5", "PM10"
  riskLevel: string; // e.g. "all", "low", "medium", "high"
}

interface DashboardState {
  filters: DashboardFilters;
  dashboardData: Record<string, unknown> | null;
  isLoading: boolean;
  error: string | null;
  setFilter: (key: keyof DashboardFilters, value: string) => void;
  fetchDashboardData: (city: string) => Promise<void>;
  resetFilters: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  filters: {
    dateRange: "today",
    pollutant: "all",
    riskLevel: "all",
  },
  dashboardData: null,
  isLoading: false,
  error: null,
  
  setFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
  },

  fetchDashboardData: async (city) => {
    set({ isLoading: true, error: null });
    try {
      // Query aggregated dashboard mock data endpoint
      const response = await apiClient.get<Record<string, unknown>>(`/dashboard?city=${encodeURIComponent(city)}`);
      if (response.success && response.data) {
        set({ dashboardData: response.data, isLoading: false });
      } else {
        throw new Error(response.message || "Failed to load dashboard data");
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to fetch dashboard metrics";
      set({ error: errMsg, isLoading: false });
    }
  },

  resetFilters: () => {
    set({
      filters: {
        dateRange: "today",
        pollutant: "all",
        riskLevel: "all",
      },
    });
  },
}));
