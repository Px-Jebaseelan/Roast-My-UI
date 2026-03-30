'use client';

import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useVoiceSynthesis } from '../../hooks/useVoiceSynthesis';

// Custom Typewriter Hook with randomized delay and React StrictMode safety
function useTypewriter(text: string, speed: number = 30) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let isCancelled = false;
    let i = 0;
    let interval: NodeJS.Timeout;

    setDisplayedText('');
    
    // Add a slight delay before typing starts to feel like a real terminal booting up
    const startDelay = setTimeout(() => {
        if (isCancelled) return;
        interval = setInterval(() => {
          if (i < text.length) {
            if (!isCancelled) {
              // Use substring to physically lock the text string instead of relying on 'prev + char' which double-fires in StrictMode
              setDisplayedText(text.substring(0, i + 1));
            }
            i++;
          } else {
            clearInterval(interval);
          }
        }, speed + (Math.random() * 20)); // Randomize typing speed slightly
    }, 500);
    
    return () => {
      isCancelled = true;
      clearTimeout(startDelay);
      if (interval) clearInterval(interval);
    };
  }, [text, speed]);

  return displayedText;
}

interface TerminalProps {
  roast: string;
  flaws: string[];
  onReset: () => void;
  onChatSubmit?: (message: string) => void;
  isProcessingChat?: boolean;
  persona?: 'roast' | 'praise';
}

export default function Terminal({ roast, flaws, onReset, onChatSubmit, isProcessingChat, persona = 'roast' }: TerminalProps) {
  const typedRoast = useTypewriter(roast || 'No output detected.', 20);
  const [chatInput, setChatInput] = useState('');
  const isRoast = persona === 'roast';

  // FEATURE 8: The Audio Roast
  // Trigger voice synthesis as soon as the terminal mounts and receives the payload string.
  useVoiceSynthesis(roast, true);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20, rotateY: 10 }} 
      animate={{ opacity: 1, x: 0, rotateY: 0 }} 
      transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
      className={`h-[700px] rounded-[2rem] border bg-[#050508]/80 backdrop-blur-2xl p-6 flex flex-col relative overflow-hidden transition-colors duration-1000
        ${isRoast ? 'border-[#ff4500]/20 shadow-[inset_0_0_80px_rgba(255,69,0,0.05),_0_20px_50px_rgba(0,0,0,0.5)]' : 'border-[#00f0ff]/30 shadow-[inset_0_0_80px_rgba(0,240,255,0.05),_0_20px_50px_rgba(0,0,0,0.5)]'}
      `}
    >
      {/* Terminal Title Bar */}
      <div className={`flex items-center justify-between mb-8 border-b pb-4 relative z-10 shrink-0 ${isRoast ? 'border-[#ff4500]/20' : 'border-[#00f0ff]/20'}`}>
        <div className="flex items-center gap-2 overflow-hidden mr-2">
           <TerminalIcon size={18} className={`shrink-0 ${isRoast ? 'text-[#ff4500]' : 'text-[#00f0ff]'}`} />
           <span className={`font-mono text-xs truncate ${isRoast ? 'text-[#ff4500]' : 'text-[#00f0ff]'}`}>
             {isRoast ? 'root@phoenix:~/analysis_output.log' : 'root@phoenix:~/praise_output.log'}
           </span>
        </div>
        <button 
          onClick={onReset} 
          className="shrink-0 whitespace-nowrap text-[10px] font-mono text-zinc-500 hover:text-[#ff4500] hover:bg-[#ff4500]/10 px-3 py-1.5 rounded-md transition-all tracking-widest border border-transparent hover:border-[#ff4500]/30"
        >
           [ TERMINATE ]
        </button>
      </div>
      
      {/* Scrollable Output Box */}
      <div className="space-y-8 overflow-y-auto pr-4 custom-scrollbar relative z-10 pb-10">
        
        {/* System Verdict */}
        <div>
          <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isRoast ? 'bg-zinc-600' : 'bg-blue-400'}`} /> {isRoast ? 'System Verdict' : 'Cosmic Review'}
          </h4>
          <p className={`text-sm leading-relaxed font-mono ${isRoast ? 'text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.2)]' : 'text-blue-300 drop-shadow-[0_0_10px_rgba(0,240,255,0.2)]'}`}>
            &gt; {typedRoast}
            {typedRoast.length < roast.length && <span className={`typewriter-cursor ${!isRoast && 'bg-[#00f0ff]'}`} />}
          </p>
        </div>
        
        {/* Flaws Array */}
        {typedRoast.length === roast.length && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h4 className="text-xs font-mono text-zinc-500 uppercase mb-4 flex items-center gap-2">
               <span className={`w-1.5 h-1.5 animate-pulse rounded-full ${isRoast ? 'bg-red-600' : 'bg-[#00f0ff]'}`} /> {isRoast ? 'Identified Vulnerabilities' : 'Brilliant Structural Choices'}
            </h4>
            <div className="space-y-3">
              {(flaws || []).map((flaw: string, i: number) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.4 + (i * 0.2) }}
                  className={`flex items-start gap-3 border p-4 rounded-xl transition-colors
                    ${isRoast ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10' : 'bg-blue-500/5 border-[#00f0ff]/20 hover:bg-[#00f0ff]/10'}
                  `}
                >
                  <AlertTriangle size={18} className={`shrink-0 mt-0.5 ${isRoast ? 'text-[#ff4500]' : 'text-[#00f0ff]'}`} />
                  <span className="text-sm text-zinc-300 font-mono leading-relaxed">{flaw}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Interactive Chat Console (Feature 1) */}
      <div className="absolute bottom-0 left-0 w-full p-6 pt-12 bg-gradient-to-t from-[#050508] via-[#050508]/90 to-transparent z-20">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (chatInput.trim() && onChatSubmit && !isProcessingChat) {
               onChatSubmit(chatInput.trim());
               setChatInput('');
            }
          }}
          className="flex items-center gap-3 border-t border-[#ff4500]/20 pt-4"
        >
          <span className="font-mono text-[#ff4500] text-sm shrink-0">roast&gt;</span>
          <input 
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isProcessingChat}
            placeholder={isProcessingChat ? "Compiling update..." : "Type custom instruction to refine UI (e.g. 'Make it darker')"}
            className="w-full bg-transparent border-none outline-none text-zinc-300 font-mono text-sm placeholder-zinc-600 disabled:opacity-50"
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>

    </motion.div>
  );
}
