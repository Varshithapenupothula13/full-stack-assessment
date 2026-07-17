import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const RoutingMachine = ({ pickupCoords, dropCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !pickupCoords || !dropCoords) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(pickupCoords.lat, pickupCoords.lng),
        L.latLng(dropCoords.lat, dropCoords.lng)
      ],
      lineOptions: {
        styles: [{ color: "#6366F1", weight: 5, opacity: 0.8 }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false
    }).addTo(map);

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, pickupCoords, dropCoords]);

  return null;
};

export default RoutingMachine;