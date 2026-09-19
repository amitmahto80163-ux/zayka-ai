'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

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
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number>(0);

  const initLiveAI = useCallback(async () => {
    if (!videoRef.current || !audioRef.current) return;
    setArPhase('connecting');
    setIsThinking(true);

    try {
      const tokenResponse = await fetch('/api/session');
      const data = await tokenResponse.json();
      const EPHEMERAL_KEY = data.client_secret.value;

      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Play AI Audio instantly when stream arrives
      pc.ontrack = e => {
        if (audioRef.current && e.track.kind === 'audio') {
          audioRef.current.srcObject = e.streams[0];
          // Force play to overcome some browser policies
          audioRef.current.play().catch(err => console.error("Autoplay blocked:", err));
        }
      };

      // Get Mic & Camera
      let stream = videoRef.current.srcObject as MediaStream;
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
        videoRef.current.srcObject = stream;
      } else if (stream.getAudioTracks().length === 0) {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.addTrack(audioStream.getAudioTracks()[0]);
      }

      // Add tracks to WebRTC
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

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
          setMicLevel(average); // 0 to ~128
          animationFrameRef.current = requestAnimationFrame(updateMicLevel);
        };
        updateMicLevel();
      }

      // Data channel for events
      const dc = pc.createDataChannel('oai-events');
      dataChannelRef.current = dc;

      // Connect to OpenAI
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2024-12-17';
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          'Content-Type': 'application/sdp'
        },
      });

      const answer = {
        type: 'answer' as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      await pc.setRemoteDescription(answer);

      setArPhase('cooking');
      setIsThinking(false);
      toast.success('Chef is listening! Say Hello! YZ');

    } catch (error) {
      console.error('WebRTC Error:', error);
      toast.error('Failed to connect to Live AI.');
      setArPhase('idle');
      setIsThinking(false);
    }
  }, [videoRef, audioRef]);

  const stopLiveAI = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setMicLevel(0);
    setArPhase('idle');
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
    lastFeedback: arPhase === 'connecting' ? 'Connecting to live brain...' : arPhase === 'cooking' ? 'Chef is watching & listening... Speak now!' : null
  };
}
