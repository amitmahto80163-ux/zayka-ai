'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, X, Sparkles, RefreshCw } from 'lucide-react';
import { useZaykaStore } from '@/store';
import { generateFusionRecipeAction } from '@/lib/actions';
import toast from 'react-hot-toast';

const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

const FOOD_CARDS = [
  { id: 'f1', name: 'Butter Chicken', cuisine: 'Indian 🇮🇳', emoji: '🍗', color: '#FF9933', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80' },
  { id: 'f2', name: 'Margherita Pizza', cuisine: 'Italian 🇮🇹', emoji: '🍕', color: '#CE2B37', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80' },
  { id: 'f3', name: 'Ramen', cuisine: 'Japanese 🇯🇵', emoji: '🍜', color: '#BC002D', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80' },
  { id: 'f4', name: 'Tacos', cuisine: 'Mexican 🇲🇽', emoji: '🌮', color: '#006847', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80' },
  { id: 'f5', name: 'Pad Thai', cuisine: 'Thai 🇹🇭', emoji: '🥘', color: '#A51931', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=400&q=80' },
  { id: 'f6', name: 'Biryani', cuisine: 'Indian 🇮🇳', emoji: '🍲', color: '#FF6B35', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
  { id: 'f7', name: 'Sushi', cuisine: 'Japanese 🇯🇵', emoji: '🍣', color: '#BC002D', img: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=400&q=80' },
  { id: 'f8', name: 'Pasta Arrabbiata', cuisine: 'Italian 🇮🇹', emoji: '🍝', color: '#009246', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=400&q=80' },
];

export default function SwipePage() {
  const router = useRouter();
  const { language } = useZaykaStore();
  const [cards, setCards] = useState(FOOD_CARDS);
  const [liked, setLiked] = useState<string[]>([]);
  const [stage, setStage] = useState<'swipe' | 'loading' | 'result'>('swipe');
  const [fusion, setFusion] = useState<any>(null);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (dir: 'left' | 'right') => {
    if (cards.length === 0) return;
    const top = cards[0];
    setSwipeDir(dir);
    if (dir === 'right') {
      setLiked(prev => [...prev, top.name]);
      toast(top.name + ' â¤ï¸', { icon: 'ðŸ”¥', style: { background: '#FFEDD5', color: W.heading, fontWeight: 700 } });
    }
    setTimeout(() => {
      setCards(prev => prev.slice(1));
      setSwipeDir(null);
    }, 300);
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
    else { toast('Kuch toh like karo!', { icon: 'ðŸ˜…' }); resetDeck(); }
  };

  const resetDeck = () => { setCards(FOOD_CARDS); setLiked([]); setFusion(null); setStage('swipe'); };

  const top = cards[0];

  return (
    <div style={{ minHeight: '100vh', background: W.bg, paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,248,243,0.92)', backdropFilter: 'blur(20px)', padding: '48px 16px 16px', borderBottom: `1px solid ${W.border}`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 18, height: 18, color: W.heading }} />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: W.heading }}>Food Tinder ðŸ”¥</h1>
          <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>Like karo â†’ AI Fusion recipe banayega!</p>
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
                    <span key={f} style={{ background: '#FFEDD5', border: '1.5px solid #FED7AA', borderRadius: 50, padding: '4px 12px', fontSize: 11, fontWeight: 800, color: W.saffron }}>â¤ï¸ {f}</span>
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

                  {/* Top Card */}
                  {top && (
                    <motion.div
                      key={top.id}
                      animate={{ x: swipeDir === 'left' ? -400 : swipeDir === 'right' ? 400 : 0, rotate: swipeDir === 'left' ? -12 : swipeDir === 'right' ? 12 : 0, opacity: swipeDir ? 0 : 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ position: 'absolute', inset: 0, borderRadius: 28, overflow: 'hidden', border: `1.5px solid ${W.border}`, boxShadow: '0 12px 48px rgba(249,115,22,0.2)', cursor: 'grab' }}
                    >
                      <img src={top.img} alt={top.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,16,9,0.9) 0%, transparent 60%)' }} />
                      <div style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: 4 }}>{top.cuisine}</p>
                        <h2 style={{ fontSize: 28, fontWeight: 900, color: 'white' }}>{top.name}</h2>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div style={{ width: '100%', height: 340, background: W.card, border: `1.5px dashed ${W.border}`, borderRadius: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <span style={{ fontSize: 48 }}>ðŸŽ´</span>
                  <p style={{ fontSize: 16, fontWeight: 800, color: W.muted }}>Sab dekh liya!</p>
                  <button onClick={handleDeckEmpty}
                    style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 16, padding: '12px 24px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                    {liked.length > 0 ? 'âœ¨ Fusion Recipe Generate Karo' : 'Reset Cards'}
                  </button>
                </div>
              )}

              {/* Swipe Buttons */}
              {cards.length > 0 && (
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                  <button onClick={() => handleSwipe('left')}
                    style={{ width: 64, height: 64, borderRadius: '50%', background: W.card, border: '2px solid #FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(239,68,68,0.2)' }}>
                    <X style={{ width: 28, height: 28, color: '#EF4444' }} />
                  </button>
                  <button onClick={() => handleSwipe('right')}
                    style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #FBBF24)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 6px 20px rgba(249,115,22,0.4)' }}>
                    <Heart style={{ width: 30, height: 30, color: 'white', fill: 'white' }} />
                  </button>
                </div>
              )}

              {/* Counter */}
              <p style={{ fontSize: 13, color: W.muted, fontWeight: 700 }}>
                {cards.length} cards left â€¢ {liked.length} liked â¤ï¸
              </p>
            </motion.div>
          )}

          {/* LOADING */}
          {stage === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '60px 20px' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                style={{ fontSize: 56 }}>ðŸ§¬</motion.div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 20, fontWeight: 900, color: W.heading }}>AI Fusion Bana Raha Hai...</p>
                <p style={{ fontSize: 13, color: W.muted, fontWeight: 600, marginTop: 6 }}>{liked.join(' + ')} ko fuse kar raha hoon!</p>
              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {stage === 'result' && fusion && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Fusion Hero */}
              <div style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', borderRadius: 28, padding: '28px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)" }} />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>AI Fusion Creation</p>
                <div style={{ fontSize: 52, marginBottom: 10 }}>{'ðŸ§¬'}</div>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: 'white', marginBottom: 6 }}>{fusion.name || 'Fusion Dish'}</h2>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{fusion.tagline || ''}</p>
              </div>

              {fusion.ingredients?.length > 0 && (
                <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: W.heading, marginBottom: 12 }}>ðŸ¥˜ Key Ingredients</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {fusion.ingredients.map((ing: string, i: number) => (
                      <span key={i} style={{ background: '#FFEDD5', border: '1px solid #FED7AA', borderRadius: 50, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: W.saffron }}>{ing}</span>
                    ))}
                  </div>
                </div>
              )}

              {fusion.instructions && (
                <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: W.heading, marginBottom: 10 }}>ðŸ“‹ How to Make</h3>
                  <p style={{ fontSize: 13, color: '#3D2B1F', lineHeight: 1.7, fontWeight: 600 }}>{fusion.instructions}</p>
                </div>
              )}

              <button onClick={resetDeck}
                style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 20, padding: '16px', fontFamily: 'Nunito, sans-serif', fontSize: 15, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 20px rgba(249,115,22,0.35)' }}>
                <RefreshCw style={{ width: 18, height: 18 }} /> Dobara Khelo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}



