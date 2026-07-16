import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- CUSTOM COLORED ICONS CONFIGURATION ---
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to handle dynamic view updates
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [center, zoom, map]);
  return null;
}

function MapView({ pickupCoords, dropCoords }) {
  // Default coordinates (Nidadavole, Andhra Pradesh)
  const defaultCenter = [16.9088, 81.6669];
  const defaultZoom = 8;

  let mapCenter = defaultCenter;
  let currentZoom = defaultZoom;

  // Calculate dynamic center and zoom based on markers
  if (pickupCoords && dropCoords) {
    mapCenter = [
      (pickupCoords.lat + dropCoords.lat) / 2,
      (pickupCoords.lon + dropCoords.lon) / 2,
    ];
    currentZoom = 7;
  } else if (pickupCoords) {
    mapCenter = [pickupCoords.lat, pickupCoords.lon];
    currentZoom = 12;
  } else if (dropCoords) {
    mapCenter = [dropCoords.lat, dropCoords.lon];
    currentZoom = 12;
  }

  // Define polyline path
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

      <ChangeMapView center={mapCenter} zoom={currentZoom} />

      {/* Pickup Marker */}
      {pickupCoords && (
        <Marker position={[pickupCoords.lat, pickupCoords.lon]} icon={greenIcon}>
          <Popup>
            <strong>Pickup Point</strong>
          </Popup>
        </Marker>
      )}

      {/* Drop Marker */}
      {dropCoords && (
        <Marker position={[dropCoords.lat, dropCoords.lon]} icon={redIcon}>
          <Popup>
            <strong>Drop Point</strong>
          </Popup>
        </Marker>
      )}

      {/* Route Path */}
      {polylinePositions.length > 0 && (
        <Polyline positions={polylinePositions} color="#0d6efd" weight={4} dashArray="5, 10" />
      )}
    </MapContainer>
  );
}

export default MapView;