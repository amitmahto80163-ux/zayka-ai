'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Home, Search, ChefHat, User, Mic,
  TrendingUp, Timer, Atom, Flame, Globe
} from 'lucide-react';
import { useZaykaStore } from '@/store';
import { CHEF_PROFILES } from '@/data/chefs';

// ============================================================
// DATA
// ============================================================
const CATEGORIES = [
  { id: 'all',     label: 'Sab 🌟' },
  { id: 'indian',  label: '🇮🇳 Indian' },
  { id: 'chinese', label: '🍜 Chinese' },
  { id: 'italian', label: '🍕 Italian' },
  { id: 'healthy', label: '🥗 Healthy' },
  { id: 'quick',   label: '⚡ Quick' },
  { id: 'dessert', label: '🎂 Dessert' },
  { id: 'street',  label: '🌮 Street' },
];

const SAMPLE_RECIPES = [
  {
    id: '1', name: 'Butter Chicken', nameHindi: 'बटर चिकन',
    cuisine: 'indian', time: 45, isVeg: false, calories: 380,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=500',
    tags: ['popular', 'dinner'], gradient: 'from-orange-400 to-red-500',
  },
  {
    id: '2', name: 'Dal Makhani', nameHindi: 'दाल मखनी',
    cuisine: 'indian', time: 60, isVeg: true, calories: 290,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=500',
    tags: ['popular', 'vegetarian'], gradient: 'from-amber-400 to-orange-600',
  },
  {
    id: '3', name: 'Paneer Tikka', nameHindi: 'पनीर टिक्का',
    cuisine: 'indian', time: 30, isVeg: true, calories: 250,
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=500',
    tags: ['starter', 'vegetarian'], gradient: 'from-yellow-400 to-orange-500',
  },
  {
    id: '4', name: 'Pasta Arrabbiata', nameHindi: 'पास्ता',
    cuisine: 'italian', time: 20, isVeg: true, calories: 320,
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=500',
    tags: ['quick', 'italian'], gradient: 'from-red-400 to-rose-500',
  },
  {
    id: '5', name: 'Hakka Noodles', nameHindi: 'हक्का नूडल्स',
    cuisine: 'chinese', time: 25, isVeg: false, calories: 350,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=500',
    tags: ['quick', 'chinese'], gradient: 'from-green-400 to-emerald-600',
  },
  {
    id: '6', name: 'Masala Chai', nameHindi: 'मसाला चाय',
    cuisine: 'indian', time: 10, isVeg: true, calories: 80,
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=500',
    tags: ['quick', 'drinks'], gradient: 'from-amber-500 to-yellow-600',
  },
];

