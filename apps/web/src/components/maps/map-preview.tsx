"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Map, Maximize2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Dynamic import with SSR disabled to bypass window compilation errors in Node server
const MapContentLazy = dynamic(() => import("./map-content"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-xs text-ink-secondary bg-canvas">
      <Loader2 className="w-6 h-6 animate-spin text-accent mb-2" />
      <span>Loading geospatial layers...</span>
    </div>
  ),
});

export function MapPreview() {
  const router = useRouter();

  return (
    <div className="border border-border bg-surface rounded-xl p-6 flex flex-col h-[380px] overflow-hidden">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-accent" />
          <h4 className="text-sm font-bold text-ink-primary font-display">GIS Hotspot Map</h4>
        </div>
        <button 
          onClick={() => router.push("/dashboard/source-map")}
          className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
          title="Open Full Map"
        >
          <span>Open Full Map</span>
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 w-full rounded-lg overflow-hidden border border-border bg-canvas relative z-10">
        <MapContentLazy />
      </div>
    </div>
  );
}
