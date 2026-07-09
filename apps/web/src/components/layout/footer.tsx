"use client";

import React from "react";
import { useAuthStore } from "@/store/auth";

export function Footer() {
  const { user } = useAuthStore();
  
  return (
    <footer className="h-12 border-t border-border bg-surface flex items-center justify-between px-6 text-[10px] text-ink-tertiary font-mono uppercase tracking-wider select-none mt-12">
      <div>
        © 2026 UrbanAir AI • System Operational
      </div>
      <div className="flex items-center gap-4">
        <span>Env: {process.env.NEXT_PUBLIC_ENVIRONMENT || "Development"}</span>
        {user && <span>User: {user.email}</span>}
      </div>
    </footer>
  );
}
