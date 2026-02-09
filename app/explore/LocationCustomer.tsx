"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate } from "lucide-react";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
  onClose: () => void;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);

  return null;
}

function CustomerMarker({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={[lat, lng]}
      draggable
      icon={customIcon}
      eventHandlers={{
        dragend: (e) => {
          const p = e.target.getLatLng();
          onChange(p.lat, p.lng);
        },
      }}
    />
  );
}

export default function LocationCustomer({
  lat,
  lng,
  onLocationChange,
  onClose,
}: Props) {
  const [currentLat, setCurrentLat] = useState(lat);
  const [currentLng, setCurrentLng] = useState(lng);

  const locateMe = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLat(pos.coords.latitude);
        setCurrentLng(pos.coords.longitude);
      },
      () => alert("تعذر الوصول لموقعك الحالي")
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">

        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">حدد عنوانك</h3>
          <div className="flex gap-2">
            <button
              onClick={locateMe}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-gray-100"
            >
              <Locate className="w-4 h-4" />
              موقعي الحالي
            </button>
            <button onClick={onClose} className="text-xl">×</button>
          </div>
        </div>

        <div className="h-[400px]">
          <MapContainer
            center={[currentLat, currentLng]}
            zoom={15}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <RecenterMap lat={currentLat} lng={currentLng} />

            <CustomerMarker
              lat={currentLat}
              lng={currentLng}
              onChange={(lat, lng) => {
                setCurrentLat(lat);
                setCurrentLng(lng);
              }}
            />
          </MapContainer>
        </div>

        <div className="p-4 text-center space-y-3">
          <p className="text-xs text-gray-500">
            ({currentLat.toFixed(6)}, {currentLng.toFixed(6)})
          </p>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border rounded-full py-2">
              إلغاء
            </button>
            <button
              onClick={() => {
                onLocationChange(currentLat, currentLng);
                onClose();
              }}
              className="flex-1 bg-[#E5A04D] text-white rounded-full py-2"
            >
              تأكيد العنوان
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
