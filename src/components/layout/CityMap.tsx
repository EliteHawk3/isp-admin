import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Define Coordinates Type for LatLngTuple
type Coordinates = [number, number];

// Initial Position - Pakistan (Zoomed Out)
const initialPosition: Coordinates = [30.3753, 69.3451]; // Pakistan Center
const cityPosition: Coordinates = [30.6647, 70.9715]; // Shah Sadar Din Coordinates

// Mockup User Data
const users = [
  { id: 1, name: "Ali Khan", position: [30.6641, 70.9712] as Coordinates, status: "Active" },
  { id: 2, name: "Sara Ahmed", position: [30.6667, 70.9735] as Coordinates, status: "Inactive" },
  { id: 3, name: "Kamran Iqbal", position: [30.6625, 70.9689] as Coordinates, status: "Active" },
  { id: 4, name: "Ayesha Raza", position: [30.6655, 70.9755] as Coordinates, status: "Pending" },
  { id: 5, name: "Usman Ali", position: [30.6675, 70.9720] as Coordinates, status: "Active" },
];

// Props Interface for Dynamic Height
interface CityMapProps {
  height?: number; // Optional height prop
}

// Zoom Animation Component
const AnimatedMapView: React.FC = () => {
  const map = useMap(); // Access Leaflet Map instance

  useEffect(() => {
    // Start at Pakistan with zoom 6
    map.setView(initialPosition, 6);

    // Animate to Shah Sadar Din
    setTimeout(() => map.flyTo(cityPosition, 14, { duration: 2.5 }), 1000);
  }, [map]);

  return null; // No UI elements here; just handles animation
};

// City Map Component
const CityMap: React.FC<CityMapProps> = ({ height = 400 }) => {
  return (
    <div
      style={{
        height: `${height}px`,
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={initialPosition} // Start from Pakistan
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Animation Logic */}
        <AnimatedMapView />

        {/* Map Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Main City Marker */}
        <Marker position={cityPosition}>
          <Popup>Main City Center - Shah Sadar Din</Popup>
        </Marker>

        {/* User Markers */}
        {users.map((user) => (
          <Marker key={user.id} position={user.position}>
            <Popup>
              <strong>{user.name}</strong>
              <br />
              Status: {user.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CityMap;