const QUICK_TOOLS = [
  { href: '/swipe',   emoji: '🔥', label: 'Food\nTinder',  bg: 'bg-orange-50',  border: 'border-orange-200' },
  { href: '/judge',   emoji: '📸', label: 'Rate My\nPlate', bg: 'bg-purple-50', border: 'border-purple-200' },
  { href: '/budget',  emoji: '💰', label: 'Student\nBudget', bg: 'bg-green-50', border: 'border-green-200' },
  { href: '/fridge',  emoji: '🧊', label: 'Fridge\nScan',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  { href: '/world',   emoji: '🌍', label: 'World\nKitchen', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { href: '/diet',    emoji: '🥗', label: 'Diet\nPlan',     bg: 'bg-lime-50',   border: 'border-lime-200' },
];

const WEATHERS = [
  { msg: 'Bahar baarish ho rahi hai! 🌧️', dish: 'Garma-garam Pakode banayein?', emoji: '🌧️', color: '#EFF6FF', q: 'Mix Veg Pakoda' },
  { msg: 'Kaafi thand hai aaj! ❄️',       dish: 'Hot Spicy Soup banayein?',     emoji: '❄️', color: '#F0F9FF', q: 'Spicy Tomato Soup' },
  { msg: 'Dhoop nikal aayi! ☀️',          dish: 'Refresh hojao — Salad khayein?', emoji: '☀️', color: '#FFFBEB', q: 'Summer Salad' },
];

// ============================================================
// HOME PAGE
// ============================================================
export default function HomePage() {
  const { user, selectedChef } = useZaykaStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeNav, setActiveNav] = useState('home');
  const [weather, setWeather] = useState<typeof WEATHERS[0] | null>(null);

  useEffect(() => {
    setWeather(WEATHERS[new Date().getHours() % 3]);
  }, []);

  const chef = CHEF_PROFILES[selectedChef];
  const userName = user?.name?.split(' ')[0] || 'Dost';
  const streak = user?.stats?.currentStreak || 0;

  const filtered = SAMPLE_RECIPES.filter(r =>
    activeCategory === 'all' || r.cuisine === activeCategory || r.tags.includes(activeCategory)
  );

  return (
    <div className="min-h-screen safe-bottom" style={{ backgroundColor: '#FFF8F3' }}>

      {/* ===== STICKY HEADER ===== */}
      <div className="glass sticky top-0 z-50 px-4 pt-10 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p style={{ color: '#92745A', fontSize: '13px', fontWeight: 600 }}>Namaste {userName} 👋</p>
            <h1 style={{ fontSize: '26px', fontWeight: 900, lineHeight: 1.1 }}>
              <span className="gradient-text">Zayka AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && <div className="streak-badge">🔥 {streak} din</div>}
            <Link href="/profile">
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFEDD5, #FED7AA)',
                border: '2px solid #F97316',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', cursor: 'pointer',
              }}>
                {user?.photoUrl
                  ? <img src={user.photoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : '👤'}
              </div>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <Link href="/search">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'white', border: '1.5px solid #F0E6DC',
            borderRadius: 20, padding: '12px 16px', cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(249,115,22,0.07)',
            transition: 'all 0.2s',
          }}>
            <Search style={{ color: '#C4A882', width: 18, height: 18, flexShrink: 0 }} />
            <span style={{ color: '#C4A882', fontSize: 14, fontWeight: 600, flex: 1 }}>Kya banana hai aaj? 🍽️</span>
            <div style={{
              background: 'linear-gradient(135deg, #F97316, #FB923C)',
              borderRadius: 12, padding: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Mic style={{ width: 14, height: 14, color: 'white' }} />
            </div>
          </div>
        </Link>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="px-4 pt-5 space-y-7">

        {/* ===== WEATHER CARD ===== */}
        {weather && (
          <Link href={`/search?q=${encodeURIComponent(weather.q)}`}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: weather.color,
                border: '1.5px solid #F0E6DC',
                borderRadius: 20, padding: '14px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', boxShadow: '0 4px 16px rgba(249,115,22,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'white', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 22,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                  {weather.emoji}
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#92745A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{weather.msg}</p>
                  <p style={{ fontSize: 14, fontWeight: 900, color: '#1C1009', marginTop: 2 }}>{weather.dish} <span style={{ color: '#F97316' }}>→</span></p>
                </div>
              </div>
            </motion.div>
          </Link>
        )}

        {/* ===== QUICK AI TOOLS ===== */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 className="section-title">Quick AI Tools ⚡</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
            {QUICK_TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'white',
                    border: '1.5px solid #F0E6DC',
                    borderRadius: 20,
                    padding: '14px 8px',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 8,
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(249,115,22,0.06)',
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, background: '#FFF8F3', border: '1.5px solid #F0E6DC',
                  }}>
                    {tool.emoji}
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 800, color: '#3D2B1F',
                    textAlign: 'center', lineHeight: 1.3, whiteSpace: 'pre-line',
                    letterSpacing: '0.01em',
                  }}>
                    {tool.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* ===== TRENDING RECIPES ===== */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 className="section-title">Trending Recipes 🔥</h2>
            <TrendingUp style={{ width: 18, height: 18, color: '#F97316' }} />
          </div>

          {/* Category Chips */}
          <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`chip ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Recipe Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
            <AnimatePresence mode="wait">
              {filtered.map((recipe, i) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/recipe/${recipe.id}`}>
                    <div className="recipe-card">
                      {/* Image */}
                      <div style={{ aspectRatio: '1/1', position: 'relative', overflow: 'hidden', background: '#FFF0E6' }}>
                        <img src={recipe.image} alt={recipe.name} />
                        {/* Gradient overlay */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(to top, rgba(28,16,9,0.55) 0%, transparent 55%)',
                        }} />
                        {/* Veg dot */}
                        <div style={{
                          position: 'absolute', top: 8, right: 8,
                          background: 'rgba(255,255,255,0.92)',
                          borderRadius: 8, padding: '4px 6px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backdropFilter: 'blur(6px)',
                        }}>
                          <div style={{
                            width: 10, height: 10, borderRadius: 3,
                            border: `2px solid ${recipe.isVeg ? '#10B981' : '#EF4444'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <div style={{
                              width: 5, height: 5, borderRadius: '50%',
                              background: recipe.isVeg ? '#10B981' : '#EF4444',
                            }} />
                          </div>
                        </div>
                        {/* Time */}
                        <div style={{
                          position: 'absolute', bottom: 8, left: 8,
                          background: 'rgba(28,16,9,0.7)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: 10, padding: '4px 8px',
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          <Timer style={{ width: 10, height: 10, color: '#FBBF24' }} />
                          <span style={{ fontSize: 10, fontWeight: 800, color: 'white' }}>{recipe.time}m</span>
                        </div>
                      </div>
                      {/* Text */}
                      <div style={{ padding: '10px 12px 12px' }}>
                        <h3 style={{ fontSize: 13, fontWeight: 900, color: '#1C1009', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {recipe.name}
                        </h3>
                        <p style={{ fontSize: 11, color: '#92745A', marginTop: 2, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {recipe.nameHindi}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                          <Flame style={{ width: 11, height: 11, color: '#F97316' }} />
                          <span style={{ fontSize: 10, color: '#C4A882', fontWeight: 700 }}>{recipe.calories} kcal</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ===== X-LABS PORTAL ===== */}
        <div style={{ paddingBottom: 8 }}>
          <Link href="/x-labs">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                borderRadius: 28, padding: 3,
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4, #10B981)',
                boxShadow: '0 0 40px rgba(124,58,237,0.4)',
                cursor: 'pointer',
              }}
              className="animate-gradient-x"
            >
              <div style={{
                background: '#050505',
                borderRadius: 26, padding: '28px 20px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', textAlign: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')",
                  opacity: 0.15, pointerEvents: 'none',
                }} />
                <div style={{
                  width: 56, height: 56,
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  <Atom style={{ width: 30, height: 30, color: '#22D3EE' }} className="animate-pulse" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Enter X-Labs
                </h3>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                  UNLOCK 12 SCI-FI FEATURES 🌌
                </p>
              </div>
            </motion.div>
          </Link>
        </div>

      </div>

      {/* ===== BOTTOM NAV ===== */}
      <nav className="bottom-nav">
        <Link href="/">
          <div className={`nav-item ${activeNav === 'home' ? 'active' : ''}`} onClick={() => setActiveNav('home')}>
            <Home /><span>Home</span>
          </div>
        </Link>
        <Link href="/search">
          <div className={`nav-item ${activeNav === 'search' ? 'active' : ''}`} onClick={() => setActiveNav('search')}>
            <Search /><span>Search</span>
          </div>
        </Link>
        <Link href="/cook">
          <div className={`nav-item ${activeNav === 'cook' ? 'active' : ''}`} onClick={() => setActiveNav('cook')}>
            <ChefHat /><span>Cook</span>
          </div>
        </Link>
        <Link href="/world">
          <div className={`nav-item ${activeNav === 'world' ? 'active' : ''}`} onClick={() => setActiveNav('world')}>
            <Globe /><span>World</span>
          </div>
        </Link>
        <Link href="/profile">
          <div className={`nav-item ${activeNav === 'profile' ? 'active' : ''}`} onClick={() => setActiveNav('profile')}>
            <User /><span>Profile</span>
          </div>
        </Link>
      </nav>

    </div>
  );
}
