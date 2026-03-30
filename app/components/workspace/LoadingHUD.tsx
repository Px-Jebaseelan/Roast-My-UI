'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LoadingHUD() {
  const [hexLine, setHexLine] = useState("0x00000000");

  useEffect(() => {
    // Generate random hacker hex strings while loading
    const interval = setInterval(() => {
      const randomHex = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0').toUpperCase();
      setHexLine(`0x${randomHex}`);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      layoutId="workspace"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl relative"
    >
      <div className="relative w-full h-[400px] rounded-3xl border border-[#ff4500]/30 bg-[#ff4500]/5 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(255,69,0,0.15)]">
        
        {/* Core HUD Frame */}
        <div className="absolute inset-4 border border-white/5 rounded-2xl pointer-events-none" />
        <div className="absolute top-4 left-4 w-4 border-t border-l border-[#ff4500] pointer-events-none h-4" />
        <div className="absolute top-4 right-4 w-4 border-t border-r border-[#ff4500] pointer-events-none h-4" />
        <div className="absolute bottom-4 left-4 w-4 border-b border-l border-[#ff4500] pointer-events-none h-4" />
        <div className="absolute bottom-4 right-4 w-4 border-b border-r border-[#ff4500] pointer-events-none h-4" />

        <div className="flex flex-col items-center z-10 w-full px-16">
          <motion.div
            animate={{ rotate: 360, opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="mb-8"
          >
            <Sparkles className="text-[#ff4500]" size={40} />
          </motion.div>
          
          <h3 className="text-xl font-mono mb-2 text-[#ff4500] tracking-widest uppercase">Synthesizing UI</h3>
          <p className="font-mono text-xs text-zinc-500 mb-8 tracking-widest">{hexLine}</p>
          
          {/* Neon Scrubber */}
          <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden relative shadow-inner">
            <motion.div 
              className="absolute top-0 left-0 h-full w-1/4 bg-[#ff4500] shadow-[0_0_20px_#ff4500]"
              animate={{ left: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
