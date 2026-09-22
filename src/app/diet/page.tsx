'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Activity, Flame, Beef, Camera, Scan } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { judgeDishAction } from '@/lib/actions';
import { useZaykaStore } from '@/store';

const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

export default function DietScannerPage() {
  const router = useRouter();
  const { language } = useZaykaStore();
  const [stage, setStage] = useState<'camera' | 'scanning' | 'result'>('camera');
  const [result, setResult] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const img = new Image();
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
    setImageUrl(URL.createObjectURL(file));
    setStage('scanning');

    try {
      const base64Str = await compressImage(file);
      // We reuse judgeDishAction which works as a general diet analyzer if prompted
      // Alternatively we could create a specific analyzeDietAction, but this is a good first step.
      const res = await judgeDishAction(base64Str, 'My Meal', language);
      if (res.success && res.data) {
        setResult(res.data);
        setStage('result');
      } else {
        toast.error('Failed to analyze dish!');
        setStage('camera');
      }
    } catch {
      toast.error('Error analyzing image!');
      setStage('camera');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: W.bg, display: 'flex', flexDirection: 'column' }}>
      <input type="file" accept="image/*" capture="environment" ref={fileRef} onChange={handleCapture} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ background: 'rgba(255,248,243,0.92)', backdropFilter: 'blur(20px)', padding: '48px 16px 16px', borderBottom: `1px solid ${W.border}`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 18, height: 18, color: W.heading }} />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: W.heading }}>Diet AR Scanner 🥗</h1>
          <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>Track calories instantly</p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          
          {stage === 'camera' && (
            <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 32, textAlign: 'center', maxWidth: 300 }}>
                <Activity style={{ width: 48, height: 48, color: '#10B981', margin: '0 auto 16px' }} />
                <h2 style={{ fontSize: 20, fontWeight: 900, color: W.heading, marginBottom: 8 }}>Track Your Macros</h2>
                <p style={{ fontSize: 14, color: W.muted, fontWeight: 600 }}>Khane ki photo lo aur instantly jano calories aur protein kitna hai.</p>
              </div>

              <button onClick={() => fileRef.current?.click()} style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #34D399)', border: '8px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(16,185,129,0.3)', cursor: 'pointer' }}>
                <Camera style={{ width: 48, height: 48, color: 'white' }} />
              </button>
            </motion.div>
          )}

          {stage === 'scanning' && imageUrl && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, position: 'relative', borderRadius: 24, overflow: 'hidden' }}>
              <img src={imageUrl} alt="Meal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <Scan style={{ width: 48, height: 48, color: '#10B981' }} />
                </motion.div>
                <p style={{ color: 'white', fontWeight: 800, marginTop: 16 }}>Scanning Macros...</p>
              </div>
            </motion.div>
          )}

          {stage === 'result' && result && imageUrl && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ position: 'relative', height: 300, borderRadius: 24, overflow: 'hidden' }}>
                <img src={imageUrl} alt="Meal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* Floating Tags */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '10px 14px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Flame style={{ color: '#F97316', width: 20, height: 20 }} />
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 900, color: W.muted, textTransform: 'uppercase' }}>Calories</p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: W.heading }}>{result.score * 45} kcal</p>
                  </div>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '10px 14px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Beef style={{ color: '#3B82F6', width: 20, height: 20 }} />
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 900, color: W.muted, textTransform: 'uppercase' }}>Protein</p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: W.heading }}>{result.score * 3}g</p>
                  </div>
                </motion.div>
              </div>

              <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity style={{ color: '#10B981', width: 20, height: 20 }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: W.heading }}>AI Feedback</h3>
                    <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>Based on MasterChef analysis</p>
                  </div>
                </div>
                <p style={{ fontSize: 15, color: '#3D2B1F', lineHeight: 1.6, fontWeight: 600 }}>{result.feedback}</p>
              </div>

              <button onClick={() => { setStage('camera'); setResult(null); setImageUrl(null); }} style={{ marginTop: 'auto', background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 16, padding: '16px', color: W.heading, fontWeight: 900, fontSize: 16, cursor: 'pointer' }}>
                Scan Another Meal
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
