'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowLeft, Lock, ChevronRight } from 'lucide-react';
import { useZaykaStore } from '@/store';
import toast from 'react-hot-toast';

const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useZaykaStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length < 10) { toast.error('Valid phone number daalo!'); return; }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    setStep('otp');
    toast.success('OTP bheja gaya! (Try: 123456)');
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) { toast.error('6-digit OTP daalo!'); return; }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    if (otp === '123456') {
      const newUser = {
        id: 'user_' + Date.now(),
        name: 'Zayka Dost',
        phone,
        isPremium: false,
        preferences: {
          isVegetarian: false,
          spiceLevel: 'medium' as const,
          skillLevel: 'beginner' as const,
          cuisineTypes: ['indian'] as any[],
          allergies: [] as string[],
          goals: [] as string[],
          budgetPerMeal: 100,
        },
        stats: {
          totalRecipesMade: 0,
          currentStreak: 0,
          longestStreak: 0,
          badges: [] as any[],
          points: 0,
          level: 1,
          weeklyGoal: 3,
          weeklyCompleted: 0,
          dailyChallengesCompleted: 0,
        },
      };
      setUser(newUser as any);
      toast.success('Welcome to Zayka AI! 🎉');
      router.push('/onboarding');
    } else {
      toast.error('Wrong OTP! Try 123456');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: W.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg, #F97316 0%, #FB923C 50%, #FBBF24 100%)', padding: '80px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🍽️</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 8 }}>Zayka AI</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.88)', fontWeight: 600 }}>Har Dish, Har Dil ❤️</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginTop: 8 }}>AI-powered desi cooking assistant</p>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.div key="phone" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: W.heading, marginBottom: 6 }}>Login / Sign Up</h2>
                <p style={{ fontSize: 14, color: W.muted, fontWeight: 600 }}>Apna phone number daalo, OTP bhejenge</p>
              </div>

              <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 20, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ background: '#FFEDD5', borderRadius: 10, padding: '6px 10px' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: W.saffron }}>🇮🇳 +91</span>
                </div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit number"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 16, fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: W.heading }} />
                <Phone style={{ width: 18, height: 18, color: '#C4A882' }} />
              </div>

              <button onClick={handleSendOTP} disabled={isLoading}
                style={{ background: isLoading ? '#FED7AA' : 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 20, padding: '16px', fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 900, cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}>
                {isLoading ? '📱 Sending...' : <><span>OTP Bhejo</span><ChevronRight style={{ width: 20, height: 20 }} /></>}
              </button>
            </motion.div>
          ) : (
            <motion.div key="otp" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => setStep('phone')} style={{ width: 36, height: 36, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ArrowLeft style={{ width: 16, height: 16, color: W.heading }} />
                </button>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: W.heading }}>OTP Verify Karo</h2>
                  <p style={{ fontSize: 13, color: W.muted, fontWeight: 600 }}>+91 {phone} par bheja gaya</p>
                </div>
              </div>

              <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 20, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Lock style={{ width: 18, height: 18, color: '#C4A882', flexShrink: 0 }} />
                <input type="number" value={otp} onChange={e => setOtp(e.target.value.slice(0, 6))}
                  placeholder="6-digit OTP"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 20, fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: W.heading, letterSpacing: '0.3em' }} />
              </div>

              <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: 14, padding: '10px 14px' }}>
                <p style={{ fontSize: 12, color: '#92400E', fontWeight: 700 }}>💡 Demo mode: OTP is <strong>123456</strong></p>
              </div>

              <button onClick={handleVerifyOTP} disabled={isLoading}
                style={{ background: isLoading ? '#FED7AA' : 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 20, padding: '16px', fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 900, cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}>
                {isLoading ? '⚡ Verifying...' : <><span>Verify & Enter 🚀</span></>}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ textAlign: 'center', marginTop: 'auto' }}>
          <button onClick={() => { setUser({ id: 'guest', name: 'Guest', phone: '', isPremium: false, preferences: { isVegetarian: false, spiceLevel: 'medium' as const, skillLevel: 'beginner' as const, cuisineTypes: [], allergies: [], goals: [], budgetPerMeal: 100 }, stats: { totalRecipesMade: 0, currentStreak: 0, longestStreak: 0, badges: [], points: 0, level: 1, weeklyGoal: 3, weeklyCompleted: 0, dailyChallengesCompleted: 0 } } as any); router.push('/'); }}
            style={{ fontSize: 14, fontWeight: 700, color: W.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
            Guest mode mein enter karo →
          </button>
        </div>
      </div>
    </div>
  );
}
