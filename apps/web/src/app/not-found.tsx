"use client";

import React from "react";
import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-sans flex items-center justify-center p-6">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-accent/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-8 shadow-lg text-center relative z-10">
        <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto mb-6">
          <Compass className="w-6 h-6 animate-pulse" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tighter font-mono text-accent mb-2">
          404
        </h1>
        <h2 className="text-xl font-bold tracking-tight font-display text-ink-primary mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-ink-secondary leading-normal mb-8">
          The city monitoring node or dashboard route you are looking for does not exist or has been relocated.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-accent text-canvas font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-md text-sm"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </Link>
          
          <Link
            href="/"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-lg border border-border bg-canvas text-ink-primary font-semibold hover:bg-surface-raised active:scale-[0.99] transition-all text-sm"
          >
            Go to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
