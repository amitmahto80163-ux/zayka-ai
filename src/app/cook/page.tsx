'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, MessageSquare, CheckCircle2, BrainCircuit, ChevronRight, ChevronLeft } from 'lucide-react';
import { useZaykaStore } from '@/store';
import { CHEF_PROFILES } from '@/data/chefs';
import ChefChat from '@/components/chat/ChefChat';
import toast from 'react-hot-toast';
import { useARChef } from '@/hooks/useARChef';

const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

export default function CookingMode() {
  const router = useRouter();
  const { currentRecipe, currentStep, setCurrentStep, selectedChef, language } = useZaykaStore();
  const chef = CHEF_PROFILES[selectedChef];

  const [showChat, setShowChat] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { isThinking: isARThinking, lastFeedback: arFeedback } = useARChef({
    videoRef,
    currentStepDescription: currentRecipe?.steps[currentStep]?.description || '',
    ingredients: currentRecipe?.ingredients || [],
    chefId: selectedChef,
    language,
    isActive: isCameraActive
  });

  useEffect(() => {
    if (!currentRecipe) router.push('/');
  }, [currentRecipe, router]);

  const toggleCamera = async () => {
    if (isCameraActive) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
      toast('AR Mode band kiya', { icon: '🛑' });
    } else {
      try {
        let stream; try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); } catch(e) { stream = await navigator.mediaDevices.getUserMedia({ video: true }); }
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        toast.success('AR Live! Chef is watching your pan 👀');
      } catch {
        toast.error('Camera access nahi mili!');
      }
    }
  };

  const nextStep = () => {
    if (currentRecipe && currentStep < currentRecipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentRecipe && currentStep === currentRecipe.steps.length - 1) {
      toast.success('🎉 Dish ready! Enjoy your meal!');
      router.push('/');
    }
  };

  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  if (!currentRecipe) return null;
  const step = currentRecipe.steps[currentStep];
  const isLastStep = currentStep === currentRecipe.steps.length - 1;
  const progress = ((currentStep + 1) / currentRecipe.steps.length) * 100;

  const CHEF_TIPS = [
    `${chef?.name} ka advice: Aanch medium rakho, masala dheere dheere pakao!`,
    `${chef?.name} keh rahe hain: Har ingredient carefully add karo!`,
    `${chef?.name} tip: Agar smell aane lage, stirring fast karo!`,
    `${chef?.name}: Patience raho — acha khana time leta hai!`,
  ];
  const currentTip = CHEF_TIPS[currentStep % CHEF_TIPS.length];

  return (
    <div style={{ minHeight: '100vh', background: W.bg, display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,248,243,0.96)', backdropFilter: 'blur(20px)', padding: '48px 16px 14px', borderBottom: `1px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 18, height: 18, color: W.heading }} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: W.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cooking Mode 🍳</p>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: W.heading, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentRecipe.name}</h2>
        </div>
        <button onClick={() => setShowChat(!showChat)} style={{ width: 40, height: 40, borderRadius: '50%', background: showChat ? '#FFEDD5' : W.card, border: `1.5px solid ${showChat ? W.saffron : W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <MessageSquare style={{ width: 18, height: 18, color: showChat ? W.saffron : W.heading }} />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ height: 4, background: '#F0E6DC' }}>
        <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} style={{ height: '100%', background: 'linear-gradient(90deg, #F97316, #FBBF24)', borderRadius: '0 50px 50px 0' }} />
      </div>
      <p style={{ textAlign: 'center', fontSize: 11, color: W.muted, fontWeight: 700, padding: '6px 0', background: W.card, borderBottom: `1px solid ${W.border}` }}>
        Step {currentStep + 1} / {currentRecipe.steps.length}
      </p>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

        {/* Camera */}
        {isCameraActive && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#000' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }} />
            {/* Focus Frame */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 200, height: 200, border: '2px dashed rgba(249,115,22,0.5)', borderRadius: 24, pointerEvents: 'none' }}>
              {['tl', 'tr', 'bl', 'br'].map(corner => (
                <div key={corner} style={{
                  position: 'absolute',
                  width: 20, height: 20,
                  borderColor: '#F97316',
                  borderStyle: 'solid',
                  borderWidth: 0,
                  ...(corner === 'tl' ? { top: -1, left: -1, borderTopWidth: 3, borderLeftWidth: 3, borderRadius: '6px 0 0 0' } :
                    corner === 'tr' ? { top: -1, right: -1, borderTopWidth: 3, borderRightWidth: 3, borderRadius: '0 6px 0 0' } :
                    corner === 'bl' ? { bottom: -1, left: -1, borderBottomWidth: 3, borderLeftWidth: 3, borderRadius: '0 0 0 6px' } :
                    { bottom: -1, right: -1, borderBottomWidth: 3, borderRightWidth: 3, borderRadius: '0 0 6px 0' }),
                }} />
              ))}
            </div>
            {/* AR Status */}
            <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', borderRadius: 50, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: isARThinking ? '#FBBF24' : '#10B981', animation: 'pulse 1s infinite' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {isARThinking ? 'Chef Analyzing...' : 'AR Live'}
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
                  {/* Step Card */}
                  <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 28, padding: 24, boxShadow: '0 8px 32px rgba(249,115,22,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 16, background: 'linear-gradient(135deg, #F97316, #FBBF24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 18 }}>{currentStep + 1}</div>
                      <div>
                        <p style={{ fontSize: 11, color: W.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current Step</p>
                        <h2 style={{ fontSize: 20, fontWeight: 900, color: W.heading }}>{step?.title}</h2>
                      </div>
                    </div>
                    <p style={{ fontSize: 15, color: '#3D2B1F', lineHeight: 1.7, fontWeight: 600 }}>{step?.description}</p>
                    {step?.duration && (
                      <div style={{ marginTop: 16, background: '#FFEDD5', border: '1px solid #FED7AA', borderRadius: 12, padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: W.saffron }}>⏱️ {step.duration} minutes</span>
                      </div>
                    )}
                  </div>

                  {/* Chef Tip */}
                  <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: 20, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 24, flexShrink: 0 }}>💡</span>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 800, color: W.saffron, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{chef?.name}'s Tip</p>
                      <p style={{ fontSize: 13, color: '#92400E', fontWeight: 600, lineHeight: 1.5 }}>{currentTip}</p>
                    </div>
                  </div>
                </>
              )}

              {/* AR Live Feedback (when camera on) */}
              {isCameraActive && arFeedback && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  style={{ margin: 16, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 20, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <BrainCircuit style={{ width: 20, height: 20, color: '#F97316', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 800, color: W.saffron, marginBottom: 4, textTransform: 'uppercase' }}>Chef {chef?.name} says:</p>
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

      {/* Footer Controls */}
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
    </div>
  );
}

