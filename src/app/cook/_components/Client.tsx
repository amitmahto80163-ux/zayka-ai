'use client';

import DishImage from '@/components/DishImage';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  CheckCircle2,
  BrainCircuit,
  Mic,
  ChefHat,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Radio,
} from 'lucide-react';
import { useZaykaStore } from '@/store';
import { useARChef } from '@/hooks/useARChef';
import ChefChat from '@/components/chat/ChefChat';
import { W } from '@/lib/theme';
import { CHEF_PROFILES } from '@/data/chefs';

export default function CookPage() {
  const router = useRouter();
  const { currentRecipe, addCookingHistoryEntry, memory, updateStreak, selectedChef } =
    useZaykaStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Done modal states
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const steps = currentRecipe?.steps || [];
  const isLastStep = currentStep === Math.max(0, steps.length - 1);
  const step = steps[currentStep];

  const chef = useMemo(
    () => CHEF_PROFILES[selectedChef] || CHEF_PROFILES['rohan'],
    [selectedChef]
  );

  const nextStepObj = steps[currentStep + 1];

  const [manualIngredientInput, setManualIngredientInput] = useState('');

  // AR Chef Hook with Live Camera, Optical Pan Sensor, Vision Loop & Spoken Audio Output
  const {
    isThinking: isARThinking,
    isSpeaking: isARSpeaking,
    isListening: isARListening,
    isRecordingWhisper,
    lastFeedback: arFeedback,
    micLevel,
    cameraFacing,
    toggleCameraFacing,
    soundEnabled,
    setSoundEnabled,
    speak,
    triggerVoicePrompt,
    scanNow,
    recordWhisperVoice,
    browningIndex,
    burnRisk,
    stageStatus,
    donenessPercent,
    flameAdvice,
    readyForNextStep,
    detectedIngredient,
    confidenceScore,
    requiresIngredientVerification,
    candidateIngredients,
    verifyScannedIngredient,
  } = useARChef({
    videoRef,
    audioRef,
    currentStepDescription: step?.description || '',
    dishName: currentRecipe?.name || 'Indian Dish',
    nextStepDescription: nextStepObj?.description || '',
    isActive: isCameraActive,
  });

  const visualizerScale = useMemo(() => {
    if (isARSpeaking) return 1.15;
    return 1 + (micLevel / 100) * 0.4;
  }, [isARSpeaking, micLevel]);

  // Voice Command Listener when camera is not in AR mode
  useEffect(() => {
    if (typeof window === 'undefined' || isCameraActive) return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN';

      recognition.onresult = (event: any) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        if (
          transcript.includes('next') ||
          transcript.includes('aage') ||
          transcript.includes('agla')
        ) {
          nextStep();
        } else if (
          transcript.includes('back') ||
          transcript.includes('peeche') ||
          transcript.includes('wapas')
        ) {
          prevStep();
        } else if (
          transcript.includes('repeat') ||
          transcript.includes('dobara') ||
          transcript.includes('phir se')
        ) {
          speakCurrentStep();
        }
      };

      recognition.start();

      return () => {
        recognition.onend = null;
        try {
          recognition.stop();
        } catch {}
      };
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isCameraActive]);

  const speakCurrentStep = () => {
    if (!step) return;
    const text = `Step ${currentStep + 1}: ${step.title || 'Next'}. ${step.description}`;
    speak(text);
  };

  const toggleCamera = async () => {
    if (isCameraActive) {
      setIsCameraActive(false);
    } else {
      setShowChat(false);
      setIsCameraActive(true);
    }
  };

  const nextStep = () => {
    if (isLastStep) {
      setShowDoneModal(true);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => currentStep > 0 && setCurrentStep((s) => s - 1);

  const handleMarkCooked = () => {
    if (currentRecipe) {
      addCookingHistoryEntry({
        recipeId: currentRecipe.id,
        recipeName: currentRecipe.name,
        cookedAt: new Date().toISOString(),
        servings: currentRecipe.servings || 2,
        notes: userRating > 0 ? `Rating: ${userRating} stars` : '',
      });
      updateStreak();
    }
    router.push('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        background: '#FFF8F3',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      {/* Hidden Audio element for spoken chef voice playback */}
      <audio ref={audioRef} autoPlay playsInline style={{ display: 'none' }} />

      {/* Header */}
      <div
        style={{
          background: 'white',
          padding: '14px 20px',
          borderBottom: `1px solid ${W.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: '#F8FAFC',
              border: `1px solid ${W.border}`,
              borderRadius: 12,
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronLeft size={18} color="#334155" />
          </button>
          <div>
            <h1
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: W.heading,
                lineHeight: 1.2,
              }}
            >
              {currentRecipe?.name || 'AR Cooking Assistant'}
            </h1>
            <p style={{ fontSize: 11, color: W.muted, fontWeight: 700 }}>
              Step {currentStep + 1} of {steps.length || 1} · {chef.name}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setShowChat(!showChat)}
            style={{
              background: showChat ? W.saffron : '#FFF0E6',
              color: showChat ? 'white' : W.saffron,
              border: 'none',
              borderRadius: 20,
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <ChefHat size={14} />
            <span>{showChat ? 'Close' : 'Ask Chef'}</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* AR Camera & Live Voice Canvas */}
        {isCameraActive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              background: '#090D16',
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.92,
              }}
            />

            {/* Top AR Controls (Facing, Sound, Live Status) */}
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                right: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 10,
              }}
            >
              {/* Live Badge */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.82)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 50,
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  border: burnRisk
                    ? '1.5px solid #EF4444'
                    : '1px solid rgba(255,255,255,0.14)',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: burnRisk
                      ? '#EF4444'
                      : isARThinking
                      ? '#FBBF24'
                      : isARSpeaking
                      ? '#F97316'
                      : '#10B981',
                    boxShadow: burnRisk
                      ? '0 0 10px #EF4444'
                      : isARSpeaking
                      ? '0 0 10px #F97316'
                      : '0 0 8px #10B981',
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: 'white',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {burnRisk
                    ? '⚠️ High Heat Alert!'
                    : isARThinking
                    ? 'Scanning Pan...'
                    : isARSpeaking
                    ? `${chef.name} Speaking 🔊`
                    : 'AR Vision · Locked'}
                </span>
              </div>

              {/* Camera Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Manual Instant Scan Pan Button */}
                <button
                  type="button"
                  onClick={scanNow}
                  disabled={isARThinking}
                  aria-label="Scan Pan Now"
                  style={{
                    background: 'rgba(16, 185, 129, 0.88)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 20,
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    cursor: isARThinking ? 'wait' : 'pointer',
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  <Sparkles size={13} />
                  <span>{isARThinking ? 'Scanning...' : 'Scan Pan 📸'}</span>
                </button>

                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  aria-label="Toggle Chef Voice Sound"
                  style={{
                    background: soundEnabled
                      ? 'rgba(249, 115, 22, 0.85)'
                      : 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                  }}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>

                {/* Flip Camera */}
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  aria-label="Flip Camera"
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                  }}
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* Live Optical & AI Telemetry Row (Stage Status + Flame Advice + Doneness Bar) */}
            <div
              style={{
                position: 'absolute',
                top: 58,
                left: 14,
                right: 14,
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.78)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px 10px',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#FBBF24',
                  }}
                >
                  🍲 {stageStatus} · Golden {browningIndex}%
                </div>

                <div
                  style={{
                    background:
                      confidenceScore < 70
                        ? 'rgba(245, 158, 11, 0.92)'
                        : 'rgba(15, 23, 42, 0.78)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px 10px',
                    borderRadius: 12,
                    border:
                      confidenceScore < 70
                        ? '1px solid #FDE68A'
                        : '1px solid rgba(255,255,255,0.12)',
                    fontSize: 11,
                    fontWeight: 800,
                    color: 'white',
                  }}
                >
                  {confidenceScore < 70 ? '⚠️' : '🎯'} {detectedIngredient} ({confidenceScore}%)
                </div>

                <div
                  style={{
                    background: burnRisk
                      ? 'rgba(239, 68, 68, 0.88)'
                      : 'rgba(15, 23, 42, 0.78)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px 10px',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: 11,
                    fontWeight: 800,
                    color: 'white',
                  }}
                >
                  🔥 {flameAdvice}
                </div>
              </div>

              {/* Step Doneness Progress Bar */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.72)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 10,
                  padding: '5px 10px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 800, color: '#E2E8F0', whiteSpace: 'nowrap' }}>
                  Step Doneness
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: 99,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${donenessPercent}%`,
                      height: '100%',
                      background:
                        donenessPercent >= 85
                          ? 'linear-gradient(90deg, #10B981, #34D399)'
                          : 'linear-gradient(90deg, #F97316, #FBBF24)',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
                <span style={{ fontSize: 10, fontWeight: 900, color: '#10B981' }}>
                  {donenessPercent}%
                </span>
              </div>

              {/* ⚠️ <70% AI Confidence Manual Ingredient Verification Fallback Card */}
              {requiresIngredientVerification && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(15, 23, 42, 0.94)',
                    backdropFilter: 'blur(14px)',
                    border: '1.5px solid #F59E0B',
                    borderRadius: 16,
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#FBBF24' }}>
                      ⚠️ Low AI Confidence ({confidenceScore}% &lt; 70%): Verify Ingredient in Pan
                    </span>
                    <button
                      type="button"
                      onClick={() => verifyScannedIngredient(detectedIngredient)}
                      style={{
                        background: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        padding: '3px 8px',
                        fontSize: 10,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Yes, {detectedIngredient}
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {candidateIngredients.map((cand) => (
                      <button
                        key={cand}
                        type="button"
                        onClick={() => verifyScannedIngredient(cand)}
                        style={{
                          background: 'rgba(255,255,255,0.12)',
                          color: 'white',
                          border: '1px solid rgba(251,191,36,0.45)',
                          borderRadius: 99,
                          padding: '4px 10px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {cand}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="text"
                      value={manualIngredientInput}
                      onChange={(e) => setManualIngredientInput(e.target.value)}
                      placeholder="Or type ingredient manually..."
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.24)',
                        borderRadius: 10,
                        padding: '5px 10px',
                        fontSize: 11,
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (manualIngredientInput.trim()) {
                          verifyScannedIngredient(manualIngredientInput.trim());
                          setManualIngredientInput('');
                        }
                      }}
                      style={{
                        background: '#F97316',
                        color: 'white',
                        border: 'none',
                        borderRadius: 10,
                        padding: '5px 12px',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      Verify
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Center-Pan AR Targeting Reticle + Voice Visualizer */}
            <div
              style={{
                position: 'absolute',
                top: '46%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 240,
                height: 240,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                border: burnRisk
                  ? '2px dashed rgba(239, 68, 68, 0.85)'
                  : readyForNextStep
                  ? '2px dashed rgba(16, 185, 129, 0.85)'
                  : '1.5px dashed rgba(251, 191, 36, 0.55)',
                borderRadius: 32,
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.25)',
              }}
            >
              <motion.div
                animate={{ scale: visualizerScale }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: '50%',
                  border: isARSpeaking
                    ? '3px solid #F97316'
                    : '2.5px solid rgba(16, 185, 129, 0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isARSpeaking
                    ? 'rgba(249, 115, 22, 0.25)'
                    : 'rgba(16, 185, 129, 0.15)',
                  boxShadow: isARSpeaking
                    ? '0 0 32px rgba(249, 115, 22, 0.6)'
                    : `0 0 ${micLevel}px rgba(16, 185, 129, 0.5)`,
                }}
              >
                {isARSpeaking ? (
                  <Radio
                    style={{
                      width: 36,
                      height: 36,
                      color: 'white',
                      animation: 'pulse 1s infinite',
                    }}
                  />
                ) : (
                  <Mic
                    style={{
                      width: 32,
                      height: 32,
                      color: 'rgba(255,255,255,0.95)',
                    }}
                  />
                )}
              </motion.div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.82)',
                  backdropFilter: 'blur(12px)',
                  padding: '5px 14px',
                  borderRadius: 24,
                  border: '1px solid rgba(255,255,255,0.14)',
                }}
              >
                <p style={{ color: 'white', fontWeight: 800, fontSize: 11 }}>
                  {isRecordingWhisper
                    ? 'Whisper AI Recording... 🎙️'
                    : isARSpeaking
                    ? `${chef.name} speaking... 🔊`
                    : isARListening && micLevel > 12
                    ? 'Listening to you... 🎙️'
                    : 'Keep Pan Inside Target 🎯'}
                </p>
              </div>
            </div>

            {/* Step Ready Auto-Advance Banner */}
            {readyForNextStep && !isLastStep && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  position: 'absolute',
                  bottom: arFeedback ? 156 : 74,
                  left: 14,
                  right: 14,
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.95), rgba(5,150,105,0.95))',
                  borderRadius: 16,
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  zIndex: 12,
                  boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
                }}
              >
                <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>
                  ✅ Step looks ready! Move to Step {currentStep + 2}?
                </span>
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    background: 'white',
                    color: '#059669',
                    border: 'none',
                    borderRadius: 12,
                    padding: '5px 12px',
                    fontSize: 11,
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  Next Step →
                </button>
              </motion.div>
            )}

            {/* Quick Interactive Spoken Query Pills + Whisper Mic Trigger */}
            <div
              style={{
                position: 'absolute',
                bottom: arFeedback ? 110 : 24,
                left: 12,
                right: 12,
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                paddingBottom: 4,
                zIndex: 10,
                scrollbarWidth: 'none',
              }}
            >
              <button
                type="button"
                onClick={recordWhisperVoice}
                disabled={isRecordingWhisper}
                style={{
                  background: isRecordingWhisper
                    ? '#EF4444'
                    : 'linear-gradient(135deg, #F97316, #FB923C)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 20,
                  padding: '8px 14px',
                  fontSize: 11,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(249,115,22,0.35)',
                }}
              >
                {isRecordingWhisper ? '🔴 Recording 3.5s...' : '🎙️ Speak (Whisper AI)'}
              </button>

              {[
                { label: '📸 Check Pan', q: '__SCAN__' },
                { label: '🔥 Flame Sahi Hai?', q: 'Flame check karo, gas kitni rakhu?' },
                { label: '🧂 Masala Daalun?', q: 'Abhi kaun sa masala daalna hai?' },
                { label: '⏱️ Kitni Der Pakau?', q: 'Yeh step kitni der aur pakana hai?' },
                { label: '📢 Step Repeat', q: 'Yeh wala step ek baar dobara bolo' },
              ].map((pill, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    pill.q === '__SCAN__' ? scanNow() : triggerVoicePrompt(pill.q)
                  }
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: 20,
                    padding: '8px 14px',
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Chef Feedback Live Bubble with Voice Indicator */}
            {arFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 14,
                  right: 14,
                  background: 'rgba(15, 23, 42, 0.92)',
                  backdropFilter: 'blur(16px)',
                  border: '1.5px solid rgba(249,115,22,0.45)',
                  borderRadius: 20,
                  padding: '14px 16px',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  zIndex: 10,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F97316, #FB923C)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ChefHat size={20} color="white" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        color: W.saffron,
                        textTransform: 'uppercase',
                      }}
                    >
                      {chef.name}
                    </span>
                    {isARSpeaking && (
                      <span
                        style={{
                          fontSize: 10,
                          color: '#10B981',
                          fontWeight: 800,
                        }}
                      >
                        · Speaking 🔊
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: 'white',
                      fontWeight: 600,
                      lineHeight: 1.45,
                    }}
                  >
                    {arFeedback}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Step-by-Step Card Mode (When Camera is Off or Chat Opened) */}
        <AnimatePresence mode="wait">
          {!showChat ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                zIndex: 10,
                padding: isCameraActive ? 0 : '20px 16px',
                justifyContent: isCameraActive ? 'flex-end' : 'center',
                gap: 16,
              }}
            >
              {!isCameraActive && (
                <div
                  style={{
                    background: W.card,
                    border: `1.5px solid ${W.border}`,
                    borderRadius: 28,
                    padding: 24,
                    boxShadow: '0 8px 32px rgba(249,115,22,0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 16,
                          background: 'linear-gradient(135deg, #F97316, #FBBF24)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 900,
                          fontSize: 18,
                        }}
                      >
                        {currentStep + 1}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            color: W.muted,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                          }}
                        >
                          Current Step
                        </p>
                        <h2
                          style={{
                            fontSize: 18,
                            fontWeight: 900,
                            color: W.heading,
                          }}
                        >
                          {step?.title || `Step ${currentStep + 1}`}
                        </h2>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={speakCurrentStep}
                      style={{
                        background: '#FFF0E6',
                        border: 'none',
                        borderRadius: 12,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        color: W.saffron,
                        fontWeight: 800,
                        fontSize: 12,
                      }}
                    >
                      <Volume2 size={16} />
                      <span>Hear Step</span>
                    </button>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: 200,
                      position: 'relative',
                      borderRadius: 16,
                      overflow: 'hidden',
                      marginBottom: 16,
                      background: '#F3F4F6',
                    }}
                  >
                    <DishImage
                      src={
                        'https://image.pollinations.ai/prompt/' +
                        encodeURIComponent(
                          'cooking step realistic top down ' +
                            (currentRecipe?.name || '') +
                            ' ' +
                            (step?.description || '')
                        ) +
                        '?width=600&height=400&nologo=true&seed=' +
                        currentStep
                      }
                      alt="Step Visualization"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <p
                    style={{
                      fontSize: 15,
                      color: '#3D2B1F',
                      lineHeight: 1.7,
                      fontWeight: 600,
                    }}
                  >
                    {step?.description}
                  </p>

                  {step?.tips && step.tips.length > 0 && (
                    <div
                      style={{
                        marginTop: 14,
                        padding: '10px 14px',
                        background: '#FEF3C7',
                        borderRadius: 12,
                        border: '1px solid #FDE68A',
                        fontSize: 12,
                        color: '#92400E',
                        fontWeight: 700,
                      }}
                    >
                      💡 Pro Tip: {step.tips[0]}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ flex: 1, background: 'white', zIndex: 10 }}
            >
              <ChefChat context="cooking" recipeData={currentRecipe} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div
        style={{
          background: 'rgba(255,248,243,0.96)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${W.border}`,
          padding: '14px 16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          zIndex: 20,
        }}
      >
        <button
          aria-label="Previous Step"
          onClick={prevStep}
          disabled={currentStep === 0}
          style={{
            padding: '12px 18px',
            borderRadius: 16,
            fontWeight: 800,
            fontSize: 14,
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            background: currentStep === 0 ? '#F0E6DC' : W.card,
            color: currentStep === 0 ? '#C4A882' : W.heading,
            border: `1.5px solid ${W.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            opacity: currentStep === 0 ? 0.5 : 1,
          }}
        >
          <ChevronLeft style={{ width: 16, height: 16 }} /> Prev
        </button>

        {/* Central AR Camera Toggle Button */}
        <button
          type="button"
          aria-label={isCameraActive ? 'Deactivate Camera' : 'Activate Live AR Chef'}
          onClick={toggleCamera}
          style={{
            height: 52,
            padding: '0 20px',
            borderRadius: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            border: 'none',
            background: isCameraActive
              ? '#EF4444'
              : 'linear-gradient(135deg, #F97316, #FB923C)',
            boxShadow: isCameraActive
              ? '0 4px 16px rgba(239,68,68,0.4)'
              : '0 4px 20px rgba(249,115,22,0.4)',
            color: 'white',
            fontWeight: 900,
            fontSize: 14,
            transition: 'all 0.3s',
          }}
        >
          <Camera style={{ width: 20, height: 20 }} />
          <span>{isCameraActive ? 'Exit AR' : 'Live AR Chef 🎙️'}</span>
        </button>

        <button
          aria-label={isLastStep ? 'Finish Cooking' : 'Next Step'}
          onClick={nextStep}
          style={{
            padding: '12px 18px',
            borderRadius: 16,
            fontWeight: 800,
            fontSize: 14,
            cursor: 'pointer',
            background: isLastStep
              ? 'linear-gradient(135deg, #10B981, #059669)'
              : 'linear-gradient(135deg, #F97316, #FB923C)',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 16px rgba(249,115,22,0.35)',
          }}
        >
          {isLastStep ? (
            <>
              <CheckCircle2 style={{ width: 16, height: 16 }} /> Done!
            </>
          ) : (
            <>
              Next <ChevronRight style={{ width: 16, height: 16 }} />
            </>
          )}
        </button>
      </div>

      {/* Done Celebration Modal */}
      <AnimatePresence>
        {showDoneModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              zIndex: 100,
            }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              style={{
                width: '100%',
                background: W.bg,
                borderRadius: '24px 24px 0 0',
                padding: '32px 24px 48px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <span style={{ fontSize: 64 }}>🎉</span>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: W.heading }}>
                Dish Ready!
              </h2>
              <p style={{ fontSize: 15, color: W.muted, textAlign: 'center' }}>
                {currentRecipe?.name || 'Dish'} ban gaya! Rate your experience:
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    style={{
                      fontSize: 36,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      filter: userRating >= star ? 'none' : 'grayscale(100%)',
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleMarkCooked}
                style={{
                  width: '100%',
                  background: W.saffron,
                  color: 'white',
                  border: 'none',
                  padding: '18px',
                  borderRadius: 100,
                  fontSize: 18,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(249,115,22,0.3)',
                }}
              >
                Save & Go Home 🏠
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
