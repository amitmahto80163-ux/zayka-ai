'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, IndianRupee } from 'lucide-react';
import { useZaykaStore } from '@/store';
import { generateBudgetMealAction } from '@/lib/actions';
import toast from 'react-hot-toast';

const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

const BUDGET_PRESETS = [50, 100, 150, 200, 300, 500];

export default function BudgetPage() {
  const router = useRouter();
  const { language } = useZaykaStore();
  const [budget, setBudget] = useState(100);
  const [stage, setStage] = useState<'input' | 'loading' | 'result'>('input');
  const [mealData, setMealData] = useState<any>(null);

  const handleGenerate = async () => {
    setStage('loading');
    try {
      const res = await generateBudgetMealAction(budget, language);
      if (res.success && res.data) {
        setMealData(res.data);
        setStage('result');
      } else {
        toast.error('Recipe nahi mili! Dobara try karo.');
        setStage('input');
      }
    } catch {
      toast.error('Connection error!');
      setStage('input');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: W.bg, paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,248,243,0.92)', backdropFilter: 'blur(20px)', padding: '48px 16px 16px', borderBottom: `1px solid ${W.border}`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 18, height: 18, color: W.heading }} />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: W.heading }}>Student Budget Meal 💰</h1>
          <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>Jo budget ho, waisi recipe banao</p>
        </div>
      </div>

      <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AnimatePresence mode="wait">

          {/* INPUT STAGE */}
          {stage === 'input' && (
            <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Budget Hero Card */}
              <div style={{ background: 'linear-gradient(135deg, #F97316, #FBBF24)', borderRadius: 28, padding: '28px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 700, marginBottom: 8 }}>Aapka Budget</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>₹</span>
                  <span style={{ fontSize: 56, fontWeight: 900, color: 'white', lineHeight: 1 }}>{budget}</span>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>per meal</p>
              </div>

              {/* Slider */}
              <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: '20px 20px' }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: W.muted, marginBottom: 14 }}>Slider se choose karo:</p>
                <input type="range" min={50} max={500} step={10} value={budget} onChange={e => setBudget(Number(e.target.value))}
                  style={{ width: '100%', accentColor: W.saffron, height: 6, cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: W.muted }}>₹50</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: W.muted }}>₹500</span>
                </div>
              </div>

              {/* Preset Amounts */}
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: W.heading, marginBottom: 12 }}>Quick Pick:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {BUDGET_PRESETS.map(amt => (
                    <button key={amt} onClick={() => setBudget(amt)}
                      style={{ background: budget === amt ? 'linear-gradient(135deg, #F97316, #FB923C)' : W.card, border: `1.5px solid ${budget === amt ? W.saffron : W.border}`, borderRadius: 16, padding: '14px 8px', fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 900, color: budget === amt ? 'white' : W.heading, cursor: 'pointer', transition: 'all 0.2s', boxShadow: budget === amt ? '0 4px 16px rgba(249,115,22,0.3)' : 'none' }}>
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleGenerate}
                style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 20, padding: '16px', fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}>
                <Sparkles style={{ width: 20, height: 20 }} />
                ₹{budget} mein AI Recipe Banao
              </button>
            </motion.div>
          )}

          {/* LOADING STAGE */}
          {stage === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '60px 20px' }}>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ fontSize: 56 }}>🧑‍🍳</motion.div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 900, color: W.heading }}>AI soch raha hai...</p>
                <p style={{ fontSize: 13, color: W.muted, fontWeight: 600, marginTop: 6 }}>₹{budget} mein best possible meal dhundh raha hai!</p>
              </div>
              <div style={{ width: '70%', height: 6, background: '#F0E6DC', borderRadius: 50, overflow: 'hidden' }}>
                <motion.div animate={{ x: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 1.2 }}
                  style={{ width: '50%', height: '100%', background: 'linear-gradient(90deg, #F97316, #FBBF24)', borderRadius: 50 }} />
              </div>
            </motion.div>
          )}

          {/* RESULT STAGE */}
          {stage === 'result' && mealData && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Meal Header */}
              <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: 24, padding: '20px', color: 'white' }}>
                <p style={{ fontSize: 11, fontWeight: 800, opacity: 0.8, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI ne suggest kiya</p>
                <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>{mealData.dishName || 'Budget Meal'}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                  <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 50, padding: '4px 14px' }}>
                    <span style={{ fontSize: 13, fontWeight: 800 }}>Total: ₹{mealData.totalCost || budget}</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 50, padding: '4px 14px' }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Budget: ₹{budget}</span>
                  </div>
                </div>
              </div>

              {/* Kirana List */}
              {mealData.ingredients?.length > 0 && (
                <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${W.border}` }}>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: W.heading }}>🛒 Kirana List</h3>
                  </div>
                  {mealData.ingredients.map((item: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < mealData.ingredients.length - 1 ? `1px solid ${W.border}` : 'none' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: W.heading }}>{item.name}</span>
                      <span style={{ fontSize: 14, fontWeight: 900, color: '#10B981' }}>₹{item.estimatedCost || '~'}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Recipe */}
              {mealData.quickRecipe && (
                <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: W.heading, marginBottom: 16 }}>🧑‍🍳 Step-by-Step Recipe</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {mealData.quickRecipe.split(/(?:Step \d+:|\n)/i).filter((s: string) => s.trim().length > 3).map((step: string, index: number) => (
                      <div key={index} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#FFF8F3', padding: 14, borderRadius: 16, border: '1px solid #FFE4CD' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #FBBF24)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>
                          {index + 1}
                        </div>
                        <p style={{ fontSize: 14, color: '#3D2B1F', lineHeight: 1.6, fontWeight: 600, paddingTop: 1 }}>
                          {step.trim().replace(/^[-*•]\s*/, '')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setStage('input')}
                style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 18, padding: '14px', fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 800, color: W.heading, cursor: 'pointer' }}>
                ← Naya Budget Try Karo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
