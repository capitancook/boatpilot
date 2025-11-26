import React, { useEffect, useState } from 'react';
import { useBoat } from '../context/BoatContext';

export const Compass: React.FC = () => {
  const { boatStatus } = useBoat();
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    // If navigating, use GPS heading, otherwise try device orientation or mock
    if (boatStatus.isNavigating) {
      setHeading(boatStatus.heading);
    } else {
       // Simulate compass drift if not navigating
       const interval = setInterval(() => {
         setHeading(h => (h + (Math.random() - 0.5) * 5) % 360);
       }, 500);
       return () => clearInterval(interval);
    }
  }, [boatStatus.isNavigating, boatStatus.heading]);

  return (
    <div className="relative w-48 h-48 mx-auto my-8">
      {/* Outer Ring */}
      <div className="absolute inset-0 bg-yellow-100 rounded-full border-4 border-yellow-500 shadow-xl flex items-center justify-center">
        {/* Compass Rose */}
        <div 
          className="w-full h-full relative transition-transform duration-500 ease-out"
          style={{ transform: `rotate(${-heading}deg)` }}
        >
          <span className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-gray-800">N</span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-gray-800">S</span>
          <span className="absolute left-2 top-1/2 -translate-y-1/2 font-bold text-gray-800">W</span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-gray-800">E</span>
          
          {/* Needle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-32">
             <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[64px] border-b-red-600 absolute bottom-1/2 left-0"></div>
             <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[64px] border-t-blue-600 absolute top-1/2 left-0"></div>
          </div>
          
          {/* Center Pin */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-600 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-white"></div>
        </div>
      </div>
      
      {/* Label bubble per PDF style */}
      <div className="absolute -top-16 -left-20 bg-green-500 text-white p-2 rounded-lg text-xs w-32 text-center shadow-lg hidden md:block after:content-[''] after:absolute after:top-full after:right-0 after:border-8 after:border-transparent after:border-t-green-500 after:border-l-green-500">
        Questa è una bussola funzionante
      </div>
    </div>
  );
};
