import React from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface AttendanceMapProps {
  campusCenter: L.LatLngExpression;
  radius: number;
  mode: "LURING" | "DARING";
  userLocation?: L.LatLngExpression | null;
  isWithinCampus?: boolean;
}

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const AttendanceMap: React.FC<AttendanceMapProps> = ({
  campusCenter,
  radius,
  mode,
  userLocation,
  isWithinCampus,
}) => {
  let markerIcon = blueIcon;
  let popupText = "Lokasi Anda saat ini (Mode Daring).";
  let mapCenter = campusCenter; // Default pusat peta adalah kampus

  if (mode === "LURING") {
    markerIcon = isWithinCampus ? greenIcon : redIcon;
    popupText = isWithinCampus
      ? "Anda berada di dalam area kampus."
      : "Anda berada di luar area kampus.";
    // Untuk mode Luring, peta selalu berpusat di kampus
    mapCenter = campusCenter;
  } else if (mode === "DARING" && userLocation) {
    // Untuk mode Daring, peta berpusat di lokasi pengguna jika ada
    mapCenter = userLocation;
  }

  return (
    <MapContainer
      center={mapCenter} // Menggunakan mapCenter yang sudah disesuaikan
      zoom={16}
      scrollWheelZoom={false}
      dragging={true}
      style={{ height: "250px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {mode === "LURING" && (
        <Circle
          center={campusCenter}
          radius={radius}
          pathOptions={{ color: "green", fillColor: "green", fillOpacity: 0.2 }}
        >
          <Popup>Area absensi yang diizinkan.</Popup>
        </Circle>
      )}

      {userLocation && (
        <Marker position={userLocation} icon={markerIcon}>
          <Popup>{popupText}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default AttendanceMap;
