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
      const tokenResponse = await fetch('/api/session');
      const data = await tokenResponse.json();
      const EPHEMERAL_KEY = data.client_secret.value;

      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      pc.ontrack = e => {
        if (audioElRef.current) {
          audioElRef.current.srcObject = e.streams[0];
        }
      };

      let stream = videoRef.current.srcObject as MediaStream;
      if (!stream) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        }
        videoRef.current.srcObject = stream;
      } else {
        if (stream.getAudioTracks().length === 0) {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.addTrack(audioStream.getAudioTracks()[0]);
        }
      }

      pc.addTrack(stream.getAudioTracks()[0]);
      pc.addTrack(stream.getVideoTracks()[0]);

      const dc = pc.createDataChannel('oai-events');
      dataChannelRef.current = dc;

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
