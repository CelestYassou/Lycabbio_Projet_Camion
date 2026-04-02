import React from 'react';
import { HiveData } from '../types';
import { Thermometer, Droplets, Scale, AlertTriangle, Wifi, ChevronRight, Battery, SignalHigh } from 'lucide-react';
import { motion } from 'framer-motion';

interface HiveCardProps {
  hive: HiveData;
  onClick?: (hive: HiveData) => void;
}

const HiveCard: React.FC<HiveCardProps> = ({ hive, onClick }) => {
  // Simulated technical data for "pro" look
  const batteryLevel = 85 + (hive.id % 15);
  const signalStrength = 70 + (hive.id % 30);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: hive.id * 0.1 }}
      onClick={() => onClick && onClick(hive)}
      className="group relative flex flex-col items-center w-full max-w-[320px] mx-auto cursor-pointer"
    >
      {/* Background Hexagon Glow */}
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-500"></div>
      
      {/* --- ROOF (Technical Top) --- */}
      <div className="w-full h-14 bg-zinc-800 dark:bg-black rounded-t-xl border-b-2 border-zinc-700 dark:border-zinc-800 shadow-2xl z-30 flex items-center justify-between px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-900 opacity-50"></div>
         <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${hive.status === 'warning' ? 'bg-amber-500 animate-pulse' : hive.status === 'critical' ? 'bg-red-500 animate-ping' : 'bg-emerald-500'} shadow-[0_0_8px_rgba(16,185,129,0.5)]`}></div>
            </div>
            <span className="font-mono font-bold text-zinc-100 uppercase tracking-tighter text-sm">UNIT_{hive.id.toString().padStart(2, '0')}</span>
         </div>
         <div className="flex items-center gap-2 relative z-10">
            <Battery size={14} className="text-zinc-500" />
            <span className="text-[10px] font-mono text-zinc-500">{batteryLevel}%</span>
         </div>
      </div>

      {/* --- SENSOR INTERFACE (Data Panel) --- */}
      <div className="w-[96%] bg-zinc-100 dark:bg-zinc-900 border-x-2 border-zinc-300 dark:border-zinc-800 shadow-xl relative z-20">
        <div className="p-4 grid grid-cols-2 gap-4">
          {/* Temperature Display */}
          <div className="relative group/stat">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer size={14} className="text-red-500" />
              <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest">Température</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{hive.temperature}</span>
              <span className="text-xs font-bold text-zinc-400">°C</span>
            </div>
            <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 mt-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${(hive.temperature / 45) * 100}%` }}
                className="h-full bg-red-500"
              />
            </div>
          </div>

          {/* Humidity Display */}
          <div className="relative group/stat">
            <div className="flex items-center gap-2 mb-1">
              <Droplets size={14} className="text-blue-500" />
              <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest">Humidité</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{hive.humidity}</span>
              <span className="text-xs font-bold text-zinc-400">%</span>
            </div>
            <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 mt-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${hive.humidity}%` }}
                className="h-full bg-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '10px 10px' }}></div>
      </div>

      {/* --- MAIN BODY (Structural) --- */}
      <div className="w-[96%] h-36 bg-white dark:bg-zinc-950 border-x-2 border-zinc-300 dark:border-zinc-800 relative z-10 flex flex-col items-center justify-center overflow-hidden">
        {/* Decorative Hexagon Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] flex items-center justify-center">
          <div className="w-32 h-32 border-2 border-zinc-900 dark:border-white rotate-45"></div>
          <div className="absolute w-24 h-24 border border-zinc-900 dark:border-white -rotate-12"></div>
        </div>

        {/* Weight Module */}
        <div className="relative z-10 bg-zinc-900 dark:bg-black p-3 rounded-lg border border-zinc-700 shadow-2xl flex flex-col items-center min-w-[140px]">
          <div className="flex items-center gap-2 mb-1">
            <Scale size={14} className="text-amber-500" />
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Mass_Payload</span>
          </div>
          <span className="text-2xl font-mono font-bold text-emerald-400 tracking-tighter">
            {hive.weight.toFixed(2)}<span className="text-xs ml-1 opacity-50">KG</span>
          </span>
        </div>

        {/* Technical Labels */}
        <div className="absolute bottom-2 left-4 flex flex-col gap-0.5">
          <span className="text-[7px] font-mono text-zinc-400 uppercase">SYS_ACTIVE</span>
          <span className="text-[7px] font-mono text-zinc-400 uppercase">LOG_STREAM_01</span>
        </div>
      </div>

      {/* --- BASE (Structural Foundation) --- */}
      <div className="w-full h-6 bg-zinc-800 dark:bg-black rounded-b-xl shadow-2xl relative z-20 flex items-center justify-center">
        <div className="w-20 h-1 bg-zinc-700 rounded-full"></div>
        <div className="absolute -bottom-6 flex gap-12">
          <div className="w-3 h-6 bg-zinc-400 dark:bg-zinc-800 rounded-b-sm"></div>
          <div className="w-3 h-6 bg-zinc-400 dark:bg-zinc-800 rounded-b-sm"></div>
        </div>
      </div>

      {/* --- STATUS FOOTER --- */}
      <div className="mt-10 flex items-center gap-4 text-[9px] font-mono text-zinc-500 dark:text-zinc-400">
         <div className="flex items-center gap-1">
            <SignalHigh size={10} className="text-emerald-500" />
            <span>RSSI: -{signalStrength}dBm</span>
         </div>
         <div className="w-px h-2 bg-zinc-300 dark:bg-zinc-700"></div>
         <div className="flex items-center gap-1">
            <Wifi size={10} className="text-blue-500" />
            <span>ESP32_V2.1</span>
         </div>
      </div>

      <div className="mt-2 text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
        Last_Sync: {hive.lastUpdated.toLocaleTimeString()}
      </div>

    </motion.div>
  );
};

export default HiveCard;
