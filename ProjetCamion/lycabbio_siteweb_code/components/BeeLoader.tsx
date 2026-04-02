import React from 'react';
import { motion } from 'framer-motion';

const BeeLoader: React.FC = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Hexagon Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-rule='evenodd' stroke='%23fff' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 92px'
        }}></div>
      </div>

      <div className="relative">
        {/* Main Hexagon */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 relative"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <path 
              d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" 
              fill="none" 
              stroke="#f59e0b" 
              strokeWidth="2"
              strokeDasharray="10 5"
            />
          </svg>
        </motion.div>

        {/* Inner Filling Hexagon */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden clip-path-hexagon">
           <motion.div 
             style={{ height: `${progress}%` }}
             className="w-full bg-amber-500/80 absolute bottom-0"
           ></motion.div>
        </div>

        {/* Orbiting Bee */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
           <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M8 8C8 8 2 6 2 12C2 16 7 16 8 16" fill="white" fillOpacity="0.8" stroke="black" strokeWidth="0.5"/>
                <path d="M16 8C16 8 22 6 22 12C22 16 17 16 16 16" fill="white" fillOpacity="0.8" stroke="black" strokeWidth="0.5"/>
                <ellipse cx="12" cy="14" rx="5" ry="8" fill="#FBBF24" stroke="#451a03" strokeWidth="1.5"/>
                <path d="M8 12H16" stroke="#451a03" strokeWidth="2"/>
                <path d="M8 15H16" stroke="#451a03" strokeWidth="2"/>
              </svg>
           </div>
        </motion.div>
      </div>

      <div className="mt-12 text-center">
         <div className="text-4xl font-black text-amber-500 mb-4 font-mono">
            {Math.min(100, Math.round(progress))}%
         </div>
         <motion.h2 
           animate={{ opacity: [0.5, 1, 0.5] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="text-amber-500 font-black tracking-[0.5em] uppercase text-xs mb-2"
         >
           Initializing_Systems
         </motion.h2>
         <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
           Connecting to Lycabbio Network...
         </p>
      </div>

      <style>{`
        .clip-path-hexagon {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </div>
  );
};

export default BeeLoader;
