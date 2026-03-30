'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Check, Copy, ChevronDown, FolderTree, FileCode2, Eye, Maximize2, Minimize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface CodeLiveProps {
  payload: {
    code_html?: string;
    architecture?: Record<string, string>;
  };
  onRequestCompile?: () => Promise<void>;
}

export default function CodeLive({ payload, onRequestCompile }: CodeLiveProps) {
  const [copied, setCopied] = useState(false);
  const [framework, setFramework] = useState<'HTML' | 'React'>('HTML');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  // Phase 04: Multi-Component file state routing
  const fileKeys = payload.architecture ? Object.keys(payload.architecture) : [];
  const [activeFile, setActiveFile] = useState<string>(fileKeys[0] || 'page.tsx');
  const [liveCode, setLiveCode] = useState(payload.code_html || '');

  // Reset active file if payload strictly changes
  useEffect(() => {
    if (fileKeys.length > 0 && !fileKeys.includes(activeFile)) {
      setActiveFile(fileKeys[0]);
    }
  }, [payload.architecture]);

  // Synchronize dynamic code state across HTML / File System
  useEffect(() => {
    if (framework === 'HTML') {
      setLiveCode(payload.code_html || '');
    } else if (framework === 'React') {
      if (payload.architecture && payload.architecture[activeFile]) {
        setLiveCode(payload.architecture[activeFile]);
      } else if (fileKeys.length > 0) {
        setLiveCode(payload.architecture![fileKeys[0]]);
      } else {
        setLiveCode('// AI failed to generate architecture components.');
      }
    }
  }, [framework, payload, activeFile, fileKeys]);

  const handleCopy = () => {
    navigator.clipboard.writeText(liveCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
    {isFullscreen && <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150]" onClick={() => setIsFullscreen(false)} />}
    <motion.div 
      layout
      initial={{ opacity: 0, x: 20, rotateY: -10 }} 
      animate={{ opacity: 1, x: 0, rotateY: 0 }} 
      transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
      className={`rounded-[2rem] border border-white/10 bg-[#050508]/80 backdrop-blur-3xl flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-500 ${isFullscreen ? 'fixed inset-4 z-[200] max-w-none !h-auto shadow-[0_0_100px_rgba(0,0,0,0.8)]' : 'h-[50vh] md:h-[700px] relative'}`}
    >
      {/* macOS-style Window Header */}
      <div className="grid grid-cols-3 items-center p-4 border-b border-white/5 bg-white/5 shrink-0">
        
        {/* LEFT: Window Controls & Title */}
        <div className="flex items-center gap-4 justify-start">
          <div className="flex gap-2 group cursor-pointer" onClick={() => setIsFullscreen(!isFullscreen)}>
            <div className={`w-3 h-3 rounded-full transition-colors ${isFullscreen ? 'bg-red-500 hover:bg-red-400' : 'bg-red-500/80 group-hover:bg-red-500'}`} />
            <div className={`w-3 h-3 rounded-full transition-colors ${isFullscreen ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-yellow-500/80 group-hover:bg-yellow-500'}`} />
            <div className={`w-3 h-3 rounded-full transition-colors ${isFullscreen ? 'bg-green-500 hover:bg-green-400' : 'bg-green-500/80 group-hover:bg-green-500'}`} />
          </div>
          
          <div className="flex items-center text-xs font-mono text-zinc-400 gap-2 overflow-hidden">
            <Code2 size={14} className="text-[#00f0ff] shrink-0" />
            <span className="truncate hidden sm:block">compiled_sandbox</span>
          </div>
        </div>

        {/* CENTER: The View Mode Tab Switcher */}
        <div className="flex items-center justify-center">
           <div className="flex items-center bg-black/80 border border-white/10 rounded-lg p-1 shadow-lg">
             <button 
                onClick={() => setViewMode('preview')}
                title="Preview Layout"
                className={`flex items-center justify-center gap-2 px-3 h-8 rounded-md transition-all ${viewMode === 'preview' ? 'bg-white/10 text-[#00f0ff] shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               <Eye size={16} />
               <span className="text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:block">Preview</span>
             </button>
             <button 
                onClick={() => setViewMode('code')}
                title="Source Code Explorer"
                className={`flex items-center justify-center gap-2 px-3 h-8 rounded-md transition-all ${viewMode === 'code' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               <FileCode2 size={16} />
               <span className="text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:block">Source</span>
             </button>
           </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 justify-end relative shrink-0">
          
          <button 
             onClick={() => setIsFullscreen(!isFullscreen)}
             className="px-2 py-1.5 text-zinc-500 hover:text-white bg-white/5 border border-transparent hover:border-white/10 rounded-lg transition-colors hidden sm:block shrink-0"
             title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          {/* Framework Dropdown */}
          <div className="relative shrink-0">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/10 px-2 sm:px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
            >
              .{framework.toLowerCase()} <ChevronDown size={10} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                <button 
                  onClick={() => { setFramework('HTML'); setIsDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs font-mono text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  HTML / Tailwind
                </button>
                <button 
                  onClick={async () => { 
                    setIsDropdownOpen(false);
                    if (payload.architecture) {
                      setFramework('React');
                      return;
                    }
                    if (!onRequestCompile) return;
                    
                    setIsCompiling(true);
                    setFramework('React');
                    setViewMode('code');
                    try {
                       await onRequestCompile();
                    } catch (e) {
                       setFramework('HTML');
                    } finally {
                       setIsCompiling(false);
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-mono text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  React (.tsx)
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={handleCopy}
            className="group flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-mono bg-white/5 border border-white/10 hover:border-[#00f0ff]/50 px-2 sm:px-3 py-1.5 rounded-lg transition-all shrink-0 whitespace-nowrap"
          >
            {copied ? (
              <Check size={14} className="text-green-400 shrink-0" />
            ) : (
              <Copy size={14} className="text-zinc-400 group-hover:text-[#00f0ff] transition-colors shrink-0" />
            )}
            <span className={copied ? 'text-green-400 hidden sm:inline-block' : 'text-zinc-400 group-hover:text-white transition-colors hidden sm:inline-block'}>
              {copied ? 'Copied' : 'Copy'}
            </span>
          </button>
        </div>
      </div>
      
      {/* ----------------- DYNAMIC VIEW RENDERING ----------------- */}
      {viewMode === 'code' ? (
        
        isCompiling ? (
           <div className="flex-1 bg-[#1e1e1e] flex flex-col items-center justify-center relative shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)]">
               <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-[#00f0ff] animate-spin mb-4 shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
               <div className="text-zinc-300 font-mono text-sm font-bold uppercase tracking-widest animate-pulse border border-white/10 bg-black/50 px-6 py-2 rounded-full">
                  Transpiling React Architecture...
               </div>
               <div className="text-zinc-500 font-mono text-xs mt-4 max-w-sm text-center leading-relaxed">
                  The AI is currently processing the physical HTML structure and decomposing it into atomic, isolated .tsx functional components.
               </div>
           </div>
        ) : (
          /* Split Pane: Monaco Editor Layer */
          <div className="flex-1 bg-[#1e1e1e] flex relative overflow-hidden">
           
           {/* Phase 04: The Dynamic File Explorer Sidebar */}
           {framework === 'React' && fileKeys.length > 0 && (
              <div className="w-48 bg-[#252526] border-r border-[#333333] flex flex-col pt-3 shrink-0 overflow-y-auto custom-scrollbar">
                 <div className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-widest px-4 mb-3 flex items-center gap-2">
                   <FolderTree size={12} /> app_architecture
                 </div>
                 <div className="flex flex-col">
                    {fileKeys.map(file => (
                      <button
                        key={file}
                        onClick={() => setActiveFile(file)}
                        className={`flex items-center gap-2 text-left px-4 py-1.5 text-xs font-mono truncate transition-all ${activeFile === file ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500' : 'text-zinc-400 hover:text-zinc-200 border-l-2 border-transparent hover:bg-white/5'}`}
                      >
                        <FileCode2 size={12} className={activeFile === file ? 'text-blue-500' : 'text-zinc-500'} />
                        {file}
                      </button>
                    ))}
                 </div>
              </div>
           )}

           {/* Embedded Monaco React Editor */}
           <div className="flex-1 relative min-w-0">
             <Editor
                height="100%"
                defaultLanguage="html"
                language={framework === 'React' ? 'typescript' : 'html'}
                theme="vs-dark"
                value={liveCode}
                onChange={(val) => setLiveCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  wordWrap: "on"
                }}
             />
           </div>
        </div>
        )

      ) : (

        /* Split Pane: The Live Output Simulator */
        <div className="flex-1 bg-zinc-950 relative shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
           {framework === 'HTML' ? (
             <iframe
               title="Live Tailwind Preview"
               sandbox="allow-scripts"
               className="w-full h-full bg-transparent border-none"
               srcDoc={`
                 <!DOCTYPE html>
                 <html class="dark">
                   <head>
                     <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
                     <style>
                        body { background: transparent; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1rem; font-family: Inter, sans-serif; }
                        ::-webkit-scrollbar { width: 4px; }
                        ::-webkit-scrollbar-track { background: transparent; }
                        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
                     </style>
                   </head>
                   <body>
                     ${payload.code_html || '<div class="text-zinc-600 font-mono text-sm animate-pulse border border-zinc-800 px-6 py-3 rounded-xl bg-zinc-950 shadow-inner">Initializing Renderer...</div>'}
                   </body>
                 </html>
               `}
             />
           ) : (
             <div className="flex flex-col items-center justify-center text-zinc-500 font-mono text-sm p-6 text-center border border-dashed border-zinc-800 rounded-xl m-4 bg-zinc-900/50">
                <FolderTree className="text-blue-500 mb-3" size={24} />
                <span className="text-zinc-300 font-bold mb-1">Architecture Compiled</span>
                The AI has cleanly decomposed your UI into {fileKeys.length} reusable functional components. <br/>
                Navigate through the file tree while in <b>Source Code</b> view mode.
             </div>
           )}
        </div>

      )}
    </motion.div>
    </>
  );
}
