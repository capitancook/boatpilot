import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, Screen, Waypoint, BoatStatus } from '../types';

interface BoatContextType {
  screen: Screen;
  setScreen: (s: Screen) => void;
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
  waypoints: Waypoint[];
  addWaypoint: (w: Omit<Waypoint, 'id'>) => void;
  deleteWaypoint: (id: number) => void;
  targetWaypoint: Waypoint | null;
  setTargetWaypoint: (w: Waypoint | null) => void;
  boatStatus: BoatStatus;
  updateBoatStatus: (s: Partial<BoatStatus>) => void;
}

const BoatContext = createContext<BoatContextType | undefined>(undefined);

const DEFAULT_SETTINGS: AppSettings = {
  ch1Center: 1.5,
  ch2Center: 1.5,
  angleRange: 5,
  averageTime: 10,
};

const MOCK_START_POS = { lat: 41.282, lng: 9.408 }; // Approx Palau/Maddalena area from PDF

export const BoatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<Screen>(Screen.HOME);
  
  // Load settings from local storage or default
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('boatSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Load waypoints
  const [waypoints, setWaypoints] = useState<Waypoint[]>(() => {
    const saved = localStorage.getItem('boatWaypoints');
    return saved ? JSON.parse(saved) : [];
  });

  const [targetWaypoint, setTargetWaypoint] = useState<Waypoint | null>(null);

  const [boatStatus, setBoatStatus] = useState<BoatStatus>({
    speedKnots: 0,
    heading: 0,
    lat: MOCK_START_POS.lat,
    lng: MOCK_START_POS.lng,
    isNavigating: false,
    trackHistory: [],
  });

  // Persist Data
  useEffect(() => {
    localStorage.setItem('boatSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('boatWaypoints', JSON.stringify(waypoints));
  }, [waypoints]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addWaypoint = (wp: Omit<Waypoint, 'id'>) => {
    if (waypoints.length >= 10) {
      alert("Memory Full! Please delete a waypoint first.");
      return;
    }
    // Find first available ID 1-10
    const usedIds = new Set(waypoints.map(w => w.id));
    let newId = 1;
    while (usedIds.has(newId)) newId++;

    const newWp = { ...wp, id: newId };
    setWaypoints(prev => [...prev, newWp].sort((a, b) => a.id - b.id));
  };

  const deleteWaypoint = (id: number) => {
    setWaypoints(prev => prev.filter(w => w.id !== id));
    if (targetWaypoint?.id === id) setTargetWaypoint(null);
  };

  const updateBoatStatus = (status: Partial<BoatStatus>) => {
    setBoatStatus(prev => ({ ...prev, ...status }));
  };

  return (
    <BoatContext.Provider value={{
      screen,
      setScreen,
      settings,
      updateSettings,
      waypoints,
      addWaypoint,
      deleteWaypoint,
      targetWaypoint,
      setTargetWaypoint,
      boatStatus,
      updateBoatStatus
    }}>
      {children}
    </BoatContext.Provider>
  );
};

export const useBoat = () => {
  const context = useContext(BoatContext);
  if (!context) throw new Error("useBoat must be used within a BoatProvider");
  return context;
};