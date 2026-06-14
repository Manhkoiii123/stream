"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

const defaultIcon = L.icon({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface SessionLocationMapProps {
  latitude: number;
  longitude: number;
}

const SessionLocationMap = ({
  latitude,
  longitude,
}: SessionLocationMapProps) => {
  const position: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={11}
      scrollWheelZoom={false}
      className="h-[300px] w-full rounded-md z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={defaultIcon} />
    </MapContainer>
  );
};

export default SessionLocationMap;
