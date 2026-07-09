// User and Role definitions
export interface UserRole {
  role_id: string;
  role_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  user_id: string;
  role_id?: string;
  role_name?: string;
  permissions?: string[];
  city_id?: string;
  first_name: string;
  last_name?: string;
  email: string;
  preferred_language?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Standard API Response Wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: any;
  errors?: any[] | null;
  timestamp: string;
}

// Severity Levels corresponding to docs/UI_DESIGN.md
export type AQISeverity = 
  | 'Good'
  | 'Moderate'
  | 'Unhealthy (Sensitive)'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

export interface AQIRecord {
  aqi_record_id: string;
  city_id: string;
  ward_id: string;
  station_id: string;
  observed_at: string;
  aqi_value: number;
  category: AQISeverity;
  dominant_pollutant: string;
}
