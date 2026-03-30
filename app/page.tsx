'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import imageCompression from 'browser-image-compression';

import Vignette from './components/layout/Vignette';
import Header from './components/layout/Header';
import DropZone from './components/workspace/DropZone';
import LoadingHUD from './components/workspace/LoadingHUD';
import Terminal from './components/output/Terminal';
import CodeLive from './components/output/CodeLive';
import ImageCropper from './components/workspace/ImageCropper';
import ConfigDrawer, { DesignConfig, DEFAULT_DESIGN_CONFIG } from './components/layout/ConfigDrawer';
import Footer from './components/layout/Footer';

interface AIResult {
  roast?: string;
  flaws?: string[];
  code_html?: string;
  architecture?: Record<string, string>;
  error?: string;
}

export default function RoastMyUI() {
  const [appState, setAppState] = useState<'idle' | 'cropping' | 'analyzing' | 'rendered'>('idle');
  const [result, setResult] = useState<AIResult | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  
  // State required for Iterative Chat (Feature 1)
  const [imagePayload, setImagePayload] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  
  // Feature 9: The Praise My UI Toggle
  const [persona, setPersona] = useState<'roast' | 'praise'>('roast');
  
  // Phase 03: The Design System Enforcer
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [designConfig, setDesignConfig] = useState<DesignConfig>(DEFAULT_DESIGN_CONFIG);

  // Phase 08: The Engine Processing State
  const [processingMode, setProcessingMode] = useState<'quick' | 'pro'>('pro');

  // Phase 09: Rate Limiting & Auth State
  const [isRateLimited, setIsRateLimited] = useState(false);

  const processFile = async (file: File) => {
    // Android Chrome occasionally returns empty file.type headers for internal gallery images
    if (file.type && !file.type.startsWith('image/')) {
       setErrorToast('Please upload a valid image file (PNG, JPG, WEBP).');
       setTimeout(() => setErrorToast(null), 3000);
       return;
    }
    
    setAppState('analyzing');
    
    try {
      // Compress the image before extracting base64 dynamically based on Processing Mode
      const options = {
        maxSizeMB: processingMode === 'quick' ? 0.5 : 1.0,
        maxWidthOrHeight: processingMode === 'quick' ? 1024 : 1920,
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(file, options);
      setActiveFile(compressedFile);
      setAppState('cropping');
      
    } catch (compressionError) {
      console.error(compressionError);
      setAppState('idle');
      setErrorToast('Failed to optimize image. Please try another file.');
      setTimeout(() => setErrorToast(null), 3000);
    }
  };

  const executeExtraction = async (base64Payload: string) => {
    setAppState('analyzing');
    setImagePayload(base64Payload);
    
    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Payload, persona, designSystem: designConfig.isEnabled ? designConfig : null })
      });
          
      const data = await res.json();
      
      if (!res.ok || data.error) {
         if (data.error === 'RATE_LIMIT_EXCEEDED' || res.status === 429) {
             setIsRateLimited(true);
             setAppState('idle');
             return;
         }
         throw new Error(data.error || 'Failed to analyze UI');
      }
      
      setResult(data);
      setAppState('rendered');
    } catch (err: any) {
      console.error(err);
      setAppState('idle');
      setErrorToast(err.message || 'An error occurred during analysis.');
      setTimeout(() => setErrorToast(null), 3000);
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setResult(null);
    setImagePayload(null);
  };

  const handleChatSubmit = async (message: string) => {
    if (!imagePayload || !result) return;
    setIsRefining(true);

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           imageBase64: imagePayload,
           chatMessage: message,
           previousHtml: result.code_html,
           persona,
           designSystem: designConfig.isEnabled ? designConfig : null
        })
      });

      const data = await res.json();
      
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to refine UI');
      
      // Update the result with the refined UI code and fresh roast critique
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorToast(err.message || 'Error executing iterative instruction.');
      setTimeout(() => setErrorToast(null), 3000);
    } finally {
      setIsRefining(false);
    }
  };

  const handleReactCompile = async () => {
    if (!result || !result.code_html) return;
    
    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           previousHtml: result.code_html,
           mode: 'react'
        })
      });

      const data = await res.json();
      
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to transpile React Architecture');
      
      // Lazily merge the new architecture block into the master UI result state
      setResult(prev => prev ? { ...prev, architecture: data.architecture } : prev);
    } catch (err: any) {
      console.error(err);
      setErrorToast(err.message || 'React transpilation failed.');
      setTimeout(() => setErrorToast(null), 3000);
      throw err; // Propagate the error so CodeLive can release its loading state
    }
  };

  return (
    <main className={`min-h-screen font-sans overflow-x-hidden relative flex flex-col items-center pb-10 px-6 transition-colors duration-1000 ${persona === 'roast' ? 'bg-[#030305]' : 'bg-[#01040f]'}`}>
      
      {/* 1. Deep Aesthetic Shadows & Light logic */}
      <Vignette persona={persona} />

      {/* Error Toast */}
      <AnimatePresence>
        {errorToast && (
           <motion.div 
             initial={false}
             animate={{ opacity: 1, y: 0 }} 
             exit={{ opacity: 0, y: -20 }}
             className="fixed top-6 z-[100] bg-red-500/10 border border-red-500/30 text-red-500 px-6 py-3 rounded-full shadow-lg backdrop-blur-xl font-medium text-sm flex items-center gap-3 drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]"
           >
             <AlertTriangle size={18} />
             {errorToast}
           </motion.div>
        )}
      </AnimatePresence>

      {/* Extreme Rate Limit Warning UI Modal */}
      <AnimatePresence>
        {isRateLimited && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-[#050508] border border-red-500/30 rounded-3xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(255,0,0,0.15)] flex flex-col items-center text-center relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-purple-500" />
               <AlertTriangle className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]" size={48} />
               <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-4">Processing Limit Reached</h2>
               <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-8">
                 To protect our AI engine integrity from automated spam, anonymous IP architecture is strictly clamped to 3 generations per 24 hours.
               </p>
               <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full mb-8 text-left">
                 <p className="text-zinc-300 text-xs font-mono uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Enterprise Access Required</p>
                 <p className="text-zinc-500 text-xs text-balance leading-relaxed">
                   Contact the overarching Principal Developer, <strong className="text-white">Jeba Seelan</strong>, to explicitly whitelist your IP address or upgrade your architectural payload limits.
                 </p>
               </div>
               
               <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                 <button 
                   onClick={() => setIsRateLimited(false)} 
                   className="w-full sm:flex-1 py-3 rounded-xl border border-white/10 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
                 >
                   Dismiss
                 </button>
                 <a 
                   href="https://www.linkedin.com/in/jeba-seelan/" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="w-full sm:flex-1 py-3 rounded-xl bg-white text-black font-black font-mono text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors text-center"
                 >
                   Contact Developer
                 </a>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* 1B. Design System Constraints UI */}
      <ConfigDrawer 
         isOpen={isConfigOpen} 
         onClose={() => setIsConfigOpen(false)} 
         config={designConfig}
         onChange={setDesignConfig}
      />

      {/* 2. Brand Identity Header */}
      <Header 
         persona={persona} 
         processingMode={processingMode}
         onTogglePersona={() => setPersona(p => p === 'roast' ? 'praise' : 'roast')} 
         onToggleMode={() => setProcessingMode(m => m === 'quick' ? 'pro' : 'quick')}
         onOpenConfig={() => setIsConfigOpen(true)}
      />

      {/* 3. The Dynamic Workspace Router */}
      <div className="w-full max-w-7xl relative z-10 flex justify-center perspective-[1200px]">
        <AnimatePresence mode="popLayout">
          
          {/* STATE: IDLE */}
          {appState === 'idle' && (
             <DropZone key="dropzone" onFile={processFile} appState={appState} persona={persona} />
          )}

          {/* STATE: CROPPING (Feature 6 Magic Eraser) */}
          {appState === 'cropping' && activeFile && (
             <ImageCropper 
               key="cropper" 
               file={activeFile} 
               onCropSubmit={executeExtraction} 
               onCancel={handleReset} 
             />
          )}

          {/* STATE: ANALYZING */}
          {appState === 'analyzing' && (
             <LoadingHUD key="loadingbox" />
          )}

          {/* STATE: RENDERED (Split Screen) */}
          {appState === 'rendered' && result && (
            <div
              key="splitscreen"
              className="w-full flex flex-col xl:flex-row gap-8 items-start relative z-10"
            >
              {/* Terminal gets the Parallax engine */}
              <motion.div 
                 layoutId="workspace"
                 className="w-full xl:w-[400px] shrink-0"
                 transition={{ type: "spring", stiffness: 100, damping: 30 }}
              >
                <Terminal 
                   roast={result.roast || 'Analysis complete. Output unreadable.'} 
                   flaws={result.flaws || []} 
                   onReset={handleReset} 
                   onChatSubmit={handleChatSubmit}
                   isProcessingChat={isRefining}
                   persona={persona}
                />
              </motion.div>

              {/* Code Editor must be outside the Parallax block to allow Fixed Fullscreen */}
              <div className="flex-1 min-w-0 w-full">
                <CodeLive payload={result} onRequestCompile={handleReactCompile} />
              </div>
            </div>
          )}

        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
