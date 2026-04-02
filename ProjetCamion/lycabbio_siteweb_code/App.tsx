import React, { useEffect, useState } from 'react';
import { HiveData, TeamMember } from './types';
import { fetchHiveData } from './services/hiveService';
import TeamCard from './components/TeamCard';
import HiveCard from './components/HiveCard';
import InfoSection from './components/InfoSection';
import BeeAnimation from './components/BeeAnimation';
import BeeLoader from './components/BeeLoader';
import HiveModal from './components/HiveModal';
import WeatherWidget from './components/WeatherWidget';
import { Sun, Moon, RefreshCw, LayoutGrid, Users, ChevronDown, Activity, Info, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Célestin Lallement",
    role: "Developpeur HTML, CSS, JavaScript - Cableur",
    description: "Célestin a codé de A à Z ce site web, il est le cerveau et le génie de cette idée. Un site qui rassemble les données des ruches ainsi que la présentation de ses collègues et du projet. ",
    image: "https://picsum.photos/seed/celestin/400/400"
  },
  {
    id: 2,
    name: "Martin Sénécal-Gacel",
    role: "Developpeur Arduino - Cableur",
    description: "Martin à conçu de A à Z le cablage ainsi que le script C++ de notre camion. Il est également l'inventeur de l'abeille Lyca, il l'a modélisée et lui a donné vie. Sans lui, aucune vie ne serait présente sur ce camion.",
    image: "https://picsum.photos/seed/leo/400/400"
  },
  {
    id: 3,
    name: "Léa Opsomer",
    role: "Décoratrice de l'éco-système de notre remorque",
    description: "Léa a utilisé ses compétences de décoratrice pour créer l'éco-sytème le la remorque de notre camion. Grace à elle, Lyca et ses amies ont un habitat pour l'hiver.",
    image: "https://picsum.photos/seed/arthur/400/400"
  },
  {
    id: 4,
    name: "Nour",
    role: "Mentor",
    description: "Apprenti ingénieur Nour nous a aidé dans la réalisation de notre projet.",
    image: "https://picsum.photos/seed/maxime/400/400"
  },
  {
    id: 5,
    name: "Julien",
    role: "Mentor",
    description: "Apprenti ingénieur Julien nous a aidé dans la réalisation de notre projet.",
    image: "https://picsum.photos/seed/thomas/400/400"
  },
  {
    id: 6,
    name: "Nos Professeurs",
    role: "Les Experts",
    description: "Nos professeurs nous ont aidé tout au long de notre projet.",
    image: "https://picsum.photos/seed/lucas/400/400"
  }
];

