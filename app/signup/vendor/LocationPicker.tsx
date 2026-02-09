"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate } from "lucide-react";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationPickerProps {
  lat: number;
  lng: number;
  radiusKm: number;
  onLocationChange: (lat: number, lng: number) => void;
  onClose: () => void;
}

function DraggableMarker({
  position,
  onPositionChange,
}: {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}) {
  const [markerPosition, setMarkerPosition] = useState(position);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      onPositionChange(lat, lng);
    },
  });

  return (
    <Marker
      position={markerPosition}
      icon={customIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setMarkerPosition([position.lat, position.lng]);
          onPositionChange(position.lat, position.lng);
        },
      }}
    />
  );
}

export default function LocationPicker({
  lat,
  lng,
  radiusKm,
  onLocationChange,
  onClose,
}: LocationPickerProps) {
  const [currentLat, setCurrentLat] = useState(lat);
  const [currentLng, setCurrentLng] = useState(lng);

  const handlePositionChange = (newLat: number, newLng: number) => {
    setCurrentLat(newLat);
    setCurrentLng(newLng);
  };

  const handleConfirm = () => {
    onLocationChange(currentLat, currentLng);
    onClose();
  };

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLat(latitude);
          setCurrentLng(longitude);
        },
        (error) => {
          alert("تعذر الوصول إلى موقعك الحالي. يرجى التحقق من إعدادات المتصفح.");
        }
      );
    } else {
      alert("المتصفح لا يدعم تحديد الموقع.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">حدد موقع المطعم</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLocateMe}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors"
              type="button"
            >
              <Locate className="w-3.5 h-3.5" />
              <span>موقعي الحالي</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              type="button"
            >
              ×
            </button>
          </div>
        </div>

        <div className="h-[400px] relative">
          <MapContainer
            center={[currentLat, currentLng]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker
              position={[currentLat, currentLng]}
              onPositionChange={handlePositionChange}
            />
            {/* Delivery radius circle */}
            <Circle
              center={[currentLat, currentLng]}
              radius={radiusKm * 1000} // Convert km to meters
              pathOptions={{
                color: "#E5A04D",
                fillColor: "#E5A04D",
                fillOpacity: 0.2,
              }}
            />
          </MapContainer>
        </div>

        <div className="p-4 space-y-3">
          <div className="text-sm text-gray-600 text-center">
            <p>اضغط على الخريطة أو اسحب العلامة لتحديد الموقع</p>
            <p className="text-xs text-gray-400 mt-1">
              الإحداثيات: ({currentLat.toFixed(6)}, {currentLng.toFixed(6)})
            </p>
            <p className="text-xs text-[#E5A04D] mt-1">
              الدائرة البرتقالية تمثل نطاق التوصيل ({radiusKm} كم)
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full border-2 border-gray-200 text-gray-700 font-semibold transition-colors hover:border-gray-300"
            >
              إلغاء
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 rounded-full bg-[#E5A04D] hover:bg-[#D4903D] text-white font-semibold transition-colors"
            >
              تأكيد الموقع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
