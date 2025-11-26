import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useBoat } from '../context/BoatContext';
import { Screen } from '../types';
import { Button } from '../components/ui/Button';
import { startSignal, stopSignal, updateSignal } from '../services/audioService';

// Boat Icon
const iconBoat = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41]
});

// Destination Icon
const iconDest = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41]
});

export const NavScreen: React.FC = () => {
  const { setScreen, boatStatus, updateBoatStatus, targetWaypoint, setTargetWaypoint, settings } = useBoat();
  const [eta, setEta] = useState<number>(0);
  const watchId = useRef<number | null>(null);

  // Start Navigation Logic
  useEffect(() => {
    // 1. Start Audio PWM Simulation
    startSignal();

    // 2. Start Geolocation Watch (or simple mock movement if no Geo)
    updateBoatStatus({ isNavigating: true, trackHistory: [] });

    if ('geolocation' in navigator) {
      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, speed, heading } = pos.coords;
          
          updateBoatStatus({
            lat: latitude,
            lng: longitude,
            // Convert m/s to Knots (1 m/s = 1.94384 knots)
            speedKnots: speed ? speed * 1.94384 : (Math.random() * 2 + 2), // Mock speed if null
            heading: heading || 0,
            trackHistory: [...boatStatus.trackHistory, [latitude, longitude]]
          });
        },
        (err) => {
          console.warn("Geolocation error, using mock movement", err);
          // Fallback mock movement loop handled in separate effect for simplicity
        },
        { enableHighAccuracy: true }
      );
    }

    return () => {
      stopSignal();
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
      updateBoatStatus({ isNavigating: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Mock movement simulation loop (runs if standard geo is static or testing)
  useEffect(() => {
    const timer = setInterval(() => {
       // Simulate moving towards target if exists
       if (targetWaypoint) {
         // Simple linear interpolation for visual effect
         const dLat = (targetWaypoint.lat - boatStatus.lat) * 0.05;
         const dLng = (targetWaypoint.lng - boatStatus.lng) * 0.05;
         
         const newLat = boatStatus.lat + dLat * 0.01;
         const newLng = boatStatus.lng + dLng * 0.01;
         
         // Calculate bearing
         const y = Math.sin(dLng * Math.PI / 180) * Math.cos(targetWaypoint.lat * Math.PI / 180);
         const x = Math.cos(boatStatus.lat * Math.PI / 180) * Math.sin(targetWaypoint.lat * Math.PI / 180) -
                   Math.sin(boatStatus.lat * Math.PI / 180) * Math.cos(targetWaypoint.lat * Math.PI / 180) * Math.cos(dLng * Math.PI / 180);
         const brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;

         updateBoatStatus({
           lat: newLat,
           lng: newLng,
           heading: brng,
           speedKnots: 3.5 + Math.random() * 0.5,
           trackHistory: [...boatStatus.trackHistory, [newLat, newLng]]
         });

         // Calculate dummy ETA (minutes)
         const dist = Math.sqrt(dLat*dLat + dLng*dLng) * 60; // rough NM
         setEta(Math.round((dist / 3.5) * 60)); // Minutes
         
         // Simulate Control Loop -> PWM Output
         // Error between current heading and target
         const error = (brng - boatStatus.heading);
         // Proportional control
         const correction = Math.max(-1, Math.min(1, error / settings.angleRange));
         // Map to 1ms-2ms (1.5 center)
         const pwm = 1.5 + (correction * 0.5); 
         
         // Update Audio
         updateSignal(pwm, pwm); // Differential would be (1.5+c, 1.5-c)
       } else {
         // Reset signal to neutral if no target
         updateSignal(1.5, 1.5);
         setEta(0);
       }
    }, 1000);
    return () => clearInterval(timer);
  }, [boatStatus.lat, boatStatus.lng, targetWaypoint, settings, boatStatus.trackHistory, updateBoatStatus]);

  const handleStop = () => {
    setScreen(Screen.HOME);
  };

  const handleClearRoute = () => {
    if (window.confirm("Are you sure you want to clear the current route?")) {
      setTargetWaypoint(null);
      updateBoatStatus({ trackHistory: [] });
      setEta(0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-blue-500">
       <div className="bg-blue-600 p-3 text-center shadow-md z-10">
          <h1 className="text-xl font-bold text-white">BOAT PILOT</h1>
          <div className="text-xs text-blue-100">NAV</div>
      </div>

      <div className="flex-1 relative border-4 border-blue-300 m-2 rounded-lg overflow-hidden">
        <MapContainer 
          center={[boatStatus.lat, boatStatus.lng]} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={[boatStatus.lat, boatStatus.lng]} icon={iconBoat} />
          {targetWaypoint && <Marker position={[targetWaypoint.lat, targetWaypoint.lng]} icon={iconDest} />}
          
          {/* Dashed white line for track */}
          <Polyline 
            positions={boatStatus.trackHistory} 
            pathOptions={{ color: 'white', dashArray: '10, 10', weight: 3 }} 
          />
          
          {/* Line to target */}
          {targetWaypoint && (
             <Polyline 
               positions={[[boatStatus.lat, boatStatus.lng], [targetWaypoint.lat, targetWaypoint.lng]]}
               pathOptions={{ color: 'red', weight: 1, opacity: 0.5 }}
             />
          )}
        </MapContainer>
      </div>

      <div className="bg-white p-4 m-2 mt-0 rounded shadow text-center space-y-2">
        <div className="font-bold text-gray-800 text-lg uppercase">
           {targetWaypoint ? targetWaypoint.name : "NO WAYPOINT"}
        </div>
        <div className="flex justify-center items-baseline space-x-4 font-mono font-black text-2xl">
          <div>
            KNT <span className="text-blue-700">{boatStatus.speedKnots.toFixed(1)}</span>
          </div>
          <div className="text-gray-400 text-sm">|</div>
          <div>
             time <span className="text-blue-700">{eta} m.</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-500 pt-0 flex gap-4">
        <Button onClick={handleClearRoute} variant="danger" className="flex-1">CLEAR</Button>
        <Button onClick={handleStop} variant="primary" className="flex-1">STOP</Button>
      </div>
    </div>
  );
};
