'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search, ChefHat, Mic, Timer, Flame, Globe, Star, User
} from 'lucide-react';
import { useZaykaStore } from '@/store';
import { CHEF_PROFILES } from '@/data/chefs';

// ============================================================
// DESIGN SYSTEM CONSTANTS
// ============================================================
const W = { 
  bg: '#FFF8F3', 
  primary: '#F97316', 
  card: '#FFFFFF', 
  text: '#1C1009', 
  muted: '#92745A', 
  border: '#F0E6DC' 
};

// ============================================================
// DATA
// ============================================================
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

const SAMPLE_RECIPES = [
  {
    id: '1', name: 'Butter Chicken', nameHindi: 'बटर चिकन',
    cuisine: 'indian', time: 45, isVeg: false, calories: 380, rating: 4.8,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600&h=800',
    tags: ['popular', 'dinner'],
  },
  {
    id: '2', name: 'Dal Makhani', nameHindi: 'दाल मखनी',
    cuisine: 'indian', time: 60, isVeg: true, calories: 290, rating: 4.9,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600&h=800',
    tags: ['popular', 'vegetarian'],
  },
  {
    id: '3', name: 'Paneer Tikka', nameHindi: 'पनीर टिक्का',
    cuisine: 'indian', time: 30, isVeg: true, calories: 250, rating: 4.7,
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=600&h=800',
    tags: ['starter', 'vegetarian'],
  },
  {
    id: '4', name: 'Pasta Arrabbiata', nameHindi: 'पास्ता',
    cuisine: 'italian', time: 20, isVeg: true, calories: 320, rating: 4.6,
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=600&h=800',
    tags: ['quick', 'italian'],
  },
  {
    id: '5', name: 'Hakka Noodles', nameHindi: 'हक्का नूडल्स',
    cuisine: 'chinese', time: 25, isVeg: false, calories: 350, rating: 4.5,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=600&h=800',
    tags: ['quick', 'chinese'],
  },
  {
    id: '6', name: 'Masala Chai', nameHindi: 'मसाला चाय',
    cuisine: 'indian', time: 10, isVeg: true, calories: 80, rating: 4.9,
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=600&h=800',
    tags: ['quick', 'drinks'],
  },
];

const QUICK_TOOLS = [
  { href: '/swipe',   emoji: '🔥', label: 'Food\nTinder',  bg: '#FFF0E6', border: '#FED7AA' },
  { href: '/judge',   emoji: '📸', label: 'Rate My\nPlate', bg: '#F5F3FF', border: '#DDD6FE' },
  { href: '/budget',  emoji: '💰', label: 'Student\nBudget', bg: '#F0FDF4', border: '#BBF7D0' },
  { href: '/fridge',  emoji: '🧊', label: 'Fridge\nScan',   bg: '#EFF6FF', border: '#BFDBFE' },
  { href: '/world',   emoji: '🌍', label: 'World\nKitchen', bg: '#FFFBEB', border: '#FDE68A' },
  { href: '/diet',    emoji: '🥗', label: 'Diet\nPlan',     bg: '#F7FEE7', border: '#D9F99D' },
];

export default function HomePage() {
  const { user } = useZaykaStore();
  const [activeCategory, setActiveCategory] = useState('all');

  const userName = user?.name?.split(' ')[0] || 'Dost';
  const streak = user?.stats?.currentStreak || 0;

  const filtered = SAMPLE_RECIPES.filter(r =>
    activeCategory === 'all' || r.cuisine === activeCategory || r.tags.includes(activeCategory)
  );

  return (
    <div className="min-h-screen safe-bottom" style={{ backgroundColor: W.bg }}>
      
      {/* ===== STICKY HEADER ===== */}
      <div className="glass sticky top-0 z-50 px-6 pt-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ color: W.muted, fontSize: '13px', fontWeight: 600 }}>Namaste {userName} 👋</p>
            <h1 style={{ fontSize: '26px', fontWeight: 900, lineHeight: 1.1, color: W.text }}>
              Zayka <span style={{ color: W.primary }}>AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && <div className="streak-badge">🔥 {streak} din</div>}
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

        {/* Search Bar - Full width pill */}
        <Link href="/search">
          <motion.div whileTap={{ scale: 0.98 }} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: W.card, border: `1.5px solid ${W.border}`,
            borderRadius: 999, padding: '14px 20px', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <Search style={{ color: W.muted, width: 20, height: 20 }} />
            <span style={{ color: W.muted, fontSize: 15, fontWeight: 600, flex: 1 }}>Kya banana hai aaj? 😋</span>
            <div style={{
              background: W.primary, borderRadius: '50%', padding: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Mic style={{ width: 14, height: 14, color: 'white' }} />
            </div>
          </motion.div>
        </Link>
      </div>

      <div className="px-6 pt-2 space-y-8 pb-32">
        
        {/* ===== MOOD SECTION ===== */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: W.text, marginBottom: 12 }}>Aaj ka Mood</h2>
          <div className="no-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {MOODS.map(mood => (
              <Link key={mood.id} href={`/search?q=${encodeURIComponent(mood.label)}`}>
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

        {/* ===== CATEGORIES ===== */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
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

        {/* ===== RECIPE FEED ===== */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: W.text, marginBottom: 16 }}>
            {activeCategory === 'all' ? 'Trending Today 📈' : 'Found Recipes 🍲'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <AnimatePresence>
              {filtered.map(recipe => (
                <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
                  <motion.div
                    layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      height: 220, borderRadius: 20, position: 'relative', overflow: 'hidden',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.06)', cursor: 'pointer'
                    }}
                  >
                    <img src={recipe.image} alt={recipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                        <h3 style={{ color: 'white', fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>{recipe.name}</h3>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
            
            {filtered.length === 0 && (
              <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px 0' }}>
                <span style={{ fontSize: 40 }}>🤷‍♂️</span>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: W.text, marginTop: 12 }}>Kuch nahi mila!</h3>
                <p style={{ fontSize: 14, color: W.muted }}>Try clearing the filter.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
