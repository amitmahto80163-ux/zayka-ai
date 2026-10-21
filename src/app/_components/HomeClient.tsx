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

const PAGE_SIZE = 10;

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
    // Pick highest rated or signature dish
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
      
      {/* ===== LUXURY STICKY HEADER ===== */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 249, 245, 0.92)',
          backdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${W.borderSubtle}`,
          padding: '44px 20px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <Sparkles size={14} color={W.gold} />
              <span style={{ fontSize: 13, fontWeight: 700, color: W.muted }}>
                {timeInfo.greeting}
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', color: W.heading, lineHeight: 1.1 }}>
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
                  width: 44,
                  height: 44,
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
                    width={44} 
                    height={44} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <User size={22} color={W.primary} />
                )}
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Grand Search Bar */}
        <Link href="/search" style={{ textDecoration: 'none' }}>
          <motion.div 
            whileTap={{ scale: 0.98 }}
            style={{
              background: W.card,
              border: `1.5px solid ${W.border}`,
              borderRadius: W.radiusPill,
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: W.shadowMd,
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
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: W.heading }}>
                Aaj kya khana pasand karenge?
              </p>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: W.muted }}>
                Boliye ya type karein (e.g. Butter Chicken, Dal Tadka)
              </p>
            </div>

            <div style={{ width: 1, height: 24, background: W.borderSubtle }} />
            
            <motion.div 
              whileHover={{ scale: 1.1 }}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: W.primaryGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)'
              }}
            >
              <Mic size={18} color="white" />
            </motion.div>
          </motion.div>
        </Link>
      </header>

      {/* ===== BODY CONTENT ===== */}
      <main style={{ padding: '16px 20px 100px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* ===== SPOTLIGHT FEATURED HERO (THALI OF THE DAY) ===== */}
        {spotlightDish && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 18 }}>👑</span>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: W.heading, margin: 0 }}>
                  Chef's Special Spotlight
                </h2>
              </div>
              <span style={{ 
                fontSize: 11, 
                fontWeight: 800, 
                color: W.gold, 
                background: W.goldLight, 
                padding: '4px 10px', 
                borderRadius: W.radiusPill 
              }}>
                ⭐ Aaj Ka Best
              </span>
            </div>

            <Link href={`/recipe/${spotlightDish.id}`} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  position: 'relative',
                  height: 240,
                  borderRadius: W.radiusCard,
                  overflow: 'hidden',
                  boxShadow: W.shadowLg,
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
                  height={500} 
                />
                
                {/* Cinematic Desi Gradient Overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(30, 18, 10, 0.95) 0%, rgba(30, 18, 10, 0.4) 50%, rgba(0, 0, 0, 0.1) 100%)',
                    padding: '20px',
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
                      padding: '4px 10px',
                      borderRadius: W.radiusPill,
                      letterSpacing: '0.5px'
                    }}>
                      {spotlightDish.isVeg ? '🟢 100% PURE VEG' : '🔴 NON-VEG SPECIAL'}
                    </span>

                    <button 
                      onClick={(e) => handleFavoriteToggle(e, spotlightDish.id)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Heart 
                        size={18} 
                        fill={favourites.includes(spotlightDish.id) ? '#EF4444' : 'transparent'} 
                        color={favourites.includes(spotlightDish.id) ? '#EF4444' : 'white'} 
                      />
                    </button>
                  </div>

                  {/* Bottom Dish Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        background: 'rgba(245, 158, 11, 0.95)',
                        color: 'white',
                        fontWeight: 900,
                        fontSize: 11,
                        padding: '3px 8px',
                        borderRadius: 6
                      }}>
                        <Star size={11} fill="white" color="white" /> {spotlightDish.rating}
                      </span>
                      <span style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Timer size={13} /> {spotlightDish.time} mins
                      </span>
                      <span style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Flame size={13} color="#FB923C" /> {spotlightDish.calories} kcal
                      </span>
                    </div>

                    <h3 style={{ color: 'white', fontSize: 22, fontWeight: 900, margin: '0 0 6px 0', lineHeight: 1.2 }}>
                      {spotlightDish.nameHindi ? `${spotlightDish.nameHindi} (${spotlightDish.name})` : spotlightDish.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                      <p style={{ margin: 0, fontSize: 12, color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>
                        MasterChef Special Recipe & Guided Steps
                      </p>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        color: '#FDBA74',
                        fontWeight: 800,
                        fontSize: 12
                      }}>
                        Abhi Banao <ArrowRight size={14} />
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: W.heading, margin: 0 }}>
              Aaj Mood Kaisa Hai? 😋
            </h2>
            <span style={{ fontSize: 12, fontWeight: 700, color: W.muted }}>
              Instant Recommendations
            </span>
          </div>

          <div 
            className="no-scrollbar" 
            style={{ 
              display: 'flex', 
              gap: 12, 
              overflowX: 'auto', 
              paddingBottom: 6,
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
                    gap: 10,
                    background: W.card,
                    border: `1.5px solid ${W.border}`,
                    padding: '10px 16px',
                    borderRadius: W.radiusPill,
                    boxShadow: W.shadowSm,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: 20 }}>{mood.emoji}</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: W.heading }}>{mood.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: W.muted }}>{mood.sub}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== QUICK AI TOOLS ===== */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18 }}>⚡</span>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: W.heading, margin: 0 }}>
                Smart AI Kitchen Tools
              </h2>
            </div>
            <Link href="/x-labs" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: W.primary, display: 'flex', alignItems: 'center', gap: 2 }}>
                Explore All <ArrowRight size={13} />
              </span>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {QUICK_TOOLS.map((tool, i) => (
              <Link href={tool.href} key={i} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: tool.gradient,
                    border: `1.5px solid ${tool.border}`,
                    borderRadius: 20,
                    padding: '16px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    boxShadow: W.shadowSm,
                    minHeight: 110,
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: 28, marginBottom: 6 }}>{tool.emoji}</span>
                  <span style={{ 
                    fontSize: 12, 
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 18 }}>🎯</span>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: W.heading, margin: 0 }}>
                    Khaas Aapke Liye
                  </h2>
                </div>
                <p style={{ margin: '2px 0 0 0', fontSize: 11, fontWeight: 600, color: W.muted }}>
                  Aapke taste aur preferences ke aadhar par chune gaye
                </p>
              </div>
            </div>

            <div 
              className="no-scrollbar" 
              style={{ 
                display: 'flex', 
                gap: 14, 
                overflowX: 'auto', 
                paddingBottom: 6 
              }}
            >
              {recommendedRecipes.slice(0, 6).map((recipe: any) => (
                <Link href={`/recipe/${recipe.id}`} key={`rec-${recipe.id}`} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: 170,
                      height: 210,
                      borderRadius: 20,
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0,
                      boxShadow: W.shadowMd,
                      border: `1.5px solid ${W.border}`,
                      cursor: 'pointer'
                    }}
                  >
                    <DishImage 
                      src={recipe.image} 
                      alt={recipe.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      width={400} 
                      height={400} 
                    />
                    
                    {/* Dark gradient for text readability */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(28, 16, 9, 0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                      padding: 12,
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
                          padding: '2px 6px',
                          borderRadius: 4
                        }}>
                          {recipe.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                        
                        <div style={{
                          background: 'rgba(0,0,0,0.4)',
                          backdropFilter: 'blur(4px)',
                          borderRadius: '50%',
                          padding: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Star size={10} fill="#F59E0B" color="#F59E0B" />
                        </div>
                      </div>

                      <div>
                        <h3 style={{ color: 'white', fontWeight: 900, fontSize: 13, lineHeight: 1.25, margin: '0 0 4px 0' }}>
                          {recipe.nameHindi || recipe.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Timer size={10} /> {recipe.time}m
                          </span>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Flame size={10} color="#FB923C" /> {recipe.calories} kcal
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: W.heading, margin: 0 }}>
              Cuisine & Categories 🍲
            </h2>
            <span style={{ fontSize: 12, fontWeight: 700, color: W.muted }}>
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
                    padding: '8px 16px',
                    borderRadius: W.radiusPill,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: isSelected ? W.primaryGradient : W.card,
                    color: isSelected ? 'white' : W.muted,
                    border: isSelected ? 'none' : `1.5px solid ${W.border}`,
                    fontWeight: 800,
                    fontSize: 13,
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? W.shadowGold : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: 15 }}>{category.icon}</span>
                  <span>{category.label}</span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ===== MAIN DISHES FEED (2-COLUMN LUXURY GRID) ===== */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: W.heading, margin: 0 }}>
              {activeCategory === 'all' ? `Sabhi Lazeez Dishes 🚀` : `Found Recipes (${filteredAll.length})`}
            </h2>
            <span style={{ fontSize: 12, fontWeight: 600, color: W.muted }}>
              Auto-expanding Feed
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            <AnimatePresence>
              {displayedDishes.map((recipe: any) => {
                const isFav = favourites.includes(recipe.id);
                return (
                  <Link href={`/recipe/${recipe.id}`} key={recipe.id} style={{ textDecoration: 'none' }}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        height: 230,
                        borderRadius: 22,
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: W.shadowMd,
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
                        width={400} 
                        height={400} 
                      />
                      
                      {/* Gradient Overlay */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(25, 14, 7, 0.95) 0%, rgba(25, 14, 7, 0.25) 50%, rgba(0,0,0,0.15) 100%)',
                        padding: 12,
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
                            fontSize: 9,
                            padding: '2px 6px',
                            borderRadius: 4
                          }}>
                            {recipe.isVeg ? 'VEG' : 'NON-VEG'}
                          </span>

                          <button
                            onClick={(e) => handleFavoriteToggle(e, recipe.id)}
                            style={{
                              width: 30,
                              height: 30,
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
                              size={14} 
                              fill={isFav ? '#EF4444' : 'transparent'} 
                              color={isFav ? '#EF4444' : 'white'} 
                            />
                          </button>
                        </div>

                        {/* Bottom Text Info */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.92)',
                              padding: '2px 6px',
                              borderRadius: 6,
                              fontSize: 10,
                              fontWeight: 900,
                              color: W.heading,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 3
                            }}>
                              <Star size={10} fill="#F59E0B" color="#F59E0B" /> {recipe.rating}
                            </div>
                            <span style={{ fontSize: 10, color: 'rgba(255, 255, 255, 0.9)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Timer size={10} /> {recipe.time}m
                            </span>
                          </div>

                          <h3 style={{ 
                            color: 'white', 
                            fontWeight: 900, 
                            fontSize: 14, 
                            lineHeight: 1.25, 
                            margin: 0,
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
              padding: '40px 20px', 
              textAlign: 'center',
              marginTop: 20 
            }}>
              <span style={{ fontSize: 44 }}>🍳</span>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: W.heading, marginTop: 12, marginBottom: 4 }}>
                Is category me koi dish nahi mili!
              </h3>
              <p style={{ fontSize: 13, color: W.muted, margin: '0 0 16px 0' }}>
                Filter hata kar dekhein ya search karein.
              </p>
              <button
                onClick={() => setActiveCategory('all')}
                style={{
                  background: W.primaryGradient,
                  color: 'white',
                  border: 'none',
                  borderRadius: W.radiusPill,
                  padding: '8px 20px',
                  fontWeight: 800,
                  fontSize: 13,
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
                padding: '36px 0 10px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 12 
              }}
            >
              {isGeneratingFallback ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Loader2 size={30} color={W.primary} />
                  </motion.div>
                  <p style={{ color: W.primary, fontSize: 13, fontWeight: 800 }}>
                    AI Nayi Lazeez Dishes Bana Raha Hai... 👨‍🍳
                  </p>
                </div>
              ) : displayedDishes.length < filteredAll.length ? (
                <div style={{ width: 44, height: 4, background: W.border, borderRadius: 10 }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: W.muted, fontSize: 13, fontWeight: 700 }}>
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
