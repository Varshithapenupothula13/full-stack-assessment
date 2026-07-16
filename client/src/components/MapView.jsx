import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default Leaflet Marker Icons Fix (Markers సరిగ్గా కనిపించడానికి)
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// 1. Map ని లొకేషన్ మారినప్పుడు ఆటోమేటిక్‌గా రీ-సెంటర్ చేసే హెల్పర్ కంపోనెంట్
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, {
        animate: true,
        duration: 1.5, // 1.5 seconds smooth animation తో కొత్త లొకేషన్ కి వెళ్తుంది
      });
    }
  }, [center, zoom, map]);
  return null;
}

function MapView({ pickupCoords, dropCoords }) {
  // Default Center: Rajahmundry/Nidadavole area (AP)
  const defaultCenter = [16.9891, 81.7835]; 
  const defaultZoom = 10;

  // Map కి సెంటర్ లొకేషన్ డిసైడ్ చేయడం
  let mapCenter = defaultCenter;
  let currentZoom = defaultZoom;

  if (pickupCoords && dropCoords) {
    // రెండు లొకేషన్స్ ఉంటే వాటి మధ్యలోకి మ్యాప్ ని సెంటర్ చేస్తాం
    mapCenter = [
      (pickupCoords.lat + dropCoords.lat) / 2,
      (pickupCoords.lon + dropCoords.lon) / 2,
    ];
    currentZoom = 11;
  } else if (pickupCoords) {
    mapCenter = [pickupCoords.lat, pickupCoords.lon];
    currentZoom = 13;
  } else if (dropCoords) {
    mapCenter = [dropCoords.lat, dropCoords.lon];
    currentZoom = 13;
  }

  // Route లైన్ గీయడానికి పాయింట్స్
  const polylinePositions =
    pickupCoords && dropCoords
      ? [
          [pickupCoords.lat, pickupCoords.lon],
          [dropCoords.lat, dropCoords.lon],
        ]
      : [];

  return (
    <MapContainer
      center={mapCenter}
      zoom={currentZoom}
      style={{ width: "100%", height: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 2. లొకేషన్ మారిన ప్రతిసారి ఈ కంపోనెంట్ మ్యాప్ ని జూమ్/సెంటర్ చేస్తుంది */}
      <ChangeMapView center={mapCenter} zoom={currentZoom} />

      {/* Pickup Marker */}
      {pickupCoords && (
        <Marker position={[pickupCoords.lat, pickupCoords.lon]}>
          <Popup>📍 Pickup Location</Popup>
        </Marker>
      )}

      {/* Drop Marker */}
      {dropCoords && (
        <Marker position={[dropCoords.lat, dropCoords.lon]}>
          <Popup>🏁 Drop Location</Popup>
        </Marker>
      )}

      {/* Route Line (Pickup to Drop బ్లూ లైన్) */}
      {polylinePositions.length > 0 && (
        <Polyline positions={polylinePositions} color="#00aeff" weight={4} />
      )}
    </MapContainer>
  );
}

export default MapView;