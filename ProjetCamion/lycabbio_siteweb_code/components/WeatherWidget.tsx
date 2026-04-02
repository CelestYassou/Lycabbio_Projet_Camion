import React, { useEffect, useState } from 'react';
import { CloudSun, Wind, Droplets, Gauge, CloudRain, Sun, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherData {
  temp: number;
  wind: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: React.ReactNode;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Granville, France: 48.837, -1.596
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=48.837&longitude=-1.596&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m&timezone=Europe%2FBerlin'
        );
        const data = await response.json();
        const current = data.current;

        // Simple mapping of weather codes to icons
        let icon = <CloudSun size={48} className="text-amber-400" />;
        let desc = "Ensoleillé";
        
        if (current.weather_code > 50) {
          icon = <CloudRain size={48} className="text-blue-400" />;
          desc = "Pluvieux";
        } else if (current.cloud_cover > 50) {
          icon = <Cloud size={48} className="text-zinc-400" />;
          desc = "Nuageux";
        } else if (current.temperature_2m > 25) {
          icon = <Sun size={48} className="text-amber-500" />;
          desc = "Chaud";
        }

        setWeather({
          temp: current.temperature_2m,
          wind: current.wind_speed_10m,
          humidity: current.relative_humidity_2m,
          pressure: Math.round(current.pressure_msl),
          description: desc,
          icon: icon
        });
      } catch (error) {
        console.error("Weather fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Update every 10 mins
    return () => clearInterval(interval);
  }, []);

  if (loading || !weather) {
    return (
      <div className="bg-zinc-900 dark:bg-black rounded-2xl p-6 text-white border border-zinc-800 animate-pulse w-full max-w-md h-32 flex items-center justify-center">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Loading_Weather_Data...</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-zinc-900 dark:bg-black rounded-2xl shadow-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-zinc-800 relative overflow-hidden group w-full max-w-2xl"
    >
      {/* Technical Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

      <div className="flex items-center gap-6 relative z-10">
        <div className="relative">
          {weather.icon}
          <div className="absolute -inset-2 bg-amber-400/10 blur-xl rounded-full animate-pulse"></div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Granville_Station_FR</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tighter">{weather.temp.toFixed(1)}</span>
            <span className="text-lg font-bold text-amber-500">°C</span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase ml-2 tracking-widest">{weather.description}</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 relative z-10 w-full md:w-auto justify-center">
        <div className="flex flex-col items-center bg-zinc-800/50 p-3 rounded-xl border border-zinc-700 min-w-[80px] hover:bg-zinc-800 transition-colors">
           <Wind size={18} className="mb-2 text-zinc-400" />
           <span className="text-sm font-black font-mono">{weather.wind.toFixed(1)}</span>
           <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mt-1">Wind_Kmh</span>
        </div>
        <div className="flex flex-col items-center bg-zinc-800/50 p-3 rounded-xl border border-zinc-700 min-w-[80px] hover:bg-zinc-800 transition-colors">
           <Droplets size={18} className="mb-2 text-zinc-400" />
           <span className="text-sm font-black font-mono">{weather.humidity}</span>
           <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mt-1">Rel_Hum_%</span>
        </div>
        <div className="flex flex-col items-center bg-zinc-800/50 p-3 rounded-xl border border-zinc-700 min-w-[80px] hover:bg-zinc-800 transition-colors">
           <Gauge size={18} className="mb-2 text-zinc-400" />
           <span className="text-sm font-black font-mono">{weather.pressure}</span>
           <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mt-1">Press_hPa</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
