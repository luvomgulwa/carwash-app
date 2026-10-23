"use client";
// This file only runs in the browser, because Leaflet needs the browser to work.
// It shows a map with one pin per carwash.

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Leaflet's pin pictures, copied into the public/leaflet folder.
// We point to them ourselves so the pins don't show up as broken images
// (a common Leaflet + Next.js problem).
const pinIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png", // sharper pin for high-resolution screens
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41], // size of the pin picture
  iconAnchor: [12, 41], // the point of the pin that touches the location
  popupAnchor: [1, -34], // where the popup opens, relative to the pin
  shadowSize: [41, 41],
});

// The information the map needs about each carwash.
export type MapCarwash = {
  id: string;
  name: string;
  phone: string;
  latitude: number;
  longitude: number;
};

export default function CarwashMap({ carwashes }: { carwashes: MapCarwash[] }) {
  // A list of every pin's position, so the map can zoom to show all of them.
  const positions = carwashes.map(
    (carwash) => [carwash.latitude, carwash.longitude] as [number, number]
  );

  return (
    <MapContainer
      bounds={positions}
      boundsOptions={{ padding: [40, 40], maxZoom: 15 }}
      scrollWheelZoom={false} // so scrolling the page doesn't zoom the map by accident
      className="h-72 w-full rounded-2xl sm:h-96"
    >
      {/* The map pictures (tiles) come from OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* One pin for each carwash. Clicking a pin opens its popup. */}
      {carwashes.map((carwash) => (
        <Marker
          key={carwash.id}
          position={[carwash.latitude, carwash.longitude]}
          icon={pinIcon}
        >
          <Popup>
            <strong>{carwash.name}</strong>
            <br />
            <a href={`tel:${carwash.phone}`}>{carwash.phone}</a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
