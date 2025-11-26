import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useBoat } from '../context/BoatContext';
import { Screen } from '../types';
import { Button } from '../components/ui/Button';

// Fix Leaflet icons
const iconBoat = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconWaypoint = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map clicks and long-press (contextmenu)
const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
    contextmenu(e) {
      // Handle long-press (contextmenu) same as click to set waypoint
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const MapScreen: React.FC = () => {
  const { setScreen, boatStatus, addWaypoint, waypoints } = useBoat();
  const [tempPos, setTempPos] = useState<{lat: number, lng: number} | null>(null);
  const [wpName, setWpName] = useState("");

  // Get next available ID for display
  const nextId = () => {
    const usedIds = new Set(waypoints.map(w => w.id));
    let id = 1;
    while(usedIds.has(id)) id++;
    return id;
  };

  const handleMapClick = (lat: number, lng: number) => {
    setTempPos({ lat, lng });
    setWpName(`WP ${nextId()}`);
  };

  const handleSave = () => {
    if (tempPos && wpName) {
      addWaypoint({
        name: wpName,
        lat: tempPos.lat,
        lng: tempPos.lng
      });
      setScreen(Screen.HOME);
    }
  };

  return (
    <div className="flex flex-col h-full bg-blue-500">
       <div className="bg-blue-600 p-3 text-center shadow-md z-10 flex justify-between items-center">
         <button onClick={() => setScreen(Screen.HOME)} className="text-white text-sm font-bold px-2"> &lt; Back</button>
         <div>
            <h1 className="text-xl font-bold text-white">BOAT PILOT</h1>
            <div className="text-xs text-blue-100">MAP</div>
         </div>
         <div className="w-10"></div>
      </div>

      <div className="flex-1 relative border-4 border-blue-300 m-2 rounded-lg overflow-hidden">
        <MapContainer 
          center={[boatStatus.lat, boatStatus.lng]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          
          {/* Boat Marker */}
          <Marker position={[boatStatus.lat, boatStatus.lng]} icon={iconBoat} />

          {/* Existing Waypoints */}
          {waypoints.map(wp => (
            <Marker key={wp.id} position={[wp.lat, wp.lng]} icon={iconWaypoint} opacity={0.6} />
          ))}

          {/* Temporary Selection */}
          {tempPos && <Marker position={[tempPos.lat, tempPos.lng]} icon={iconWaypoint} />}
        </MapContainer>

        {/* Floating Instruction if no selection */}
        {!tempPos && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white p-2 rounded text-center pointer-events-none z-[1000] text-sm">
            Tap or Long Press map to select
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="p-4 bg-blue-600 space-y-3">
        <div className="bg-white p-2 rounded flex items-center">
          <span className="text-black font-bold mr-2 text-sm">NAME:</span>
          <input 
            type="text" 
            value={wpName}
            onChange={(e) => setWpName(e.target.value)}
            disabled={!tempPos}
            placeholder={tempPos ? "Waypoint name" : "Select point on map"}
            className="flex-1 outline-none text-black font-mono uppercase bg-transparent"
          />
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={!tempPos}
          className={!tempPos ? "opacity-50 cursor-not-allowed" : ""}
        >
          {tempPos ? `SET WP N ${nextId()}` : "SET WP"}
        </Button>
      </div>
    </div>
  );
};