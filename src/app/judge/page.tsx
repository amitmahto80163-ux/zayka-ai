'use client';

import { useState, useRef } from 'react';
import { Camera, ArrowLeft, Star, Share2, Award, Flame, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { judgeDishAction } from '@/lib/actions';
import { useZaykaStore } from '@/store';
import toast from 'react-hot-toast';

const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

export default function JudgePage() {
  const router = useRouter();
  const { language } = useZaykaStore();
  const [stage, setStage] = useState<'camera' | 'judging' | 'result'>('camera');
  const [result, setResult] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);
    setStage('judging');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Str = reader.result?.toString().split(',')[1];
      if (base64Str) {
        try {
          const response = await judgeDishAction(base64Str, 'My Dish', language);
          if (response.success && response.data) {
            setResult(response.data);
          } else {
            toast.error("Scan failed!");
            setStage('camera');
          }
        } catch (error) {
          toast.error("Error analyzing image!");
          setStage('camera');
        }
        if (stage !== 'camera') setStage('result');
      }
    };
  };

  const reset = () => {
    setStage('camera');
    setResult(null);
    setImageUrl(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: W.bg, display: 'flex', flexDirection: 'column' }}>
      <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ background: 'rgba(255,248,243,0.92)', backdropFilter: 'blur(20px)', padding: '48px 16px 16px', borderBottom: `1px solid ${W.border}`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 18, height: 18, color: W.heading }} />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: W.heading }}>Rate My Plate 📸</h1>
          <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>Get MasterChef feedback instantly</p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
        <AnimatePresence mode="wait">

          {/* CAMERA STAGE */}
          {stage === 'camera' && (
            <motion.div key="camera" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
              
              <div style={{ background: 'linear-gradient(135deg, #FFF0E6, #FFEDD5)', border: `1.5px solid ${W.saffron}30`, borderRadius: 24, padding: '24px', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(249,115,22,0.15)' }}>
                  <Award style={{ width: 32, height: 32, color: W.saffron }} />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: W.heading, marginBottom: 8 }}>AI MasterChef Judge</h2>
                <p style={{ fontSize: 14, color: '#9A3412', fontWeight: 600, lineHeight: 1.5 }}>
                  Apni dish ki ek clear photo lo aur AI judge se rating and tips paao!
                </p>
              </div>

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button onClick={handleCaptureClick} style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #FB923C)', border: '8px solid rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(249,115,22,0.4)', cursor: 'pointer', transition: 'transform 0.2s' }}>
                  <Camera style={{ width: 48, height: 48, color: 'white' }} />
                </button>
              </div>

            </motion.div>
          )}

          {/* JUDGING STAGE */}
          {stage === 'judging' && (
            <motion.div key="judging" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <div style={{ position: 'relative', width: 140, height: 140 }}>
                {imageUrl && <img src={imageUrl} alt="Scanning" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: `4px solid ${W.card}` }} />}
                <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `4px solid ${W.saffron}`, borderTopColor: 'transparent' }} className="animate-spin" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: W.heading, marginBottom: 8 }}>Judging...</h2>
                <p style={{ fontSize: 14, color: W.muted, fontWeight: 600 }} className="animate-pulse">Checking plating, texture, and doneness</p>
              </div>
            </motion.div>
          )}

          {/* RESULT STAGE */}
          {stage === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {/* Dish Image */}
              <div style={{ position: 'relative', height: 260, borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                <img src={imageUrl || ""} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Dish Result" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,16,9,0.9) 0%, transparent 70%)' }} />
                
                {/* Score Card */}
                <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 20, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Final Score</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 48, fontWeight: 900, color: 'white', lineHeight: 1 }}>{result.score}</span>
                      <span style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>/10</span>
                    </div>
                  </div>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #FBBF24, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star style={{ width: 28, height: 28, color: 'white' }} fill="white" />
                  </div>
                </div>
              </div>

              {/* Feedback Card */}
              <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Award style={{ width: 20, height: 20, color: W.saffron }} />
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: W.heading }}>Chef's Feedback</h3>
                </div>
                <p style={{ fontSize: 14, color: '#3D2B1F', lineHeight: 1.6, fontWeight: 500, fontStyle: 'italic' }}>
                  "{result.feedback}"
                </p>
              </div>

              {/* Tips */}
              {result.tips && result.tips.length > 0 && (
                <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 24, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Flame style={{ width: 20, height: 20, color: '#3B82F6' }} />
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: '#1E3A5F' }}>Pro Tips</h3>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {result.tips.map((tip: string, i: number) => (
                      <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <CheckCircle2 style={{ width: 16, height: 16, color: '#3B82F6', marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: '#1D4ED8', fontWeight: 600 }}>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Share Caption */}
              <div style={{ background: W.card, border: `1.5px dashed ${W.border}`, borderRadius: 24, padding: 20, marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Share2 style={{ width: 16, height: 16, color: W.muted }} />
                  <h4 style={{ fontSize: 12, fontWeight: 800, color: W.muted, textTransform: 'uppercase' }}>Insta Ready Caption</h4>
                </div>
                <p style={{ fontSize: 13, color: W.heading, fontWeight: 600 }}>{result.shareCaption}</p>
              </div>

              <button onClick={reset} style={{ width: '100%', background: 'white', border: `1.5px solid ${W.border}`, padding: 18, borderRadius: 20, color: W.heading, fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                <RefreshCw style={{ width: 18, height: 18 }} /> Scan Another Dish
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
