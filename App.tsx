import React from 'react';
import { BoatProvider, useBoat } from './context/BoatContext';
import { Screen } from './types';
import { HomeScreen } from './screens/HomeScreen';
import { MapScreen } from './screens/MapScreen';
import { WaypointsScreen } from './screens/WaypointsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { NavScreen } from './screens/NavScreen';

const ScreenManager = () => {
  const { screen } = useBoat();

  switch (screen) {
    case Screen.HOME: return <HomeScreen />;
    case Screen.MAP: return <MapScreen />;
    case Screen.WAYPOINTS: return <WaypointsScreen />;
    case Screen.SETTINGS: return <SettingsScreen />;
    case Screen.NAV: return <NavScreen />;
    default: return <HomeScreen />;
  }
};

const App = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-800 p-4">
      {/* iPhone Frame Simulation */}
      <div className="relative w-full max-w-sm h-[800px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden ring-4 ring-gray-700/50">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-40 bg-black rounded-b-2xl z-50"></div>
        
        {/* Status Bar simulation area */}
        <div className="h-8 bg-blue-600 w-full"></div>

        {/* Main Content Area */}
        <div className="h-[calc(100%-2rem)] bg-blue-500 w-full relative overflow-hidden">
          <BoatProvider>
            <ScreenManager />
          </BoatProvider>
        </div>
        
        {/* Home Bar Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50"></div>
      </div>
    </div>
  );
};

export default App;
