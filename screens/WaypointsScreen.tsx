import React, { useState } from 'react';
import { useBoat } from '../context/BoatContext';
import { Screen } from '../types';
import { Button } from '../components/ui/Button';

export const WaypointsScreen: React.FC = () => {
  const { setScreen, waypoints, deleteWaypoint, setTargetWaypoint } = useBoat();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSet = () => {
    if (selectedId !== null) {
      const wp = waypoints.find(w => w.id === selectedId);
      if (wp) {
        setTargetWaypoint(wp);
        setScreen(Screen.HOME);
      }
    }
  };

  const handleErase = () => {
    if (selectedId !== null) {
      if (window.confirm("Are you sure you want to delete this waypoint?")) {
        deleteWaypoint(selectedId);
        setSelectedId(null);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-blue-500">
      <div className="bg-blue-600 p-3 text-center shadow-md flex justify-between items-center">
         <button onClick={() => setScreen(Screen.HOME)} className="text-white text-sm font-bold px-2"> &lt; Back</button>
         <div>
            <h1 className="text-xl font-bold text-white">BOAT PILOT</h1>
            <div className="text-xs text-blue-100">WAYPOINTS</div>
         </div>
         <div className="w-10"></div>
      </div>

      <div className="bg-white m-4 p-2 text-center text-black font-bold shadow rounded">
        Click on the name<br/>of waypoint you want
      </div>

      <div className="flex-1 bg-blue-700 m-4 mt-0 border-2 border-black/20 overflow-y-auto rounded relative">
        <div className="absolute inset-0 p-4 space-y-2">
          {waypoints.length === 0 && (
             <div className="text-white/50 text-center mt-10">Empty List</div>
          )}
          {waypoints.map((wp) => (
            <div 
              key={wp.id}
              onClick={() => setSelectedId(wp.id)}
              className={`p-3 text-lg font-mono font-bold cursor-pointer transition-colors ${
                selectedId === wp.id 
                  ? 'bg-cyan-400 text-black shadow-inner ring-2 ring-yellow-400' 
                  : 'text-yellow-400 hover:bg-white/10'
              }`}
            >
              {wp.id} {wp.name}
            </div>
          ))}
          {/* Fillers for visuals if list is short */}
          {Array.from({ length: Math.max(0, 10 - waypoints.length) }).map((_, i) => (
             <div key={`empty-${i}`} className="p-3 text-lg font-mono font-bold text-white/20">
               {waypoints.length + i + 1} ......
             </div>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3 mb-4">
        <Button onClick={handleSet} disabled={selectedId === null} className={selectedId === null ? "opacity-50" : ""}>
          SET
        </Button>
        <Button onClick={handleErase} disabled={selectedId === null} className={selectedId === null ? "opacity-50" : ""}>
          ERASE
        </Button>
      </div>
    </div>
  );
};
