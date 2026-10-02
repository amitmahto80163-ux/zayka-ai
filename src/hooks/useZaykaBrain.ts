'use client';
/**
 * ============================================================
 * ZAYKA AI — useZaykaBrain Hook
 * Real-time voice + text conversation with your own AI model
 * 
 * Features:
 * - Voice input (Web Speech API)
 * - Streaming text response
 * - TTS output (browser native)
 * - Falls back to Groq if own model unavailable
 * ============================================================
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { useZaykaStore } from '@/store';

interface ZaykaBrainMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface UseZaykaBrainOptions {
  context?: {
    currentRecipe?: string;
    currentStep?: number;
    fridgeIngredients?: string[];
  };
  autoSpeak?: boolean;       // Auto-read AI responses aloud
  useOwnModel?: boolean;     // true = Zayka Brain, false = Groq fallback
}

export function useZaykaBrain(options: UseZaykaBrainOptions = {}) {
  const { autoSpeak = true, useOwnModel = true } = options;
  const { fridgeIngredients, currentRecipe, currentStep, memory } = useZaykaStore();
  
  const [messages, setMessages] = useState<ZaykaBrainMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [micLevel, setMicLevel] = useState(0);
  const [usingOwnModel, setUsingOwnModel] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  
  // ---- SEND MESSAGE TO ZAYKA BRAIN ----
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: ZaykaBrainMessage = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);
    setError(null);
    
    try {
      let response: string;
      let ownModelWorked = false;
      
      // ---- Try Zayka Brain (own model) first ----
      if (useOwnModel) {
        try {
          const res = await fetch('/api/zayka-brain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text,
              chatHistory: messages.slice(-8).map(m => ({ role: m.role, content: m.content })),
              context: {
                currentRecipe: currentRecipe?.name,
                currentStep,
                fridgeIngredients,
              },
            }),
          });
          
          const data = await res.json();
          if (data.success && data.response) {
            response = data.response;
            ownModelWorked = data.backend !== undefined;
            setUsingOwnModel(true);
          } else {
            throw new Error(data.error || 'Own model unavailable');
          }
        } catch (ownModelError) {
          // Fall back to Groq
          console.log('Falling back to Groq...', ownModelError);
          setUsingOwnModel(false);
          
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, chatHistory: messages.slice(-8) }),
          });
          const data = await res.json();
          response = data.response || 'Kuch problem ho gayi, dobara try karo!';
        }
      } else {
        // Direct Groq
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, chatHistory: messages.slice(-8) }),
        });
        const data = await res.json();
        response = data.response || 'Kuch problem ho gayi, dobara try karo!';
      }
      
      const assistantMsg: ZaykaBrainMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      
      // ---- Auto-speak response ----
      if (autoSpeak && response) {
        speakText(response);
      }
      
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Network error';
      setError(errMsg);
    } finally {
      setIsThinking(false);
    }
  }, [messages, currentRecipe, currentStep, fridgeIngredients, autoSpeak, useOwnModel]);
  
  // ---- TEXT TO SPEECH ----
  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined') return;
    
    window.speechSynthesis.cancel();
    
    // Clean text for TTS (remove markdown, emojis reduce quality)
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/#{1,6} /g, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/\n+/g, ' ')
      .trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Find best Hindi/Indian voice
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => 
      v.lang.includes('hi') || 
      v.lang.includes('en-IN') || 
      v.name.includes('Ravi') || 
      v.name.includes('Lekha')
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (indianVoice) utterance.voice = indianVoice;
    
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, []);
  
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);
  
  // ---- MIC LEVEL ANALYZER ----
  const startMicAnalyzer = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setMicLevel(avg);
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      
      updateLevel();
    } catch (err) {
      console.log('Mic analyzer failed:', err);
    }
  }, []);
  
  const stopMicAnalyzer = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    audioContextRef.current?.close();
    setMicLevel(0);
  }, []);
  
  // ---- VOICE INPUT ----
  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Aapka browser voice input support nahi karta');
      return;
    }
    
    stopSpeaking();
    
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'hi-IN'; // Hindi first, falls back to English
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      startMicAnalyzer();
    };
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      
      setTranscript(finalTranscript || interimTranscript);
      
      if (finalTranscript) {
        sendMessage(finalTranscript.trim());
      }
    };
    
    recognition.onerror = (event: any) => {
      if (event.error !== 'aborted') {
        setError(`Voice error: ${event.error}`);
      }
      setIsListening(false);
      stopMicAnalyzer();
    };
    
    recognition.onend = () => {
      setIsListening(false);
      stopMicAnalyzer();
    };
    
    try {
      recognition.start();
    } catch (err) {
      setError('Mic start nahi ho raha, permission check karo');
    }
  }, [sendMessage, stopSpeaking, startMicAnalyzer, stopMicAnalyzer]);
  
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    stopMicAnalyzer();
  }, [stopMicAnalyzer]);
  
  // ---- TOGGLE VOICE ----
  const toggleVoice = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);
  
  // ---- CLEAR CONVERSATION ----
  const clearMessages = useCallback(() => {
    setMessages([]);
    setTranscript('');
    stopSpeaking();
  }, [stopSpeaking]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
      stopMicAnalyzer();
    };
  }, [stopMicAnalyzer]);
  
  return {
    // State
    messages,
    isListening,
    isThinking,
    isSpeaking,
    transcript,
    error,
    micLevel,
    usingOwnModel,
    
    // Actions
    sendMessage,
    toggleVoice,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    clearMessages,
  };
}
