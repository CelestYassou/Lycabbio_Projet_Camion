import React from 'react';
import { TeamMember } from '../types';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

interface TeamCardProps {
  member: TeamMember;
}

const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl hover:border-amber-400 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6 gap-4">
           <motion.button whileHover={{ scale: 1.2 }} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-amber-500 transition-colors">
              <Github size={18} />
           </motion.button>
           <motion.button whileHover={{ scale: 1.2 }} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-amber-500 transition-colors">
              <Linkedin size={18} />
           </motion.button>
           <motion.button whileHover={{ scale: 1.2 }} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-amber-500 transition-colors">
              <Mail size={18} />
           </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-[2px] bg-amber-500"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
            {member.role}
          </span>
        </div>
        <h4 className="text-xl font-black tracking-tight mb-3 uppercase">
          {member.name}
        </h4>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
          {member.description}
        </p>
      </div>

      {/* Technical Accent */}
      <div className="absolute top-4 right-4 text-[8px] font-mono text-white/50 bg-black/20 backdrop-blur-sm px-2 py-1 rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        ID_00{member.id}
      </div>
    </motion.div>
  );
};

export default TeamCard;
