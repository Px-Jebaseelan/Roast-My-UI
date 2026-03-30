'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, RefreshCw, AlertTriangle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-black/80 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.1)] relative z-10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-[#ff4500]" />
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
             <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">System Failure</h2>
            <p className="font-mono text-xs text-red-400">Error Code: FATAL_EXCEPTION</p>
          </div>
        </div>

        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 mb-8">
          <p className="font-mono text-xs text-zinc-400 leading-relaxed">
            The Trinity Engine encountered a critical boundary failure. 
            <br/><br/>
            <span className="text-red-300">"{error.message || 'Unknown render exception'}"</span>
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-red-600/20"
        >
          <RefreshCw size={18} />
          Execute System Reboot
        </button>
      </motion.div>
    </div>
  );
}
