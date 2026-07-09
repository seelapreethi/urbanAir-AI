"use client";

import React, { useEffect, useState } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MapToolbar } from "@/components/maps/map-toolbar";
import { ControlPanel } from "@/components/maps/control-panel";
import { InfoPanel } from "@/components/maps/info-panel";
import { TimeSlider } from "@/components/maps/time-slider";
import { FullMap } from "@/components/maps/full-map";
import { useCityStore } from "@/store/city";
import { useMapStore } from "@/store/map";
import { Loader2 } from "lucide-react";

export default function MapPage() {
  const { selectedCity } = useCityStore();
  const { fetchMapData, isLoading, error } = useMapStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchMapData(selectedCity);
    }
  }, [selectedCity, fetchMapData, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas text-ink-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <RouteGuard>
      <div className="h-screen w-screen bg-canvas text-ink-primary flex overflow-hidden font-sans">
        {/* Left App Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Right Content Space */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header Panel */}
          <Header onOpenMobileDrawer={() => {}} />

          {/* Map Sub-Toolbar */}
          <MapToolbar />

          {/* Main Map Workspace containing side drawers and map */}
          <div className="flex-1 flex relative overflow-hidden bg-canvas">
            {/* Left Control Panel Drawer */}
            <ControlPanel />

            {/* Central Leaflet Map Container */}
            <div className="flex-1 h-full w-full relative">
              {isLoading && (
                <div className="absolute inset-0 bg-canvas/40 backdrop-blur-[1px] flex items-center justify-center z-30">
                  <div className="bg-surface border border-border p-4 rounded-xl flex items-center gap-3 shadow-2xl">
                    <Loader2 className="w-5 h-5 animate-spin text-accent" />
                    <span className="text-xs font-semibold text-ink-primary">Fetching GIS points...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-danger-soft border border-danger/20 text-danger text-xs p-3 rounded-lg z-30 shadow-md">
                  {error}
                </div>
              )}

              {/* Dynamic Leaflet component */}
              <FullMap />

              {/* Time Slider timeline */}
              <TimeSlider />
            </div>

            {/* Right Information Details Drawer */}
            <InfoPanel />
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
