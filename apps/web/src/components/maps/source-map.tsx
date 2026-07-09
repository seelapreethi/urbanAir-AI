"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const SourceMapLazy = dynamic(() => import("./source-map-content"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-sm text-ink-secondary bg-canvas">
      <Loader2 className="w-8 h-8 animate-spin text-accent mb-3" />
      <span>Loading source dispersion layers...</span>
    </div>
  ),
});

export function SourceMap({ cityCenter }: { cityCenter: [number, number] }) {
  return (
    <div className="w-full h-full relative z-10">
      <SourceMapLazy cityCenter={cityCenter} />
    </div>
  );
}
export default SourceMap;
