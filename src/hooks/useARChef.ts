'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { analyzeFrameAction } from '@/lib/actions';
import { useZaykaStore } from '@/store';
import { CHEF_PROFILES } from '@/data/chefs';

interface UseARChefProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  currentStepDescription: string;
  isActive: boolean;
}

export function useARChef({
  videoRef,
  audioRef,
  currentStepDescription,
  isActive,
}: UseARChefProps) {
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [arPhase, setArPhase] = useState<'idle' | 'connecting' | 'cooking'>('idle');
  const [micLevel, setMicLevel] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number>(0);
  const visionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const internalAudioRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const { selectedChef, language } = useZaykaStore();
  const chef = CHEF_PROFILES[selectedChef] || CHEF_PROFILES['rohan'];

  // ─── Dual-Engine Voice Synthesizer (MP3 Audio + Web Speech API fallback) ───
  const fallbackSpeechSynthesis = useCallback(
    (cleanText: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        setIsSpeaking(false);
        return;
      }

      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        currentUtteranceRef.current = utterance; // Prevent garbage collection bug

        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().includes('hi') ||
            v.name.toLowerCase().includes('hindi') ||
            v.name.toLowerCase().includes('india')
        );
        const indianEnglishVoice = voices.find(
          (v) => v.lang === 'en-IN' || v.name.toLowerCase().includes('indian')
        );

        if (language === 'hindi' && hindiVoice) {
          utterance.voice = hindiVoice;
          utterance.lang = 'hi-IN';
        } else if (indianEnglishVoice) {
          utterance.voice = indianEnglishVoice;
          utterance.lang = 'en-IN';
        } else {
          utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';
        }

        // Persona tuning
        if (selectedChef === 'ananya' || selectedChef === 'priya') {
          utterance.pitch = 1.15;
          utterance.rate = 1.0;
        } else if (selectedChef === 'savita') {
          utterance.pitch = 1.05;
          utterance.rate = 0.92;
        } else if (selectedChef === 'rajan') {
          utterance.pitch = 0.85;
          utterance.rate = 0.95;
        } else {
          utterance.pitch = 1.0;
          utterance.rate = 1.02;
        }

        utterance.onend = () => {
          setIsSpeaking(false);
          currentUtteranceRef.current = null;
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          currentUtteranceRef.current = null;
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
      }
    },
    [language, selectedChef]
  );

  const speak = useCallback(
    async (text: string) => {
      if (!text || !text.trim() || !soundEnabledRef.current) return;
      setIsSpeaking(true);

      const clean = text
        .replace(/[*_#`~[\]()]/g, '')
        .replace(
          /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
          ''
        )
        .trim();

      if (!clean) {
        setIsSpeaking(false);
        return;
      }

      // Try Online High-Fidelity MP3 Voice via /api/tts first
      let playedOnline = false;
      try {
        let audioEl = audioRef?.current || internalAudioRef.current;
        if (!audioEl && typeof Audio !== 'undefined') {
          audioEl = new Audio();
          internalAudioRef.current = audioEl;
        }

        if (audioEl) {
          const ttsUrl = `/api/tts?text=${encodeURIComponent(clean.slice(0, 180))}&lang=${
            language === 'english' ? 'english' : 'hindi'
          }`;
          audioEl.src = ttsUrl;

          const onEnded = () => {
            setIsSpeaking(false);
            audioEl?.removeEventListener('ended', onEnded);
            audioEl?.removeEventListener('error', onError);
          };
          const onError = () => {
            audioEl?.removeEventListener('ended', onEnded);
            audioEl?.removeEventListener('error', onError);
            fallbackSpeechSynthesis(clean);
          };

          audioEl.addEventListener('ended', onEnded);
          audioEl.addEventListener('error', onError);

          await audioEl.play();
          playedOnline = true;
        }
      } catch {
        playedOnline = false;
      }

      if (!playedOnline) {
        fallbackSpeechSynthesis(clean);
      }
    },
    [audioRef, fallbackSpeechSynthesis, language]
  );

  // ─── Camera Frame Grabber ──────────────────────────────────
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || videoRef.current.readyState < 2) return null;
    try {
      const canvas = document.createElement('canvas');
      const w = Math.min(videoRef.current.videoWidth || 640, 640);
      const h = Math.min(videoRef.current.videoHeight || 480, 480);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(videoRef.current, 0, 0, w, h);
      return canvas.toDataURL('image/jpeg', 0.65);
    } catch {
      return null;
    }
  }, [videoRef]);

  // ─── Universal Camera Stream Getter (With Graceful Fallbacks) ─
  const getCameraStream = useCallback(async (facing: 'environment' | 'user') => {
    const attempts = [
      {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      },
      {
        video: { facingMode: { ideal: facing } },
        audio: true,
      },
      {
        video: true,
        audio: true,
      },
      {
        video: true,
        audio: false, // In case mic is blocked or exclusive
      },
    ];

    for (const constraint of attempts) {
      try {
        const s = await navigator.mediaDevices.getUserMedia(constraint);
        return s;
      } catch {
        continue;
      }
    }
    throw new Error('Unable to access camera or microphone.');
  }, []);

  // ─── Direct Voice Trigger for User Prompt ─────────────────
  const triggerVoicePrompt = useCallback(
    async (promptText: string) => {
      if (!promptText.trim()) return;
      setIsThinking(true);
      setLastFeedback(`You: "${promptText}"`);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: promptText,
            chefId: selectedChef,
            language,
            currentRecipe: null,
            chatHistory: [],
          }),
        });
        const data = await res.json();
        const reply =
          data.response || `${chef.name}: "Bilkul sahi ja rahe ho! Aise hi continue karo."`;
        setLastFeedback(`${chef.name}: "${reply}"`);
        speak(reply);
      } catch (e) {
        console.error('Chat error:', e);
      } finally {
        setIsThinking(false);
      }
    },
    [chef.name, language, selectedChef, speak]
  );

  // ─── Live AR Initialization ───────────────────────────────
  const initLiveAI = useCallback(async () => {
    if (!videoRef.current) return;
    setArPhase('connecting');
    setIsThinking(true);

    try {
      // 1. Acquire MediaStream
      let stream = streamRef.current;
      if (!stream || !stream.active) {
        stream = await getCameraStream(cameraFacing);
        streamRef.current = stream;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        await videoRef.current.play().catch(() => {});
      }

      // 2. Setup Audio Visualizer Analyzer
      try {
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length > 0) {
          const AudioContextClass =
            window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            if (audioCtx.state === 'suspended') {
              audioCtx.resume().catch(() => {});
            }
            audioContextRef.current = audioCtx;
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 128;
            analyser.smoothingTimeConstant = 0.8;
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateMicLevel = () => {
              if (!analyser) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const average = sum / dataArray.length;
              setMicLevel(Math.min(100, Math.round(average * 1.5)));
              animationFrameRef.current = requestAnimationFrame(updateMicLevel);
            };
            updateMicLevel();
          }
        }
      } catch (audioErr) {
        console.warn('AudioContext visualizer skipped:', audioErr);
      }

      // 3. Setup Speech Recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';
          recognitionRef.current = recognition;

          recognition.onstart = () => setIsListening(true);
          recognition.onend = () => {
            setIsListening(false);
            if (isActive && arPhase !== 'idle') {
              try {
                recognition.start();
              } catch {}
            }
          };

          recognition.onresult = async (event: any) => {
            const transcript =
              event.results[event.results.length - 1][0].transcript;
            if (transcript && transcript.trim()) {
              await triggerVoicePrompt(transcript.trim());
            }
          };

          recognition.onerror = (e: any) => {
            if (e.error !== 'no-speech') {
              console.warn('Speech recognition warning:', e.error);
            }
          };

          recognition.start();
        } catch (recErr) {
          console.warn('Speech recognition start failed:', recErr);
        }
      }

      // 4. Periodic Vision Loop (Every 12s - Fast Model)
      visionIntervalRef.current = setInterval(async () => {
        const base64 = captureFrame();
        if (!base64) return;
        try {
          const frameRes = await analyzeFrameAction(
            base64,
            currentStepDescription || 'Cooking step in progress',
            selectedChef,
            language
          );
          if (frameRes?.feedback) {
            setLastFeedback(`${chef.name}: "${frameRes.feedback}"`);
            speak(frameRes.feedback);
          }
        } catch (e) {
          console.warn('Vision loop frame analysis skipped:', e);
        }
      }, 12000);

      setArPhase('cooking');
      setIsThinking(false);

      // 5. Initial Spoken Chef Greeting (Voice from Chef!)
      const initialGreeting =
        chef.greeting || `Namaste! Main hoon ${chef.name}. Cooking start kijiye, main dekh raha hoon!`;
      setLastFeedback(`${chef.name}: "${initialGreeting}"`);
      speak(initialGreeting);
      toast.success(`${chef.name} is watching & listening with voice live! 🧑‍🍳🎙️`);
    } catch (error) {
      console.error('AR Setup Error:', error);
      toast.error('Camera/Mic permission needed. Please allow camera access in browser.');
      setArPhase('idle');
      setIsThinking(false);
    }
  }, [
    cameraFacing,
    captureFrame,
    chef.greeting,
    chef.name,
    currentStepDescription,
    getCameraStream,
    isActive,
    language,
    selectedChef,
    speak,
    triggerVoicePrompt,
    videoRef,
    arPhase,
  ]);

  // ─── Flip Camera (Front / Rear) ───────────────────────────
  const toggleCameraFacing = useCallback(async () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (arPhase === 'cooking') {
      try {
        const newStream = await getCameraStream(nextFacing);
        streamRef.current = newStream;
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error('Toggle camera error:', err);
      }
    }
  }, [cameraFacing, arPhase, getCameraStream, videoRef]);

  // ─── Stop Live AI ──────────────────────────────────────────
  const stopLiveAI = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      try {
        recognitionRef.current.stop();
      } catch {}
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
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (internalAudioRef.current) {
      internalAudioRef.current.pause();
    }
    if (audioRef?.current) {
      audioRef.current.pause();
    }

    setMicLevel(0);
    setIsSpeaking(false);
    setIsListening(false);
    setArPhase('idle');
    setLastFeedback(null);
  }, [audioRef]);

  // ─── Manage Lifecycle via isActive ─────────────────────────
  useEffect(() => {
    if (isActive && arPhase === 'idle') {
      initLiveAI();
    } else if (!isActive && arPhase !== 'idle') {
      stopLiveAI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLiveAI();
    };
  }, [stopLiveAI]);

  return {
    isThinking,
    isSpeaking,
    isListening,
    arPhase,
    micLevel,
    lastFeedback:
      arPhase === 'connecting'
        ? 'Connecting to live chef vision...'
        : lastFeedback,
    speak,
    triggerVoicePrompt,
    cameraFacing,
    toggleCameraFacing,
    soundEnabled,
    setSoundEnabled,
  };
}
