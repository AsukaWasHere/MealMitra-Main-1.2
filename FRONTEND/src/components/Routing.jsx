// FRONTEND/src/components/Routing.jsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const Routing = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || waypoints.length < 2) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(waypoints[0][0], waypoints[0][1]),
        L.latLng(waypoints[1][0], waypoints[1][1])
      ],
      lineOptions: {
        styles: [{ color: "#059669", weight: 6 }]
      },
      show: false, // Set to true if you want to see the text instructions
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null, // Prevents creating duplicate markers
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, waypoints]);

  return null;
};

export default Routing;