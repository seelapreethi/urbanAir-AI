"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamic import with SSR disabled to resolve Node compiler window exceptions
const FullMapLazy = dynamic(() => import("./full-map-content"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-sm text-ink-secondary bg-canvas">
      <Loader2 className="w-8 h-8 animate-spin text-accent mb-3" />
      <span>Initializing Geospatial Engine...</span>
    </div>
  ),
});

export function FullMap() {
  return (
    <div className="w-full h-full relative z-10">
      <FullMapLazy />
    </div>
  );
}
export default FullMap;
