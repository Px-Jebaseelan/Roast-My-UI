'use client';

import { motion } from 'framer-motion';
import { Settings2, Info, Zap, Sparkles } from 'lucide-react';

interface HeaderProps {
  persona?: 'roast' | 'praise';
  processingMode?: 'quick' | 'pro';
  onTogglePersona?: () => void;
  onToggleMode?: () => void;
  onOpenConfig?: () => void;
}

// Now accepts additional processing Mode props (Phase 08)
export default function Header({ persona = 'roast', processingMode, onTogglePersona, onToggleMode, onOpenConfig }: HeaderProps) {
  const isRoast = persona === 'roast';
  
  return (
    <div className="z-10 flex flex-col items-center mb-16 pt-40 sm:pt-24 relative w-full justify-center">
      
      {/* Absolute Absolute Left - System Config Rules */}
      {onOpenConfig && (
        <div className="absolute left-0 top-6 sm:top-10 flex items-center gap-4 pl-4 sm:pl-6 z-50">
           <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 hidden xl:block">SYS_CONFIG_</span>
           <button 
             onClick={onOpenConfig}
             className={`flex items-center justify-center w-10 h-10 bg-black/40 border transition-all rounded-full shadow-md group ${isRoast ? 'border-zinc-800 hover:border-[#ff4500]/50' : 'border-blue-900/50 hover:border-[#00f0ff]/50'}`}
           >
             <Settings2 size={16} className={`transition-transform duration-500 group-hover:rotate-90 ${isRoast ? 'text-zinc-400 group-hover:text-[#ff4500]' : 'text-blue-400 group-hover:text-[#00f0ff]'}`} />
           </button>
        </div>
      )}

      {/* Absolute Absolute Right - Controls */}
      <div className="absolute right-0 top-6 sm:top-10 flex flex-col gap-4 sm:gap-6 z-50 pr-4 sm:pr-6 items-end">
         
         {/* Row 1: The Praise/Roast Toggle Switch */}
         {onTogglePersona && (
           <div className="flex items-center gap-4">
             <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 hidden xl:block">_PERSONA</span>
             <button 
               onClick={onTogglePersona}
               className={`relative w-24 h-10 rounded-full border transition-colors duration-500 overflow-hidden shadow-inner flex items-center p-1
                 ${isRoast ? 'bg-[#050508] border-red-500/30' : 'bg-blue-950 border-blue-400/50'}
               `}
             >
                <motion.div 
                  initial={false}
                  animate={{ x: isRoast ? 0 : 56 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`w-8 h-8 rounded-full shadow-lg border relative z-10 flex items-center justify-center 
                    ${isRoast ? 'bg-gradient-to-br from-orange-500 to-red-600 border-[#ff4500]' : 'bg-gradient-to-br from-[#00f0ff] to-blue-500 border-white/50'}
                  `}
                />
                <div className="absolute inset-0 w-full h-full flex items-center pointer-events-none px-3">
                   {!isRoast && <span className="text-[10px] tracking-widest font-black text-[#00f0ff] ml-1">PRAISE</span>}
                   {isRoast && <span className="text-[10px] tracking-widest font-black text-red-500 ml-auto mr-0.5">ROAST</span>}
                </div>
             </button>
           </div>
         )}

         {/* Row 2: The Quick/Pro Engine Mode */}
         {onToggleMode && processingMode && (
           <div className="flex items-center gap-3">
             <div className="relative group flex items-center">
               <Info size={14} className="text-zinc-500 hover:text-[#00f0ff] cursor-help transition-colors" />
               <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-72 bg-zinc-950 border border-white/10 rounded-xl p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                  <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                    <strong className="text-white block mb-2 uppercase tracking-widest border-b border-white/10 pb-2">Processing Engine</strong>
                    <span className="text-[#00f0ff] font-bold">⚡ Quick Mode:</span><br/>Fast uploads, token-efficient, limits visual scan to 1024px bounds.<br/><br/>
                    <span className="text-purple-400 font-bold">✨ Pro Mode:</span><br/>Maximizes fidelity string extraction. Uses 1920px bounds for extremely dense dashboard/text scanning.
                  </p>
               </div>
             </div>
             
             <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 hidden xl:block">_SCAN_MODE</span>
             
             <button 
               onClick={onToggleMode}
               className="relative w-24 h-10 rounded-full border border-zinc-800 bg-black shadow-inner overflow-hidden flex items-center p-1"
             >
                <motion.div 
                  initial={false}
                  animate={{ x: processingMode === 'quick' ? 0 : 56 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`w-8 h-8 rounded-full shadow-lg border relative z-10 flex items-center justify-center 
                    ${processingMode === 'quick' ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300' : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400'}
                  `}
                >
                   {processingMode === 'quick' ? <Zap size={14} className="text-white" /> : <Sparkles size={14} className="text-white" />}
                </motion.div>
                <div className="absolute inset-0 w-full h-full flex items-center pointer-events-none px-3">
                   {processingMode === 'pro' && <span className="text-[10px] tracking-widest font-black text-purple-400 ml-2">PRO</span>}
                   {processingMode === 'quick' && <span className="text-[10px] tracking-widest font-black text-yellow-500 ml-auto mr-0.5">QUICK</span>}
                </div>
             </button>
           </div>
         )}
      </div>

      <motion.header 
        layout 
        className="flex flex-col items-center"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={`flex items-center gap-2 border px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-[0.2em] mb-8 backdrop-blur-md shadow-[0_0_40px_rgba(255,69,0,0.15)] ring-1 ring-inset
          ${isRoast ? 'bg-gradient-to-r from-orange-500/10 to-[#7000ff]/10 border-orange-500/20 text-[#ff4500] ring-orange-500/10' : 'bg-gradient-to-r from-blue-500/10 to-[#00f0ff]/10 border-[#00f0ff]/40 text-[#00f0ff] ring-[#00f0ff]/10'}
        `}>
          <span className={`w-1.5 h-1.5 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] ${isRoast ? 'bg-[#ff4500] shadow-[0_0_10px_#ff4500]' : 'bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]'}`} />
          Phoenix Trinity: Phase 01
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 pb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 drop-shadow-[0_4px_30px_rgba(255,255,255,0.1)] transition-colors">
          {isRoast ? 'Roast My UI' : 'Praise My UI'}
        </h1>
        
        <p className="text-zinc-300 font-mono text-sm max-w-lg text-center leading-loose drop-shadow-md transition-colors duration-500">
          {isRoast 
             ? '> Upload a screenshot. Get brutally roasted. Receive the perfectly styled Tailwind CSS fix instantly.'
             : '> Upload your brilliant design. Receive gentle cosmic praise and beautifully crafted Tailwind enhancements.'
          }
        </p>
      </motion.header>
    </div>
  );
}
