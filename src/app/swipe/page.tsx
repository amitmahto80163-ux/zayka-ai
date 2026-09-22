'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, RefreshCw, X, Heart, Loader2 } from 'lucide-react';
import { useZaykaStore } from '@/store';
import { generateFusionRecipeAction } from '@/lib/actions';
import toast from 'react-hot-toast';

const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

const FOOD_CARDS = [
  { id: 'f1', name: 'Butter Chicken', cuisine: 'Indian 🇮🇳', emoji: '🥘', color: '#E85D04', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80' },
  { id: 'f2', name: 'Margherita Pizza', cuisine: 'Italian 🇮🇹', emoji: '🍕', color: '#D90429', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80' },
  { id: 'f3', name: 'Ramen', cuisine: 'Japanese 🇯🇵', emoji: '🍜', color: '#FFB703', img: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=400&q=80' },
  { id: 'f4', name: 'Tacos', cuisine: 'Mexican 🇲🇽', emoji: '🌮', color: '#8CB369', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80' },
  { id: 'f5', name: 'Pad Thai', cuisine: 'Thai 🇹🇭', emoji: '🥡', color: '#A51931', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=400&q=80' },
  { id: 'f6', name: 'Biryani', cuisine: 'Indian 🇮🇳', emoji: '🍛', color: '#FF6B35', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
  { id: 'f7', name: 'Sushi', cuisine: 'Japanese 🇯🇵', emoji: '🍣', color: '#BC002D', img: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=400&q=80' },
  { id: 'f8', name: 'Pasta Arrabbiata', cuisine: 'Italian 🇮🇹', emoji: '🍝', color: '#009246', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=400&q=80' },
];

export default function SwipePage() {
  const router = useRouter();
  const { language, setCurrentRecipe } = useZaykaStore();
  const [cards, setCards] = useState(FOOD_CARDS);
  const [liked, setLiked] = useState<string[]>([]);
  const [stage, setStage] = useState<'swipe' | 'loading' | 'result'>('swipe');
  const [fusion, setFusion] = useState<any>(null);

  // Framer motion drag states
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

  const handleDragEnd = (e: any, info: any) => {
    if (info.offset.x > 100) handleLike();
    else if (info.offset.x < -100) handleSkip();
  };

  const handleSkip = () => {
    if (cards.length === 0) return;
    setCards(prev => prev.slice(1));
  };

  const handleLike = () => {
    if (cards.length === 0) return;
    const top = cards[0];
    setLiked(prev => [...prev, top.name]);
    toast(top.name + ' ❤️', { icon: '🔥', style: { background: '#FFEDD5', color: W.heading, fontWeight: 700 } });
    setCards(prev => prev.slice(1));
  };

  const generateFusion = async (likedFoods: string[]) => {
    setStage('loading');
    try {
      const res = await generateFusionRecipeAction(likedFoods, language);
      if (res.success && res.data) {
        setFusion(res.data);
        setStage('result');
      } else {
        toast.error('Fusion recipe nahi bani!');
        setStage('swipe');
      }
    } catch {
      toast.error('Error! Try again.');
      setStage('swipe');
    }
  };

  const handleDeckEmpty = () => {
    if (liked.length > 0) generateFusion(liked);
    else { toast('Kuch toh like karo!', { icon: '😅' }); resetDeck(); }
  };

  const resetDeck = () => { setCards(FOOD_CARDS); setLiked([]); setFusion(null); setStage('swipe'); };

  const handleStartCooking = () => {
    if (!fusion) return;
    const recipe = {
      id: `fusion-${Date.now()}`, name: fusion.name,
      description: fusion.tagline, cuisine: 'indian',
      prepTime: 10, cookTime: 20, servings: 2,
      isVeg: true, calories: 450, rating: 5,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
      ingredients: fusion.ingredients?.map((i: string, idx: number) => ({ id: `fi-${idx}`, name: i, amount: 1, unit: 'as needed', category: 'other' })) || [],
      steps: fusion.instructions?.split('\n').filter((s: string) => s.trim().length > 3).map((s: string, idx: number) => ({ stepNumber: idx + 1, title: `Step ${idx + 1}`, description: s.replace(/^Step \d+:\s*/, ''), duration: 5 })) || [],
      category: 'dinner', difficulty: 'medium',
      nutrition: { calories: 450, protein: 15, carbs: 40, fat: 12 },
      tags: ['fusion'],
      createdAt: new Date().toISOString()
    };
    setCurrentRecipe(recipe as any);
    router.push('/cook');
  };

  const top = cards[0];

  return (
    <div style={{ minHeight: '100vh', background: W.bg, paddingBottom: 40, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,248,243,0.92)', backdropFilter: 'blur(20px)', padding: '48px 16px 16px', borderBottom: `1px solid ${W.border}`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 18, height: 18, color: W.heading }} />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: W.heading }}>Food Tinder 🔥</h1>
          <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>Like karo → AI Fusion recipe banayega!</p>
        </div>
        <button onClick={resetDeck} style={{ marginLeft: 'auto', width: 38, height: 38, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <RefreshCw style={{ width: 16, height: 16, color: W.muted }} />
        </button>
      </div>

      <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
        <AnimatePresence mode="wait">

          {/* SWIPE STAGE */}
          {stage === 'swipe' && (
            <motion.div key="swipe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

              {/* Liked Badges */}
              {liked.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                  {liked.map(f => (
                    <span key={f} style={{ background: '#FFEDD5', border: '1.5px solid #FED7AA', borderRadius: 50, padding: '4px 12px', fontSize: 11, fontWeight: 800, color: W.saffron }}>❤️ {f}</span>
                  ))}
                </div>
              )}

              {/* Card Stack */}
              {cards.length > 0 ? (
                <div style={{ position: 'relative', width: '100%', height: 380 }}>
                  {/* Background cards */}
                  {cards.slice(1, 3).map((c, i) => (
                    <div key={c.id} style={{ position: 'absolute', inset: 0, borderRadius: 28, overflow: 'hidden', border: `1.5px solid ${W.border}`, transform: `scale(${0.95 - i * 0.04}) translateY(${(i + 1) * 8}px)`, zIndex: -i - 1, boxShadow: '0 4px 20px rgba(249,115,22,0.1)' }}>
                      <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                    </div>
                  ))}

                  {/* Top Card (Draggable) */}
                  {top && (
                    <motion.div
                      key={top.id}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={handleDragEnd}
                      style={{ x, opacity, rotate, position: 'absolute', inset: 0, borderRadius: 28, overflow: 'hidden', border: `1.5px solid ${W.border}`, boxShadow: '0 12px 48px rgba(249,115,22,0.2)', cursor: 'grab' }}
                    >
                      <img src={top.img} alt={top.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,16,9,0.9) 0%, transparent 60%)' }} />
                      <div style={{ position: 'absolute', bottom: 24, left: 20, right: 20, pointerEvents: 'none' }}>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: 4 }}>{top.cuisine}</p>
                        <h2 style={{ fontSize: 28, fontWeight: 900, color: 'white' }}>{top.name}</h2>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div style={{ width: '100%', height: 340, background: W.card, border: `1.5px dashed ${W.border}`, borderRadius: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <span style={{ fontSize: 48 }}>🎩</span>
                  <p style={{ fontSize: 16, fontWeight: 800, color: W.muted }}>Sab dekh liya!</p>
                  <button onClick={handleDeckEmpty}
                    style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 16, padding: '12px 24px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                    {liked.length > 0 ? '✨ Fusion Recipe Generate Karo' : 'Reset Cards'}
                  </button>
                </div>
              )}

              {/* Swipe Buttons */}
              {cards.length > 0 && (
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                  <button onClick={handleSkip}
                    style={{ width: 64, height: 64, borderRadius: '50%', background: W.card, border: '2px solid #FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(239,68,68,0.2)' }}>
                    <X style={{ width: 28, height: 28, color: '#EF4444' }} />
                  </button>
                  <span style={{ fontSize: 12, fontWeight: 800, color: W.muted }}>{cards.length} left</span>
                  <button onClick={handleLike}
                    style={{ width: 64, height: 64, borderRadius: '50%', background: W.card, border: '2px solid #6EE7B7', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(16,185,129,0.2)' }}>
                    <Heart style={{ width: 28, height: 28, color: '#10B981', fill: '#10B981' }} />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* LOADING STAGE */}
          {stage === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
              <Loader2 className="animate-spin" style={{ width: 48, height: 48, color: W.saffron }} />
              <h2 style={{ fontSize: 20, fontWeight: 900, color: W.heading }}>AI is cooking...</h2>
              <p style={{ fontSize: 14, color: W.muted, lineHeight: 1.5 }}>
                {liked.join(', ')} ko mix karke ek naya <br/>Zayka create kar rahe hain! 🧬
              </p>
            </motion.div>
          )}

          {/* RESULT STAGE */}
          {stage === 'result' && fusion && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ width: '100%', background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 20, boxShadow: '0 12px 48px rgba(0,0,0,0.05)' }}>
              
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 64 }}>{fusion.emoji}</span>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: W.heading, marginTop: 12 }}>{fusion.name}</h2>
                <p style={{ fontSize: 14, color: W.saffron, fontWeight: 800, marginTop: 4 }}>{fusion.tagline}</p>
                <div style={{ display: 'inline-block', background: '#F3F4F6', color: '#4B5563', fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 100, marginTop: 12 }}>
                  ⏱️ Prep: {fusion.time}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: W.heading, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🥣 Key Ingredients</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {fusion.ingredients?.map((ing: string) => (
                    <span key={ing} style={{ background: '#FFF0E6', color: '#C2410C', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>{ing}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: W.heading, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>📋 How to Make</h3>
                <div style={{ background: W.bg, padding: 16, borderRadius: 16, border: `1px solid ${W.border}` }}>
                  <p style={{ fontSize: 14, color: W.heading, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{fusion.instructions}</p>
                </div>
              </div>
              
              {fusion.funFact && (
                <div style={{ background: '#EFF6FF', padding: 12, borderRadius: 12, marginBottom: 20 }}>
                  <p style={{ fontSize: 12, color: '#1D4ED8', fontWeight: 600 }}>💡 <strong>Zayka Fact:</strong> {fusion.funFact}</p>
                </div>
              )}

              <button 
                onClick={handleStartCooking}
                style={{ width: '100%', background: 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 16, padding: '16px', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 24px rgba(249,115,22,0.25)' }}>
                Start Cooking 🔥
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
