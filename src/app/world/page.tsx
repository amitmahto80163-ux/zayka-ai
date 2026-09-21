'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Globe2 } from 'lucide-react';
import { useZaykaStore } from '@/store';
import toast from 'react-hot-toast';

// ============================================================
// DATA WITH PHASE B UPDATES
// ============================================================
const WORLD_CUISINES = [
  {
    id: 'india', name: 'India', emoji: '🇮🇳', gradient: 'linear-gradient(135deg, #FF9933, #FFFFFF, #138808)',
    funFact: "India has over 7,500 unique recipes documented — more than any other country!",
    dishes: [
      { name: 'Butter Chicken', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=300&q=80', funFact: 'Invented in the 1950s in Delhi by accident!', desiAlt: 'You are in India! Enjoy the original desi masterpiece.' },
      { name: 'Dal Makhani', type: 'Veg', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80', funFact: 'Traditionally slow-cooked over coal overnight for 12 hours.', desiAlt: 'Skip the overnight wait, use a pressure cooker with extra cream!' },
      { name: 'Biryani', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80', funFact: 'There are over 30 distinct types of Biryani in India.', desiAlt: 'Quick veg pulav in pressure cooker if you are short on time.' },
      { name: 'Paneer Tikka', type: 'Veg', img: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=300&q=80', funFact: 'The perfect tandoor temperature for Tikka is around 400°C.', desiAlt: 'Make it on a regular tawa using a little ghee and besan coating.' },
    ]
  },
  {
    id: 'italy', name: 'Italy', emoji: '🇮🇹', gradient: 'linear-gradient(135deg, #009246, #FFFFFF, #CE2B37)',
    funFact: "Italians eat an average of 23kg of pasta per person every year!",
    dishes: [
      { name: 'Margherita Pizza', type: 'Veg', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80', funFact: 'Named after Queen Margherita in 1889, representing the colors of the Italian flag.', desiAlt: 'Tawa Pizza using a thick paratha base and Amul cheese!' },
      { name: 'Pasta Arrabbiata', type: 'Veg', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=300&q=80', funFact: 'Arrabbiata literally means "angry" in Italian due to the spicy chili!', desiAlt: 'Macaroni cooked in a spicy tomato and garlic tadka.' },
      { name: 'Risotto', type: 'Veg', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=300&q=80', funFact: 'Risotto must be stirred constantly to release starch for creaminess.', desiAlt: 'Creamy garlic cheese Khichdi made with everyday short-grain rice.' },
      { name: 'Tiramisu', type: 'Veg', img: 'https://images.unsplash.com/photo-1484723091791-cdd515f0d2d2?auto=format&fit=crop&w=300&q=80', funFact: 'Tiramisu translates to "pick me up" because of the coffee and cocoa.', desiAlt: 'Coffee-dipped Parle-G layered with sweet malai!' },
    ]
  },
  {
    id: 'japan', name: 'Japan', emoji: '🇯🇵', gradient: 'linear-gradient(135deg, #FFFFFF, #BC002D)',
    funFact: "Japan has the most 3-Michelin-star restaurants in the world!",
    dishes: [
      { name: 'Sushi', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80', funFact: 'Sushi originally meant sour rice, and the fish was discarded!', desiAlt: 'Veggie Sushi Roll: Spinach paratha wrapped around sticky jeera rice.' },
      { name: 'Ramen', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=300&q=80', funFact: 'Ramen noodles are actually of Chinese origin.', desiAlt: 'Maggi upgraded with boiled egg, soy sauce, and burnt garlic.' },
      { name: 'Tempura', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80', funFact: 'Tempura was introduced to Japan by Portuguese missionaries.', desiAlt: 'Crispy Veg Pakoras with a lighter, ice-cold besan batter.' },
      { name: 'Miso Soup', type: 'Vegan', img: 'https://images.unsplash.com/photo-1484723091791-cdd515f0d2d2?auto=format&fit=crop&w=300&q=80', funFact: 'Over 75% of Japanese people consume miso soup at least once a day.', desiAlt: 'Clear Dal Ka Pani infused with garlic and spring onions.' },
    ]
  },
  {
    id: 'mexico', name: 'Mexico', emoji: '🇲🇽', gradient: 'linear-gradient(135deg, #006847, #FFFFFF, #CE1126)',
    funFact: "Tomatoes, avocados, and chocolate all originated in Mexico!",
    dishes: [
      { name: 'Tacos al Pastor', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80', funFact: 'Tacos were inspired by Lebanese shawarma brought to Mexico.', desiAlt: 'Crispy Roti folded with spicy Rajma filling and green chutney.' },
      { name: 'Guacamole', type: 'Vegan', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80', funFact: 'Aztecs invented guacamole; the name means "avocado sauce".', desiAlt: 'Spiced Avocado mash with raw onions, green chilies, and lime (Avo-Chutney).' },
      { name: 'Enchiladas', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80', funFact: 'Enchilada means "to decorate with chili".', desiAlt: 'Leftover rotis rolled with paneer, baked in spicy tomato puree.' },
      { name: 'Churros', type: 'Veg', img: 'https://images.unsplash.com/photo-1484723091791-cdd515f0d2d2?auto=format&fit=crop&w=300&q=80', funFact: 'Churros were actually invented by Spanish shepherds!', desiAlt: 'Crispy long jalebis coated in cinnamon and sugar instead of syrup.' },
    ]
  }
];

export default function WorldCuisinePage() {
  const router = useRouter();
  const [active, setActive] = useState(WORLD_CUISINES[0]);
  
  // Phase B3: Diet Filter Bar State
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg' | 'vegan'>('all');
  
  // Phase B1: Selected Dish Bottom Sheet State
  const [selectedDish, setSelectedDish] = useState<any>(null);

  const typeColor = (type: string) => {
    if (type === 'Veg' || type === 'Vegan') return { bg: '#ECFDF5', text: '#059669' };
    if (type === 'Non-Veg') return { bg: '#FEF2F2', text: '#DC2626' };
    return { bg: '#FFFBEB', text: '#D97706' };
  };

  const filteredDishes = active.dishes.filter(d => {
    if (dietFilter === 'all') return true;
    if (dietFilter === 'veg') return d.type === 'Veg';
    if (dietFilter === 'nonveg') return d.type === 'Non-Veg';
    if (dietFilter === 'vegan') return d.type === 'Vegan';
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFF8F3', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        background: 'rgba(255,248,243,0.92)', backdropFilter: 'blur(20px)',
        padding: '48px 16px 16px',
        borderBottom: '1px solid #F0E6DC',
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={() => router.back()} style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'white', border: '1.5px solid #F0E6DC',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(249,115,22,0.08)',
        }}>
          <ArrowLeft style={{ width: 18, height: 18, color: '#3D2B1F' }} />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe2 style={{ width: 20, height: 20, color: '#F97316' }} />
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#1C1009' }}>World Kitchen</h1>
          </div>
          <p style={{ fontSize: 12, color: '#92745A', fontWeight: 600 }}>Ghar baithe duniya ka swaad 🌎</p>
        </div>
      </div>

      <div style={{ padding: '20px 16px 0' }}>

        {/* Country Selector */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 16 }}>
          {WORLD_CUISINES.map(c => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              style={{
                flexShrink: 0, minWidth: 80, padding: '10px 8px', borderRadius: 18,
                border: active.id === c.id ? '2px solid #F97316' : '1.5px solid #F0E6DC',
                background: active.id === c.id ? '#FFEDD5' : 'white', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                transform: active.id === c.id ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease',
                boxShadow: active.id === c.id ? '0 4px 16px rgba(249,115,22,0.2)' : 'none',
              }}
            >
              <span style={{ fontSize: 28 }}>{c.emoji}</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: active.id === c.id ? '#F97316' : '#92745A' }}>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Phase B3: Diet Filter Bar */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20 }}>
          {[
            { id: 'all', label: 'All', emoji: '🍽️' },
            { id: 'veg', label: 'Veg', emoji: '🥗' },
            { id: 'vegan', label: 'Vegan', emoji: '🌱' },
            { id: 'nonveg', label: 'Non-Veg', emoji: '🥩' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setDietFilter(f.id as any)}
              style={{
                background: dietFilter === f.id ? '#1C1009' : 'white',
                color: dietFilter === f.id ? 'white' : '#92745A',
                border: `1.5px solid ${dietFilter === f.id ? '#1C1009' : '#F0E6DC'}`,
                padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 800,
                display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span>{f.emoji}</span> {f.label}
            </button>
          ))}
        </div>

        {/* Active Country Banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {/* Banner */}
            <div style={{
              borderRadius: 24, padding: '20px 20px', marginBottom: 12,
              background: 'white', border: '1.5px solid #F0E6DC',
              boxShadow: '0 4px 20px rgba(249,115,22,0.08)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: active.gradient, opacity: 0.9 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <span style={{ fontSize: 48 }}>{active.emoji}</span>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1009' }}>
                    Authentic {active.name}
                  </h2>
                  <p style={{ fontSize: 12, color: '#92745A', fontWeight: 600, marginTop: 2 }}>
                    Top dishes from {active.name} 🔥
                  </p>
                </div>
              </div>
            </div>

            {/* Phase B2: Country Fun Fact */}
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 16, padding: '12px 16px', marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: '#78350F', fontWeight: 700 }}>💡 <b>Did you know?</b> {active.funFact}</p>
            </div>

            {/* Dish Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredDishes.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#92745A', fontWeight: 600 }}>
                  No {dietFilter} dishes available for {active.name}.
                </div>
              ) : (
                filteredDishes.map((dish, i) => {
                  const tc = typeColor(dish.type);
                  return (
                    <motion.div
                      key={dish.name}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      onClick={() => setSelectedDish(dish)}
                      style={{
                        background: 'white', border: '1.5px solid #F0E6DC', borderRadius: 20, padding: 12,
                        display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                        boxShadow: '0 2px 12px rgba(249,115,22,0.06)', transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ width: 80, height: 80, borderRadius: 16, overflow: 'hidden', flexShrink: 0, border: '1.5px solid #F0E6DC' }}>
                        <img src={dish.img} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 50, background: tc.bg, color: tc.text, display: 'inline-block', marginBottom: 6 }}>
                          {dish.type}
                        </span>
                        <h4 style={{ fontSize: 15, fontWeight: 900, color: '#1C1009', lineHeight: 1.2 }}>
                          {dish.name}
                        </h4>
                        <p style={{ fontSize: 11, color: '#C4A882', fontWeight: 600, marginTop: 4 }}>
                          Tap to view detail 👉
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Phase B1: Dish Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedDish(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFF8F3', borderRadius: '24px 24px 0 0', padding: '0 0 48px' }}>
              
              {/* Dish Image in Bottom Sheet */}
              <div style={{ height: 240, position: 'relative' }}>
                <img src={selectedDish.img} alt={selectedDish.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px 24px 0 0' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,16,9,0.9) 0%, transparent 60%)', borderRadius: '24px 24px 0 0' }} />
                <div style={{ position: 'absolute', bottom: 16, left: 20 }}>
                  <h2 style={{ color: 'white', fontSize: 28, fontWeight: 900 }}>{selectedDish.name}</h2>
                  <span style={{ background: selectedDish.type === 'Veg' || selectedDish.type === 'Vegan' ? '#22C55E' : '#EF4444', color: 'white', padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 800 }}>{selectedDish.type}</span>
                </div>
              </div>
              
              {/* Content */}
              <div style={{ padding: '20px 20px 0' }}>
                {/* Fun Fact */}
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 16, padding: '12px 16px', marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: '#92400E', fontWeight: 600 }}>💡 <b>Did you know?</b> {selectedDish.funFact}</p>
                </div>
                
                {/* Desi Alt */}
                <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 16, padding: '12px 16px', marginBottom: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: '#BE123C', marginBottom: 4 }}>🇮🇳 Zayka AI Desi Jugaad:</p>
                  <p style={{ fontSize: 13, color: '#9F1239', fontWeight: 600 }}>{selectedDish.desiAlt}</p>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button onClick={() => router.push(`/recipe/${selectedDish.name.toLowerCase().replace(/ /g, '-')}`)}
                    style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', color: 'white', border: 'none', padding: '18px', borderRadius: 100, fontSize: 16, fontWeight: 900, cursor: 'pointer' }}>
                    🌍 View Full Recipe
                  </button>
                  <button onClick={() => { 
                      toast.success('Loading Desi version! 🇮🇳'); 
                      router.push(`/recipe/${selectedDish.name.toLowerCase().replace(/ /g, '-')}?version=desi`); 
                    }}
                    style={{ background: 'white', border: '1.5px solid #F0E6DC', color: '#1C1009', padding: '16px', borderRadius: 100, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
                    🇮🇳 Try Desi Jugaad Instead
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
