'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone, ChevronRight, Lock } from 'lucide-react';
import { useZaykaStore } from '@/store';
import toast from 'react-hot-toast';
import { auth, db } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

declare global {
  interface Window {
    recaptchaVerifier: any;
    grecaptcha: any;
  }
}

const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useZaykaStore();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {}
      });
    }
  }, []);

  const handleSendOTP = async () => {
    if (phone.length < 10) { toast.error('Please enter a valid 10-digit number!'); return; }
    setIsLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const formatPhone = '+91' + phone;
      const confirmation = await signInWithPhoneNumber(auth, formatPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
      toast.success('OTP sent successfully!');
    } catch (error: any) {
      console.error('Firebase OTP Error:', error);
      toast.error(`Error: ${error.message || 'Failed to send OTP'}`);
      if (window.recaptchaVerifier) window.recaptchaVerifier.render().then((id: any) => window.grecaptcha.reset(id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) { toast.error('Enter 6-digit OTP!'); return; }
    setIsLoading(true);
    try {
      if (!confirmationResult) throw new Error("No confirmation result");
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      let userData;
      if (docSnap.exists()) {
        userData = docSnap.data();
      } else {
        userData = {
          id: user.uid,
          name: 'Zayka Chef',
          phone: user.phoneNumber,
          isPremium: false,
          preferences: { isVegetarian: false, spiceLevel: 'medium', skillLevel: 'beginner', cuisineTypes: [], allergies: [], goals: [], budgetPerMeal: 100 },
          stats: { totalRecipesMade: 0, currentStreak: 0, longestStreak: 0, badges: [], points: 0, level: 1, weeklyGoal: 3, weeklyCompleted: 0, dailyChallengesCompleted: 0 }
        };
        await setDoc(userRef, userData);
      }

      setUser(userData as any);
      toast.success('Welcome to Zayka AI! 🥘');
      router.push('/onboarding');
    } catch (error) {
      console.error(error);
      toast.error('Invalid OTP! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: W.bg, display: 'flex', flexDirection: 'column' }}>
      <div id="recaptcha-container"></div>
      <div style={{ background: 'linear-gradient(160deg, #F97316 0%, #FB923C 50%, #FBBF24 100%)', padding: '80px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 8 }}>Zayka AI</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.88)', fontWeight: 600 }}>Har Dish, Har Dil 🥘</p>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.div key="phone" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: W.heading, marginBottom: 6 }}>Login / Sign Up</h2>
                <p style={{ fontSize: 14, color: W.muted, fontWeight: 600 }}>Enter your phone number</p>
              </div>
              <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 20, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: W.saffron }}>🇮🇳 +91</span>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit number" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 16, fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: W.heading }} />
                <Phone style={{ width: 18, height: 18, color: '#C4A882' }} />
              </div>
              <button onClick={handleSendOTP} disabled={isLoading} style={{ background: isLoading ? '#FED7AA' : 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 20, padding: '16px', fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 900, cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}>
                {isLoading ? 'Sending...' : <><span>Send OTP</span><ChevronRight style={{ width: 20, height: 20 }} /></>}
              </button>
            </motion.div>
          ) : (
            <motion.div key="otp" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => setStep('phone')} style={{ width: 36, height: 36, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowLeft style={{ width: 16, height: 16, color: W.heading }} />
                </button>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: W.heading }}>Verify OTP</h2>
                  <p style={{ fontSize: 13, color: W.muted, fontWeight: 600 }}>Sent to +91 {phone}</p>
                </div>
              </div>
              <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 20, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Lock style={{ width: 18, height: 18, color: '#C4A882' }} />
                <input type="number" value={otp} onChange={e => setOtp(e.target.value.slice(0, 6))} placeholder="6-digit OTP" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 20, fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: W.heading, letterSpacing: '0.3em' }} />
              </div>
              <button onClick={handleVerifyOTP} disabled={isLoading} style={{ background: isLoading ? '#FED7AA' : 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 20, padding: '16px', fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 900, cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}>
                {isLoading ? 'Verifying...' : 'Verify & Enter 🥘'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
