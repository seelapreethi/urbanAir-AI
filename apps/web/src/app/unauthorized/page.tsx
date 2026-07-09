"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-sans flex items-center justify-center p-6">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-danger/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-8 shadow-lg text-center relative z-10">
        <div className="w-12 h-12 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center text-danger mx-auto mb-6">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight font-display text-ink-primary mb-2">
          Access Forbidden
        </h1>
        <p className="text-sm text-ink-secondary leading-normal mb-8">
          You do not have the required role privileges to access this console route. Please contact your city administrator if you believe this is an error.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-accent text-canvas font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-md text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Safety
          </Link>
          
          <Link
            href="/login"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-lg border border-border bg-canvas text-ink-primary font-semibold hover:bg-surface-raised active:scale-[0.99] transition-all text-sm"
          >
            Switch Accounts
          </Link>
        </div>
      </div>
    </div>
  );
}
