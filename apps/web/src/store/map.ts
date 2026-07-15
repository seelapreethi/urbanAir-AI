import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

// City centers mapping
const CITY_CENTERS: Record<string, [number, number]> = {
  Vijayawada: [16.5062, 80.6480],
  Hyderabad: [17.3850, 78.4867],
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Delhi: [28.6139, 77.2090],
  Mumbai: [19.0760, 72.8777],
  Kolkata: [22.5726, 88.3639],
  Pune: [18.5204, 73.8567],
  Ahmedabad: [23.0225, 72.5714],
  Visakhapatnam: [17.6868, 83.2185]
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

export interface PollutionSource {
  id: string;
  type: string;
  name: string;
  latitude: number;
  longitude: number;
  contribution: number;
  confidence: number;
  evidence: string;
  trend: string;
}

export interface ForecastZone {
  time_offset: string;
  latitude: number;
  longitude: number;
  aqi: number;
  color: string;
}

export interface HospitalZone {
  name: string;
  latitude: number;
  longitude: number;
  current_risk: string;
  forecast_risk: string;
  suggested_action: string;
}

export interface SchoolZone {
  name: string;
  latitude: number;
  longitude: number;
  current_risk: string;
  forecast_risk: string;
  suggested_action: string;
}

export interface InspectionTask {
  id: string;
  name: string;
  status: string;
  priority: string;
  latitude: number;
  longitude: number;
}

interface MapState {
  stations: AQIStation[];
  hotspots: Hotspot[];
  heatmapPoints: [number, number, number][];
  weather: WeatherInfo | null;
  wardsGeoJSON: Record<string, unknown> | null;
  layers: MapLayer[];
  visibleLayers: string[];
  sources: PollutionSource[];
  forecastGrid: ForecastZone[];
  hospitals: HospitalZone[];
  schools: SchoolZone[];
  inspections: InspectionTask[];
  selectedMarker: AQIStation | Hotspot | PollutionSource | HospitalZone | SchoolZone | null;
  selectedMarkerType: "station" | "hotspot" | "source" | "hospital" | "school" | null;
  searchQuery: string;
  timeSlider: string;
  isLoading: boolean;
  error: string | null;
  mapCenter: [number, number];
  mapZoom: number;

  fetchMapData: (city: string) => Promise<void>;
  toggleLayer: (layerKey: string) => void;
  selectMarker: (
    marker: AQIStation | Hotspot | PollutionSource | HospitalZone | SchoolZone | null,
    type: "station" | "hotspot" | "source" | "hospital" | "school" | null
  ) => void;
  setSearchQuery: (query: string) => void;
  setTimeSlider: (time: string, city: string) => Promise<void>;
  setMapViewport: (center: [number, number], zoom: number) => void;
  resetMapState: () => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  stations: [],
  hotspots: [],
  heatmapPoints: [],
  weather: null,
  wardsGeoJSON: null,
  layers: [],
  visibleLayers: ["aqi_stations", "ward_boundaries", "heatmap", "weather", "traffic", "industries", "construction_sites", "green_cover", "hospitals", "schools", "inspections"],
  sources: [],
  forecastGrid: [],
  hospitals: [],
  schools: [],
  inspections: [],
  selectedMarker: null,
  selectedMarkerType: null,
  searchQuery: "",
  timeSlider: "current",
  isLoading: false,
  error: null,
  mapCenter: CITY_CENTERS.Delhi,
  mapZoom: 12,

  fetchMapData: async (city: string) => {
    set({ isLoading: true, error: null });
    const time = get().timeSlider;
    try {
      const center = CITY_CENTERS[city] || CITY_CENTERS.Delhi;

      const [
        stationsRes,
        hotspotsRes,
        heatmapRes,
        weatherRes,
        wardsRes,
        layersRes,
        sourcesRes,
        forecastRes,
        hospitalsRes,
        schoolsRes,
        inspectionsRes
      ] = await Promise.all([
        apiClient.get<AQIStation[]>(`/map/stations?city=${city}&time=${time}`),
        apiClient.get<Hotspot[]>(`/map/hotspots?city=${city}&time=${time}`),
        apiClient.get<[number, number, number][]>(`/map/heatmap?city=${city}&time=${time}`),
        apiClient.get<WeatherInfo>(`/map/weather?city=${city}&time=${time}`),
        apiClient.get<Record<string, unknown>>(`/map/wards?city=${city}&time=${time}`),
        apiClient.get<MapLayer[]>("/map/layers"),
        apiClient.get<PollutionSource[]>(`/map/sources?city=${city}`),
        apiClient.get<ForecastZone[]>(`/map/forecast?city=${city}&time=${time}`),
        apiClient.get<HospitalZone[]>(`/map/hospitals?city=${city}&time=${time}`),
        apiClient.get<SchoolZone[]>(`/map/schools?city=${city}&time=${time}`),
        apiClient.get<InspectionTask[]>(`/map/inspection?city=${city}`)
      ]);

      set({
        stations: stationsRes.data || [],
        hotspots: hotspotsRes.data || [],
        heatmapPoints: heatmapRes.data || [],
        weather: weatherRes.data || null,
        wardsGeoJSON: wardsRes.data || null,
        layers: layersRes.data || [],
        sources: sourcesRes.data || [],
        forecastGrid: forecastRes.data || [],
        hospitals: hospitalsRes.data || [],
        schools: schoolsRes.data || [],
        inspections: inspectionsRes.data || [],
        mapCenter: center,
        isLoading: false,
        selectedMarker: null,
        selectedMarkerType: null,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to retrieve geospatial data.";
      set({ error: errMsg, isLoading: false });
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
  setTimeSlider: async (time, city) => {
    set({ timeSlider: time });
    await get().fetchMapData(city);
  },
  setMapViewport: (center, zoom) => set({ mapCenter: center, mapZoom: zoom }),
  resetMapState: () => set({
    visibleLayers: ["aqi_stations", "ward_boundaries", "heatmap", "weather", "traffic", "industries", "construction_sites", "green_cover", "hospitals", "schools", "inspections"],
    selectedMarker: null,
    selectedMarkerType: null,
    searchQuery: "",
    timeSlider: "current",
    mapCenter: CITY_CENTERS.Delhi,
    mapZoom: 12
  })
}));
