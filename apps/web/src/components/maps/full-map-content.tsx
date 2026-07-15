"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapStore, Hotspot } from "@/store/map";

// Centering helper
function MapController() {
  const map = useMap();
  const { mapCenter, mapZoom } = useMapStore();

  useEffect(() => {
    map.setView(mapCenter, mapZoom, { animate: true });
  }, [mapCenter, mapZoom, map]);

  return null;
}

// AQI Pulsing Markers
const createStationIcon = (aqi: number) => {
  let color = "#10B981"; // Good
  if (aqi > 50) color = "#F59E0B"; // Satisfactory/Moderate
  if (aqi > 100) color = "#EF4444"; // Poor
  if (aqi > 200) color = "#EC4899"; // Very Poor
  if (aqi > 300) color = "#8B5CF6"; // Severe

  return L.divIcon({
    className: "custom-station-icon",
    html: `
      <div class="relative w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-border shadow-lg">
        <div class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-canvas font-mono" style="background-color: ${color}">
          ${aqi}
        </div>
        <div class="absolute -inset-0.5 rounded-full animate-ping opacity-25 pointer-events-none" style="border: 2px solid ${color}"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// Pollution Source Icons
const createSourceIcon = (type: string) => {
  let emoji = "🏭";
  let bg = "bg-danger/10 border-danger/40 text-danger";
  
  if (type === "Traffic") {
    emoji = "🚗";
    bg = "bg-warning/10 border-warning/40 text-warning";
  } else if (type === "Construction") {
    emoji = "🏗️";
    bg = "bg-info/10 border-info/40 text-info";
  } else if (type === "Waste Burning") {
    emoji = "🔥";
    bg = "bg-danger/15 border-danger/40 text-danger";
  }

  return L.divIcon({
    className: "custom-source-icon",
    html: `
      <div class="w-8 h-8 rounded-lg ${bg} flex items-center justify-center text-sm font-bold shadow-md">
        ${emoji}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

// Hospital & School Icons
const createHospitalIcon = () => {
  return L.divIcon({
    className: "custom-hospital-icon",
    html: `
      <div class="w-8 h-8 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] font-black text-lg shadow-md">
        +
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const createSchoolIcon = () => {
  return L.divIcon({
    className: "custom-school-icon",
    html: `
      <div class="w-8 h-8 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/40 flex items-center justify-center text-[#3B82F6] font-bold text-sm shadow-md">
        🎓
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

// Inspection Task Icons
const createInspectionIcon = (status: string) => {
  let color = "#10B981"; // Completed
  let icon = "✓";
  if (status === "Inspection Required") {
    color = "#EF4444";
    icon = "!";
  } else if (status === "Pending Violations") {
    color = "#F59E0B";
    icon = "?";
  }

  return L.divIcon({
    className: "custom-inspection-icon",
    html: `
      <div class="w-7 h-7 rounded-md border flex items-center justify-center font-extrabold text-sm text-canvas shadow-md" style="background-color: ${color}; border-color: ${color}40">
        ${icon}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

// Wind Arrow Flow Vector Layer
const createWindFlowIcon = (angle: number, speed: number) => {
  // Speed dictates animation duration (faster speed = faster duration)
  const duration = Math.max(1.0, 4.0 - speed * 0.1);
  return L.divIcon({
    className: "custom-wind-flow-icon",
    html: `
      <style>
        @keyframes windParticle {
          0% { transform: translate(0,0) rotate(${angle}deg) scale(0.6); opacity: 0; }
          15% { opacity: 0.6; }
          85% { opacity: 0.6; }
          100% { transform: translate(40px, -40px) rotate(${angle}deg) scale(1); opacity: 0; }
        }
        .wind-particle-vector {
          animation: windParticle ${duration}s linear infinite;
        }
      </style>
      <div class="wind-particle-vector w-6 h-6 flex items-center justify-center text-accent/40 pointer-events-none">
        →
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
    sources,
    forecastGrid,
    hospitals,
    schools,
    inspections,
    visibleLayers,
    selectMarker,
    mapCenter,
    mapZoom,
    weather
  } = useMapStore();

  const getWardStyle = (aqi: number) => {
    let color = "#10B981";
    if (aqi > 50) color = "#F59E0B";
    if (aqi > 100) color = "#EF4444";
    if (aqi > 200) color = "#EC4899";
    if (aqi > 300) color = "#8B5CF6";

    return {
      color: "var(--color-border)",
      weight: 1.5,
      fillColor: color,
      fillOpacity: 0.12,
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

        {/* 1. Ward Boundaries Layer */}
        {visibleLayers.includes("ward_boundaries") && !!wardsGeoJSON?.features &&
          (wardsGeoJSON.features as WardFeature[]).map((feature: WardFeature, idx: number) => {
            const coords = feature.geometry.coordinates[0].map((c) => [c[1], c[0]] as [number, number]);
            const props = feature.properties;
            return (
              <Polygon
                key={props.ward_id || idx}
                positions={coords}
                pathOptions={getWardStyle(props.current_aqi)}
                eventHandlers={{
                  click: () => {
                    // Treat clicked polygon as a hotspot selection payload to trigger Right Info Panel
                    selectMarker({
                      hotspot_id: props.ward_id,
                      latitude: coords[0][0],
                      longitude: coords[0][1],
                      risk_level: props.current_aqi > 200 ? "Critical" : props.current_aqi > 100 ? "High" : "Moderate",
                      severity: roundValue(props.current_aqi / 300.0),
                      estimated_source: "Ward Region Grid",
                      confidence_score: 95,
                      radius: 2000,
                      ward_name: props.ward_name,
                      ward_code: props.ward_code,
                      population: props.population,
                      aqi: props.current_aqi
                    } as unknown as Hotspot, "hotspot");
                  }
                }}
              />
            );
          })
        }

        {/* 2. Heatmap Gradient Rings */}
        {visibleLayers.includes("heatmap") && heatmapPoints &&
          heatmapPoints.map((pt, idx) => (
            <Circle
              key={`heat-${idx}`}
              center={[pt[0], pt[1]]}
              radius={2000}
              pathOptions={{
                color: "#EF4444",
                fillColor: "#EF4444",
                fillOpacity: 0.15 * pt[2],
                weight: 0
              }}
            />
          ))
        }

        {/* 3. Pollution Sources Layer */}
        {visibleLayers.includes("industries") && sources &&
          sources.map((src) => (
            <Marker
              key={src.id}
              position={[src.latitude, src.longitude]}
              icon={createSourceIcon(src.type)}
              eventHandlers={{
                click: () => selectMarker(src, "source")
              }}
            />
          ))
        }

        {/* 4. Forecast Layers (24h/48h/72h circular overlays) */}
        {visibleLayers.includes("forecast_grid") && forecastGrid &&
          forecastGrid.map((fc, idx) => (
            <Circle
              key={`fc-${idx}`}
              center={[fc.latitude, fc.longitude]}
              radius={1800}
              pathOptions={{
                color: fc.color,
                fillColor: fc.color,
                fillOpacity: 0.15,
                weight: 1.5,
                dashArray: "4"
              }}
            />
          ))
        }

        {/* 5. Health Risk (Hospitals & Schools sensitive markers) */}
        {visibleLayers.includes("hospitals") && hospitals &&
          hospitals.map((h, idx) => (
            <Marker
              key={`hosp-${idx}`}
              position={[h.latitude, h.longitude]}
              icon={createHospitalIcon()}
              eventHandlers={{
                click: () => selectMarker(h, "hospital")
              }}
            />
          ))
        }

        {visibleLayers.includes("schools") && schools &&
          schools.map((s, idx) => (
            <Marker
              key={`sch-${idx}`}
              position={[s.latitude, s.longitude]}
              icon={createSchoolIcon()}
              eventHandlers={{
                click: () => selectMarker(s, "school")
              }}
            />
          ))
        }

        {/* 6. Inspections Layer */}
        {visibleLayers.includes("inspections") && inspections &&
          inspections.map((insp) => (
            <Marker
              key={insp.id}
              position={[insp.latitude, insp.longitude]}
              icon={createInspectionIcon(insp.status)}
            />
          ))
        }

        {/* 7. AQI Stations Layer */}
        {visibleLayers.includes("aqi_stations") && stations &&
          stations.map((st) => (
            <Marker
              key={st.station_id}
              position={[st.latitude, st.longitude]}
              icon={createStationIcon(st.aqi)}
              eventHandlers={{
                click: () => selectMarker(st, "station")
              }}
            />
          ))
        }

        {/* 8. Hotspot Glowing Red Circles */}
        {visibleLayers.includes("heatmap") && hotspots &&
          hotspots.map((hp) => (
            <Circle
              key={`glow-${hp.hotspot_id}`}
              center={[hp.latitude, hp.longitude]}
              radius={hp.radius}
              pathOptions={{
                color: "#EF4444",
                fillColor: "#EF4444",
                fillOpacity: 0.08,
                weight: 1.5,
                className: "glow-hotspot-circle"
              }}
            />
          ))
        }

        {/* 9. Animated Wind Flow Layer */}
        {visibleLayers.includes("weather") && weather &&
          [
            [0.015, -0.015], [-0.015, 0.015], [0.02, 0.02], [-0.02, -0.02], [0.0, 0.0]
          ].map(([latOff, lngOff], idx) => (
            <Marker
              key={`flow-${idx}`}
              position={[mapCenter[0] + latOff, mapCenter[1] + lngOff]}
              icon={createWindFlowIcon(45, weather.wind_speed)}
              interactive={false}
            />
          ))
        }
      </MapContainer>
    </div>
  );
}

function roundValue(val: number) {
  return round(val, 2);
}

function round(val: number, decimals: number) {
  const mult = Math.pow(10, decimals);
  return Math.round(val * mult) / mult;
}
