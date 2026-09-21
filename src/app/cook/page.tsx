'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Camera, CheckCircle2, Timer, Flame, BrainCircuit, Mic, ChefHat } from 'lucide-react';
import { useZaykaStore } from '@/store';
import { useARChef } from '@/hooks/useARChef';
import ChefChat from '@/components/chat/ChefChat';

const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

export default function CookPage() {
  const router = useRouter();
  const { currentRecipe, addCookingHistoryEntry, updateMemory, memory, updateStreak } = useZaykaStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Phase 2 states
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [userRating, setUserRating] = useState(0);

  // Phase 5 states
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const step = currentRecipe?.steps[currentStep];
  const isLastStep = currentStep === (currentRecipe?.steps.length || 1) - 1;

  // Use new AR Chef with visualizer
  const { isThinking: isARThinking, lastFeedback: arFeedback, micLevel } = useARChef({
    videoRef,
    audioRef,
    currentStepDescription: currentRecipe?.steps[currentStep]?.description || '',
    isActive: isCameraActive
  });

  // Phase 5: Voice Commands Logic
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'hi-IN';

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      if (transcript.includes('next') || transcript.includes('aage') || transcript.includes('agla')) {
        nextStep();
      } else if (transcript.includes('back') || transcript.includes('peeche') || transcript.includes('wapas')) {
        prevStep();
      } else if (transcript.includes('repeat') || transcript.includes('dobara') || transcript.includes('phir se')) {
        speakStep();
      }
    };

    recognition.onstart = () => setIsVoiceActive(true);
    recognition.onend = () => {
      // automatically restart listening unless unmounted or manually stopped
      // But for safety and not being annoying, we won't auto-restart here. Just let user click a mic if they want it.
      // Wait, Masterplan says "Add voice command listener" and start it.
      setIsVoiceActive(false);
      try { recognition.start(); } catch (e) {} 
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }
    
    return () => {
      recognition.onend = null;
      recognition.stop();
    };
  }, [currentStep]); // Restart on step change

  const speakStep = () => {
    if (!step) return;
    const text = `Step ${currentStep + 1}: ${step.title || 'Next'}. ${step.description}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const toggleCamera = async () => {
    if (isCameraActive) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(t => t.stop());
      setIsCameraActive(false);
    } else {
      setShowChat(false);
      setIsCameraActive(true);
    }
  };

  // Phase 2: Show done modal instead of redirect
  const nextStep = () => {
    if (isLastStep) {
      setShowDoneModal(true);
    } else {
      setCurrentStep(s => s + 1);
    }
  };
  const prevStep = () => currentStep > 0 && setCurrentStep(s => s - 1);

  // Phase 2: Save to memory and handle gamification
  const handleMarkCooked = () => {
    if (currentRecipe) {
      addCookingHistoryEntry({
        recipeId: currentRecipe.id,
        recipeName: currentRecipe.name,
        cookedAt: new Date().toISOString(),
        rating: userRating || null,
        note: '',
      });
      if (memory) {
        updateMemory({ weeklyCompleted: memory.weeklyCompleted + 1 });
      }
      updateStreak();
    }
    router.push('/');
  };

  const visualizerScale = 1 + (micLevel / 150);

  if (!currentRecipe) {
    return (
      <div style={{ minHeight: '100vh', background: W.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <ChefHat style={{ width: 64, height: 64, color: W.saffron, opacity: 0.5, marginBottom: 16 }} />
        <h2 style={{ fontSize: 24, fontWeight: 800, color: W.heading, marginBottom: 8 }}>Kitchen is Empty!</h2>
        <p style={{ color: W.muted, textAlign: 'center', marginBottom: 24 }}>Aapne abhi koi recipe select nahi ki hai. Search mein jaake ek recipe choose karein.</p>
        <button onClick={() => router.push('/search')} style={{ background: W.saffron, color: 'white', border: 'none', padding: '14px 24px', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
          Find a Recipe
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: W.bg }}>
      <audio ref={audioRef} autoPlay playsInline style={{ display: 'none' }} />

      {/* Voice Active Indicator (Phase 5) */}
      {isVoiceActive && (
        <div style={{
          position: 'absolute', top: 16, right: 16, background: 'rgba(249,115,22,0.1)',
          border: '1px solid rgba(249,115,22,0.3)', borderRadius: 100,
          padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, zIndex: 100
        }}>
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: W.saffron }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: W.saffron }}>Listening...</span>
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'white', padding: '16px 20px', borderBottom: `1px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 20 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 900, color: W.heading }}>{currentRecipe?.name || 'AR Cooking'}</h1>
          <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>Step {currentStep + 1} of {currentRecipe?.steps?.length || 1}</p>
        </div>
        <button onClick={() => setShowChat(!showChat)} style={{ background: showChat ? W.saffron : '#FFF0E6', color: showChat ? 'white' : W.saffron, border: 'none', borderRadius: 20, padding: '8px 16px', fontSize: 13, fontWeight: 800, transition: 'all 0.2s' }}>
          {showChat ? 'Close Chat' : 'Ask Chef'}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        
        {isCameraActive && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#000' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }} />
            
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
               <motion.div 
                 animate={{ scale: visualizerScale }} 
                 transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                 style={{ width: 120, height: 120, borderRadius: '50%', border: '3px solid rgba(249,115,22,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(249,115,22,0.1)', boxShadow: `0 0 ${micLevel}px rgba(249,115,22,0.4)` }}
               >
                 <Mic style={{ width: 40, height: 40, color: 'rgba(255,255,255,0.9)' }} />
               </motion.div>
               <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: 20 }}>
                 <p style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>
                   {micLevel > 10 ? "Listening... 🎙️" : "Speak to Chef!"}
                 </p>
               </div>
            </div>

            <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', borderRadius: 50, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: isARThinking ? '#FBBF24' : '#10B981', animation: 'pulse 1s infinite' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {isARThinking ? 'Connecting Brain...' : 'AR Live'}
              </span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!showChat ? (
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 10, padding: isCameraActive ? 0 : '20px 16px', justifyContent: isCameraActive ? 'flex-end' : 'center', gap: 16 }}>

              {!isCameraActive && (
                <>
                  <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 28, padding: 24, boxShadow: '0 8px 32px rgba(249,115,22,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 16, background: 'linear-gradient(135deg, #F97316, #FBBF24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 18 }}>{currentStep + 1}</div>
                      <div>
                        <p style={{ fontSize: 11, color: W.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current Step</p>
                        <h2 style={{ fontSize: 20, fontWeight: 900, color: W.heading }}>{step?.description?.substring(0,20)}...</h2>
                      </div>
                    </div>
                    <p style={{ fontSize: 15, color: '#3D2B1F', lineHeight: 1.7, fontWeight: 600 }}>{step?.description}</p>
                  </div>
                </>
              )}

              {isCameraActive && arFeedback && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  style={{ margin: 16, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 20, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <BrainCircuit style={{ width: 20, height: 20, color: '#F97316', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 800, color: W.saffron, marginBottom: 4, textTransform: 'uppercase' }}>Zayka AI Status:</p>
                    <p style={{ fontSize: 13, color: 'white', fontWeight: 600, lineHeight: 1.5 }}>{arFeedback}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ flex: 1, background: 'white', zIndex: 10 }}>
              <ChefChat context="cooking" recipeData={currentRecipe} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ background: 'rgba(255,248,243,0.96)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${W.border}`, padding: '14px 16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, zIndex: 20 }}>
        <button onClick={prevStep} disabled={currentStep === 0}
          style={{ padding: '12px 20px', borderRadius: 16, fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, cursor: currentStep === 0 ? 'not-allowed' : 'pointer', background: currentStep === 0 ? '#F0E6DC' : W.card, color: currentStep === 0 ? '#C4A882' : W.heading, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', opacity: currentStep === 0 ? 0.5 : 1 }}>
          <ChevronLeft style={{ width: 16, height: 16 }} /> Prev
        </button>

        <button onClick={toggleCamera}
          style={{ width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', background: isCameraActive ? '#EF4444' : 'linear-gradient(135deg, #3B82F6, #06B6D4)', boxShadow: isCameraActive ? '0 4px 16px rgba(239,68,68,0.4)' : '0 4px 16px rgba(59,130,246,0.3)', transition: 'all 0.3s' }}>
          <Camera style={{ width: 22, height: 22, color: 'white' }} />
        </button>

        <button onClick={nextStep}
          style={{ padding: '12px 20px', borderRadius: 16, fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer', background: 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 16px rgba(249,115,22,0.35)', transition: 'all 0.2s' }}>
          {isLastStep ? (<><CheckCircle2 style={{ width: 16, height: 16 }} /> Done!</>) : (<>Next <ChevronRight style={{ width: 16, height: 16 }} /></>)}
        </button>
      </div>

      {/* ===== DONE MODAL (Phase 2) ===== */}
      <AnimatePresence>
        {showDoneModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100
            }}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              style={{
                width: '100%', background: W.bg, borderRadius: '24px 24px 0 0',
                padding: '32px 24px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20
              }}
            >
              <span style={{ fontSize: 64 }}>🎉</span>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: W.heading }}>Dish Ready!</h2>
              <p style={{ fontSize: 15, color: W.muted, textAlign: 'center' }}>
                {currentRecipe?.name} ban gaya! Rate your experience:
              </p>

              {/* Star Rating */}
              <div style={{ display: 'flex', gap: 12 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setUserRating(star)} style={{
                    fontSize: 36, background: 'none', border: 'none', cursor: 'pointer',
                    filter: userRating >= star ? 'none' : 'grayscale(100%)'
                  }}>⭐</button>
                ))}
              </div>

              <button
                onClick={handleMarkCooked}
                style={{
                  width: '100%', background: W.saffron, color: 'white', border: 'none',
                  padding: '18px', borderRadius: 100, fontSize: 18, fontWeight: 900, cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(249,115,22,0.3)'
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
