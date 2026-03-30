'use client';

import { useEffect, useRef } from 'react';

export function useVoiceSynthesis(text: string, playTrigger: boolean = true) {
  const synthRef = useRef<SpeechSynthesis | null>(null);

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
      
      // Cyber-Hacker / Gordon Ramsay Voice Profile Tuning
      utterance.rate = 0.95; // Deliberate and cold pacing
      utterance.pitch = 0.6; // Deep, slightly threatening pitch
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
    if (synthRef.current.getVoices().length > 0) {
      speak();
    } else {
      synthRef.current.onvoiceschanged = speak;
    }

    return () => {
      synthRef.current?.cancel();
    };
  }, [text, playTrigger]);
}
