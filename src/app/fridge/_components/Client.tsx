import Image from 'next/image';
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, RefreshCw, ChevronRight } from 'lucide-react';
import { scanFridgeAction } from '@/lib/actions';
import { useZaykaStore } from '@/store';
import toast from 'react-hot-toast';
import { W } from '@/lib/theme';



export default function FridgePage() {
  const router = useRouter();
  const { language } = useZaykaStore();
  const [stage, setStage] = useState<'camera' | 'scanning' | 'result'>('camera');
  const { fridgeIngredients: ingredients, setFridgeIngredients: setIngredients } = useZaykaStore();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const img = new window.Image();
      img.onload = () => {
        const MAX = 800;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7).split(',')[1]);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setStage('scanning');

    try {
      const base64 = await compressImage(file);
      const res = await scanFridgeAction(base64, language);
      if (res.success && res.data) {
        setIngredients(res.data as string[]);
        setStage('result');
      } else {
        toast.error('Scan fail! Dobara try karo.');
        setStage('camera');
      }
    } catch {
      toast.error('Error! Please try again.');
      setStage('camera');
    }
  };

  const reset = () => { setStage('camera'); setIngredients([]); setImagePreview(null); };

  const goToSearch = () => {
    router.push(`/search?q=${encodeURIComponent(ingredients.join(', '))}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: W.bg, paddingBottom: 40 }}>
      <input type="file" accept="image/*" capture="environment" ref={fileRef} onChange={handleCapture} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ background: 'rgba(255,248,243,0.92)', backdropFilter: 'blur(20px)', padding: '48px 16px 16px', borderBottom: `1px solid ${W.border}`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 18, height: 18, color: W.heading }} />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: W.heading }}>Fridge Scan 🧊</h1>
          <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>Jo fridge mein hai usi se recipe banao</p>
        </div>
      </div>

      <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AnimatePresence mode="wait">

          {/* CAMERA STAGE */}
          {stage === 'camera' && (
            <motion.div key="camera" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Info Card */}
              <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', border: '1.5px solid #BFDBFE', borderRadius: 24, padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🧊</div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: '#1E3A5F' }}>AI Fridge Scanner</h3>
                    <p style={{ fontSize: 12, color: '#3B82F6', fontWeight: 700 }}>Powered by Gemini Vision</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#1D4ED8', fontWeight: 600, lineHeight: 1.5 }}>
                  Apne fridge ya ingredients ka photo lo → AI automatically detect karega → Best recipe suggest karega!
                </p>
              </div>

              {/* Instructions */}
              <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: W.heading, marginBottom: 14 }}>📸 Kaise use karein:</h3>
                {['Fridge kholo aur samagri dikhayen', 'Clear aur well-lit photo lo', 'AI automatically ingredients detect karega', 'Recipe generate hogi!'].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < 3 ? 12 : 0 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #FBBF24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 11, flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ fontSize: 13, color: '#3D2B1F', fontWeight: 600, lineHeight: 1.5, paddingTop: 4 }}>{tip}</p>
                  </div>
                ))}
              </div>

              {/* Capture Button */}
              <button onClick={() => fileRef.current?.click()}
                style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', color: 'white', border: 'none', borderRadius: 22, padding: '20px', fontFamily: 'Nunito, sans-serif', fontSize: 18, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 8px 28px rgba(59,130,246,0.4)' }}>
                <Camera style={{ width: 24, height: 24 }} />
                Fridge / Ingredients Scan Karo
              </button>
            </motion.div>
          )}

          {/* SCANNING STAGE */}
          {stage === 'scanning' && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              {imagePreview && (
                <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 24, overflow: 'hidden', position: 'relative', border: `2px solid ${W.border}` }}>
                  <Image src={imagePreview} alt="Fridge" style={{ width: '100%', height: '100%', objectFit: 'cover' }} width={400} height={400} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(59,130,246,0.3)', backdropFilter: 'blur(2px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                      style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🤖</motion.div>
                    <div style={{ background: 'rgba(0,0,0,0.7)', borderRadius: 50, padding: '8px 20px' }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>AI ingredients scan kar raha hai...</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* RESULT STAGE */}
          {stage === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {imagePreview && (
                <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 24, overflow: 'hidden', border: `1.5px solid ${W.border}` }}>
                  <Image src={imagePreview} alt="Fridge" style={{ width: '100%', height: '100%', objectFit: 'cover' }} width={400} height={400} />
                </div>
              )}

              {/* Detected Ingredients */}
              <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: W.heading, marginBottom: 16 }}>✅ Mila kya fridge mein:</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {ingredients.map((ing, i) => (
                    <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      style={{ padding: '8px 16px', borderRadius: 50, background: '#ECFDF5', border: '1.5px solid #6EE7B7', fontSize: 13, fontWeight: 700, color: '#065F46' }}>
                      {ing}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <button onClick={goToSearch}
                style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 20, padding: '16px', fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}>
                Inhi se Recipe Generate Karo <ChevronRight style={{ width: 20, height: 20 }} />
              </button>

              <button onClick={reset}
                style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 18, padding: '14px', fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 800, color: W.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <RefreshCw style={{ width: 16, height: 16 }} /> Dobara Scan Karo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
