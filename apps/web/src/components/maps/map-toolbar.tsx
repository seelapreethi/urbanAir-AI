"use client";

import React from "react";
import { RefreshCw, Download, FileJson, Printer, RotateCcw } from "lucide-react";
import { useMapStore } from "@/store/map";
import { useCityStore } from "@/store/city";
import { useUIStore } from "@/store/ui";

export function MapToolbar() {
  const { selectedCity } = useCityStore();
  const { fetchMapData, resetMapState, stations, hotspots } = useMapStore();
  const { notifySuccess, notifyInfo } = useUIStore();

  const handleRefresh = async () => {
    await fetchMapData(selectedCity);
    notifySuccess("Map Data Refreshed", `GIS layers updated for ${selectedCity}.`);
  };

  const handleExportGeoJSON = () => {
    const featureCollection = {
      type: "FeatureCollection",
      features: [
        ...stations.map((st) => ({
          type: "Feature",
          properties: {
            type: "station",
            id: st.station_id,
            name: st.station_name,
            aqi: st.aqi,
            pollutant: st.dominant_pollutant,
            temp: st.temp,
          },
          geometry: {
            type: "Point",
            coordinates: [st.longitude, st.latitude],
          },
        })),
        ...hotspots.map((hp) => ({
          type: "Feature",
          properties: {
            type: "hotspot",
            id: hp.hotspot_id,
            risk: hp.risk_level,
            source: hp.estimated_source,
            confidence: hp.confidence_score,
          },
          geometry: {
            type: "Point",
            coordinates: [hp.longitude, hp.latitude],
          },
        })),
      ],
    };

    const blob = new Blob([JSON.stringify(featureCollection, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedCity}_gis_export.geojson`;
    link.click();
    URL.revokeObjectURL(url);
    notifySuccess("GeoJSON Exported", "Downloaded active stations and hotspots vector layers.");
  };

  const handleDownloadImage = () => {
    notifyInfo("Map Capture Initiated", "Generating offline visual print layouts...");
  };

  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-surface border-b border-border text-xs z-20">
      <div className="flex items-center gap-2">
        <span className="font-mono text-ink-tertiary uppercase tracking-wider">Active:</span>
        <span className="font-bold text-accent font-display">{selectedCity} Geospatial Matrix</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={handleRefresh}
          className="h-8 px-3 rounded hover:bg-surface-raised text-ink-secondary flex items-center gap-1.5 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
        <button
          onClick={handleDownloadImage}
          className="h-8 px-3 rounded hover:bg-surface-raised text-ink-secondary flex items-center gap-1.5 transition-colors"
          title="Download Map Image"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Capture</span>
        </button>
        <button
          onClick={handleExportGeoJSON}
          className="h-8 px-3 rounded hover:bg-surface-raised text-ink-secondary flex items-center gap-1.5 transition-colors"
          title="Export as GeoJSON vector file"
        >
          <FileJson className="w-3.5 h-3.5" />
          <span>Export GeoJSON</span>
        </button>
        <button
          onClick={() => window.print()}
          className="h-8 px-3 rounded hover:bg-surface-raised text-ink-secondary flex items-center gap-1.5 transition-colors"
          title="Print layouts"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print</span>
        </button>
        <div className="w-px h-4 bg-border mx-1"></div>
        <button
          onClick={resetMapState}
          className="h-8 px-3 rounded hover:bg-surface-raised text-ink-secondary flex items-center gap-1.5 transition-colors"
          title="Reset Map State"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset View</span>
        </button>
      </div>
    </div>
  );
}
