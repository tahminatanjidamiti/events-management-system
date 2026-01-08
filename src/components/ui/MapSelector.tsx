"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ILocation } from "@/types";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

type MapSelectorProps = {
  value: ILocation;
  onChange: (loc: ILocation) => void;
  height?: number;
  zoom?: number;
};

const MapSelector = ({ value, onChange, height = 400, zoom = 13 }: MapSelectorProps) => {

  const LocationSetter = () => {
    useMapEvents({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      click(e: any) {
        onChange({
          lat: parseFloat(e.latlng.lat.toFixed(5)),
          lng: parseFloat(e.latlng.lng.toFixed(5)),
        });
      },
    });
    return null;
  };

  return (
    <div className="border rounded p-3">
      <MapContainer
        center={[value.lat || 24.8949, value.lng || 91.8687]}
        zoom={zoom}
        scrollWheelZoom
        style={{ height, width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationSetter />

        {value.lat !== 0 && (
          <Marker
            position={[value.lat, value.lng]}
            draggable
            eventHandlers={{
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              dragend: (e: any) => {
                const pos = (e.target as L.Marker).getLatLng();
                onChange({
                  lat: parseFloat(pos.lat.toFixed(5)),
                  lng: parseFloat(pos.lng.toFixed(5)),
                });
              },
            }}
          >
            <Popup>Selected location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapSelector;