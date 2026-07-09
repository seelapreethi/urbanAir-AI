import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

export interface ForecastPeriod {
  aqi: number;
  risk: string;
  pollutant: string;
  confidence: number;
  interval: [number, number];
}

export interface ForecastSummary {
  city: string;
  current_aqi: number;
  model_selected: string;
  predictions: {
    "24h": ForecastPeriod;
    "48h": ForecastPeriod;
    "72h": ForecastPeriod;
  };
  ai_explanation: string;
}

export interface HourlyForecastPoint {
  timestamp: string;
  hour_index: number;
  predicted_aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

export interface DailyForecastPoint {
  date: string;
  day_index: number;
  mean_aqi: number;
  min_aqi: number;
  max_aqi: number;
  dominant_pollutant: string;
  confidence_score: number;
  risk_level: string;
}

export interface WardForecastItem {
  ward_id: string;
  ward_name: string;
  current_aqi: number;
  forecast_24h: number;
  forecast_48h: number;
  forecast_72h: number;
  risk_level: string;
  confidence_score: number;
  trend: string;
}

export interface WeatherForecastDay {
  date: string;
  temp: number;
  humidity: number;
  wind_speed: number;
  pressure: number;
  visibility: number;
  rain_probability: number;
}

export interface ForecastRecommendation {
  recommendation_id: string;
  action_text: string;
  priority: string;
  expected_aqi_improvement: number;
  confidence_score: number;
}

export interface FeatureImportanceItem {
  name: string;
  value: number;
}

export interface HistoricalAccuracyItem {
  date: string;
  predicted: number;
  actual: number;
}

export interface ConfidenceMetrics {
  model_name: string;
  reliability_percentage: number;
  historical_accuracy: HistoricalAccuracyItem[];
  feature_importances: FeatureImportanceItem[];
}

interface ForecastState {
  selectedModel: string;
  forecastSummary: ForecastSummary | null;
  hourlyForecast: HourlyForecastPoint[];
  dailyForecast: DailyForecastPoint[];
  wardForecasts: WardForecastItem[];
  weatherForecast: WeatherForecastDay[];
  recommendations: ForecastRecommendation[];
  confidenceMetrics: ConfidenceMetrics | null;
  isLoading: boolean;
  error: string | null;

  setModel: (model: string) => void;
  fetchForecastData: (city: string, model?: string) => Promise<void>;
  resetForecastState: () => void;
}

export const useForecastStore = create<ForecastState>((set, get) => ({
  selectedModel: "xgboost",
  forecastSummary: null,
  hourlyForecast: [],
  dailyForecast: [],
  wardForecasts: [],
  weatherForecast: [],
  recommendations: [],
  confidenceMetrics: null,
  isLoading: false,
  error: null,

  setModel: (model) => {
    set({ selectedModel: model });
  },

  fetchForecastData: async (city, model) => {
    const activeModel = model || get().selectedModel;
    set({ isLoading: true, error: null });

    try {
      const [
        summaryRes,
        hourlyRes,
        dailyRes,
        wardsRes,
        weatherRes,
        recsRes,
        confidenceRes
      ] = await Promise.all([
        apiClient.get<ForecastSummary>(`/forecast?city=${city}&model=${activeModel}`),
        apiClient.get<HourlyForecastPoint[]>(`/forecast/hourly?city=${city}&model=${activeModel}`),
        apiClient.get<DailyForecastPoint[]>(`/forecast/daily?city=${city}&model=${activeModel}`),
        apiClient.get<WardForecastItem[]>(`/forecast/wards?city=${city}&model=${activeModel}`),
        apiClient.get<WeatherForecastDay[]>(`/forecast/weather?city=${city}`),
        apiClient.get<ForecastRecommendation[]>(`/forecast/recommendations?city=${city}`),
        apiClient.get<ConfidenceMetrics>(`/forecast/confidence?city=${city}&model=${activeModel}`)
      ]);

      set({
        forecastSummary: summaryRes.data || null,
        hourlyForecast: hourlyRes.data || [],
        dailyForecast: dailyRes.data || [],
        wardForecasts: wardsRes.data || [],
        weatherForecast: weatherRes.data || [],
        recommendations: recsRes.data || [],
        confidenceMetrics: confidenceRes.data || null,
        isLoading: false
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load forecasting vectors.";
      set({
        error: errMsg,
        isLoading: false
      });
    }
  },

  resetForecastState: () => set({
    selectedModel: "xgboost",
    forecastSummary: null,
    hourlyForecast: [],
    dailyForecast: [],
    wardForecasts: [],
    weatherForecast: [],
    recommendations: [],
    confidenceMetrics: null,
    isLoading: false,
    error: null
  })
}));
