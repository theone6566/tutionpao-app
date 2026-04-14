import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { MapPin, X, User } from 'lucide-react';
import L from 'leaflet';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create profile pic circle marker
const createProfileIcon = (photoUrl, isUser = false) => {
  const size = isUser ? 48 : 40;
  const borderColor = isUser ? '#FF6B2B' : '#4A90D9';
  const borderWidth = isUser ? 3 : 2;

  const html = photoUrl
    ? `<div style="
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        border: ${borderWidth}px solid ${borderColor};
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        background: #1E1E1E;
      ">
        <img src="${photoUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      ${isUser ? '<div style="width:12px;height:12px;background:#FF6B2B;border-radius:50%;position:absolute;bottom:-2px;right:-2px;border:2px solid #121212;"></div>' : ''}`
    : `<div style="
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        border: ${borderWidth}px solid ${borderColor};
        background: #1E1E1E;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        color: ${borderColor};
        font-size: ${size * 0.4}px;
        font-weight: bold;
      ">
        ?
      </div>`;

  return L.divIcon({
    html,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Pulsing user marker
const createUserIcon = (photoUrl) => {
  const size = 52;

  const html = `
    <div style="position:relative;">
      <div style="
        position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
        width: 70px; height: 70px;
        border-radius: 50%;
        background: rgba(255,107,43,0.2);
        animation: pulse 2s infinite;
      "></div>
      <div style="
        position:relative; z-index:2;
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        border: 3px solid #FF6B2B;
        overflow: hidden;
        box-shadow: 0 0 20px rgba(255,107,43,0.4);
        background: #1E1E1E;
      ">
        ${photoUrl
          ? `<img src="${photoUrl}" style="width:100%;height:100%;object-fit:cover;" />`
          : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#FF6B2B;font-weight:bold;font-size:18px;">You</div>`
        }
      </div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: translate(-50%,-50%) scale(0.8); opacity: 1; }
        100% { transform: translate(-50%,-50%) scale(1.5); opacity: 0; }
      }
    </style>
  `;

  return L.divIcon({
    html,
    className: 'custom-marker-user',
    iconSize: [70, 70],
    iconAnchor: [35, 35],
    popupAnchor: [0, -35],
  });
};

export default function MapView({ userLocation, nearbyUsers, loadingNearby, selectedUser, onSelectUser, onClose, role }) {
  return (
    <div className="w-full h-full relative">
      <MapContainer center={userLocation} zoom={14} className="w-full h-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* User's own marker (pulsing) */}
        <Marker position={userLocation} icon={createUserIcon(null)}>
          <Popup>You are here</Popup>
        </Marker>

        {/* 5km radius circle */}
        <Circle
          center={userLocation}
          pathOptions={{ fillColor: '#FF6B2B', fillOpacity: 0.05, color: '#FF6B2B', opacity: 0.3, weight: 1 }}
          radius={5000}
        />

        {/* Nearby users with profile pic markers */}
        {!loadingNearby && nearbyUsers.map(person => {
          if (!person.location || !person.location.coordinates) return null;

          return (
            <Marker
              key={person._id}
              position={[person.location.coordinates[1], person.location.coordinates[0]]}
              icon={createProfileIcon(person.photo)}
              eventHandlers={{
                click: () => onSelectUser(person),
              }}
            >
              <Popup>
                <div style={{ minWidth: '150px', color: '#fff', background: '#1E1E1E', padding: '8px', borderRadius: '8px', margin: '-12px' }}>
                  <strong>{person.name || 'Unknown'}</strong>
                  {role === 'student' && <><br /><small>{person.subjects?.join(', ') || 'All subjects'}</small><br /><small>₹{person.chargePerMonth || '—'}/mo</small></>}
                  {role === 'teacher' && <><br /><small>{person.subjectsNeeded?.join(', ') || 'All subjects'}</small><br /><small>Budget: ₹{person.budgetPerMonth || '—'}/mo</small></>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Top Bar overlay */}
      <div className="absolute top-4 w-full px-4 z-[400] flex justify-between items-center pointer-events-none">
        <div className="bg-[#1E1E1E]/90 backdrop-blur pointer-events-auto px-4 py-2 rounded-full border border-gray-800 shadow-xl flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            {loadingNearby && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B2B] opacity-75"></span>}
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF6B2B]"></span>
          </span>
          <span className="text-sm font-semibold text-white">
            {loadingNearby ? "Scanning 5km radius..." : `Found ${nearbyUsers.length} nearby`}
          </span>
        </div>
        <button
          onClick={onClose}
          className="bg-[#1E1E1E]/90 backdrop-blur pointer-events-auto p-2 rounded-full border border-gray-800 hover:bg-gray-800 text-white transition cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Custom marker styles */}
      <style>{`
        .custom-marker, .custom-marker-user { background: transparent !important; border: none !important; }
        .leaflet-popup-content-wrapper { background: #1E1E1E !important; border: 1px solid #333 !important; border-radius: 12px !important; }
        .leaflet-popup-tip { background: #1E1E1E !important; }
        .leaflet-popup-content { color: #fff !important; margin: 8px !important; }
      `}</style>
    </div>
  );
}
