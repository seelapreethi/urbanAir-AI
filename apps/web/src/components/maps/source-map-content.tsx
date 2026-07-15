"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSourceStore } from "@/store/source";
import { useCityStore } from "@/store/city";

// Viewport controller
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12, { animate: true });
  }, [center, map]);
  return null;
}

const createSourceIcon = (type: string) => {
  let color = "#EF4444"; // Red for general
  let text = "SRC";
  if (type === "Traffic") {
    color = "#3B82F6"; // Blue for traffic
    text = "TRAF";
  } else if (type === "Industry") {
    color = "#F59E0B"; // Yellow for industry
    text = "IND";
  } else if (type === "Construction Sites") {
    color = "#EC4899"; // Pink for construction
    text = "CONS";
  }

  return L.divIcon({
    className: "custom-source-pin",
    html: `
      <div class="relative w-8 h-8 flex items-center justify-center rounded-lg bg-surface border border-border shadow-lg">
        <div class="w-6 h-6 rounded flex items-center justify-center text-[8px] font-black text-canvas font-mono" style="background-color: ${color}">
          ${text}
        </div>
        <div class="absolute -inset-0.5 rounded-lg animate-ping opacity-15 pointer-events-none" style="border: 1px solid ${color}"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export default function SourceMapContent({ cityCenter }: { cityCenter: [number, number] }) {
  const { mapSources, selectSource } = useSourceStore();
  const { selectedCity } = useCityStore();

  const getSourceColor = (type: string) => {
    if (type === "Traffic") return "#3B82F6";
    if (type === "Industry") return "#F59E0B";
    if (type === "Construction Sites") return "#EC4899";
    return "#EF4444";
  };

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

        {mapSources.map((src) => (
          <React.Fragment key={src.id}>
            {/* Influence coverage circle */}
            <Circle
              center={[src.latitude, src.longitude]}
              radius={src.influence_radius}
              pathOptions={{
                color: getSourceColor(src.type),
                fillColor: getSourceColor(src.type),
                fillOpacity: 0.08,
                weight: 1,
                dashArray: "4"
              }}
            />

            {/* Source Pin Marker */}
            <Marker
              position={[src.latitude, src.longitude]}
              icon={createSourceIcon(src.type)}
              eventHandlers={{
                click: () => selectSource(src.id, selectedCity)
              }}
            >
              <Popup>
                <div className="text-xs p-1 space-y-1">
                  <span className="font-bold text-ink-primary block">{src.name}</span>
                  <span className="text-[10px] text-ink-tertiary block">Type: {src.type} (Conf: {src.confidence}%)</span>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
}
