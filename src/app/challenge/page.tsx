'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, CheckCircle, Trophy, Flame, Calendar, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

const DAILY_TASKS = [
  { day: 1, dish: 'Dal Tadka', difficulty: 'Easy', emoji: '🫘', points: 10 },
  { day: 2, dish: 'Aloo Sabzi', difficulty: 'Easy', emoji: '🥔', points: 10 },
  { day: 3, dish: 'Paneer Bhurji', difficulty: 'Medium', emoji: '🧀', points: 20 },
  { day: 4, dish: 'Rajma', difficulty: 'Medium', emoji: '🫘', points: 20 },
  { day: 5, dish: 'Biryani', difficulty: 'Hard', emoji: '🍚', points: 40 },
  { day: 6, dish: 'Chole', difficulty: 'Medium', emoji: '🌾', points: 20 },
  { day: 7, dish: 'Special Dessert', difficulty: 'Special', emoji: '🍮', points: 50 },
];

export default function ChallengePage() {
  const router = useRouter();
  const [streak, setStreak] = useState(4);
  const [skipPasses, setSkipPasses] = useState(2);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const totalDays = 30;
  const todayDay = streak + 1;
  const today = DAILY_TASKS[(todayDay - 1) % 7];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    await new Promise(r => setTimeout(r, 1800));
    const fakeScore = Math.floor(Math.random() * 3) + 7; // 7–9
    setScore(fakeScore);
    setIsUploading(false);
    setTodayCompleted(true);
    setStreak(s => s + 1);
    toast.success(`🎉 ${fakeScore}/10 — Zabardast!`);
  };

  const handleSkip = () => {
    if (skipPasses <= 0) { toast.error('No skip passes left!'); return; }
    setSkipPasses(s => s - 1);
    setTodayCompleted(true);
    toast('Day skipped! 1 pass used.', { icon: '⏭️' });
  };

  const diffColor = (d: string) => {
    if (d === 'Easy') return { bg: '#ECFDF5', text: '#059669' };
    if (d === 'Hard') return { bg: '#FEF2F2', text: '#DC2626' };
    if (d === 'Special') return { bg: '#F5F3FF', text: '#7C3AED' };
    return { bg: '#FFFBEB', text: '#D97706' };
  };

  return (
    <div style={{ minHeight: '100vh', background: W.bg, paddingBottom: 40 }}>
      <input type="file" accept="image/*" capture="environment" ref={fileRef} onChange={handlePhotoUpload} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ background: 'rgba(255,248,243,0.92)', backdropFilter: 'blur(20px)', padding: '48px 16px 16px', borderBottom: `1px solid ${W.border}`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 18, height: 18, color: W.heading }} />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: W.heading }}>30-Day Challenge 🏆</h1>
          <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>Ek chef ban jao — 30 din mein!</p>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Streak Hero */}
        <div style={{ background: 'linear-gradient(135deg, #F97316, #FBBF24)', borderRadius: 28, padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
          <div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 700, marginBottom: 4 }}>Current Streak</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: 'white', lineHeight: 1 }}>{streak}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>days 🔥</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Trophy style={{ width: 48, height: 48, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }} />
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{totalDays - streak} days left</p>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Star style={{ width: 24, height: 24, color: '#FBBF24' }} />
            <span style={{ fontSize: 22, fontWeight: 900, color: W.heading }}>{streak * 15}</span>
            <span style={{ fontSize: 11, color: W.muted, fontWeight: 700 }}>Total Points ⭐</span>
          </div>
          <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Flame style={{ width: 24, height: 24, color: W.saffron }} />
            <span style={{ fontSize: 22, fontWeight: 900, color: W.heading }}>{skipPasses}</span>
            <span style={{ fontSize: 11, color: W.muted, fontWeight: 700 }}>Skip Passes Left</span>
          </div>
        </div>

        {/* Today's Task */}
        <AnimatePresence mode="wait">
          {!todayCompleted ? (
            <motion.div key="task" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: W.card, border: `2px solid ${W.saffron}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 8px 32px rgba(249,115,22,0.12)' }}>
              <div style={{ background: 'linear-gradient(135deg, #FFEDD5, #FFF7ED)', padding: '16px 20px', borderBottom: `1px solid #FED7AA` }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: W.saffron, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Day {todayDay} — Aaj ka Challenge</p>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 20, background: '#FFEDD5', border: `1.5px solid #FED7AA`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                    {today.emoji}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 900, color: W.heading }}>{today.dish}</h3>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 50, background: diffColor(today.difficulty).bg, color: diffColor(today.difficulty).text }}>
                        {today.difficulty}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 50, background: '#FFFBEB', color: '#D97706' }}>
                        +{today.points} pts
                      </span>
                    </div>
                  </div>
                </div>

                {isUploading ? (
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      style={{ width: 40, height: 40, border: '3px solid #F0E6DC', borderTopColor: W.saffron, borderRadius: '50%', margin: '0 auto 10px' }} />
                    <p style={{ fontSize: 13, fontWeight: 700, color: W.muted }}>AI judge kar raha hai... 🤖</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => fileRef.current?.click()}
                      style={{ flex: 1, background: 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 16, padding: '14px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 20px rgba(249,115,22,0.3)' }}>
                      <Camera style={{ width: 18, height: 18 }} /> Photo Submit
                    </button>
                    <button onClick={handleSkip} disabled={skipPasses <= 0}
                      style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 16, padding: '14px 16px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13, color: skipPasses > 0 ? W.muted : '#C4A882', cursor: skipPasses > 0 ? 'pointer' : 'not-allowed', opacity: skipPasses > 0 ? 1 : 0.5 }}>
                      Skip
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ background: '#ECFDF5', border: '2px solid #6EE7B7', borderRadius: 28, padding: '24px 20px', textAlign: 'center' }}>
              <CheckCircle style={{ width: 48, height: 48, color: '#10B981', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 22, fontWeight: 900, color: '#065F46', marginBottom: 6 }}>
                {score ? `🎉 ${score}/10 — Shandaar!` : 'Day Complete! ✅'}
              </h3>
              <p style={{ fontSize: 13, color: '#059669', fontWeight: 700 }}>Kal ka challenge kal aayega. Great job, Chef! 👨‍🍳</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calendar */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: W.heading, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar style={{ width: 18, height: 18, color: W.saffron }} /> 30-Day Progress
          </h3>
          <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {Array.from({ length: 30 }, (_, i) => {
                const status = i < streak ? 'done' : i === streak ? 'today' : 'upcoming';
                return (
                  <div key={i} style={{
                    aspectRatio: '1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900,
                    background: status === 'done' ? '#10B981' : status === 'today' ? 'linear-gradient(135deg, #F97316, #FBBF24)' : '#F0E6DC',
                    color: status === 'upcoming' ? W.muted : 'white',
                    border: status === 'today' ? '2px solid #F97316' : '1.5px solid transparent',
                    boxShadow: status === 'today' ? '0 2px 8px rgba(249,115,22,0.4)' : 'none',
                  }}>
                    {status === 'done' ? '✓' : i + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
