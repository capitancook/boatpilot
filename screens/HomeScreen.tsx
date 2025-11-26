import React from 'react';
import { useBoat } from '../context/BoatContext';
import { Screen } from '../types';
import { Compass } from '../components/Compass';
import { Button } from '../components/ui/Button';

export const HomeScreen: React.FC = () => {
  const { setScreen } = useBoat();

  return (
    <div className="flex flex-col h-full">
      <div className="bg-blue-600 p-4 text-center shadow-md z-10">
         <h1 className="text-2xl font-black text-white tracking-wider">BOAT PILOT</h1>
         <div className="text-xs text-blue-100">HOME</div>
      </div>

      <div className="flex-1 bg-blue-500 flex flex-col items-center justify-start p-6 space-y-6">
        <Compass />

        <div className="w-full max-w-xs space-y-4 mt-auto mb-8">
          <Button onClick={() => setScreen(Screen.MAP)}>MAP</Button>
          <Button onClick={() => setScreen(Screen.WAYPOINTS)}>WAY POINTS</Button>
          <Button onClick={() => setScreen(Screen.SETTINGS)}>SETTINGS</Button>
          <Button onClick={() => setScreen(Screen.NAV)}>NAV</Button>
        </div>
        
        <div className="text-white/60 text-xs text-center border p-2 border-white/30">
          Nella pagina Home sono presenti 4 pulsanti per aprire le corrispettive pagine
        </div>
      </div>
    </div>
  );
};
