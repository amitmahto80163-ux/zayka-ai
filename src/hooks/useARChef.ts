'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseARChefProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  currentStepDescription: string;
  isActive: boolean;
}

export function useARChef({ videoRef, currentStepDescription, isActive }: UseARChefProps) {
  const [isThinking, setIsThinking] = useState(false);
  const [arPhase, setArPhase] = useState<'idle' | 'connecting' | 'cooking'>('idle');
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create a hidden audio element to play the AI's voice
    if (typeof window !== 'undefined' && !audioElRef.current) {
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      document.body.appendChild(audioEl);
      audioElRef.current = audioEl;
    }
    return () => {
      if (audioElRef.current) {
        audioElRef.current.remove();
      }
    };
  }, []);

  const initLiveAI = useCallback(async () => {
    if (!videoRef.current || !audioElRef.current) return;
    setArPhase('connecting');
    setIsThinking(true);

    try {
      // 1. Get an ephemeral token from our backend
      const tokenResponse = await fetch('/api/session');
      const data = await tokenResponse.json();
      const EPHEMERAL_KEY = data.client_secret.value;

      // 2. Create PeerConnection
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Play the AI's voice when the audio track arrives
      pc.ontrack = e => {
        if (audioElRef.current) {
          audioElRef.current.srcObject = e.streams[0];
        }
      };

      // 3. Add local video/audio tracks
      let stream = videoRef.current.srcObject as MediaStream;
      if (!stream) {
        // Fallback if not already active
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        }
        videoRef.current.srcObject = stream;
      } else {
        // Make sure audio is also requested if missing
        if (stream.getAudioTracks().length === 0) {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.addTrack(audioStream.getAudioTracks()[0]);
        }
      }

      pc.addTrack(stream.getAudioTracks()[0]); // Add mic
      pc.addTrack(stream.getVideoTracks()[0]); // Add camera

      // 4. Data channel for sending events (like updating instructions)
      const dc = pc.createDataChannel('oai-events');
      dataChannelRef.current = dc;

      // 5. Create Offer & connect to OpenAI
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2024-12-17';
      const sdpResponse = await fetch(\\?model=\\, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: \Bearer \\,
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
      toast.success('Live AI Connected! Start talking to the Chef.');

    } catch (error) {
      console.error('WebRTC Error:', error);
      toast.error('Failed to connect to Live AI.');
      setArPhase('idle');
      setIsThinking(false);
    }
  }, [videoRef]);

  const stopLiveAI = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setArPhase('idle');
  }, []);

  // Sync active state
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
    lastFeedback: arPhase === 'connecting' ? 'Connecting to live brain...' : arPhase === 'cooking' ? 'Chef is watching & listening...' : null
  };
}
