import { useAuthStore } from "@/store/auth";
import { ApiResponse, AuthTokens } from "@urbanair/shared";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface FetchOptions extends RequestInit {
  retryCount?: number;
  skipAuth?: boolean;
}

// Helper to handle refreshing token outside of standard store to prevent race conditions
async function refreshTokens(refreshToken: string): Promise<AuthTokens | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      return json.data as AuthTokens;
    }
    return null;
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const { retryCount = 0, skipAuth = false, ...init } = options;
  const authStore = useAuthStore.getState();
  
  // Build URL path
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  
  // Set default headers
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  
  // Inject access token if authenticated and skipAuth is not specified
  if (authStore.isAuthenticated && authStore.tokens?.access_token && !skipAuth) {
    headers.set("Authorization", `Bearer ${authStore.tokens.access_token}`);
  }
  
  const finalOptions: RequestInit = {
    ...init,
    headers,
  };
  
  try {
    const response = await fetch(url, finalOptions);
    
    // Auto token refresh interceptor for 401 errors
    if (response.status === 401 && authStore.tokens?.refresh_token && !skipAuth && retryCount < 1) {
      const newTokens = await refreshTokens(authStore.tokens.refresh_token);
      
      if (newTokens) {
        // Success: Update tokens and user state inside Zustand
        // Since we refresh, let's fetch /auth/me to verify user state remains consistent
        const meRes = await fetch(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${newTokens.access_token}`,
          },
        });
        
        if (meRes.ok) {
          const meJson = await meRes.json();
          if (meJson.success) {
            authStore.setAuth(newTokens, meJson.data);
            
            // Retry the original query with updated access token
            return request<T>(endpoint, {
              ...options,
              retryCount: retryCount + 1,
            });
          }
        }
      }
      
      // Token refresh failed or profile retrieval failed: Sign out
      authStore.clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired. Please log in again.");
    }
    
    // Parse response
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.message || `Request failed with status ${response.status}`);
    }
    
    // If the response is already wrapped as ApiResponse, validate and return it
    if (json && typeof json === "object" && "success" in json) {
      if (!json.success) {
        throw new Error(json.message || "Request failed");
      }
      return json as ApiResponse<T>;
    }
    
    // Otherwise, wrap the raw response payload
    return {
      success: true,
      data: json,
      timestamp: new Date().toISOString()
    } as unknown as ApiResponse<T>;
  } catch (error) {
    const isNetworkError = error instanceof TypeError || (error instanceof Error && error.message.includes("Failed to fetch"));
    if (retryCount < 2 && isNetworkError) {
      return request<T>(endpoint, {
        ...options,
        retryCount: retryCount + 1,
      });
    }
    throw error;
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: FetchOptions) => 
    request<T>(endpoint, { ...options, method: "GET" }),
    
  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) => 
    request<T>(endpoint, { 
      ...options, 
      method: "POST", 
      body: body ? JSON.stringify(body) : undefined 
    }),
    
  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) => 
    request<T>(endpoint, { 
      ...options, 
      method: "PUT", 
      body: body ? JSON.stringify(body) : undefined 
    }),
    
  patch: <T>(endpoint: string, body?: unknown, options?: FetchOptions) => 
    request<T>(endpoint, { 
      ...options, 
      method: "PATCH", 
      body: body ? JSON.stringify(body) : undefined 
    }),
    
  delete: <T>(endpoint: string, options?: FetchOptions) => 
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
