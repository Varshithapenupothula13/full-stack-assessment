import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapView() {
  // Pickup & Drop Coordinates
  const pickup = [17.0005, 81.8040]; // Rajahmundry
  const drop = [16.9891, 82.2475]; // Kakinada

  // Route Line
  const route = [pickup, drop];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={pickup}
        zoom={10}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Pickup Marker */}
        <Marker position={pickup}>
          <Popup>📍 Pickup Location</Popup>
        </Marker>

        {/* Drop Marker */}
        <Marker position={drop}>
          <Popup>🏁 Drop Location</Popup>
        </Marker>

        {/* Route */}
        <Polyline
          positions={route}
          pathOptions={{
            color: "blue",
            weight: 5,
          }}
        />
      </MapContainer>
    </div>
  );
}

export default MapView;