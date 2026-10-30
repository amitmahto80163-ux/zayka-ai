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
  dishName?: string;
  nextStepDescription?: string;
  isActive: boolean;
}

export function useARChef({
  videoRef,
  audioRef,
  currentStepDescription,
  dishName,
  nextStepDescription,
  isActive,
}: UseARChefProps) {
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecordingWhisper, setIsRecordingWhisper] = useState(false);
  const [arPhase, setArPhase] = useState<'idle' | 'connecting' | 'cooking'>('idle');
  const [micLevel, setMicLevel] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Live AR Optical & AI Telemetry States
  const [browningIndex, setBrowningIndex] = useState(32);
  const [burnRisk, setBurnRisk] = useState(false);
  const [stageStatus, setStageStatus] = useState('Pan Target Locked');
  const [donenessPercent, setDonenessPercent] = useState(30);
  const [flameAdvice, setFlameAdvice] = useState('Medium Flame');
  const [readyForNextStep, setReadyForNextStep] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number>(0);
  const visionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sensorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const internalAudioRef = useRef<HTMLAudioElement | null>(null);
  const recentFeedbacksRef = useRef<string[]>([]);
  const prevPixelSampleRef = useRef<number[] | null>(null);
  const browningRef = useRef(32);
  const burnRiskRef = useRef(false);
  const opticalProfileRef = useRef('Golden: 32%, Red-masala: 18%, Motion: 12');

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
        currentUtteranceRef.current = utterance;

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

      let playedOnline = false;
      try {
        let audioEl = audioRef?.current || internalAudioRef.current;
        if (!audioEl && typeof Audio !== 'undefined') {
          audioEl = new Audio();
          internalAudioRef.current = audioEl;
        }

        if (audioEl) {
          const ttsUrl = `/api/tts?text=${encodeURIComponent(clean.slice(0, 200))}&lang=${
            language === 'english' ? 'english' : 'hindi'
          }&chef=${encodeURIComponent(selectedChef)}`;
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
    [audioRef, fallbackSpeechSynthesis, language, selectedChef]
  );

  // ─── Center-Weighted 72% Pan ROI Frame Grabber (448x448 @ 0.68 JPEG ~24KB) ─────
  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return null;
    try {
      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 480;

      const cropRatio = 0.72;
      const cropW = Math.round(vw * cropRatio);
      const cropH = Math.round(vh * cropRatio);
      const startX = Math.round((vw - cropW) / 2);
      const startY = Math.round((vh - cropH) / 2);

      const canvas = document.createElement('canvas');
      canvas.width = 448;
      canvas.height = 448;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.drawImage(video, startX, startY, cropW, cropH, 0, 0, 448, 448);
      return canvas.toDataURL('image/jpeg', 0.68);
    } catch {
      return null;
    }
  }, [videoRef]);

  // ─── Real-Time On-Device Multi-Channel Optical Culinary Sensor ─
  const sampleOpticalTelemetry = useCallback((): {
    browning: number;
    burnDanger: boolean;
    sceneDelta: number;
    profileString: string;
  } => {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || !video.videoWidth) {
      return {
        browning: browningRef.current,
        burnDanger: false,
        sceneDelta: 15,
        profileString: opticalProfileRef.current,
      };
    }
    try {
      const vw = video.videoWidth || 320;
      const vh = video.videoHeight || 240;

      const sampleSize = 48;
      const canvas = document.createElement('canvas');
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return {
          browning: browningRef.current,
          burnDanger: false,
          sceneDelta: 15,
          profileString: opticalProfileRef.current,
        };
      }

      const sx = Math.round(vw * 0.18);
      const sy = Math.round(vh * 0.18);
      const sw = Math.round(vw * 0.64);
      const sh = Math.round(vh * 0.64);
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sampleSize, sampleSize);

      const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize);
      const totalPixels = sampleSize * sampleSize;
      let goldenBrownCount = 0;
      let redMasalaCount = 0;
      let greenHerbCount = 0;
      let paleCreamCount = 0;
      let darkCharCount = 0;
      const currentLuma: number[] = [];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        currentLuma.push(luma);

        // 1. Golden-brown / caramelized / roasted tadka spectrum
        if (r > 90 && g > 45 && r > g * 1.15 && g > b * 1.15 && luma > 38 && luma < 210) {
          goldenBrownCount++;
        }
        // 2. Red-orange tomato / Kashmiri chilli gravy spectrum
        if (r > 135 && r > g * 1.45 && r > b * 1.6 && luma > 45) {
          redMasalaCount++;
        }
        // 3. Green herbs / palak / veggies spectrum
        if (g > 80 && g > r * 1.12 && g > b * 1.15) {
          greenHerbCount++;
        }
        // 4. Pale / cream / milk / paneer / dough / rice spectrum
        if (r > 175 && g > 170 && b > 155) {
          paleCreamCount++;
        }
        // 5. Scorched / charred dark pixels
        if (luma < 26 && r >= b) {
          darkCharCount++;
        }
      }

      let sceneDelta = 18;
      if (prevPixelSampleRef.current && prevPixelSampleRef.current.length === currentLuma.length) {
        let diffSum = 0;
        for (let i = 0; i < currentLuma.length; i++) {
          diffSum += Math.abs(currentLuma[i] - prevPixelSampleRef.current[i]);
        }
        sceneDelta = Math.round(diffSum / currentLuma.length);
      }
      prevPixelSampleRef.current = currentLuma;

      const goldenPct = Math.min(100, Math.round((goldenBrownCount / totalPixels) * 190));
      const redPct = Math.min(100, Math.round((redMasalaCount / totalPixels) * 180));
      const greenPct = Math.min(100, Math.round((greenHerbCount / totalPixels) * 180));
      const creamPct = Math.min(100, Math.round((paleCreamCount / totalPixels) * 140));

      const rawBrowning = Math.min(100, Math.max(18, Math.round(goldenPct * 0.7 + redPct * 0.45)));
      const smoothedBrowning = Math.round(browningRef.current * 0.55 + rawBrowning * 0.45);
      const isBurning = darkCharCount / totalPixels > 0.42 && smoothedBrowning > 50;

      const profileString = `Golden: ${smoothedBrowning}%, Red-masala: ${redPct}%, Green-herbs: ${greenPct}%, Cream/Pale: ${creamPct}%, Motion: ${sceneDelta}`;

      browningRef.current = smoothedBrowning;
      burnRiskRef.current = isBurning;
      opticalProfileRef.current = profileString;

      setBrowningIndex(smoothedBrowning);
      setBurnRisk(isBurning);

      // Live responsive optical badge updates between AI calls
      if (isBurning) {
        setStageStatus('High Heat Detected!');
        setFlameAdvice('Low Flame');
      } else if (redPct > 32) {
        setStageStatus('Rich Masala Gravy');
      } else if (greenPct > 28) {
        setStageStatus('Fresh Greens Active');
      } else if (smoothedBrowning > 62) {
        setStageStatus('Golden Brown Tadka');
      } else if (creamPct > 45) {
        setStageStatus('Base / Dairy Prep');
      }

      return {
        browning: smoothedBrowning,
        burnDanger: isBurning,
        sceneDelta,
        profileString,
      };
    } catch {
      return {
        browning: browningRef.current,
        burnDanger: false,
        sceneDelta: 15,
        profileString: opticalProfileRef.current,
      };
    }
  }, [videoRef]);

  // ─── Execute Single Vision Inspection (Used by Auto-Loop & "Scan Pan Now") ───
  const runVisionInspection = useCallback(
    async (forceSpeak = false) => {
      const telemetry = sampleOpticalTelemetry();
      const base64 = captureFrame();
      if (!base64) {
        if (forceSpeak) {
          toast('Camera warming up — point at your pan and tap Scan Pan again!', { icon: '📷' });
        }
        return;
      }

      setIsThinking(true);
      try {
        const frameRes = await analyzeFrameAction(
          base64,
          currentStepDescription || 'Cooking step in progress',
          selectedChef,
          language,
          {
            dishName,
            nextStep: nextStepDescription,
            previousFeedback: recentFeedbacksRef.current,
            browningIndex: telemetry.browning,
            burnRisk: telemetry.burnDanger,
            opticalProfile: telemetry.profileString,
            sceneDelta: telemetry.sceneDelta,
          }
        );

        if (frameRes) {
          if (frameRes.stageStatus) setStageStatus(frameRes.stageStatus);
          if (typeof frameRes.donenessPercent === 'number') {
            setDonenessPercent(frameRes.donenessPercent);
          }
          if (frameRes.flameAdvice) setFlameAdvice(frameRes.flameAdvice);
          if (typeof frameRes.readyForNextStep === 'boolean') {
            setReadyForNextStep(frameRes.readyForNextStep);
          }
          if (typeof frameRes.burnRisk === 'boolean') {
            setBurnRisk(frameRes.burnRisk);
          }

          if (frameRes.feedback) {
            const cleanReply = frameRes.feedback.trim();
            const isDuplicate = recentFeedbacksRef.current.some(
              (prev) => prev.toLowerCase() === cleanReply.toLowerCase()
            );
            if (!isDuplicate || forceSpeak) {
              recentFeedbacksRef.current = [...recentFeedbacksRef.current.slice(-4), cleanReply];
              setLastFeedback(`${chef.name}: "${cleanReply}"`);
              speak(cleanReply);
            }
          }
        }
      } catch (e) {
        console.warn('Vision frame analysis error:', e);
      } finally {
        setIsThinking(false);
      }
    },
    [
      captureFrame,
      chef.name,
      currentStepDescription,
      dishName,
      language,
      nextStepDescription,
      sampleOpticalTelemetry,
      selectedChef,
      speak,
    ]
  );

  // Keep latest callbacks in refs so setInterval never uses stale step descriptions
  const runVisionInspectionRef = useRef(runVisionInspection);
  runVisionInspectionRef.current = runVisionInspection;

  const sampleOpticalTelemetryRef = useRef(sampleOpticalTelemetry);
  sampleOpticalTelemetryRef.current = sampleOpticalTelemetry;

  // Reset step completion telemetry and trigger fresh vision scan when user changes step
  useEffect(() => {
    setReadyForNextStep(false);
    setDonenessPercent(25);
    setStageStatus('Scanning New Step...');
    if (isActive && arPhase === 'cooking') {
      const timer = setTimeout(() => {
        runVisionInspectionRef.current(true);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [currentStepDescription, isActive, arPhase]);

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
        audio: false,
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

  // ─── Direct Voice Trigger for User Prompt (Streaming Cooking Advice) ─────
  const triggerVoicePrompt = useCallback(
    async (promptText: string) => {
      if (!promptText.trim()) return;
      setIsThinking(true);
      setLastFeedback(`You: "${promptText}"`);

      try {
        const streamRes = await fetch('/api/chef-stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'advice',
            stepInstruction: `${dishName ? `[Dish: ${dishName}] ` : ''}${
              currentStepDescription || 'Cooking step in progress'
            } (Live Pan Optical Sensor: ${opticalProfileRef.current}, Stage: ${stageStatus})`,
            question: promptText,
            chefId: selectedChef,
            language,
          }),
        });

        if (streamRes.ok && streamRes.body) {
          const reader = streamRes.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let accumulated = '';

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              const rawJson = trimmed.replace(/^data:\s*/, '');
              try {
                const payload = JSON.parse(rawJson);
                if (payload.delta) {
                  accumulated += payload.delta;
                  setLastFeedback(`${chef.name}: "${accumulated}"`);
                }
              } catch {
                // Ignore partial JSON chunk
              }
            }
          }

          if (accumulated.trim()) {
            const finalReply = accumulated.trim();
            setLastFeedback(`${chef.name}: "${finalReply}"`);
            speak(finalReply);
            return;
          }
        }

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
    [chef.name, currentStepDescription, dishName, language, selectedChef, speak, stageStatus]
  );

  // ─── Noisy Kitchen Voice Recorder (Groq Whisper Large v3 Turbo /api/stt) ───
  const recordWhisperVoice = useCallback(async () => {
    if (isRecordingWhisper) return;
    try {
      let audioStream = streamRef.current;
      let createdTempStream = false;
      if (!audioStream || audioStream.getAudioTracks().length === 0) {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        createdTempStream = true;
      }

      const audioTracks = audioStream.getAudioTracks();
      if (audioTracks.length === 0) {
        toast.error('Microphone not available');
        return;
      }

      const micOnlyStream = new MediaStream([audioTracks[0]]);
      const recorder = new MediaRecorder(micOnlyStream);
      const chunks: BlobPart[] = [];

      setIsRecordingWhisper(true);
      setLastFeedback('🎙️ Listening via Whisper AI (Speak now for 3.5s)...');

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        setIsRecordingWhisper(false);
        if (createdTempStream) {
          micOnlyStream.getTracks().forEach((t) => t.stop());
        }
        const blob = new Blob(chunks, { type: 'audio/webm' });
        if (blob.size < 400) return;

        setIsThinking(true);
        try {
          const form = new FormData();
          form.append('audio', blob, 'kitchen-voice.webm');
          form.append('language', language);

          const sttRes = await fetch('/api/stt', { method: 'POST', body: form });
          if (sttRes.ok) {
            const sttData = await sttRes.json();
            if (sttData.text && sttData.text.trim()) {
              await triggerVoicePrompt(sttData.text.trim());
              return;
            }
          }
          toast('Inspecting your pan live to answer...', { icon: '👨‍🍳' });
          await runVisionInspectionRef.current(true);
        } catch {
          await runVisionInspectionRef.current(true);
        } finally {
          setIsThinking(false);
        }
      };

      recorder.start();
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 3500);
    } catch {
      setIsRecordingWhisper(false);
      toast.error('Could not record kitchen audio');
    }
  }, [isRecordingWhisper, language, triggerVoicePrompt]);

  // ─── Live AR Initialization ───────────────────────────────
  const initLiveAI = useCallback(async () => {
    setArPhase('connecting');
    setIsThinking(true);

    try {
      // Wait up to 800ms if videoRef is mounting right now
      let retries = 0;
      while (!videoRef.current && retries < 8) {
        await new Promise((r) => setTimeout(r, 100));
        retries++;
      }
      if (!videoRef.current) {
        setArPhase('idle');
        setIsThinking(false);
        return;
      }

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
            if (isActive && streamRef.current?.active) {
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

      // 4. Real-Time On-Device Optical Pixel Sensor Loop (Every 1.2s using live ref)
      if (sensorIntervalRef.current) clearInterval(sensorIntervalRef.current);
      sensorIntervalRef.current = setInterval(() => {
        sampleOpticalTelemetryRef.current();
      }, 1200);

      // 5. Periodic High-Accuracy Vision Loop (Every 8.5s using live ref)
      if (visionIntervalRef.current) clearInterval(visionIntervalRef.current);
      visionIntervalRef.current = setInterval(() => {
        runVisionInspectionRef.current(false);
      }, 8500);

      setArPhase('cooking');
      setIsThinking(false);

      // 6. Initial Spoken Chef Greeting + First Vision Scan after camera frames stabilize
      const initialGreeting =
        chef.greeting || `Namaste! Main hoon ${chef.name}. Pan ko center box mein rakhiye, main live dekh raha hoon!`;
      setLastFeedback(`${chef.name}: "${initialGreeting}"`);
      speak(initialGreeting);
      toast.success(`${chef.name} AR Vision + Optical Pan Sensor Active! 🧑‍🍳🎯`);

      setTimeout(() => {
        runVisionInspectionRef.current(true);
      }, 2200);
    } catch (error) {
      console.error('AR Setup Error:', error);
      toast.error('Camera/Mic permission needed. Please allow camera access in browser.');
      setArPhase('idle');
      setIsThinking(false);
    }
  }, [
    cameraFacing,
    chef.greeting,
    chef.name,
    getCameraStream,
    isActive,
    language,
    speak,
    triggerVoicePrompt,
    videoRef,
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
        setTimeout(() => {
          runVisionInspectionRef.current(true);
        }, 1000);
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
    if (sensorIntervalRef.current) {
      clearInterval(sensorIntervalRef.current);
      sensorIntervalRef.current = null;
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
    setIsRecordingWhisper(false);
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
    isRecordingWhisper,
    arPhase,
    micLevel,
    lastFeedback:
      arPhase === 'connecting'
        ? 'Connecting to live chef vision & optical sensors...'
        : lastFeedback,
    speak,
    triggerVoicePrompt,
    scanNow: () => runVisionInspectionRef.current(true),
    recordWhisperVoice,
    browningIndex,
    burnRisk,
    stageStatus,
    donenessPercent,
    flameAdvice,
    readyForNextStep,
    cameraFacing,
    toggleCameraFacing,
    soundEnabled,
    setSoundEnabled,
  };
}
