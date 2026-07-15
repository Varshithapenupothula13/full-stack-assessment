import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 11);
  }, [center, map]);

  return null;
}
function MapView({ pickup, drop }) {
  const [pickupCoords, setPickupCoords] = useState([17.0005, 81.8040]);
  const [dropCoords, setDropCoords] = useState([16.9891, 82.2475]);

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        if (pickup) {
          const pickupRes = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${pickup}`
          );

          if (pickupRes.data.length > 0) {
            setPickupCoords([
              parseFloat(pickupRes.data[0].lat),
              parseFloat(pickupRes.data[0].lon),
            ]);
          }
        }

        if (drop) {
          const dropRes = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${drop}`
          );

          if (dropRes.data.length > 0) {
            setDropCoords([
              parseFloat(dropRes.data[0].lat),
              parseFloat(dropRes.data[0].lon),
            ]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCoordinates();
  }, [pickup, drop]);

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
        center={pickupCoords}
        zoom={11}
        style={{ width: "100%", height: "100%" }}
      >
        <ChangeMapView center={pickupCoords} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={pickupCoords}>
          <Popup>📍 Pickup Location</Popup>
        </Marker>

        <Marker position={dropCoords}>
          <Popup>🏁 Drop Location</Popup>
        </Marker>

        <Polyline
          positions={[pickupCoords, dropCoords]}
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