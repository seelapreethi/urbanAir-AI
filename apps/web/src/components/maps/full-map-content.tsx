"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapStore } from "@/store/map";

// Helper to center the map viewport dynamically when store parameters change
function MapController() {
  const map = useMap();
  const { mapCenter, mapZoom } = useMapStore();

  useEffect(() => {
    map.setView(mapCenter, mapZoom, { animate: true });
  }, [mapCenter, mapZoom, map]);

  return null;
}

// Generate premium HTML pulsing markers matching AQI severity levels
const createStationIcon = (aqi: number) => {
  let color = "#10B981"; // Good - Green
  if (aqi > 50) color = "#F59E0B"; // Moderate - Yellow
  if (aqi > 100) color = "#EF4444"; // Poor - Orange
  if (aqi > 200) color = "#EC4899"; // Very Poor - Pink
  if (aqi > 300) color = "#8B5CF6"; // Severe - Purple

  return L.divIcon({
    className: "custom-station-icon",
    html: `
      <div class="relative w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border shadow-lg">
        <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-canvas font-mono" style="background-color: ${color}">
          ${aqi}
        </div>
        <div class="absolute -inset-0.5 rounded-full animate-ping opacity-20 pointer-events-none" style="border: 2px solid ${color}"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const createHotspotIcon = (risk: string) => {
  let color = "#EF4444"; // Critical - Red
  if (risk === "High") color = "#F59E0B";
  if (risk === "Medium") color = "#3B82F6";
  if (risk === "Low") color = "#10B981";

  return L.divIcon({
    className: "custom-hotspot-icon",
    html: `
      <div class="relative w-6 h-6 flex items-center justify-center rounded-full bg-canvas border border-border shadow-md">
        <div class="w-4 h-4 rounded-full" style="background-color: ${color}"></div>
        <div class="absolute -inset-1 rounded-full animate-pulse opacity-40 pointer-events-none" style="border: 1px solid ${color}"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const createIndustryIcon = () => {
  return L.divIcon({
    className: "custom-industry-icon",
    html: `
      <div class="w-6 h-6 rounded bg-danger/10 border border-danger/40 flex items-center justify-center text-danger font-bold text-[8px]">
        IND
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const createHospitalIcon = () => {
  return L.divIcon({
    className: "custom-hospital-icon",
    html: `
      <div class="w-6 h-6 rounded bg-info/10 border border-info/40 flex items-center justify-center text-info font-bold text-[9px]">
        +
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

interface WardFeature {
  type: string;
  properties: {
    ward_id: string;
    ward_name: string;
    ward_code: string;
    population: number;
    area_sq_km: number;
    current_aqi: number;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export default function FullMapContent() {
  const {
    stations,
    hotspots,
    heatmapPoints,
    wardsGeoJSON,
    visibleLayers,
    selectMarker,
    mapCenter,
    mapZoom
  } = useMapStore();

  // Basic styling for ward polygon layers
  const getWardStyle = (aqi: number) => {
    let color = "#10B981";
    if (aqi > 50) color = "#F59E0B";
    if (aqi > 100) color = "#EF4444";
    if (aqi > 200) color = "#EC4899";

    return {
      color: "var(--color-border)",
      weight: 1.5,
      fillColor: color,
      fillOpacity: 0.08,
      dashArray: "3"
    };
  };

  return (
    <div className="w-full h-full relative z-10">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapController />

        {/* 1. Municipal Wards Layer */}
        {visibleLayers.includes("ward_boundaries") && !!wardsGeoJSON?.features && 
          (wardsGeoJSON.features as WardFeature[]).map((feature: WardFeature, idx: number) => {
            const coords = feature.geometry.coordinates[0].map((c) => [c[1], c[0]] as [number, number]);
            const props = feature.properties;
            return (
              <Polygon
                key={props.ward_id || idx}
                positions={coords}
                pathOptions={getWardStyle(props.current_aqi)}
              >
                <Popup>
                  <div className="text-xs p-1.5 space-y-1">
                    <span className="font-bold text-ink-primary block">{props.ward_name}</span>
                    <span className="text-[10px] text-ink-tertiary font-mono block">Code: {props.ward_code}</span>
                    <div className="flex justify-between gap-4 pt-1 text-[11px]">
                      <span>AQI Index:</span>
                      <span className="font-bold font-mono">{props.current_aqi}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-[11px]">
                      <span>Population:</span>
                      <span>{props.population?.toLocaleString()}</span>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          })
        }

        {/* 2. Heatmap Pollution Ring Layer */}
        {visibleLayers.includes("heatmap") && heatmapPoints &&
          heatmapPoints.map((pt, idx) => (
            <Circle
              key={`heat-${idx}`}
              center={[pt[0], pt[1]]}
              radius={2400}
              pathOptions={{
                color: "#EF4444",
                fillColor: "#EF4444",
                fillOpacity: 0.12 * pt[2],
                weight: 0
              }}
            />
          ))
        }

        {/* 3. Road Network Overlay */}
        {visibleLayers.includes("road_network") && (
          <>
            <Polyline
              positions={[
                [mapCenter[0] - 0.03, mapCenter[1] - 0.03],
                [mapCenter[0], mapCenter[1]],
                [mapCenter[0] + 0.03, mapCenter[1] + 0.03]
              ]}
              pathOptions={{ color: "#3B82F6", weight: 3, opacity: 0.4 }}
            />
            <Polyline
              positions={[
                [mapCenter[0] + 0.02, mapCenter[1] - 0.03],
                [mapCenter[0], mapCenter[1]],
                [mapCenter[0] - 0.02, mapCenter[1] + 0.03]
              ]}
              pathOptions={{ color: "#10B981", weight: 2, opacity: 0.4 }}
            />
          </>
        )}

        {/* 4. Traffic Congestion Hotspots */}
        {visibleLayers.includes("traffic") && (
          <Circle
            center={[mapCenter[0] + 0.005, mapCenter[1] + 0.01]}
            radius={900}
            pathOptions={{ color: "#EF4444", fillColor: "#EF4444", fillOpacity: 0.15, weight: 1 }}
          />
        )}

        {/* 5. AQI Stations Layer */}
        {visibleLayers.includes("aqi_stations") && stations &&
          stations.map((st) => (
            <Marker
              key={st.station_id}
              position={[st.latitude, st.longitude]}
              icon={createStationIcon(st.aqi)}
              eventHandlers={{
                click: () => selectMarker(st, "station")
              }}
            >
              <Popup>
                <div className="text-xs p-1 space-y-1">
                  <span className="font-bold text-ink-primary block">{st.station_name}</span>
                  <span className="text-[10px] text-ink-tertiary block">AQI Parameter: {st.aqi}</span>
                </div>
              </Popup>
            </Marker>
          ))
        }

        {/* 6. Hotspots Markers Layer */}
        {visibleLayers.includes("heatmap") && hotspots &&
          hotspots.map((hp) => (
            <React.Fragment key={hp.hotspot_id}>
              <Circle
                center={[hp.latitude, hp.longitude]}
                radius={hp.radius}
                pathOptions={{
                  color: "#EF4444",
                  fillColor: "#EF4444",
                  fillOpacity: 0.1,
                  weight: 1
                }}
              />
              <Marker
                position={[hp.latitude, hp.longitude]}
                icon={createHotspotIcon(hp.risk_level)}
                eventHandlers={{
                  click: () => selectMarker(hp, "hotspot")
                }}
              />
            </React.Fragment>
          ))
        }

        {/* 7. Industrial Sites Layer */}
        {visibleLayers.includes("industries") && (
          <>
            <Marker position={[mapCenter[0] + 0.025, mapCenter[1] - 0.02]} icon={createIndustryIcon()} />
            <Marker position={[mapCenter[0] - 0.02, mapCenter[1] + 0.025]} icon={createIndustryIcon()} />
          </>
        )}

        {/* 8. Hospitals (Sensitive Zones) */}
        {visibleLayers.includes("hospitals") && (
          <>
            <Marker position={[mapCenter[0] + 0.01, mapCenter[1] - 0.015]} icon={createHospitalIcon()} />
            <Marker position={[mapCenter[0] - 0.015, mapCenter[1] + 0.01]} icon={createHospitalIcon()} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
