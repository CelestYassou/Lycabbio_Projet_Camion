import React from 'react';
import { Sprout, Cpu, Zap, Shield, Microscope, Network, Activity, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const InfoSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-32">
        
        {/* Block 1: Engineering Approach */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 relative"
            >
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-800">
                    <img 
                        src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80" 
                        alt="Engineering" 
                        className="w-full aspect-[4/3] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay"></div>
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 bg-zinc-900 dark:bg-white text-white dark:text-black p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-zinc-800 dark:border-zinc-200">
                   <Cpu size={32} className="text-amber-500" />
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Hardware</p>
                      <p className="text-sm font-black uppercase tracking-tighter">Arduino-Uno</p>
                   </div>
                </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 space-y-8"
            >
                <div className="flex items-center gap-3 text-amber-500 font-mono text-[10px] font-black uppercase tracking-[0.4em]">
                  <div className="w-8 h-[2px] bg-amber-500"></div>
                  <span>System_Architecture</span>
                </div>
                <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">Notre Décoration</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                    Notre Camion est équipé d'un décoration hors du commun. De la fausse herbe au sol rappel l'environnement naturel des abeilles. 
                    Nos fleurs lumineuses lie design et technolgie 
                </p>
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <Zap size={20} className="text-amber-500 mb-2" />
                      <h4 className="text-xs font-black uppercase tracking-widest mb-1">Low_Power</h4>
                      <p className="text-[10px] text-zinc-500">Optimisation énergétique ainsi que la de la consommation du camion</p>
                   </div>
                   <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <Shield size={20} className="text-amber-500 mb-2" />
                      <h4 className="text-xs font-black uppercase tracking-widest mb-1">Robustness</h4>
                      <p className="text-[10px] text-zinc-500">Boîtiers IP67 résistants aux conditions extrêmes.</p>
                   </div>
                </div>
            </motion.div>
        </div>

        {/* Block 2: Biological Impact */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 relative"
            >
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-800">
                    <img 
                        src="https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?auto=format&fit=crop&w=1200&q=80" 
                        alt="Biology" 
                        className="w-full aspect-[4/3] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay"></div>
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-zinc-900 dark:bg-white text-white dark:text-black p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-zinc-800 dark:border-zinc-200">
                   <Microscope size={32} className="text-emerald-500" />
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Analyse des ruches</p>
                      <p className="text-sm font-black uppercase tracking-tighter">Système de suivi</p>
                   </div>
                </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 space-y-8 lg:text-right"
            >
                <div className="flex items-center lg:justify-end gap-3 text-emerald-500 font-mono text-[10px] font-black uppercase tracking-[0.4em]">
                  <span>Environmental_Impact</span>
                  <div className="w-8 h-[2px] bg-emerald-500"></div>
                </div>
                <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">Un Projet Éco-Responsable</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                    Le projet Lycabbio ne se limite pas à la technologie. Il s'agit avant tout d'une initiative de sensibilisation à la biodiversité au sein du lycée. 
                    L'entreprise que nous représentons installe des ruches connectés pour lutter contre la disparition des abeilles. 
                </p>
                <div className="flex flex-col lg:items-end gap-4">
                   <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-800/50 text-xs font-black uppercase tracking-widest">
                      <Sprout size={16} />
                      Préservation des abeilles
                   </div>
                   <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-800/50 text-xs font-black uppercase tracking-widest">
                      <Network size={16} />
                      Réseau de pollinisation urbain
                   </div>
                </div>
            </motion.div>
        </div>

        {/* Block 3: Data Visualization & AI */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 relative"
            >
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-800">
                    <img 
                        src="https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=1200&q=80" 
                        alt="Data Analysis" 
                        className="w-full aspect-[4/3] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-zinc-900 dark:bg-white text-white dark:text-black p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-zinc-800 dark:border-zinc-200">
                   <Activity size={32} className="text-blue-500" />
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">ENGINE</p>
                      <p className="text-sm font-black uppercase tracking-tighter">Notre Tracteur</p>
                   </div>
                </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 space-y-8"
            >
                <div className="flex items-center gap-3 text-blue-500 font-mono text-[10px] font-black uppercase tracking-[0.4em]">
                  <div className="w-8 h-[2px] bg-blue-500"></div>
                  <span>Engine - Motor</span>
                </div>
                <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">Notre Tracteur - Performances</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                    Notre tracteur lie à la perfection performances, design, informatique. Notre robot autonome MicroROS (Pi-5) utilise l'un des meilleurs système autonome.
                    Grâce à notre équipe de développeurs les performances de notre camion ont été boosté et amélioré.
                </p>
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <h4 className="text-xs font-black uppercase tracking-widest mb-1 text-blue-500">Pattern_Recognition</h4>
                      <p className="text-[10px] text-zinc-500">Détection automatique des murs et obstacles (lidar)</p>
                   </div>
                   <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <h4 className="text-xs font-black uppercase tracking-widest mb-1 text-blue-500">Cloud_Sync</h4>
                      <p className="text-[10px] text-zinc-500">Suiveur de ligne et détéction d'obstacles (caméra co-axiale)</p>
                   </div>
                </div>
            </motion.div>
        </div>

        {/* Block 4: Educational Mission */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 relative"
            >
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-800">
                    <img 
                        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80" 
                        alt="Education" 
                        className="w-full aspect-[4/3] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-zinc-900 dark:bg-white text-white dark:text-black p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-zinc-800 dark:border-zinc-200">
                   <Info size={32} className="text-amber-500" />
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Disponibilité</p>
                      <p className="text-sm font-black uppercase tracking-tighter">Nos scripts</p>
                   </div>
                </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 space-y-8 lg:text-right"
            >
                <div className="flex items-center lg:justify-end gap-3 text-amber-500 font-mono text-[10px] font-black uppercase tracking-[0.4em]">
                  <span>Learning_Pathway</span>
                  <div className="w-8 h-[2px] bg-amber-500"></div>
                </div>
                <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">Nos Scripts - OpenSource</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                    Notre camion ainsi que ses fonctionnalités on été codés par nos soins. Alors pourquoi ne pas vous-y donner accès ?
                    Vous pouvez bénéficier de l'accès a nos codes sources par l'intermédiaire de GitHub notre plateforme de référence, vous permettant d'utiliser nos scripts et de les améliorer. 
                </p>
                <div className="flex flex-col lg:items-end gap-4">
                   <div className="px-6 py-3 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 rounded-full border border-amber-100 dark:border-amber-800/50 text-xs font-black uppercase tracking-widest">
                      Code OpenSource
                   </div>
                   <div className="px-6 py-3 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 rounded-full border border-amber-100 dark:border-amber-800/50 text-xs font-black uppercase tracking-widest">
                      But Pédagogique
                   </div>
                </div>
            </motion.div>
        </div>
    </div>
  );
};

export default InfoSection;
