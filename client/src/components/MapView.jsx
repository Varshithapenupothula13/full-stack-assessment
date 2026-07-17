import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

// Leaflet default icons path crash fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapController({ pickupCoords, dropCoords }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Paatha control arrays overlapping markers clear chesthundi
    if (map.routeControl) {
      map.removeControl(map.routeControl);
      map.routeControl = null;
    }

    // Dynamic Polyline & routing trigger condition logic
    if (pickupCoords && dropCoords) {
      const pLat = pickupCoords.lat;
      const pLon = pickupCoords.lon || pickupCoords.lng;
      const dLat = dropCoords.lat;
      const dLon = dropCoords.lon || dropCoords.lng;

      if (pLat && pLon && dLat && dLon) {
        const routingControl = L.Routing.control({
          waypoints: [L.latLng(pLat, pLon), L.latLng(dLat, dLon)],
          lineOptions: {
            styles: [{ color: "#0d6efd", weight: 6, opacity: 0.8 }] // Smooth routing trace blue line
          },
          createMarker: () => null, // Built-in numbers clean logic marker
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true
        }).addTo(map);

        map.routeControl = routingControl;
      }
    } else if (pickupCoords) {
      // Input data type map animation flyover focus code logic
      const lat = pickupCoords.lat;
      const lon = pickupCoords.lon || pickupCoords.lng;
      if (lat && lon) {
        map.flyTo([lat, lon], 14, { animate: true });
      }
    }
  }, [pickupCoords, dropCoords, map]);

  return null;
}

export default function MapView({ pickupCoords, dropCoords }) {
  const defaultCenter = [17.0005, 81.7835]; // Rajahmundry center default fallback pointer

  const getPos = (coords) => {
    if (!coords) return null;
    const lat = coords.lat;
    const lon = coords.lon || coords.lng;
    return lat && lon ? [lat, lon] : null;
  };

  const pickupPos = getPos(pickupCoords);
  const dropPos = getPos(dropCoords);

  return (
    <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {pickupPos && (
        <Marker position={pickupPos}>
          <Popup>📍 Pickup Point</Popup>
        </Marker>
      )}
      {dropPos && (
        <Marker position={dropPos}>
          <Popup>🏁 Drop Point</Popup>
        </Marker>
      )}
      <MapController pickupCoords={pickupCoords} dropCoords={dropCoords} />
    </MapContainer>
  );
}