'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2, User, Cake } from 'lucide-react';
import { useZaykaStore } from '@/store';
import toast from 'react-hot-toast';
import { W } from '@/lib/theme';



const SKILL_LEVELS = [
  { id: 'beginner', title: 'Beginner', desc: 'Bas Maggi aur Chai aati hai 😅', emoji: '🥚' },
  { id: 'intermediate', title: 'Intermediate', desc: 'Achha khasa bana leta hoon 🍳', emoji: '🧑‍🍳' },
  { id: 'expert', title: 'Expert', desc: 'Main khud ek Chef hoon! 🔥', emoji: '👑' },
];

const DIET_TYPES = [
  { id: 'veg', title: 'Pure Veg', emoji: '🥬', activeColor: '#10B981', activeBg: '#ECFDF5' },
  { id: 'non-veg', title: 'Non-Veg bhi', emoji: '🍗', activeColor: '#EF4444', activeBg: '#FEF2F2' },
  { id: 'both', title: 'Dono Chalega', emoji: '🥩🥗', activeColor: W.saffron, activeBg: '#FFEDD5' },
  { id: 'vegan', title: 'Vegan', emoji: '🌱', activeColor: '#059669', activeBg: '#D1FAE5' },
];

const GOALS = [
  { id: 'healthy', title: 'Healthy Khana', emoji: '🥗' },
  { id: 'quick', title: 'Quick & Fast', emoji: '⚡' },
  { id: 'impress', title: 'Impress Karna', emoji: '💖' },
  { id: 'learn', title: 'Nayi Dishes', emoji: '🧠' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser, setChef } = useZaykaStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', age: '', diet: '', skill: '', goal: '' });

  const handleNext = () => {
    if (step === 1 && (!form.name || !form.age)) { toast.error('Naam aur Age bata dijiye!'); return; }
    if (step === 2 && !form.diet) { toast.error('Diet type select kariye!'); return; }
    if (step === 3 && !form.skill) { toast.error('Cooking level bataiye!'); return; }
    if (step < 4) { setStep(s => s + 1); return; }
    finish();
  };

  const finish = async () => {
    if (!form.goal) { toast.error('Ek goal select karo!'); return; }
    const age = parseInt(form.age);
    let chef = 'arjun';
    if (age <= 22) chef = 'rohan';
    else if (age >= 40) chef = 'rajan';
    else if (form.diet === 'veg') chef = 'priya';
    setChef(chef as any);

    const newUser = {
      ...user,
      name: form.name,
      age: age,
      preferences: {
        ...(user?.preferences || {}),
        isVegetarian: form.diet === 'veg' || form.diet === 'vegan',
        skillLevel: form.skill as 'beginner' | 'intermediate' | 'expert',
        goals: [form.goal],
      }
    };
    setUser(newUser as any);

    const { setMemory } = useZaykaStore.getState();
    setMemory({
      isVegetarian: form.diet === 'veg' || form.diet === 'vegan',
      isVegan: form.diet === 'vegan',
      allergies: [],
      spiceLevel: 'medium',
      skillLevel: form.skill as 'beginner' | 'intermediate' | 'expert',
      cuisineTypes: ['indian'],
      goals: [form.goal],
      budgetPerMeal: 150,
      cookingHistory: [],
      preferredCookTime: 30,
      favoriteTags: [],
      lastActiveDate: new Date().toISOString(),
      weeklyGoal: 3,
      weeklyCompleted: 0,
    });

    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      if (user?.id) {
        await updateDoc(doc(db, 'users', user.id), { onboardingDone: true });
      }
    } catch (err) {
      console.error('Failed to update firestore:', err);
    }

    toast.success('Your kitchen is ready! 🎉');
    router.push('/');
  };

  const STEPS = ['Aapke Baare Mein', 'Khana Preferences', 'Cooking Level', 'Aapka Goal'];

  return (
    <div style={{ minHeight: '100vh', background: W.bg, display: 'flex', flexDirection: 'column', padding: '0 0 32px' }}>

      {/* Progress Header */}
      <div style={{ padding: '52px 20px 20px', background: W.bg }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ flex: 1, height: 5, borderRadius: 50, background: s <= step ? W.saffron : '#F0E6DC', transition: 'background 0.3s' }} />
          ))}
        </div>
        <p style={{ fontSize: 12, fontWeight: 700, color: W.muted, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Step {step} of 4
        </p>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: W.heading }}>{STEPS[step - 1]}</h2>
      </div>

      <div style={{ flex: 1, padding: '0 20px' }}>
        <AnimatePresence mode="wait">

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: W.heading, lineHeight: 1.2, marginBottom: 8 }}>Aapka Swagat Hai! 👋</h1>
                <p style={{ fontSize: 14, color: W.muted, fontWeight: 600 }}>Hum aapke liye perfect AI Chef assign karenge.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Aapka Naam', key: 'name', icon: <User style={{ width: 18, height: 18, color: W.saffron }} />, placeholder: 'e.g. Rahul', type: 'text' },
                  { label: 'Umar (Age)', key: 'age', icon: <Cake style={{ width: 18, height: 18, color: W.saffron }} />, placeholder: 'e.g. 22', type: 'number' },
                ].map(f => (
                  <div key={f.key} style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 18, padding: '14px 16px' }}>
                    <label style={{ fontSize: 10, fontWeight: 800, color: W.muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>{f.label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {f.icon}
                      <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 18, fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: W.heading }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: W.heading, lineHeight: 1.2, marginBottom: 8 }}>Kya khate ho? 🍽️</h1>
                <p style={{ fontSize: 14, color: W.muted, fontWeight: 600 }}>Isi ke hisaab se recipes dikhenge.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {DIET_TYPES.map(d => {
                  const active = form.diet === d.id;
                  return (
                    <div key={d.id} onClick={() => setForm({ ...form, diet: d.id })}
                      style={{ background: active ? d.activeBg : W.card, border: `2px solid ${active ? d.activeColor : W.border}`, borderRadius: 20, padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s', boxShadow: active ? `0 4px 16px ${d.activeColor}30` : 'none' }}>
                      <span style={{ fontSize: 28 }}>{d.emoji}</span>
                      <span style={{ fontSize: 17, fontWeight: 900, color: active ? d.activeColor : W.heading }}>{d.title}</span>
                      {active && <CheckCircle2 style={{ width: 22, height: 22, color: d.activeColor, marginLeft: 'auto' }} />}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: W.heading, lineHeight: 1.2, marginBottom: 8 }}>Cooking aati hai? 🍳</h1>
                <p style={{ fontSize: 14, color: W.muted, fontWeight: 600 }}>Sachchi baat bolo — Chef usi hisaab se guide karega!</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SKILL_LEVELS.map(s => {
                  const active = form.skill === s.id;
                  return (
                    <div key={s.id} onClick={() => setForm({ ...form, skill: s.id })}
                      style={{ background: active ? '#FFEDD5' : W.card, border: `2px solid ${active ? W.saffron : W.border}`, borderRadius: 20, padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s', boxShadow: active ? '0 4px 16px rgba(249,115,22,0.2)' : 'none' }}>
                      <span style={{ fontSize: 32 }}>{s.emoji}</span>
                      <div>
                        <p style={{ fontSize: 16, fontWeight: 900, color: active ? W.saffron : W.heading }}>{s.title}</p>
                        <p style={{ fontSize: 12, color: W.muted, fontWeight: 600, marginTop: 2 }}>{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: W.heading, lineHeight: 1.2, marginBottom: 8 }}>Aapka Goal? 🎯</h1>
                <p style={{ fontSize: 14, color: W.muted, fontWeight: 600 }}>Zayka AI se aap mainly kya chahte ho?</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {GOALS.map(g => {
                  const active = form.goal === g.id;
                  return (
                    <div key={g.id} onClick={() => setForm({ ...form, goal: g.id })}
                      style={{ background: active ? '#FFEDD5' : W.card, border: `2px solid ${active ? W.saffron : W.border}`, borderRadius: 22, padding: '20px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transition: 'all 0.2s', boxShadow: active ? '0 4px 16px rgba(249,115,22,0.2)' : 'none' }}>
                      <span style={{ fontSize: 36 }}>{g.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 900, color: active ? W.saffron : W.heading, textAlign: 'center', lineHeight: 1.2 }}>{g.title}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <div style={{ padding: '20px 20px 0' }}>
        <button onClick={handleNext}
          style={{ width: '100%', background: 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 20, padding: '16px', fontFamily: 'Nunito, sans-serif', fontSize: 17, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}>
          {step === 4 ? 'App Shuru Karein! 🚀' : <><span>Next</span><ChevronRight style={{ width: 20, height: 20 }} /></>}
        </button>
      </div>
    </div>
  );
}
