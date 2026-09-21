'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, ChefHat, Mic, Timer, Flame, Globe, Star, User, Loader2 } from 'lucide-react';
import { useZaykaStore } from '@/store';
import { ALL_DISHES } from '@/data/dishes';

const W = { bg: '#FFF8F3', primary: '#F97316', card: '#FFFFFF', text: '#1C1009', muted: '#92745A', border: '#F0E6DC' };

const CATEGORIES = [
  { id: 'all',     label: 'Sab',       icon: '🍲' },
  { id: 'indian',  label: 'Indian',    icon: '🇮🇳' },
  { id: 'chinese', label: 'Chinese',   icon: '🍜' },
  { id: 'italian', label: 'Italian',   icon: '🍝' },
  { id: 'healthy', label: 'Healthy',   icon: '🥗' },
  { id: 'quick',   label: 'Quick',     icon: '⏱️' },
  { id: 'dessert', label: 'Dessert',   icon: '🍨' },
  { id: 'street',  label: 'Street',    icon: '🌶️' },
];

const MOODS = [
  { id: 'sick', emoji: '🤒', label: 'Tabiyat kharab' },
  { id: 'late', emoji: '🌙', label: 'Late night' },
  { id: 'gym',  emoji: '💪', label: 'Gym diet' },
  { id: 'date', emoji: '❤️', label: 'Date night' },
];

const QUICK_TOOLS = [
  { href: '/swipe',   emoji: '🔥', label: 'Food\nTinder',  bg: '#FFF0E6', border: '#FED7AA' },
  { href: '/judge',   emoji: '📸', label: 'Rate My\nPlate', bg: '#F5F3FF', border: '#DDD6FE' },
  { href: '/budget',  emoji: '💰', label: 'Student\nBudget', bg: '#F0FDF4', border: '#BBF7D0' },
  { href: '/fridge',  emoji: '🧊', label: 'Fridge\nScan',   bg: '#EFF6FF', border: '#BFDBFE' },
  { href: '/world',   emoji: '🌎', label: 'World\nKitchen', bg: '#FFFBEB', border: '#FDE68A' },
  { href: '/diet',    emoji: '🥗', label: 'Diet\nPlan',     bg: '#F7FEE7', border: '#D9F99D' },
];

const PAGE_SIZE = 10; // Number of items to load per scroll

