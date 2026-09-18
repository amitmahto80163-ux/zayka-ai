'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Globe2 } from 'lucide-react';
import { useZaykaStore } from '@/store';
import toast from 'react-hot-toast';

// ============================================================
// DATA
// ============================================================
const WORLD_CUISINES = [
  {
    id: 'india', name: 'India', emoji: '🇮🇳', gradient: 'linear-gradient(135deg, #FF9933, #FFFFFF, #138808)',
    dishes: [
      { name: 'Butter Chicken', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=300&q=80' },
      { name: 'Dal Makhani', type: 'Veg', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Biryani', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80' },
      { name: 'Paneer Tikka', type: 'Veg', img: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  {
    id: 'italy', name: 'Italy', emoji: '🇮🇹', gradient: 'linear-gradient(135deg, #009246, #FFFFFF, #CE2B37)',
    dishes: [
      { name: 'Margherita Pizza', type: 'Veg', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80' },
      { name: 'Pasta Arrabbiata', type: 'Veg', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=300&q=80' },
      { name: 'Risotto', type: 'Veg', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=300&q=80' },
      { name: 'Tiramisu', type: 'Veg', img: 'https://images.unsplash.com/photo-1484723091791-cdd515f0d2d2?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  {
    id: 'china', name: 'China', emoji: '🇨🇳', gradient: 'linear-gradient(135deg, #DE2910, #FFDE00)',
    dishes: [
      { name: 'Kung Pao Chicken', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80' },
      { name: 'Dim Sum', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=300&q=80' },
      { name: 'Peking Duck', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Mapo Tofu', type: 'Veg', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  {
    id: 'japan', name: 'Japan', emoji: '🇯🇵', gradient: 'linear-gradient(135deg, #FFFFFF, #BC002D)',
    dishes: [
      { name: 'Sushi', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80' },
      { name: 'Ramen', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=300&q=80' },
      { name: 'Tempura', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80' },
      { name: 'Miso Soup', type: 'Veg', img: 'https://images.unsplash.com/photo-1484723091791-cdd515f0d2d2?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  {
    id: 'mexico', name: 'Mexico', emoji: '🇲🇽', gradient: 'linear-gradient(135deg, #006847, #FFFFFF, #CE1126)',
    dishes: [
      { name: 'Tacos al Pastor', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80' },
      { name: 'Guacamole', type: 'Vegan', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80' },
      { name: 'Enchiladas', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Churros', type: 'Veg', img: 'https://images.unsplash.com/photo-1484723091791-cdd515f0d2d2?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  {
    id: 'france', name: 'France', emoji: '🇫🇷', gradient: 'linear-gradient(135deg, #002395, #FFFFFF, #ED2939)',
    dishes: [
      { name: 'Croissant', type: 'Veg', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=300&q=80' },
      { name: 'Coq au Vin', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80' },
      { name: 'Crème Brûlée', type: 'Veg', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=300&q=80' },
      { name: 'French Onion Soup', type: 'Veg', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  {
    id: 'thailand', name: 'Thailand', emoji: '🇹🇭', gradient: 'linear-gradient(135deg, #A51931, #F4F5F8, #2D2A4A)',
    dishes: [
      { name: 'Pad Thai', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=300&q=80' },
      { name: 'Green Curry', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=300&q=80' },
      { name: 'Tom Yum Soup', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1484723091791-cdd515f0d2d2?auto=format&fit=crop&w=300&q=80' },
      { name: 'Mango Sticky Rice', type: 'Vegan', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  {
    id: 'usa', name: 'USA', emoji: '🇺🇸', gradient: 'linear-gradient(135deg, #B22234, #FFFFFF, #3C3B6E)',
    dishes: [
      { name: 'BBQ Ribs', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80' },
      { name: 'Mac & Cheese', type: 'Veg', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=300&q=80' },
      { name: 'Clam Chowder', type: 'Non-Veg', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80' },
      { name: 'NY Cheesecake', type: 'Veg', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80' },
    ]
  },
];

// ============================================================
// COMPONENT
// ============================================================
export default function WorldCuisinePage() {
  const router = useRouter();
  const { setSearchQuery } = useZaykaStore();
  const [active, setActive] = useState(WORLD_CUISINES[0]);

  const handleCook = (name: string) => {
    toast.success(`${name} ki recipe dhoondh raha hai! 🔍`);
    router.push(`/search?q=${encodeURIComponent(name)}`);
  };

  const typeColor = (type: string) => {
    if (type === 'Veg' || type === 'Vegan') return { bg: '#ECFDF5', text: '#059669' };
    if (type === 'Non-Veg') return { bg: '#FEF2F2', text: '#DC2626' };
    return { bg: '#FFFBEB', text: '#D97706' };
  };

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
          <p style={{ fontSize: 12, color: '#92745A', fontWeight: 600 }}>Ghar baithe duniya ka swaad 🌍</p>
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
                flexShrink: 0,
                minWidth: 80,
                padding: '10px 8px',
                borderRadius: 18,
                border: active.id === c.id ? '2px solid #F97316' : '1.5px solid #F0E6DC',
                background: active.id === c.id ? '#FFEDD5' : 'white',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                transform: active.id === c.id ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease',
                boxShadow: active.id === c.id ? '0 4px 16px rgba(249,115,22,0.2)' : 'none',
              }}
            >
              <span style={{ fontSize: 28 }}>{c.emoji}</span>
              <span style={{
                fontSize: 10, fontWeight: 800,
                color: active.id === c.id ? '#F97316' : '#92745A',
              }}>{c.name}</span>
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
              borderRadius: 24, padding: '20px 20px', marginBottom: 16,
              background: 'white', border: '1.5px solid #F0E6DC',
              boxShadow: '0 4px 20px rgba(249,115,22,0.08)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Flag gradient strip */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                background: active.gradient, opacity: 0.9,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <span style={{ fontSize: 48 }}>{active.emoji}</span>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1009' }}>
                    Authentic {active.name}
                  </h2>
                  <p style={{ fontSize: 12, color: '#92745A', fontWeight: 600, marginTop: 2 }}>
                    Top dishes from {active.name} 🍽️
                  </p>
                </div>
              </div>
            </div>

            {/* Dish Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {active.dishes.map((dish, i) => {
                const tc = typeColor(dish.type);
                return (
                  <motion.div
                    key={dish.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => handleCook(dish.name)}
                    style={{
                      background: 'white',
                      border: '1.5px solid #F0E6DC',
                      borderRadius: 20, padding: 12,
                      display: 'flex', alignItems: 'center', gap: 14,
                      cursor: 'pointer',
                      boxShadow: '0 2px 12px rgba(249,115,22,0.06)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Image */}
                    <div style={{
                      width: 80, height: 80, borderRadius: 16,
                      overflow: 'hidden', flexShrink: 0,
                      border: '1.5px solid #F0E6DC',
                    }}>
                      <img
                        src={dish.img} alt={dish.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
                        letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 50,
                        background: tc.bg, color: tc.text,
                        display: 'inline-block', marginBottom: 6,
                      }}>
                        {dish.type}
                      </span>
                      <h4 style={{ fontSize: 15, fontWeight: 900, color: '#1C1009', lineHeight: 1.2 }}>
                        {dish.name}
                      </h4>
                      <p style={{ fontSize: 11, color: '#C4A882', fontWeight: 600, marginTop: 4 }}>
                        Tap to get recipe →
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
