'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { chatWithChef, analyzeCookingFrame } from '@/lib/gemini';
import { useZaykaStore } from '@/store'; // Or get chef/lang from props. Wait, useARChefProps doesn't have them? Let's check store

interface UseARChefProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentStepDescription: string;
  isActive: boolean;
}

export function useARChef({ videoRef, audioRef, currentStepDescription, isActive }: UseARChefProps) {
  const [isThinking, setIsThinking] = useState(false);
  const [arPhase, setArPhase] = useState<'idle' | 'connecting' | 'cooking'>('idle');
  const [micLevel, setMicLevel] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number>(0);
  const visionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // We need store for chef/language
  // Let's just hardcode 'sanjeev_kapoor' and 'hindi' if store is hard to import, but usually we can import it.
  const { selectedChef, language } = useZaykaStore();

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';
    // optionally find a good voice
    window.speechSynthesis.speak(utterance);
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.6);
  };

  const initLiveAI = useCallback(async () => {
    if (!videoRef.current) return;
    setArPhase('connecting');
    setIsThinking(true);

    try {
      // Get Mic & Camera
      let stream = videoRef.current.srcObject as MediaStream;
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
        videoRef.current.srcObject = stream;
      }

      // --- AUDIO VISUALIZER LOGIC ---
      if (!audioContextRef.current) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateMicLevel = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for(let i = 0; i < dataArray.length; i++) { sum += dataArray[i]; }
          const average = sum / dataArray.length;
          setMicLevel(average); 
          animationFrameRef.current = requestAnimationFrame(updateMicLevel);
        };
        updateMicLevel();
      }

      // --- SPEECH RECOGNITION ---
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error('Voice not supported in this browser. Please use Chrome/Edge or text chat.', { duration: 5000 });
        setArPhase('idle');
        setIsThinking(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';
      recognitionRef.current = recognition;

      recognition.onresult = async (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (!transcript.trim()) return;
        
        setIsThinking(true);
        setLastFeedback(`You: "${transcript}"`);
        try {
          const reply = await chatWithChef(transcript, selectedChef, language, null, []);
          setLastFeedback(`Chef: "${reply}"`);
          speak(reply);
        } catch(e) {
          console.error(e);
        } finally {
          setIsThinking(false);
        }
      };

      recognition.onerror = (e: any) => {
        if (e.error !== 'no-speech') console.error('Speech recognition error', e.error);
      };

      recognition.onend = () => {
        // Auto-restart if still active
        if (arPhase === 'cooking') {
          recognition.start();
        }
      };

      recognition.start();

      // --- VISION LOOP (Every 20 seconds) ---
      visionIntervalRef.current = setInterval(async () => {
        const base64 = captureFrame();
        if (!base64) return;
        try {
          const feedback = await analyzeCookingFrame(base64, currentStepDescription || "Cooking", selectedChef, language);
          setLastFeedback(`Chef saw: "${feedback}"`);
          speak(feedback);
        } catch(e) {
          console.error(e);
        }
      }, 20000);

      setArPhase('cooking');
      setIsThinking(false);
      setLastFeedback('Chef is watching & listening... Speak now!');
      toast.success('AR Chef Active! Start cooking and talking.');

    } catch (error) {
      console.error('AR Setup Error:', error);
      toast.error('Failed to start camera/mic.');
      setArPhase('idle');
      setIsThinking(false);
    }
  }, [videoRef, selectedChef, language, currentStepDescription, arPhase]);

  const stopLiveAI = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (visionIntervalRef.current) {
      clearInterval(visionIntervalRef.current);
      visionIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setMicLevel(0);
    setArPhase('idle');
    setLastFeedback(null);
  }, []);

  useEffect(() => {
    if (isActive && arPhase === 'idle') {
      initLiveAI();
    } else if (!isActive && arPhase !== 'idle') {
      stopLiveAI();
    }
  }, [isActive, arPhase, initLiveAI, stopLiveAI]);

  return {
    isThinking,
    arPhase,
    micLevel,
    lastFeedback: arPhase === 'connecting' ? 'Connecting to live brain...' : lastFeedback
  };
}


