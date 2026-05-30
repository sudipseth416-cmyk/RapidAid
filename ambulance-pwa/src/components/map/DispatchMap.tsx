import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import type { LatLng } from "../../types";

function createIcon(html: string, size: number) {
  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const ambulanceIcon = createIcon(
  `<div style="width:36px;height:36px;background:#E24B4A;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.4);border:2px solid white">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M20 8h-3V6H6v8h12v-2h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"/></svg>
  </div>`,
  36
);

const patientIcon = createIcon(
  `<div style="width:32px;height:32px;background:#3B82F6;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.4);border:2px solid white">
    <div style="transform:rotate(45deg);width:8px;height:8px;background:white;border-radius:50%"></div>
  </div>`,
  32
);

const hospitalIcon = createIcon(
  `<div style="width:32px;height:32px;background:#22C55E;border-radius:6px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.4);border:2px solid white">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-1 11h-4v4h-2v-4H8v-2h4V8h2v4h4z"/></svg>
  </div>`,
  32
);

function MapUpdater({
  center,
  ambulancePos,
}: {
  center: LatLng;
  ambulancePos: LatLng;
}) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds([center, ambulancePos]);
    map.fitBounds(bounds.pad(0.3), { animate: true, maxZoom: 15 });
  }, [map, center, ambulancePos]);
  return null;
}

interface DispatchMapProps {
  ambulancePosition: LatLng;
  destination: LatLng;
  origin: LatLng;
  destinationType: "patient" | "hospital";
  routeOptimized?: boolean;
  distanceKm?: number;
  className?: string;
}

export function DispatchMap({
  ambulancePosition,
  destination,
  origin,
  destinationType,
  routeOptimized = true,
  distanceKm,
  className = "h-52",
}: DispatchMapProps) {
  const route: [number, number][] = [
    [origin.lat, origin.lng],
    [ambulancePosition.lat, ambulancePosition.lng],
    [destination.lat, destination.lng],
  ];

  const destIcon = destinationType === "patient" ? patientIcon : hospitalIcon;

  return (
    <div className={`relative w-full ${className}`}>
      {routeOptimized && (
        <div className="absolute left-3 top-3 z-[1000] rounded-lg bg-dark/90 px-2.5 py-1.5 text-label font-semibold text-green-400 backdrop-blur-sm">
          Route optimized
        </div>
      )}
      {distanceKm !== undefined && (
        <div className="absolute right-3 top-3 z-[1000] rounded-lg bg-dark/90 px-2.5 py-1.5 text-label font-bold tabular-nums backdrop-blur-sm">
          {distanceKm} km
        </div>
      )}

      <MapContainer
        center={[ambulancePosition.lat, ambulancePosition.lng]}
        zoom={14}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
        />
        <Polyline
          positions={route}
          pathOptions={{ color: "#E24B4A", weight: 4, opacity: 0.8, dashArray: "8 6" }}
        />
        <Marker position={[destination.lat, destination.lng]} icon={destIcon} />
        <Marker position={[ambulancePosition.lat, ambulancePosition.lng]} icon={ambulanceIcon} />
        <MapUpdater center={destination} ambulancePos={ambulancePosition} />
      </MapContainer>
    </div>
  );
}
