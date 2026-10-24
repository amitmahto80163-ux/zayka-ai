'use client';
import Image from 'next/image';

import { useState, useRef } from 'react';
import { ArrowLeft, Activity, Flame, Beef, Camera, Scan, Wheat, Droplet, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { analyzeDietAction } from '@/lib/actions';
import { useZaykaStore } from '@/store';
import { W } from '@/lib/theme';

export default function DietScannerPage() {
  const router = useRouter();
  const { language } = useZaykaStore();
  const [stage, setStage] = useState<'camera' | 'scanning' | 'result'>('camera');
  const [result, setResult] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dishHint, setDishHint] = useState('');
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
    setImageUrl(URL.createObjectURL(file));
    setStage('scanning');

    try {
      const base64Str = await compressImage(file);
      const res = await analyzeDietAction(base64Str, dishHint.trim() || 'Indian Meal', language);
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
          <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>AI se calories, protein & macros jano</p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          
          {stage === 'camera' && (
            <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 28, textAlign: 'center', width: '100%', maxWidth: 360 }}>
                <Activity style={{ width: 48, height: 48, color: '#10B981', margin: '0 auto 12px' }} />
                <h2 style={{ fontSize: 20, fontWeight: 900, color: W.heading, marginBottom: 8 }}>Track Your Macros</h2>
                <p style={{ fontSize: 14, color: W.muted, fontWeight: 600, marginBottom: 16 }}>Khane ki photo lo aur instantly jano calories, protein, carbs aur fat kitna hai.</p>
                <input
                  type="text"
                  value={dishHint}
                  onChange={e => setDishHint(e.target.value)}
                  placeholder="Dish ka naam (optional, e.g. Dal Chawal)"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: `1.5px solid ${W.border}`, background: W.bg, color: W.heading, fontSize: 14, fontWeight: 700, outline: 'none' }}
                />
              </div>

              <button onClick={() => fileRef.current?.click()} style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #34D399)', border: '8px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(16,185,129,0.3)', cursor: 'pointer' }}>
                <Camera style={{ width: 48, height: 48, color: 'white' }} />
              </button>
            </motion.div>
          )}

          {stage === 'scanning' && imageUrl && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, position: 'relative', borderRadius: 24, overflow: 'hidden', minHeight: 340 }}>
              <Image src={imageUrl} alt="Meal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} width={400} height={400} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <Scan style={{ width: 48, height: 48, color: '#10B981' }} />
                </motion.div>
                <p style={{ color: 'white', fontWeight: 800, marginTop: 16 }}>AI Macros Scan Kar Raha Hai...</p>
              </div>
            </motion.div>
          )}

          {stage === 'result' && result && imageUrl && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ position: 'relative', height: 260, borderRadius: 24, overflow: 'hidden' }}>
                <Image src={imageUrl} alt="Meal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} width={400} height={400} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }} />

                <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#6EE7B7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Detected Meal</span>
                    <h2 style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>{result.dishName || 'Home Meal'}</h2>
                  </div>
                  <div style={{ background: '#10B981', color: 'white', padding: '6px 12px', borderRadius: 12, fontWeight: 900, fontSize: 13 }}>
                    Health: {result.score}/10
                  </div>
                </div>
              </div>

              {/* 4 Macro Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <div style={{ background: W.card, border: `1.5px solid ${W.border}`, padding: '14px', borderRadius: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Flame style={{ color: '#F97316', width: 24, height: 24 }} />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: W.muted }}>Calories</p>
                    <p style={{ fontSize: 18, fontWeight: 900, color: W.heading }}>{result.calories} kcal</p>
                  </div>
                </div>

                <div style={{ background: W.card, border: `1.5px solid ${W.border}`, padding: '14px', borderRadius: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Beef style={{ color: '#3B82F6', width: 24, height: 24 }} />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: W.muted }}>Protein</p>
                    <p style={{ fontSize: 18, fontWeight: 900, color: W.heading }}>{result.protein}g</p>
                  </div>
                </div>

                <div style={{ background: W.card, border: `1.5px solid ${W.border}`, padding: '14px', borderRadius: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Wheat style={{ color: '#D97706', width: 24, height: 24 }} />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: W.muted }}>Carbs</p>
                    <p style={{ fontSize: 18, fontWeight: 900, color: W.heading }}>{result.carbs}g</p>
                  </div>
                </div>

                <div style={{ background: W.card, border: `1.5px solid ${W.border}`, padding: '14px', borderRadius: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Droplet style={{ color: '#EF4444', width: 24, height: 24 }} />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: W.muted }}>Fats & Fiber</p>
                    <p style={{ fontSize: 18, fontWeight: 900, color: W.heading }}>{result.fat}g / {result.fiber || 5}g</p>
                  </div>
                </div>
              </div>

              <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity style={{ color: '#10B981', width: 20, height: 20 }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: W.heading }}>AI Nutritionist Feedback</h3>
                    <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>Personalized macro analysis</p>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#3D2B1F', lineHeight: 1.6, fontWeight: 600, marginBottom: 12 }}>{result.feedback}</p>
                {result.tips?.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 10, borderTop: `1px solid ${W.border}` }}>
                    {result.tips.map((tip: string, idx: number) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981', marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: '#065F46', fontWeight: 700 }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
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
