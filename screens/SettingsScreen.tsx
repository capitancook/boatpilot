import React from 'react';
import { useBoat } from '../context/BoatContext';
import { Screen } from '../types';
import { Button } from '../components/ui/Button';

// Helper component for the slider UI
const SettingsSlider = ({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  unit, 
  onChange,
  marks
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (val: number) => void;
  marks?: string[];
}) => {
  return (
    <div className="bg-white/90 p-3 rounded shadow-sm">
      <div className="text-center font-bold text-black mb-1 uppercase text-sm">
        {label} <span className="text-blue-700">{value} {unit}</span>
      </div>
      <div className="relative h-12 flex items-center justify-center">
         {/* Custom Track Background */}
         <div className="absolute left-0 right-0 h-2 bg-red-600 rounded-full"></div>
         {/* Central Tick */}
         <div className="absolute left-1/2 top-1 bottom-1 w-1 bg-yellow-400 z-10"></div>
         
         <input 
           type="range"
           min={min}
           max={max}
           step={step}
           value={value}
           onChange={(e) => onChange(parseFloat(e.target.value))}
           className="absolute w-full h-full opacity-0 cursor-pointer z-20"
         />
         
         {/* Visual Indicator of Thumb position (simplified) */}
         <div 
            className="absolute h-6 w-3 bg-yellow-300 border-2 border-black top-3 pointer-events-none transition-all"
            style={{ left: `${((value - min) / (max - min)) * 100}%`, transform: 'translateX(-50%)' }}
         ></div>
      </div>
      {marks && (
        <div className="flex justify-between text-xs text-gray-600 font-bold mt-1 px-1">
          {marks.map((m, i) => <span key={i}>{m}</span>)}
        </div>
      )}
    </div>
  );
};

export const SettingsScreen: React.FC = () => {
  const { setScreen, settings, updateSettings } = useBoat();

  return (
    <div className="flex flex-col h-full bg-blue-500 overflow-y-auto">
       <div className="bg-blue-600 p-3 text-center shadow-md flex justify-between items-center sticky top-0 z-10">
         <button onClick={() => setScreen(Screen.HOME)} className="text-white text-sm font-bold px-2"> &lt; Back</button>
         <div>
            <h1 className="text-xl font-bold text-white">BOAT PILOT</h1>
            <div className="text-xs text-blue-100">SETTINGS</div>
         </div>
         <div className="w-10"></div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        <SettingsSlider 
          label="CH1 central value"
          value={settings.ch1Center}
          min={1.0}
          max={2.0}
          step={0.1}
          unit="ms"
          onChange={(v) => updateSettings({ ch1Center: v })}
          marks={['1ms', '2ms']}
        />

        <SettingsSlider 
          label="CH2 central value"
          value={settings.ch2Center}
          min={1.0}
          max={2.0}
          step={0.1}
          unit="ms"
          onChange={(v) => updateSettings({ ch2Center: v })}
          marks={['1ms', '2ms']}
        />

        <SettingsSlider 
          label="angle range value"
          value={settings.angleRange}
          min={5}
          max={30}
          step={1}
          unit="°"
          onChange={(v) => updateSettings({ angleRange: v })}
          marks={['5°', '10°', '15°', '20°', '30°']}
        />

        <SettingsSlider 
          label="average time"
          value={settings.averageTime}
          min={5}
          max={30}
          step={1}
          unit="s"
          onChange={(v) => updateSettings({ averageTime: v })}
          marks={['5s', '10s', '15s', '20s', '30s']}
        />
      </div>

      <div className="p-4 sticky bottom-0 bg-blue-500">
        <Button onClick={() => setScreen(Screen.HOME)}>SAVE</Button>
      </div>
    </div>
  );
};
