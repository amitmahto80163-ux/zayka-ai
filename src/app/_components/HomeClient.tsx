'use client';

import Image from 'next/image';
import DishImage from '@/components/DishImage';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Search, Mic, Timer, Flame, Star, User, Loader2, 
  Sparkles, Heart, ArrowRight, Utensils, Award, Compass 
} from 'lucide-react';
import { useZaykaStore } from '@/store';
import { generateMoreDishesAction } from '@/lib/actions';
import { W } from '@/lib/theme';

const CATEGORIES = [
  { id: 'all',     label: 'Sab Kuch',  icon: '🍱' },
  { id: 'indian',  label: 'Desi Khana',icon: '🇮🇳' },
  { id: 'chinese', label: 'Indo-Chinese', icon: '🥡' },
  { id: 'italian', label: 'Pasta & Pizza', icon: '🍕' },
  { id: 'healthy', label: 'Healthy & Fit', icon: '🥗' },
  { id: 'quick',   label: '15-Min Quick', icon: '⚡' },
  { id: 'dessert', label: 'Meetha / Sweets', icon: '🍮' },
  { id: 'street',  label: 'Street Food', icon: '🥟' },
];

const MOODS = [
  { id: 'quick',    emoji: '⚡', label: '15-Min Quick', sub: 'Jaldi banao' },
  { id: 'gym',      emoji: '💪', label: 'High Protein', sub: 'Gym diet' },
  { id: 'mehman',   emoji: '👑', label: 'Royal Treat', sub: 'Mehman special' },
  { id: 'chai',     emoji: '☕', label: 'Chai & Snacks', sub: 'Evening crave' },
  { id: 'sick',     emoji: '🥣', label: 'Halka Phulka', sub: 'Easy to digest' },
  { id: 'meetha',   emoji: '🍩', label: 'Meetha Craving', sub: 'Dessert mood' },
];

const QUICK_TOOLS = [
  { 
    href: '/swipe',   
    emoji: '🔥', 
    label: 'Food Tinder', 
    desc: 'Swipe to decide',
    gradient: 'linear-gradient(135deg, #FFF1E8 0%, #FED7AA 100%)', 
    border: '#FDBA74',
    accent: '#EA580C'
  },
  { 
    href: '/judge',   
    emoji: '📸', 
    label: 'Rate My Plate', 
    desc: 'AI Chef Score 1-10',
    gradient: 'linear-gradient(135deg, #F5F3FF 0%, #DDD6FE 100%)', 
    border: '#C4B5FD',
    accent: '#7C3AED'
  },
  { 
    href: '/budget',  
    emoji: '💰', 
    label: 'Budget Meal', 
    desc: '₹50 me pet bhar',
    gradient: 'linear-gradient(135deg, #ECFDF5 0%, #A7F3D0 100%)', 
    border: '#6EE7B7',
    accent: '#059669'
  },
  { 
    href: '/fridge',  
    emoji: '🧊', 
    label: 'Fridge Scan', 
    desc: 'Bachi sabzi se dish',
    gradient: 'linear-gradient(135deg, #EFF6FF 0%, #BFDBFE 100%)', 
    border: '#93C5FD',
    accent: '#2563EB'
  },
  { 
    href: '/world',   
    emoji: '🌎', 
    label: 'World Kitchen', 
    desc: 'Global with Desi twist',
    gradient: 'linear-gradient(135deg, #FFFBEB 0%, #FDE68A 100%)', 
    border: '#FCD34D',
    accent: '#D97706'
  },
  { 
    href: '/diet',    
    emoji: '🥗', 
    label: 'Diet & Macros', 
    desc: 'Calories & Protein',
    gradient: 'linear-gradient(135deg, #F7FEE7 0%, #D9F99D 100%)', 
    border: '#BEF264',
    accent: '#65A30D'
  },
];

const PAGE_SIZE = 12;

