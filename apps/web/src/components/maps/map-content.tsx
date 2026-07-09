"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCityStore } from "@/store/city";

// Fix standard Leaflet marker assets resolving bug in Webpack
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Centers mapping config
const CITY_CENTERS: Record<string, [number, number]> = {
  Vijayawada: [16.5062, 80.6480],
  Hyderabad: [17.3850, 78.4867],
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Delhi: [28.6139, 77.2090],
};

// Component to dynamically pan map center when global city switcher triggers
function MapRecenter() {
  const map = useMap();
  const { selectedCity } = useCityStore();

  useEffect(() => {
    const center = CITY_CENTERS[selectedCity] || CITY_CENTERS.Vijayawada;
    map.setView(center, 12);
  }, [selectedCity, map]);

  return null;
}

export default function MapContent() {
  const { selectedCity } = useCityStore();
  const defaultCenter = CITY_CENTERS[selectedCity] || CITY_CENTERS.Vijayawada;

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Recenter triggers */}
        <MapRecenter />

        {/* Center Marker */}
        <Marker position={defaultCenter}>
          <Popup>
            <div className="text-xs font-semibold text-ink-primary p-1">
              {selectedCity} City Center Station
            </div>
          </Popup>
        </Marker>

        {/* Hotspot Circle Preview */}
        <Circle
          center={[defaultCenter[0] + 0.015, defaultCenter[1] - 0.015]}
          radius={1200}
          pathOptions={{
            color: "#EF4444",
            fillColor: "#EF4444",
            fillOpacity: 0.2,
            weight: 1.5,
          }}
        >
          <Popup>
            <div className="text-xs p-1">
              <span className="font-bold text-danger block mb-0.5">High Risk Hotspot</span>
              <span>Sensor KV-02 reported PM2.5 threshold warnings.</span>
            </div>
          </Popup>
        </Circle>
      </MapContainer>
    </div>
  );
}
