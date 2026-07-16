"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { Lock, Mail, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    if (url && !url.endsWith("/api/v1")) {
      const cleaned = url.endsWith("/") ? url.slice(0, -1) : url;
      url = `${cleaned}/api/v1`;
    }
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const apiUrl = getApiUrl();

    try {
      const response = await fetch(
        `${apiUrl}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Failed to log in");
      }

      const tokens = responseData.data;

      // Now fetch /auth/me using access token to retrieve user details
      const meResponse = await fetch(
        `${apiUrl}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      );

      const meData = await meResponse.json();

      if (!meResponse.ok || !meData.success) {
        throw new Error("Failed to load user profile");
      }

      // Save credentials in Zustand store
      setAuth(tokens, meData.data);
      router.push("/dashboard");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong. Please check your credentials.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-sans flex items-center justify-center p-6">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-accent/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-8 shadow-lg relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-canvas">
              ⬡
            </div>
            <span className="text-xl font-bold tracking-tight font-display">
              UrbanAir <span className="text-accent">AI</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight font-display">Welcome back</h2>
          <p className="text-sm text-ink-secondary mt-1">Sign in to city control dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink-tertiary">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="officer@urbanair.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-canvas text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-ink-tertiary"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs text-accent hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink-tertiary">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-canvas text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-ink-tertiary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-accent text-canvas font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2 shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-[10px] font-bold text-accent tracking-wide uppercase">
            <Sparkles className="w-3 h-3" />
            Development Seed Credentials
          </div>
          <div className="text-left w-full space-y-1.5 font-mono text-[11px] text-ink-secondary bg-canvas border border-border p-3.5 rounded-lg">
            <div>
              <span className="font-bold text-ink-primary">Admin:</span> admin@urbanair.ai / Admin@123
            </div>
            <div>
              <span className="font-bold text-ink-primary">Officer:</span> officer@urbanair.ai / Officer@123
            </div>
            <div>
              <span className="font-bold text-ink-primary">Citizen:</span> citizen@urbanair.ai / Citizen@123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
