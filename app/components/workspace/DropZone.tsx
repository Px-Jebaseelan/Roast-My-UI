'use client';

import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';
import { useRef, useState, DragEvent, ChangeEvent } from 'react';

interface DropZoneProps {
  onFile: (file: File) => void;
  appState: 'idle' | 'analyzing' | 'rendered';
  persona?: 'roast' | 'praise';
}

export default function DropZone({ onFile, appState, persona = 'roast' }: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const isRoast = persona === 'roast';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.05, y: y * 0.05 }); 
  };

  const resetPos = () => setPos({ x: 0, y: 0 });

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    resetPos();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragEnter = () => setIsDragActive(true);

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFile(e.target.files[0]);
    }
  };

  return (
    <motion.div
      layoutId="workspace"
      initial={{ opacity: 1, scale: 1, y: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -40, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`relative w-full max-w-4xl h-[400px] mx-auto flex items-center justify-center rounded-[3rem] border transition-all duration-700 backdrop-blur-3xl cursor-pointer group overflow-hidden
        ${isDragActive ? 'border-zinc-300 bg-white/5 scale-[1.02] shadow-[0_0_100px_rgba(255,255,255,0.1)]' : 'bg-[#050508]/60 border-white/10 hover:border-white/20'}
        ${!isDragActive && (isRoast ? 'shadow-[0_20px_60px_rgba(255,69,0,0.05),_inset_0_0_80px_rgba(255,69,0,0.02)]' : 'shadow-[0_20px_60px_rgba(0,240,255,0.05),_inset_0_0_80px_rgba(0,240,255,0.02)]')}
      `}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { handleDragLeave(); resetPos(); }}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleChange} 
        className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer appearance-none" 
        accept="image/*" 
      />
      
      {/* Rotating Cyber Rings */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className={`absolute w-[500px] h-[500px] rounded-full border border-dashed opacity-20 pointer-events-none transition-colors duration-1000
          ${isRoast ? 'border-[#ff4500]' : 'border-[#00f0ff]'}
        `}
      />
      <motion.div 
        animate={{ rotate: -360 }} 
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className={`absolute w-[350px] h-[350px] rounded-full border opacity-10 pointer-events-none transition-colors duration-1000
          ${isRoast ? 'border-orange-400' : 'border-blue-400'}
        `}
      />

      <motion.div 
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, mass: 1 }}
        className="flex flex-col items-center z-10"
      >
        {/* Glowing High-Contrast Neon Call To Action */}
        <motion.div 
          className={`relative z-20 w-28 h-28 rounded-[2rem] flex items-center justify-center mb-10 transition-all duration-500 border group-hover:-translate-y-4
            ${isDragActive 
              ? (isRoast ? 'bg-gradient-to-br from-[#ff4500] to-red-600 shadow-[0_0_80px_#ff4500]' : 'bg-gradient-to-br from-[#00f0ff] to-blue-600 shadow-[0_0_80px_#00f0ff]') + ' border-transparent text-white scale-110' 
              : 'bg-zinc-950/80 backdrop-blur-xl shadow-[inset_0_2px_20px_rgba(255,255,255,0.05),_0_20px_40px_rgba(0,0,0,0.8)] border-white/5 text-zinc-400 ' + 
                (isRoast ? 'group-hover:bg-gradient-to-br group-hover:from-orange-500/10 group-hover:to-[#ff4500]/5 group-hover:border-[#ff4500]/40 group-hover:text-[#ff4500] group-hover:shadow-[0_20px_50px_rgba(255,69,0,0.2)]' : 'group-hover:bg-gradient-to-br group-hover:from-blue-500/10 group-hover:to-[#00f0ff]/5 group-hover:border-[#00f0ff]/40 group-hover:text-[#00f0ff] group-hover:shadow-[0_20px_50px_rgba(0,240,255,0.2)]')}`}
          animate={{ scale: isDragActive ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <UploadCloud size={44} className="stroke-[1.5px]" />
        </motion.div>

        <h3 className="text-3xl font-semibold mb-3 tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          Initialize Core Scan
        </h3>
        <p className="text-zinc-400 font-mono text-sm group-hover:text-zinc-300 transition-colors">
          PNG, JPG, WEBP • Max 5MB
        </p>
      </motion.div>
    </motion.div>
  );
}
