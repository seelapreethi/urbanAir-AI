"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const EnforcementMapLazy = dynamic(() => import("./enforcement-map-content"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-sm text-ink-secondary bg-canvas">
      <Loader2 className="w-8 h-8 animate-spin text-accent mb-3" />
      <span>Loading enforcement routing paths...</span>
    </div>
  ),
});

export function EnforcementMap({ cityCenter }: { cityCenter: [number, number] }) {
  return (
    <div className="w-full h-full relative z-10">
      <EnforcementMapLazy cityCenter={cityCenter} />
    </div>
  );
}
export default EnforcementMap;