function getTimeGreeting(userName: string): { greeting: string; sub: string } {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) {
    return { greeting: `Shubh Prabhat, ${userName} ☀️`, sub: 'Aaj nashte aur lunch me kya banayein?' };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: `Namaste, ${userName} 🍛`, sub: 'Dophar ka garma-garam zayka taiyar karein?' };
  } else if (hour >= 17 && hour < 22) {
    return { greeting: `Shubh Sandhya, ${userName} 🪔`, sub: 'Shaam ki chai aur shandaar dinner ka waqt!' };
  } else {
    return { greeting: `Late Night Hunger, ${userName}? 🌙`, sub: 'Jaldi banne wala instant swadisht khana!' };
  }
}

export default function HomeClient({ initialDishes }: { initialDishes: any[] }) {
  const { user, memory, currentStreak, language, favourites, addFavourite, removeFavourite } = useZaykaStore();
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Infinite Scroll & Generation States
  const [page, setPage] = useState(1);
  const [isGeneratingFallback, setIsGeneratingFallback] = useState(false);
  const [generatedDishes, setGeneratedDishes] = useState<any[]>([]);
  const observerRef = useRef<HTMLDivElement>(null);

  const userName = user?.name?.split(' ')[0] || 'Dost';
  const streak = currentStreak || 0;
  const timeInfo = useMemo(() => getTimeGreeting(userName), [userName]);

  // Spotlight Featured Recipe (Dish of the day)
  const spotlightDish = useMemo(() => {
    if (!initialDishes || initialDishes.length === 0) return null;
    return initialDishes.find((d: any) => d.rating >= 4.8) || initialDishes[0];
  }, [initialDishes]);

  // Combined & Filtered Dishes
  const combinedDishes = useMemo(() => [...initialDishes, ...generatedDishes], [initialDishes, generatedDishes]);
  
  const filteredAll = useMemo(() => {
    return combinedDishes.filter((r: any) =>
      activeCategory === 'all' || r.cuisine === activeCategory || r.tags?.includes(activeCategory)
    );
  }, [combinedDishes, activeCategory]);

  const displayedDishes = useMemo(() => {
    return filteredAll.slice(0, page * PAGE_SIZE);
  }, [filteredAll, page]);

  // Personalized Recommended Dishes based on user memory
  const recommendedRecipes = useMemo(() => {
    return initialDishes.filter((r: any) => {
      if (memory?.isVegetarian && !r.isVeg) return false;
      if (memory?.budgetPerMeal && memory.budgetPerMeal < 80 && r.calories > 400) return false;
      return true;
    });
  }, [initialDishes, memory]);

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isGeneratingFallback) {
        if (displayedDishes.length < filteredAll.length) {
          setPage(p => p + 1);
        } else if (displayedDishes.length > 0) {
          setIsGeneratingFallback(true);
          generateMoreDishesAction(activeCategory, language).then(res => {
            if (res.success && res.data) {
              setGeneratedDishes(prev => [...prev, ...res.data]);
              setPage(p => p + 1);
            }
            setIsGeneratingFallback(false);
          });
        }
      }
    }, { threshold: 0.1 });

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [displayedDishes.length, filteredAll.length, activeCategory, isGeneratingFallback, language]);

  const handleFavoriteToggle = (e: React.MouseEvent, dishId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (favourites.includes(dishId)) {
      removeFavourite(dishId);
    } else {
      addFavourite(dishId);
    }
  };

  return (
    <div className="min-h-screen safe-bottom" style={{ backgroundColor: W.bg }}>
      
      {/* ===== LUXURY STICKY HEADER (RESPONSIVE CENTERED) ===== */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 249, 245, 0.94)',
          backdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${W.borderSubtle}`,
          padding: '24px 20px 14px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <Sparkles size={14} color={W.gold} />
                <span style={{ fontSize: 13, fontWeight: 700, color: W.muted }}>
                  {timeInfo.greeting}
                </span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px', color: W.heading, lineHeight: 1.1, margin: 0 }}>
                Zayka <span style={{ color: W.saffron }}>AI</span>
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Streak Counter Badge */}
              <motion.div 
                whileTap={{ scale: 0.94 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'linear-gradient(135deg, #FFF1E8 0%, #FFEDD5 100%)',
                  border: `1.5px solid ${W.border}`,
                  borderRadius: W.radiusPill,
                  padding: '6px 14px',
                  boxShadow: W.shadowSm,
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: 16 }}>🔥</span>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: W.primary }}>{streak} din</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: W.muted }}>Streak</span>
                </div>
              </motion.div>

              {/* Profile Avatar */}
              <Link href="/profile" style={{ textDecoration: 'none' }}>
                <motion.div 
                  whileTap={{ scale: 0.94 }}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)',
                    border: `2px solid ${W.card}`,
                    boxShadow: W.shadowSm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  {user?.photoUrl ? (
                    <Image 
                      src={user.photoUrl} 
                      alt="User" 
                      width={42} 
                      height={42} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <User size={20} color={W.primary} />
                  )}
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Grand Search Bar */}
          <Link href="/search" style={{ textDecoration: 'none' }}>
            <motion.div 
              whileTap={{ scale: 0.99 }}
              style={{
                background: W.card,
                border: `1.5px solid ${W.border}`,
                borderRadius: W.radiusPill,
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: W.shadowSm,
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#FFF0E6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Search size={16} color={W.primary} />
              </div>
              
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: W.heading }}>
                  Aaj kya khana pasand karenge?
                </p>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: W.muted }}>
                  Boliye ya search karein (Butter Chicken, Dal Tadka, Biryani...)
                </p>
              </div>

              <div style={{ width: 1, height: 22, background: W.borderSubtle }} />
              
              <motion.div 
                whileHover={{ scale: 1.08 }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: W.primaryGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(234, 88, 12, 0.3)'
                }}
              >
                <Mic size={16} color="white" />
              </motion.div>
            </motion.div>
          </Link>
        </div>
      </header>

      {/* ===== BODY CONTENT (CONSTRAINED RESPONSIVE MAX-WIDTH) ===== */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 16px 120px', display: 'flex', flexDirection: 'column', gap: 26 }}>

        {/* ===== SPOTLIGHT FEATURED HERO (COMPACT & SLEEK) ===== */}
        {spotlightDish && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>👑</span>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: W.heading, margin: 0 }}>
                  Chef's Special Spotlight
                </h2>
              </div>
              <span style={{ 
                fontSize: 11, 
                fontWeight: 800, 
                color: W.gold, 
                background: W.goldLight, 
                padding: '3px 10px', 
                borderRadius: W.radiusPill 
              }}>
                ⭐ Aaj Ka Best
              </span>
            </div>

            <Link href={`/recipe/${spotlightDish.id}`} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  position: 'relative',
                  height: 200,
                  borderRadius: 22,
                  overflow: 'hidden',
                  boxShadow: W.shadowMd,
                  border: `1.5px solid ${W.border}`,
                  cursor: 'pointer'
                }}
              >
                <DishImage 
                  src={spotlightDish.image} 
                  alt={spotlightDish.name} 
                  priority 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  width={800} 
                  height={400} 
                />
                
                {/* Cinematic Desi Gradient Overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(25, 14, 7, 0.92) 0%, rgba(25, 14, 7, 0.35) 50%, rgba(0, 0, 0, 0.1) 100%)',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Top Bar with Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      background: spotlightDish.isVeg ? '#15803D' : '#B91C1C',
                      color: 'white',
                      fontWeight: 900,
                      fontSize: 10,
                      padding: '3px 9px',
                      borderRadius: W.radiusPill,
                      letterSpacing: '0.4px'
                    }}>
                      {spotlightDish.isVeg ? '🟢 PURE VEG' : '🔴 NON-VEG'}
                    </span>

                    <button 
                      onClick={(e) => handleFavoriteToggle(e, spotlightDish.id)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Heart 
                        size={16} 
                        fill={favourites.includes(spotlightDish.id) ? '#EF4444' : 'transparent'} 
                        color={favourites.includes(spotlightDish.id) ? '#EF4444' : 'white'} 
                      />
                    </button>
                  </div>

                  {/* Bottom Dish Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        background: 'rgba(245, 158, 11, 0.95)',
                        color: 'white',
                        fontWeight: 900,
                        fontSize: 10,
                        padding: '2px 7px',
                        borderRadius: 5
                      }}>
                        <Star size={10} fill="white" color="white" /> {spotlightDish.rating}
                      </span>
                      <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Timer size={12} /> {spotlightDish.time}m
                      </span>
                      <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Flame size={12} color="#FB923C" /> {spotlightDish.calories} kcal
                      </span>
                    </div>

                    <h3 style={{ color: 'white', fontSize: 19, fontWeight: 900, margin: '0 0 4px 0', lineHeight: 1.2 }}>
                      {spotlightDish.nameHindi ? `${spotlightDish.nameHindi} (${spotlightDish.name})` : spotlightDish.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ margin: 0, fontSize: 11, color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>
                        MasterChef Guided Steps & Timer
                      </p>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        color: '#FDBA74',
                        fontWeight: 800,
                        fontSize: 12
                      }}>
                        Abhi Banao <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </section>
        )}

        {/* ===== MOOD & CRAVINGS SELECTOR ===== */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: W.heading, margin: 0 }}>
              Aaj Mood Kaisa Hai? 😋
            </h2>
            <span style={{ fontSize: 11, fontWeight: 700, color: W.muted }}>
              Instant Pick
            </span>
          </div>

          <div 
            className="no-scrollbar" 
            style={{ 
              display: 'flex', 
              gap: 10, 
              overflowX: 'auto', 
              paddingBottom: 4,
              paddingTop: 2 
            }}
          >
            {MOODS.map(mood => (
              <Link href={`/search?q=${encodeURIComponent(mood.label)}`} key={mood.id} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: W.card,
                    border: `1.5px solid ${W.border}`,
                    padding: '8px 14px',
                    borderRadius: W.radiusPill,
                    boxShadow: W.shadowSm,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: 17 }}>{mood.emoji}</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: W.heading }}>{mood.label}</span>
                    <span style={{ fontSize: 9, fontWeight: 600, color: W.muted }}>{mood.sub}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== QUICK AI TOOLS (RESPONSIVE: 3 ON MOBILE, 6 ON DESKTOP) ===== */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: W.heading, margin: 0 }}>
                Smart AI Kitchen Tools
              </h2>
            </div>
            <Link href="/x-labs" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: W.primary, display: 'flex', alignItems: 'center', gap: 2 }}>
                Explore All <ArrowRight size={12} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
            {QUICK_TOOLS.map((tool, i) => (
              <Link href={tool.href} key={i} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: tool.gradient,
                    border: `1.5px solid ${tool.border}`,
                    borderRadius: 18,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    boxShadow: W.shadowSm,
                    minHeight: 96,
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: 24, marginBottom: 4 }}>{tool.emoji}</span>
                  <span style={{ 
                    fontSize: 11, 
                    fontWeight: 900, 
                    color: W.heading, 
                    lineHeight: 1.2,
                    marginBottom: 2
                  }}>
                    {tool.label}
                  </span>
                  <span style={{ 
                    fontSize: 9, 
                    fontWeight: 700, 
                    color: tool.accent,
                    lineHeight: 1.1
                  }}>
                    {tool.desc}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== FOR YOU (PERSONALIZED CAROUSEL) ===== */}
        {recommendedRecipes.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16 }}>🎯</span>
                  <h2 style={{ fontSize: 16, fontWeight: 900, color: W.heading, margin: 0 }}>
                    Khaas Aapke Liye
                  </h2>
                </div>
                <p style={{ margin: '1px 0 0 0', fontSize: 11, fontWeight: 600, color: W.muted }}>
                  Aapke taste aur preferences ke aadhar par chune gaye
                </p>
              </div>
            </div>

            <div 
              className="no-scrollbar" 
              style={{ 
                display: 'flex', 
                gap: 12, 
                overflowX: 'auto', 
                paddingBottom: 4 
              }}
            >
              {recommendedRecipes.slice(0, 8).map((recipe: any) => (
                <Link href={`/recipe/${recipe.id}`} key={`rec-${recipe.id}`} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: 150,
                      height: 185,
                      borderRadius: 18,
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0,
                      boxShadow: W.shadowSm,
                      border: `1.5px solid ${W.border}`,
                      cursor: 'pointer'
                    }}
                  >
                    <DishImage 
                      src={recipe.image} 
                      alt={recipe.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      width={300} 
                      height={300} 
                    />
                    
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(25, 14, 7, 0.92) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                      padding: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          background: recipe.isVeg ? '#166534' : '#991B1B',
                          color: 'white',
                          fontWeight: 800,
                          fontSize: 9,
                          padding: '2px 5px',
                          borderRadius: 4
                        }}>
                          {recipe.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                        
                        <div style={{
                          background: 'rgba(0,0,0,0.4)',
                          backdropFilter: 'blur(4px)',
                          borderRadius: '50%',
                          padding: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Star size={10} fill="#F59E0B" color="#F59E0B" />
                        </div>
                      </div>

                      <div>
                        <h3 style={{ color: 'white', fontWeight: 900, fontSize: 12, lineHeight: 1.25, margin: '0 0 3px 0' }}>
                          {recipe.nameHindi || recipe.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Timer size={9} /> {recipe.time}m
                          </span>
                          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Flame size={9} color="#FB923C" /> {recipe.calories}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ===== CUISINE CATEGORY SELECTOR TABS ===== */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: W.heading, margin: 0 }}>
              Cuisine & Categories 🍲
            </h2>
            <span style={{ fontSize: 11, fontWeight: 700, color: W.muted }}>
              {filteredAll.length} Dishes
            </span>
          </div>

          <div 
            className="no-scrollbar" 
            style={{ 
              display: 'flex', 
              gap: 8, 
              overflowX: 'auto', 
              paddingBottom: 4 
            }}
          >
            {CATEGORIES.map(category => {
              const isSelected = activeCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setPage(1);
                  }}
                  style={{
                    padding: '7px 14px',
                    borderRadius: W.radiusPill,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: isSelected ? W.primaryGradient : W.card,
                    color: isSelected ? 'white' : W.muted,
                    border: isSelected ? 'none' : `1.5px solid ${W.border}`,
                    fontWeight: 800,
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? W.shadowGold : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: 14 }}>{category.icon}</span>
                  <span>{category.label}</span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ===== MAIN DISHES FEED (COMPACT, ATTRACTIVE RESPONSIVE WEB GRID) ===== */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: W.heading, margin: 0 }}>
              {activeCategory === 'all' ? `Sabhi Lazeez Dishes 🚀` : `Found Recipes (${filteredAll.length})`}
            </h2>
            <span style={{ fontSize: 11, fontWeight: 600, color: W.muted }}>
              Gourmet Grid
            </span>
          </div>

          {/* ATTRACTIVE COMPACT RESPONSIVE GRID: 2 cols on mobile, 3 on tablet, 4 on small laptop, 5/6 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-3.5 md:gap-4">
            <AnimatePresence>
              {displayedDishes.map((recipe: any) => {
                const isFav = favourites.includes(recipe.id);
                return (
                  <Link href={`/recipe/${recipe.id}`} key={recipe.id} style={{ textDecoration: 'none' }}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        height: 185,
                        borderRadius: 18,
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: W.shadowSm,
                        border: `1.5px solid ${W.border}`,
                        background: W.card,
                        cursor: 'pointer'
                      }}
                    >
                      <DishImage 
                        src={recipe.image} 
                        alt={recipe.name} 
                        loading="lazy" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        width={350} 
                        height={350} 
                      />
                      
                      {/* Gradient Overlay */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(25, 14, 7, 0.94) 0%, rgba(25, 14, 7, 0.2) 50%, rgba(0,0,0,0.15) 100%)',
                        padding: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        {/* Top Chips */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{
                            background: recipe.isVeg ? '#15803D' : '#B91C1C',
                            color: 'white',
                            fontWeight: 900,
                            fontSize: 8.5,
                            padding: '2px 5px',
                            borderRadius: 4
                          }}>
                            {recipe.isVeg ? 'VEG' : 'NON-VEG'}
                          </span>

                          <button
                            onClick={(e) => handleFavoriteToggle(e, recipe.id)}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.25)',
                              backdropFilter: 'blur(8px)',
                              border: '1px solid rgba(255, 255, 255, 0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <Heart 
                              size={13} 
                              fill={isFav ? '#EF4444' : 'transparent'} 
                              color={isFav ? '#EF4444' : 'white'} 
                            />
                          </button>
                        </div>

                        {/* Bottom Text Info */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.92)',
                              padding: '1px 5px',
                              borderRadius: 5,
                              fontSize: 9.5,
                              fontWeight: 900,
                              color: W.heading,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2.5
                            }}>
                              <Star size={9} fill="#F59E0B" color="#F59E0B" /> {recipe.rating}
                            </div>
                            <span style={{ fontSize: 9.5, color: 'rgba(255, 255, 255, 0.9)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Timer size={9} /> {recipe.time}m
                            </span>
                          </div>

                          <h3 style={{ 
                            color: 'white', 
                            fontWeight: 900, 
                            fontSize: 13, 
                            lineHeight: 1.25, 
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                          }}>
                            {recipe.nameHindi || recipe.name}
                          </h3>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredAll.length === 0 && (
            <div style={{ 
              background: W.card, 
              border: `1.5px solid ${W.border}`, 
              borderRadius: W.radiusCard, 
              padding: '36px 20px', 
              textAlign: 'center',
              marginTop: 16 
            }}>
              <span style={{ fontSize: 40 }}>🍳</span>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: W.heading, marginTop: 10, marginBottom: 4 }}>
                Is category me koi dish nahi mili!
              </h3>
              <p style={{ fontSize: 12, color: W.muted, margin: '0 0 14px 0' }}>
                Filter hata kar dekhein ya search karein.
              </p>
              <button
                onClick={() => setActiveCategory('all')}
                style={{
                  background: W.primaryGradient,
                  color: 'white',
                  border: 'none',
                  borderRadius: W.radiusPill,
                  padding: '7px 18px',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Sabhi Dishes Dekhein
              </button>
            </div>
          )}

          {/* Infinite Scroll Indicator */}
          {displayedDishes.length > 0 && (
            <div 
              ref={observerRef} 
              style={{ 
                width: '100%', 
                padding: '30px 0 10px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 10 
              }}
            >
              {isGeneratingFallback ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Loader2 size={26} color={W.primary} />
                  </motion.div>
                  <p style={{ color: W.primary, fontSize: 12, fontWeight: 800 }}>
                    AI Nayi Lazeez Dishes Bana Raha Hai... 👨‍🍳
                  </p>
                </div>
              ) : displayedDishes.length < filteredAll.length ? (
                <div style={{ width: 40, height: 4, background: W.border, borderRadius: 10 }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: W.muted, fontSize: 12, fontWeight: 700 }}>
                  <span>🌟</span>
                  <span>Aapne sabhi dishes dekh li hain!</span>
                </div>
              )}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