export default function HomePage() {
  const { user, memory, currentStreak } = useZaykaStore();
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Infinite Scroll States
  const [page, setPage] = useState(1);
  const [isGeneratingFallback, setIsGeneratingFallback] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const userName = user?.name?.split(' ')[0] || 'Dost';
  const streak = currentStreak || 0;

  // 1. Filter ALL_DISHES based on category
  const filteredAll = ALL_DISHES.filter((r: any) =>
    activeCategory === 'all' || r.cuisine === activeCategory || r.tags.includes(activeCategory)
  );

  // 2. Paginate the filtered array
  const displayedDishes = filteredAll.slice(0, page * PAGE_SIZE);

  const recommendedRecipes = ALL_DISHES.filter((r: any) => {
    if (memory?.isVegetarian && !r.isVeg) return false;
    if (memory?.budgetPerMeal && memory.budgetPerMeal < 80 && r.calories > 400) return false;
    return true;
  });

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (displayedDishes.length < filteredAll.length) {
          // Normal load more from existing list
          setPage(p => p + 1);
        } else if (displayedDishes.length > 0 && activeCategory === 'all') {
          // Exhausted the list — simulate AI generation
          setIsGeneratingFallback(true);
          setTimeout(() => {
            setIsGeneratingFallback(false);
            // In a real app, this would append to the list from the AI backend.
            // For now, it just resets or shows it finished generating one batch.
          }, 2000);
        }
      }
    }, { threshold: 0.1 });

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [displayedDishes.length, filteredAll.length, activeCategory]);

  return (
    <div className="min-h-screen safe-bottom" style={{ backgroundColor: W.bg }}>
      
      {/* ===== STICKY HEADER ===== */}
      <div className="glass sticky top-0 z-50 px-6 pt-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ color: W.muted, fontSize: '13px', fontWeight: 600 }}>Namaste {userName} 🙏</p>
            <h1 style={{ fontSize: '26px', fontWeight: 900, lineHeight: 1.1, color: W.text }}>
              Zayka <span style={{ color: W.primary }}>AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {currentStreak > 0 && (
              <motion.div whileTap={{ scale: 0.9 }} style={{
                display: 'flex', alignItems: 'center', gap: 6, background: '#FFF0E6',
                border: '1px solid #FED7AA', borderRadius: 100, padding: '6px 12px'
              }}>
                <span style={{ fontSize: 16 }}>🔥</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: W.primary }}>{currentStreak} din</span>
              </motion.div>
            )}
            <Link href="/profile">
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: '#FFEDD5', border: `2px solid ${W.primary}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', cursor: 'pointer', overflow: 'hidden'
              }}>
                {user?.photoUrl
                  ? <img src={user.photoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <User size={20} color={W.primary} />}
              </div>
            </Link>
          </div>
        </div>

        {/* Global Search Button */}
        <Link href="/search">
          <div style={{
            background: 'white', border: `1.5px solid ${W.border}`, borderRadius: 100,
            padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'text'
          }}>
            <Search size={20} color={W.muted} />
            <span style={{ color: W.muted, fontSize: 15, fontWeight: 600, flex: 1 }}>
              Aaj kya khana hai?
            </span>
            <div style={{ width: 1, height: 20, background: W.border }} />
            <Mic size={20} color={W.primary} />
          </div>
        </Link>
      </div>

      {/* ===== BODY ===== */}
      <div className="px-6 pb-24 flex flex-col gap-10 mt-2">

        {/* ===== MOODS ===== */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: W.text, marginBottom: 14 }}>Mood kaisa hai? 😋</h2>
          <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {MOODS.map(mood => (
              <Link href={`/search?q=${encodeURIComponent(mood.label)}`} key={mood.id}>
                <motion.div whileTap={{ scale: 0.95 }} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: W.card, border: `1px solid ${W.border}`,
                  padding: '10px 16px', borderRadius: 100, whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}>
                  <span style={{ fontSize: 16 }}>{mood.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: W.text }}>{mood.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* ===== QUICK AI TOOLS ===== */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: W.text }}>Quick AI Tools ⚡</h2>
            <Link href="/x-labs"><span style={{ fontSize: 13, fontWeight: 700, color: W.primary }}>View All</span></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {QUICK_TOOLS.map((t, i) => (
              <Link href={t.href} key={i}>
                <motion.div whileTap={{ scale: 0.95 }} style={{
                  background: t.bg, border: `1px solid ${t.border}`,
                  borderRadius: 16, padding: '16px 8px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 8, textAlign: 'center',
                }}>
                  <span style={{ fontSize: 24 }}>{t.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: W.text, lineHeight: 1.2, whiteSpace: 'pre-line' }}>
                    {t.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* ===== FOR YOU ===== */}
        {memory && recommendedRecipes.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: W.text }}>🎯 For You</h2>
              <span style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>Based on your taste</span>
            </div>
            <div className="no-scrollbar" style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }}>
              {recommendedRecipes.slice(0, 5).map((recipe: any) => (
                <Link href={`/recipe/${recipe.id}`} key={`rec-${recipe.id}`}>
                  <motion.div whileTap={{ scale: 0.95 }} style={{
                    width: 160, height: 180, borderRadius: 16, position: 'relative', overflow: 'hidden', flexShrink: 0
                  }}>
                    <img src={recipe.image} alt={recipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                      padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
                    }}>
                      <h3 style={{ color: 'white', fontWeight: 800, fontSize: 13, lineHeight: 1.2 }}>{recipe.name}</h3>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{recipe.time}m</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ===== CATEGORIES ===== */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', position: 'sticky', top: 120, zIndex: 40, padding: '10px 0', background: W.bg }}>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCategory(c.id);
                setPage(1); // Reset pagination on filter change
              }}
              style={{
                padding: '8px 16px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 6,
                background: activeCategory === c.id ? W.primary : W.card,
                color: activeCategory === c.id ? 'white' : W.muted,
                border: activeCategory === c.id ? 'none' : `1px solid ${W.border}`,
                fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                boxShadow: activeCategory === c.id ? '0 4px 12px rgba(249,115,22,0.3)' : 'none',
                cursor: 'pointer'
              }}
            >
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>

        {/* ===== MASSIVE RECIPE FEED (INFINITE SCROLL) ===== */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: W.text, marginBottom: 16 }}>
            {activeCategory === 'all' ? `Trending Today 🚀 (${ALL_DISHES.length}+ dishes)` : 'Found Recipes 🍳'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <AnimatePresence>
              {displayedDishes.map((recipe: any) => (
                <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
                  <motion.div
                    layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      height: 220, borderRadius: 20, position: 'relative', overflow: 'hidden',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.06)', cursor: 'pointer'
                    }}
                  >
                    <img src={recipe.image} alt={recipe.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                      padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                    }}>
                      {/* Top Chips */}
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <div style={{ background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: 8, fontSize: 10, fontWeight: 800, color: W.text, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Star size={10} fill="#F59E0B" color="#F59E0B" /> {recipe.rating}
                        </div>
                      </div>
                      
                      {/* Bottom Text */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: recipe.isVeg ? '#DCFCE7' : '#FEE2E2', color: recipe.isVeg ? '#166534' : '#991B1B', fontWeight: 800 }}>
                            {recipe.isVeg ? 'VEG' : 'NON-VEG'}
                          </span>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.9)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Timer size={10} /> {recipe.time}m
                          </span>
                        </div>
                        <h3 style={{ color: 'white', fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>{recipe.nameHindi || recipe.name}</h3>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
            
            {filteredAll.length === 0 && (
              <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px 0' }}>
                <span style={{ fontSize: 40 }}>🤷‍♂️</span>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: W.text, marginTop: 12 }}>Kuch nahi mila!</h3>
                <p style={{ fontSize: 14, color: W.muted }}>Try clearing the filter.</p>
              </div>
            )}
          </div>

          {/* Loader Element for Intersection Observer */}
          {displayedDishes.length > 0 && (
            <div ref={observerRef} style={{ width: '100%', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              {isGeneratingFallback ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Loader2 size={32} color={W.primary} />
                  </motion.div>
                  <p style={{ color: W.primary, fontSize: 14, fontWeight: 700 }}>AI is generating more delicious dishes...</p>
                </>
              ) : displayedDishes.length < filteredAll.length ? (
                <div style={{ width: 40, height: 4, background: W.border, borderRadius: 10 }} />
              ) : (
                <p style={{ color: W.muted, fontSize: 14, fontWeight: 600 }}>Wow, you reached the end! 🌟</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
