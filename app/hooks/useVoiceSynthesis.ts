'use client';

import { useEffect, useRef } from 'react';

export function useVoiceSynthesis(text: string, playTrigger: boolean = true) {
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (!playTrigger || !text || !synthRef.current) return;

    const speak = () => {
      // Cancel any ongoing speech to prevent overlapping audio
      synthRef.current?.cancel(); 
      
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance; // GC-Bug Fix: Bind to ref so Chrome doesn't delete it while speaking
      
      // Cyber-Hacker / Gordon Ramsay Voice Profile Tuning
      utterance.rate = 1.0; // Stabilized speed to prevent buffer underruns
      utterance.pitch = 0.9; // Brought closer to 1.0; extreme pitch shifting causes lag on Windows TTS
      utterance.volume = 1;
      
      // Attempt to load a structured English voice (preferably British for the Ramsay effect)
      const voices = synthRef.current?.getVoices() || [];
      const preferredVoice = voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.includes('en-US'));
      
      if (preferredVoice) {
         utterance.voice = preferredVoice;
      }

      synthRef.current?.speak(utterance);
    };

    // Voices load asynchronously in some browsers
    if (synthRef.current?.getVoices().length > 0) {
      speak();
    } else if (synthRef.current) {
      synthRef.current.onvoiceschanged = speak;
    }

    return () => {
      synthRef.current?.cancel();
    };
  }, [text, playTrigger]);
}
