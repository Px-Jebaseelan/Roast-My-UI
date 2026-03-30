'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Brush, Type, Layers, Shapes, Maximize, Activity, Moon, Sun, Zap } from 'lucide-react';

export interface DesignConfig {
  isEnabled: boolean;
  primaryColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  borderRadius: 'none' | 'sm' | 'md' | 'xl' | 'full';
  shadowDepth: 'none' | 'md' | 'xl' | 'glass';
  spatialDensity: 'compact' | 'cozy' | 'spacious';
  animationPhysics: 'static' | 'subtle' | 'bouncy';
  colorTheme: 'dark' | 'light' | 'neon';
}

export const DEFAULT_DESIGN_CONFIG: DesignConfig = {
  isEnabled: false,
  primaryColor: '#00f0ff',
  fontFamily: 'sans',
  borderRadius: 'full',
  shadowDepth: 'glass',
  spatialDensity: 'cozy',
  animationPhysics: 'subtle',
  colorTheme: 'dark'
};

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: DesignConfig;
  onChange: (config: DesignConfig) => void;
}

export default function ConfigDrawer({ isOpen, onClose, config, onChange }: ConfigDrawerProps) {
  
  const handleColorChange = (color: string) => onChange({ ...config, primaryColor: color });
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
          />
          
          {/* Drawer Sidebar */}
          <motion.div 
            initial={{ x: '-100%', opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: '-100%', opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-screen w-full sm:w-[400px] z-[100] backdrop-blur-3xl border-r shadow-[20px_0_50px_rgba(0,0,0,0.7)] flex flex-col pt-8"
            style={{ 
               backgroundColor: `color-mix(in srgb, ${config.primaryColor} 8%, #030305 92%)`,
               borderColor: `color-mix(in srgb, ${config.primaryColor} 30%, transparent)`,
               boxShadow: `inset -1px 0 30px color-mix(in srgb, ${config.primaryColor} 5%, transparent)`
            }}
          >
             
             {/* Header */}
             <div className="px-8 pb-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Brush size={20} className="text-[#00f0ff]" /> Rules Engine
                  </h2>
                  <p className="text-xs font-mono text-zinc-500 mt-1">Enforce corporate design tokens blindly.</p>
                </div>
                <button onClick={onClose} className="p-2 bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 rounded-xl transition-colors">
                  <X size={18} />
                </button>
             </div>

             {/* Master Enable/Disable Toggle */}
             <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex flex-col">
                   <span className="text-sm font-bold text-white tracking-wide">Engine Status</span>
                   <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">{config.isEnabled ? 'AI strictly locked to tokens' : 'Heuristic Roaming Free'}</span>
                </div>
                <button 
                  onClick={() => onChange({ ...config, isEnabled: !config.isEnabled })}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${config.isEnabled ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  <motion.div 
                    animate={{ x: config.isEnabled ? 26 : 2 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                  />
                </button>
             </div>

             {/* scrollable controls */}
             <div className={`flex-1 overflow-y-auto px-8 py-6 space-y-10 custom-scrollbar transition-all duration-500 ${!config.isEnabled ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>

               {/* Section 1: Color Palette */}
               <div className="space-y-4">
                 <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                   <Palette size={14} /> Global Brand Color
                 </h3>
                 <div className="flex flex-col gap-3">
                   {/* Visual Bubbles */}
                   <div className="flex gap-2">
                     {['#00f0ff', '#ff4500', '#10b981', '#a855f7', '#f43f5e', '#ffffff'].map(c => (
                        <button 
                          key={c}
                          onClick={() => handleColorChange(c)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${config.primaryColor === c ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'border-black'}`}
                          style={{ backgroundColor: c }}
                        />
                     ))}
                   </div>
                   {/* Custom exact hex */}
                   <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-sm">HEX</span>
                     <input 
                       type="text" 
                       value={config.primaryColor}
                       onChange={(e) => handleColorChange(e.target.value)}
                       className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-mono text-sm focus:outline-none focus:border-[#00f0ff]/50"
                     />
                     <div 
                       className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/20" 
                       style={{ backgroundColor: config.primaryColor }} 
                     />
                   </div>
                 </div>
               </div>

               {/* Section 2: Typography Style */}
               <div className="space-y-4">
                 <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                   <Type size={14} /> Typography Matrix
                 </h3>
                 <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
                    {['sans', 'serif', 'mono'].map(font => (
                      <button 
                         key={font}
                         onClick={() => onChange({ ...config, fontFamily: font as any })}
                         className={`flex-1 py-2 text-xs uppercase tracking-wider rounded-lg font-bold transition-all ${config.fontFamily === font ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-300'}`}
                      >
                        {font}
                      </button>
                    ))}
                 </div>
               </div>

               {/* Section 3: Architecture Radii */}
               <div className="space-y-4">
                 <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                   <Shapes size={14} /> Border Physics
                 </h3>
                 <div className="grid grid-cols-5 gap-2">
                    {['none', 'sm', 'md', 'xl', 'full'].map(radius => (
                      <button 
                         key={radius}
                         onClick={() => onChange({ ...config, borderRadius: radius as any })}
                         className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all ${config.borderRadius === radius ? 'bg-[#00f0ff]/10 border-[#00f0ff]/50 text-[#00f0ff]' : 'bg-black/20 border-white/5 text-zinc-600 hover:bg-white/5'}`}
                      >
                        <div className={`w-6 h-6 border-2 border-current rounded-${radius}`} />
                        <span className="text-[10px] font-mono uppercase">{radius}</span>
                      </button>
                    ))}
                 </div>
               </div>

               {/* Section 4: Z-Index Elevation Details */}
               <div className="space-y-4">
                 <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                   <Layers size={14} /> Rendering Depth
                 </h3>
                 <div className="grid grid-cols-2 gap-3">
                    {['none', 'md', 'xl', 'glass'].map(shadow => (
                      <button 
                         key={shadow}
                         onClick={() => onChange({ ...config, shadowDepth: shadow as any })}
                         className={`py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-left border transition-all ${config.shadowDepth === shadow ? 'bg-gradient-to-r from-white/10 to-transparent border-white/30 text-white' : 'bg-black/40 border-white/5 text-zinc-600 hover:text-zinc-300 hover:border-white/20'}`}
                      >
                        {shadow === 'none' && 'Flat Engine'}
                        {shadow === 'md' && 'Soft Elevation'}
                        {shadow === 'xl' && 'Deep Ambient'}
                        {shadow === 'glass' && 'Glassmorphism'}
                      </button>
                    ))}
                 </div>
                 <p className="text-[10px] font-mono text-zinc-500 leading-relaxed mt-4">
                   * Glassmorphism instructs the AI to combine intense backdrop filters (blur) with very low opacity backgrounds.
                 </p>
               </div>
               
               {/* Section 5: Spatial Density */}
               <div className="space-y-4">
                 <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                   <Maximize size={14} /> Spatial Density
                 </h3>
                 <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
                    {['compact', 'cozy', 'spacious'].map(density => (
                      <button 
                         key={density}
                         onClick={() => onChange({ ...config, spatialDensity: density as any })}
                         className={`flex-1 py-2 text-[10px] uppercase tracking-wider rounded-lg font-bold transition-all ${config.spatialDensity === density ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-300'}`}
                      >
                         {density}
                      </button>
                    ))}
                 </div>
               </div>

               {/* Section 6: Animation Physics */}
               <div className="space-y-4">
                 <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                   <Activity size={14} /> Animation Physics
                 </h3>
                 <div className="grid grid-cols-3 gap-2">
                    {['static', 'subtle', 'bouncy'].map(physics => (
                      <button 
                         key={physics}
                         onClick={() => onChange({ ...config, animationPhysics: physics as any })}
                         className={`py-3 px-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider text-center border transition-all ${config.animationPhysics === physics ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border-indigo-400/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-black/40 border-white/5 text-zinc-600 hover:text-zinc-300 hover:border-white/20'}`}
                      >
                         {physics}
                      </button>
                    ))}
                 </div>
               </div>

               {/* Section 7: Tone Alignment */}
               <div className="space-y-4">
                 <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                   {config.colorTheme === 'dark' ? <Moon size={14} /> : config.colorTheme === 'light' ? <Sun size={14} /> : <Zap size={14} />} Tone Alignment
                 </h3>
                 <div className="grid grid-cols-3 gap-2">
                    {['dark', 'light', 'neon'].map(theme => (
                      <button 
                         key={theme}
                         onClick={() => onChange({ ...config, colorTheme: theme as any })}
                         className={`py-3 px-2 flex flex-col items-center gap-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider border transition-all ${config.colorTheme === theme ? 'bg-white/10 border-white/30 text-white' : 'bg-black/40 border-white/5 text-zinc-600 hover:text-zinc-300 hover:bg-white/5'}`}
                      >
                         {theme === 'dark' && <Moon size={16} />}
                         {theme === 'light' && <Sun size={16} />}
                         {theme === 'neon' && <Zap size={16} />}
                         {theme}
                      </button>
                    ))}
                 </div>
               </div>
               
             </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
