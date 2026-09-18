'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { analyzeFrameAction } from '@/lib/actions';
import { ChefId, AppLanguage, Ingredient } from '@/types';
import toast from 'react-hot-toast';

interface UseARChefProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  currentStepDescription: string;
  ingredients: Ingredient[];
  chefId: ChefId;
  language: AppLanguage;
  isActive: boolean;
}

export function useARChef({ videoRef, currentStepDescription, ingredients, chefId, language, isActive }: UseARChefProps) {
  const [isThinking, setIsThinking] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [arPhase, setArPhase] = useState<'idle' | 'prep_check' | 'cooking'>('idle');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Canvas for frame extraction
  useEffect(() => {
    if (typeof window !== 'undefined') {
      canvasRef.current = document.createElement('canvas');
    }
  }, []);

  const speakFeedback = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (language === 'hindi' || language === 'hinglish') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }
    
    utterance.rate = 1.1; 
    utterance.pitch = chefId === 'ananya' || chefId === 'priya' || chefId === 'savita' ? 1.2 : 0.9;
    
    window.speechSynthesis.speak(utterance);
  }, [language, chefId]);

  // Phase 1: The Intro / Prep Check
  useEffect(() => {
    if (isActive && arPhase === 'idle') {
      setArPhase('prep_check');
      const ingList = ingredients.slice(0, 3).map(i => i.name).join(', ');
      const msg = `Hello! Chef here. Cooking start karne se pehle, kya aapne ${ingList} aur baaki saara saaman apne paas ready rakha hai?`;
      setLastFeedback(msg);
      speakFeedback(msg);
      
      // Move to cooking phase after asking
      setTimeout(() => {
        setArPhase('cooking');
      }, 5000);
    }
    
    if (!isActive) {
      setArPhase('idle');
    }
  }, [isActive, arPhase, ingredients, speakFeedback]);

  const captureAndAnalyze = useCallback(async () => {
    // Only analyze frames during the cooking phase
    if (!isActive || isThinking || arPhase !== 'cooking' || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const scale = 640 / video.videoWidth;
    canvas.width = 640;
    canvas.height = video.videoHeight * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Data = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];

    setIsThinking(true);
    try {
      const response = await analyzeFrameAction(base64Data, currentStepDescription, chefId, language);
      if (response.success && response.feedback) {
        setLastFeedback(response.feedback);
        speakFeedback(response.feedback);
      }
    } catch (error) {
      console.error("AR Vision Error:", error);
    } finally {
      setIsThinking(false);
    }
  }, [isActive, isThinking, arPhase, videoRef, currentStepDescription, chefId, language, speakFeedback]);

  // The AR Loop: Capture a frame every 10 seconds if active
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isActive && arPhase === 'cooking') {
      captureAndAnalyze();
      intervalId = setInterval(() => {
        captureAndAnalyze();
      }, 10000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isActive, arPhase, captureAndAnalyze]);

  return {
    isThinking,
    lastFeedback,
    arPhase,
    triggerManualAnalysis: captureAndAnalyze
  };
}
