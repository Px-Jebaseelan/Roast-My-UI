'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Vignette({ persona = 'roast' }: { persona?: 'roast' | 'praise' }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isRoast = persona === 'roast';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
       setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 0. Static Geometric Grid */}
      <div className="bg-grid absolute inset-0 w-full h-full opacity-30" />

      {/* 1. Global Noise Overlay */}
      <div className="bg-noise absolute inset-0 w-full h-full mix-blend-overlay opacity-30" />
      
      {/* 2. Heavy Edge Vignette (Cinematic Shadow framing) */}
      <div className="absolute inset-0 w-full h-full shadow-[inset_0_0_200px_rgba(0,0,0,0.95)] z-10" />

      {/* Deep Red/Cyan Ambient Top Glow */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[120%] h-[70vh] opacity-20 transition-all duration-1000 z-0"
        style={{
          background: isRoast 
            ? 'radial-gradient(circle at 50% 0%, rgba(255, 69, 0, 0.4) 0%, transparent 60%)'
            : 'radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.4) 0%, transparent 60%)'
        }}
      />
      
      {/* Secondary Depth Base Glow */}
      <div 
        className="absolute top-[20%] left-[-20%] w-[140%] h-[80vh] opacity-10 transition-all duration-1000 z-0"
        style={{
          background: isRoast
            ? 'radial-gradient(ellipse at 50% 50%, rgba(138, 43, 226, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
        }}
      />

      {/* Deep Intense Ambient Orbs */}
      <div className={`absolute -bottom-1/4 -right-1/4 w-[1000px] h-[1000px] transition-colors duration-1000 rounded-full blur-[150px] z-0 ${isRoast ? 'bg-[#ff4500]/20' : 'bg-[#00f0ff]/10'}`} />
      <div className={`absolute top-1/4 -left-1/4 w-[800px] h-[800px] transition-colors duration-1000 rounded-full blur-[150px] z-0 ${isRoast ? 'bg-[#7000ff]/20' : 'bg-blue-500/10'}`} />

      {/* Mouse-tracking Flashlight Gradient */}
      <motion.div
        className="absolute inset-0 z-20 opacity-100"
        animate={{
          background: `radial-gradient(1000px circle at ${mousePos.x}px ${mousePos.y}px, rgba(112, 0, 255, 0.08), transparent 40%)`,
        }}
      />
      
    </div>
  );
}