const App: React.FC = () => {
  const [hives, setHives] = useState<HiveData[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedHive, setSelectedHive] = useState<HiveData | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'warning' | 'heavy'>('all');
  const [error, setError] = useState<string | null>(null);

  const loadData = async (silent = false) => {
    if (!silent) {
      setIsRefreshing(true);
      setError(null);
    }
    try {
      const data = await fetchHiveData();
      if (data.length === 0) throw new Error("Aucune donnée reçue du serveur.");
      setHives(data);
    } catch (error) {
      console.error("Failed to load data", error);
      if (!silent) setError("Erreur de connexion au réseau Lycabbio. Vérifiez votre connexion.");
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsInitialLoading(true);
      await loadData(true);
      setTimeout(() => setIsInitialLoading(false), 2500);
    };
    init();
    const interval = setInterval(() => loadData(true), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredHives = hives.filter(h => {
    if (filterType === 'warning') return h.status !== 'optimal';
    if (filterType === 'heavy') return h.weight > 25.5;
    return true;
  });

  if (isInitialLoading) {
    return <BeeLoader />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-700 font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* Global Background Hexagon Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07] z-0 overflow-hidden">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-rule='evenodd' stroke='%23000' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 92px'
        }}></div>
      </div>

      {/* Wandering Bees */}
      <BeeAnimation count={6} behavior="wander" className="fixed inset-0 pointer-events-none z-[60]" />

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-[100] bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 bg-amber-400 dark:bg-amber-600 rounded-2xl flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-12 transition-transform duration-500">
              <img src="https://lycabbio.fr/public/bee.png" alt="Logo" className="w-9 h-9 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Lycabbio</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Network_Active_V2.6</span>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            <a href="#hives" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">Monitoring</a>
            <a href="#info" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">Engineering</a>
            <a href="#team" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">Project_Team</a>
          </nav>

          <div className="flex items-center gap-3">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => loadData()}
              className={`p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-400 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={18} />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-400 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10">
        
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center relative z-10"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-amber-200 dark:border-amber-800/50"
            >
              <ShieldCheck size={12} />
              Lycabbio_Connect
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl lg:text-[120px] font-black tracking-tighter mb-8 leading-[0.9] md:leading-[0.85] uppercase">
              Projet Camion<br />
              <span className="text-amber-500">Lycabbio</span><br />
            </h2>
            
            <p className="max-w-2xl mx-auto text-base md:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 font-medium mb-12 leading-relaxed px-4">
              Projet camion, nos explications, notre dévellopement, les stats
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-6">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#hives" 
                className="px-8 md:px-10 py-4 md:py-5 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl shadow-2xl flex items-center justify-center gap-3 text-sm md:text-base"
              >
                <Activity size={20} />
                Nos ruches 
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#info" 
                className="px-8 md:px-10 py-4 md:py-5 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 text-sm md:text-base"
              >
                <Info size={20} />
                Le Fonctionnement
              </motion.a>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-1/4 left-[15%] w-32 h-32 bg-amber-400/10 rounded-full blur-3xl"
            ></motion.div>
            <motion.div 
              animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-1/4 right-[15%] w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"
            ></motion.div>
          </div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-12"
          >
            <ChevronDown size={32} className="text-zinc-300 dark:text-zinc-700" />
          </motion.div>
        </section>

        {/* Hives Section */}
        <section id="hives" className="py-32 px-6 relative bg-white dark:bg-[#080808] transition-colors duration-700">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 text-amber-500 font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                  <div className="w-8 h-[2px] bg-amber-500"></div>
                  <span>Données en temps réel</span>
                </div>
                <h3 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-6">Notre Réseau de Ruches</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                  Chaque unité est équipée d'un module ESP32 transmettant la masse (kg), la température (°C) et l'hygrométrie (%) en temps réel. Les données sont synchronisées quotidiennement.
                </p>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-widest"
                  >
                    <AlertTriangle size={16} />
                    {error}
                  </motion.div>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-6 w-full lg:w-auto">
                <WeatherWidget />
                <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
                  {(['all', 'warning', 'heavy'] as const).map((t) => (
                    <button 
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === t ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-xl' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
                    >
                      {t === 'all' ? 'All_Units' : t === 'warning' ? 'Alerts_Only' : 'Payload_Max'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 relative">
              <BeeAnimation count={10} behavior="swarm" className="absolute inset-0 pointer-events-none z-0" />
              <AnimatePresence mode="popLayout">
                {filteredHives.map((hive) => (
                  <HiveCard 
                    key={hive.id} 
                    hive={hive} 
                    onClick={(h) => setSelectedHive(h)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section id="info" className="py-32 bg-zinc-50 dark:bg-[#0a0a0a]">
          <InfoSection />
        </section>

        {/* Team Section */}
        <section id="team" className="py-32 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-24">
              <div className="flex justify-center items-center gap-3 text-amber-500 font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                <div className="w-8 h-[2px] bg-amber-500"></div>
                <span>Engineering_Team</span>
                <div className="w-8 h-[2px] bg-amber-500"></div>
              </div>
              <h3 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">L'Équipe Lycabbio</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-10">
              {TEAM_MEMBERS.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          </div>
          
          {/* Background Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 0)', backgroundSize: '60px 60px' }}></div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white py-24 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center rotate-3">
                <img src="https://lycabbio.fr/public/bee.png" alt="Logo" className="w-9 h-9 object-contain" />
              </div>
              <h4 className="text-3xl font-black tracking-tighter uppercase">Lycabbio</h4>
            </div>
            <p className="text-zinc-500 text-lg leading-relaxed max-w-md">
              Un projet de SI (Science de l'ingénieur) - Pilotage de Camion
            </p>
          </div>
          
          <div className="space-y-6">
            <h5 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500">Navigation</h5>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">Home_Base</a></li>
              <li><a href="#hives" className="hover:text-white transition-colors">Monitoring_Grid</a></li>
              <li><a href="#info" className="hover:text-white transition-colors">Tech_Specs</a></li>
              <li><a href="#team" className="hover:text-white transition-colors">Team_Bios</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500">Location</h5>
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 leading-loose">
              Lycée Lycabbio<br />
              Science de l'Ingénieur<br />
              France, 2026
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.5em]">
            © 2026 LYCABBIO // Touts droits réservés
          </div>
          <div className="flex items-center gap-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Server_Status: Operational</span>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {selectedHive && (
          <HiveModal 
            hive={selectedHive} 
            onClose={() => setSelectedHive(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
