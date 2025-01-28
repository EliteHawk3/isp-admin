import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useUsers } from "../../context/UsersContext";
import { User } from "../../types/users";

// Add this CSS for the rotating animation
const styles = `
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.earth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(45deg, #1a1a1a, #2d2d2d);
}

.earth-spinner {
  animation: rotate 8s linear infinite;
  width: 100px;
  height: 100px;
}

.loading-text {
  margin-top: 20px;
  color: #718096;
  font-size: 1.2rem;
}
`;

const EarthSpinner = () => (
  <svg
    className="earth-spinner"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="45" fill="#2D3748" />
    <path
      d="M50 5
         a45 45 0 0 1 30 15
         a50 50 0 0 0 -30 -5
         a45 45 0 0 1 -30 15
         a50 50 0 0 0 30 -5"
      fill="#4A5568"
    />
    <path
      d="M20 40
         q15 -10 30 0
         q15 10 30 0
         q-15 20 -30 0
         q-15 20 -30 0"
      fill="#63B3ED"
      opacity="0.8"
    />
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="none"
      stroke="#4A5568"
      strokeWidth="2"
    />
  </svg>
);

// Fix leaflet marker icons
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type Coordinates = [number, number];

interface GeocodedUser extends User {
  coordinates?: Coordinates;
}

interface CityMapProps {
  height?: number;
}

const useGeocode = () => {
  const [cache, setCache] = useState<Record<string, Coordinates>>({});

  const geocodeAddress = useCallback(
    async (address: string): Promise<Coordinates | null> => {
      if (cache[address]) return cache[address];

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}`
        );
        const data = await response.json();

        if (data.length > 0) {
          const coords: Coordinates = [
            parseFloat(data[0].lat),
            parseFloat(data[0].lon),
          ];
          setCache((prev) => ({ ...prev, [address]: coords }));
          return coords;
        }
        return null;
      } catch (error) {
        console.error("Geocoding error:", error);
        return null;
      }
    },
    [cache]
  );

  return { geocodeAddress };
};

const AnimatedMapView: React.FC<{ users: GeocodedUser[] }> = ({ users }) => {
  const map = useMap();
  const validCoordinates = users
    .filter((u) => u.coordinates)
    .map((u) => u.coordinates!);

  useEffect(() => {
    if (validCoordinates.length > 0) {
      const bounds = L.latLngBounds(validCoordinates);
      map.fitBounds(bounds.pad(0.1));
    } else {
      map.setView([30.3753, 69.3451], 6);
    }
  }, [map, validCoordinates]);

  return null;
};

const CityMap: React.FC<CityMapProps> = ({ height = 400 }) => {
  const { users } = useUsers();
  const { geocodeAddress } = useGeocode();
  const [geocodedUsers, setGeocodedUsers] = useState<GeocodedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const geocodeAllAddresses = async () => {
      setIsLoading(true);
      const results = await Promise.all(
        users.map(async (user) => {
          const coords = await geocodeAddress(user.address);
          return { ...user, coordinates: coords || undefined };
        })
      );
      setGeocodedUsers(results);
      setIsLoading(false);
    };

    geocodeAllAddresses();
  }, [users, geocodeAddress]); // Add geocodeAddress to dependencies

  return (
    <div
      style={{
        height: `${height}px`,
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <style>{styles}</style>
      {isLoading ? (
        <div className="earth-container">
          <EarthSpinner />
          <div className="loading-text">Locating users...</div>
        </div>
      ) : (
        <MapContainer
          center={[30.3753, 69.3451]}
          zoom={6}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <AnimatedMapView users={geocodedUsers} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {geocodedUsers.map(
            (user) =>
              user.coordinates && (
                <Marker key={user.id} position={user.coordinates}>
                  <Popup>
                    <strong>{user.name}</strong>
                    <br />
                    <span>Address: {user.address}</span>
                    <br />
                    <span>
                      Status: {user.payments?.[0]?.status || "Unknown"}
                    </span>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      )}
    </div>
  );
};

export default CityMap;
