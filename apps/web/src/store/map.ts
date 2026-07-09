import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

// City centers mapping
const CITY_CENTERS: Record<string, [number, number]> = {
  Vijayawada: [16.5062, 80.6480],
  Hyderabad: [17.3850, 78.4867],
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Delhi: [28.6139, 77.2090],
};

export interface AQIStation {
  station_id: string;
  station_name: string;
  latitude: number;
  longitude: number;
  aqi: number;
  dominant_pollutant: string;
  temp: number;
  humidity: number;
  wind_speed: number;
  last_updated: string;
  is_active: boolean;
}

export interface Hotspot {
  hotspot_id: string;
  latitude: number;
  longitude: number;
  risk_level: string;
  severity: number;
  estimated_source: string;
  confidence_score: number;
  radius: number;
}

export interface MapLayer {
  layer_key: string;
  layer_name: string;
  category: string;
  is_default: boolean;
}

export interface WeatherInfo {
  temp: number;
  humidity: number;
  wind_speed: number;
  visibility: number;
  pressure: number;
}

interface MapState {
  stations: AQIStation[];
  hotspots: Hotspot[];
  heatmapPoints: [number, number, number][];
  weather: WeatherInfo | null;
  wardsGeoJSON: Record<string, unknown> | null;
  layers: MapLayer[];
  visibleLayers: string[];
  selectedMarker: AQIStation | Hotspot | null;
  selectedMarkerType: "station" | "hotspot" | null;
  searchQuery: string;
  timeSlider: string;
  isLoading: boolean;
  error: string | null;
  mapCenter: [number, number];
  mapZoom: number;

  fetchMapData: (city: string) => Promise<void>;
  toggleLayer: (layerKey: string) => void;
  selectMarker: (marker: AQIStation | Hotspot | null, type: "station" | "hotspot" | null) => void;
  setSearchQuery: (query: string) => void;
  setTimeSlider: (time: string) => void;
  setMapViewport: (center: [number, number], zoom: number) => void;
  resetMapState: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  stations: [],
  hotspots: [],
  heatmapPoints: [],
  weather: null,
  wardsGeoJSON: null,
  layers: [],
  visibleLayers: ["aqi_stations", "ward_boundaries"],
  selectedMarker: null,
  selectedMarkerType: null,
  searchQuery: "",
  timeSlider: "today",
  isLoading: false,
  error: null,
  mapCenter: CITY_CENTERS.Vijayawada,
  mapZoom: 12,

  fetchMapData: async (city: string) => {
    set({ isLoading: true, error: null });
    try {
      // Set map viewport default center when city context changes
      const center = CITY_CENTERS[city] || CITY_CENTERS.Vijayawada;

      const [
        stationsRes,
        hotspotsRes,
        heatmapRes,
        weatherRes,
        wardsRes,
        layersRes
      ] = await Promise.all([
        apiClient.get<AQIStation[]>(`/map/stations?city=${city}`),
        apiClient.get<Hotspot[]>(`/map/hotspots?city=${city}`),
        apiClient.get<[number, number, number][]>(`/map/heatmap?city=${city}`),
        apiClient.get<WeatherInfo>(`/map/weather?city=${city}`),
        apiClient.get<Record<string, unknown>>(`/map/wards?city=${city}`),
        apiClient.get<MapLayer[]>("/map/layers")
      ]);

      set({
        stations: stationsRes.data || [],
        hotspots: hotspotsRes.data || [],
        heatmapPoints: heatmapRes.data || [],
        weather: weatherRes.data || null,
        wardsGeoJSON: wardsRes.data || null,
        layers: layersRes.data || [],
        mapCenter: center,
        isLoading: false,
        // Reset selection on city swap
        selectedMarker: null,
        selectedMarkerType: null,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to retrieve geospatial data from endpoints.";
      set({
        error: errMsg,
        isLoading: false
      });
    }
  },

  toggleLayer: (layerKey: string) => set((state) => {
    const isVisible = state.visibleLayers.includes(layerKey);
    const newLayers = isVisible
      ? state.visibleLayers.filter((k) => k !== layerKey)
      : [...state.visibleLayers, layerKey];
    return { visibleLayers: newLayers };
  }),

  selectMarker: (marker, type) => set({
    selectedMarker: marker,
    selectedMarkerType: type
  }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setTimeSlider: (time) => set({ timeSlider: time }),
  setMapViewport: (center, zoom) => set({ mapCenter: center, mapZoom: zoom }),
  resetMapState: () => set({
    visibleLayers: ["aqi_stations", "ward_boundaries"],
    selectedMarker: null,
    selectedMarkerType: null,
    searchQuery: "",
    timeSlider: "today",
    mapCenter: CITY_CENTERS.Vijayawada,
    mapZoom: 12
  })
}));
