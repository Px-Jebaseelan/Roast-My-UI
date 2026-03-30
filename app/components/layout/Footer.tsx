'use client';

import { Code2, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto pt-20 pb-4 flex flex-col items-center justify-center gap-6 relative z-10">
      
      {/* Subtle Divider */}
      <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Social Links */}
      <div className="flex items-center gap-8">
        <a href="https://github.com/Px-Jebaseelan" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white hover:scale-110 transition-all duration-300">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        </a>
        <a href="https://x.com/Phoenix07_Dev" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#00f0ff] hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(0,240,255,0)] hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
        </a>
        <a href="https://www.linkedin.com/in/jeba-seelan/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-400 hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(59,130,246,0)] hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
      </div>

      {/* Developer Branding & Tech Stack */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono text-zinc-600">
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-zinc-500" />
          <span>Engineered by <span className="text-zinc-300 font-bold uppercase tracking-widest px-1">Phoenix Trinity</span></span>
        </div>
        
        <span className="hidden sm:inline-block opacity-30">•</span>
        
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[#00f0ff] opacity-70" />
          <span>Built With Passion by Jeba Seelan</span>
        </div>
      </div>
      
    </footer>
  );
}
