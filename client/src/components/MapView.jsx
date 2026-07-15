import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapView() {
  const pickup = [17.0005, 81.8040]; // Rajahmundry
  const drop = [16.9891, 82.2475]; // Kakinada

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={pickup}
        zoom={10}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={pickup}>
          <Popup>Pickup Location</Popup>
        </Marker>

        <Marker position={drop}>
          <Popup>Drop Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapView;