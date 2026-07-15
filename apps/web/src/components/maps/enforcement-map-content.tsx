"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEnforcementStore } from "@/store/enforcement";
import { useCityStore } from "@/store/city";

// Viewport controller
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12, { animate: true });
  }, [center, map]);
  return null;
}

const createHotspotIcon = (priority: string, visitOrder: number) => {
  let color = "#EF4444"; // Critical - Red
  if (priority === "High") color = "#F59E0B";
  if (priority === "Medium") color = "#3B82F6";
  if (priority === "Low") color = "#10B981";

  return L.divIcon({
    className: "custom-inspection-pin",
    html: `
      <div class="relative w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border shadow-lg">
        <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-canvas font-mono" style="background-color: ${color}">
          #${visitOrder}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export default function EnforcementMapContent({ cityCenter }: { cityCenter: [number, number] }) {
  const { dispatchRoutes, selectHotspot } = useEnforcementStore();
  const { selectedCity } = useCityStore();

  // Coordinates array for drawing route lines connecting hotspots
  const routeLinePoints = dispatchRoutes.map((hp) => [hp.latitude, hp.longitude] as [number, number]);

  return (
    <div className="w-full h-full relative z-10">
      <MapContainer
        center={cityCenter}
        zoom={12}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapController center={cityCenter} />

        {/* Dispatch routing path polyline */}
        {routeLinePoints.length > 1 && (
          <Polyline
            positions={routeLinePoints}
            pathOptions={{
              color: "#3B82F6",
              weight: 3,
              opacity: 0.65,
              dashArray: "6, 6"
            }}
          />
        )}

        {/* Hotspot Markers */}
        {dispatchRoutes.map((hp) => (
          <Marker
            key={hp.hotspot_id}
            position={[hp.latitude, hp.longitude]}
            icon={createHotspotIcon(
              hp.severity >= 0.9 ? "Critical" : hp.severity >= 0.75 ? "High" : "Medium",
              hp.suggested_visit_order
            )}
            eventHandlers={{
              click: () => selectHotspot(hp.hotspot_id, selectedCity)
            }}
          >
            <Popup>
              <div className="text-xs p-1 space-y-1">
                <span className="font-bold text-ink-primary block">{hp.estimated_source}</span>
                <span className="text-[10px] text-ink-tertiary block">
                  Route Order: #{hp.suggested_visit_order} (Sev: {hp.severity.toFixed(2)})
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
