import React from 'react';
import { HiveData } from '../types';
import { X, Battery, Wifi, TrendingUp, TrendingDown, Thermometer, Scale, Droplets, Zap, Activity, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HiveModalProps {
  hive: HiveData;
  onClose: () => void;
}

// Simple Sparkline Component (SVG)
const Sparkline: React.FC<{ data: number[], color: string, height?: number }> = ({ data, color, height = 50 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
       <polyline 
          points={points} 
          fill="none" 
          stroke={color} 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
    </svg>
  );
};

const HiveModal: React.FC<HiveModalProps> = ({ hive, onClose }) => {
  // Simulate history data based on current values
  const tempData = Array.from({length: 12}, () => hive.temperature + (Math.random() - 0.5) * 3);
  const weightData = Array.from({length: 12}, () => hive.weight + (Math.random() - 0.5) * 0.5);
  const humData = Array.from({length: 12}, () => hive.humidity + (Math.random() - 0.5) * 10);

  const batteryLevel = 85 + (hive.id % 15);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity" 
        onClick={onClose}
      ></motion.div>

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-zinc-50 dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden relative border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row"
      >
        
        {/* Sidebar / Header (Mobile) */}
        <div className="w-full md:w-1/3 bg-zinc-900 dark:bg-black p-8 text-white flex flex-col justify-between border-r border-zinc-800">
           <div>
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center rotate-3">
                  <img src="https://lycabbio.fr/public/bee.png" alt="Logo" className="w-8 h-8 object-contain" />
                </div>
                <h2 className="text-2xl font-black tracking-tighter uppercase">UNIT_{hive.id.toString().padStart(2, '0')}</h2>
             </div>

             <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                   <div className="flex items-center gap-3">
                      <Battery size={20} className="text-emerald-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Battery</span>
                   </div>
                   <span className="font-mono font-bold">{batteryLevel}%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                   <div className="flex items-center gap-3">
                      <Wifi size={20} className="text-blue-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Signal</span>
                   </div>
                   <span className="font-mono font-bold">-68dBm</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                   <div className="flex items-center gap-3">
                      <Activity size={20} className="text-amber-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Status</span>
                   </div>
                   <span className={`font-mono font-bold uppercase text-[10px] px-2 py-0.5 rounded ${hive.status === 'optimal' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                      {hive.status}
                   </span>
                </div>
             </div>
           </div>

           <div className="mt-12 space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                 <Clock size={12} />
                 <span>Last_Sync: {hive.lastUpdated.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                 <ShieldCheck size={12} />
                 <span>Encryption: AES-256</span>
              </div>
           </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[80vh] md:max-h-none">
            <div className="flex justify-between items-start mb-12">
               <div>
                  <h3 className="text-4xl font-black tracking-tighter uppercase mb-2">Detailed_Telemetry</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">Analyse structurelle et environnementale de la colonie.</p>
               </div>
               <button onClick={onClose} className="p-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-amber-400 transition-colors rounded-2xl">
                  <X size={24} />
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {/* Temperature Chart */}
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <div className="flex items-center gap-2">
                        <Thermometer size={18} className="text-red-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Temperature_Log</span>
                     </div>
                     <span className="text-2xl font-black">{hive.temperature}°C</span>
                  </div>
                  <div className="h-32 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-inner">
                     <Sparkline data={tempData} color="#ef4444" />
                  </div>
               </div>

               {/* Weight Chart */}
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <div className="flex items-center gap-2">
                        <Scale size={18} className="text-emerald-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Payload_Mass_Log</span>
                     </div>
                     <span className="text-2xl font-black">{hive.weight.toFixed(2)}kg</span>
                  </div>
                  <div className="h-32 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-inner">
                     <Sparkline data={weightData} color="#10b981" />
                  </div>
               </div>

               {/* Humidity Chart */}
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <div className="flex items-center gap-2">
                        <Droplets size={18} className="text-blue-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Hygrometry_Log</span>
                     </div>
                     <span className="text-2xl font-black">{hive.humidity}%</span>
                  </div>
                  <div className="h-32 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-inner">
                     <Sparkline data={humData} color="#3b82f6" />
                  </div>
               </div>

               {/* Technical Summary */}
               <div className="bg-amber-100 dark:bg-amber-900/20 rounded-[2rem] p-8 border border-amber-200 dark:border-amber-800/50 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                     <Zap size={24} className="text-amber-600 dark:text-amber-400" />
                     <h4 className="text-lg font-black uppercase tracking-tighter">System_Diagnostics</h4>
                  </div>
                  <p className="text-sm text-amber-900/70 dark:text-amber-400/70 font-medium leading-relaxed">
                     L'unité fonctionne en mode nominal. La stabilité thermique indique une activité saine de la grappe. La masse est stable, suggérant une consommation de réserves équilibrée.
                  </p>
               </div>
            </div>

            <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
               <button 
                 onClick={onClose}
                 className="px-10 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-transform"
               >
                 Close_Interface
               </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HiveModal;
