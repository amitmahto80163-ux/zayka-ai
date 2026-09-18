'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Heart, Medal, Settings, ChefHat, Flame, Star } from 'lucide-react';
import { useZaykaStore } from '@/store';

const BADGES = [
  { emoji: '🔥', label: 'First Step', sub: 'Unlocked', color: '#FFF7ED', border: '#FED7AA' },
  { emoji: '⭐', label: 'Recipe Star', sub: '5 recipes', color: '#FFFBEB', border: '#FDE68A' },
  { emoji: '🌍', label: 'World Tour', sub: 'Visit World Kitchen', color: '#EFF6FF', border: '#BFDBFE' },
  { emoji: '🧪', label: 'Lab Rat', sub: 'Try X-Labs', color: '#F5F3FF', border: '#DDD6FE' },
  { emoji: '📸', label: 'Food Critic', sub: 'Rate a dish', color: '#FDF2F8', border: '#F9A8D4' },
  { emoji: '🏆', label: 'Champion', sub: '30-day streak', color: '#F0FDF4', border: '#BBF7D0' },
];

const MENU_ITEMS = [
  { icon: '⚙️', label: 'Settings & Preferences', desc: 'Language, diet, skill level', href: '/onboarding' },
  { icon: '🏋️', label: 'Diet Plan', desc: 'Personalized meal planner', href: '/diet' },
  { icon: '🏆', label: 'Challenges', desc: 'Weekly cooking challenges', href: '/challenge' },
  { icon: '🌍', label: 'World Kitchen', desc: 'Explore global cuisines', href: '/world' },
  { icon: '🧪', label: 'X-Labs', desc: 'Experimental AI features', href: '/x-labs' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useZaykaStore();
  const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

  return (
    <div style={{ minHeight: '100vh', background: W.bg, paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,248,243,0.92)', backdropFilter: 'blur(20px)', padding: '48px 16px 16px', borderBottom: `1px solid ${W.border}`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 18, height: 18, color: W.heading }} />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: W.heading }}>Mera Profile 👤</h1>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Profile Hero Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg, #F97316, #FB923C, #FBBF24)', borderRadius: 28, padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ position: 'absolute', bottom: -30, right: 30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              {user?.photoUrl ? <img src={user.photoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>{user?.name || 'Zayka Dost'}</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600, marginTop: 2 }}>
                {user?.preferences?.isVegetarian ? '🥗 Vegetarian' : '🍗 Non-Veg'} • {user?.preferences?.skillLevel || 'Beginner'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 50, padding: '4px 10px', width: 'fit-content' }}>
                <Flame style={{ width: 14, height: 14, color: 'white' }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>{user?.stats?.currentStreak || 0} din streak!</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { icon: <Trophy style={{ width: 20, height: 20, color: '#FBBF24' }} />, val: user?.stats?.currentStreak || 0, label: 'Day Streak', bg: '#FFFBEB', border: '#FDE68A' },
            { icon: <Heart style={{ width: 20, height: 20, color: '#F97316' }} />, val: user?.stats?.totalRecipesMade || 0, label: 'Dishes Made', bg: '#FFF7ED', border: '#FED7AA' },
            { icon: <Star style={{ width: 20, height: 20, color: '#8B5CF6' }} />, val: '3', label: 'Badges', bg: '#F5F3FF', border: '#DDD6FE' },
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 20, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              {s.icon}
              <span style={{ fontSize: 22, fontWeight: 900, color: W.heading }}>{s.val}</span>
              <span style={{ fontSize: 9, fontWeight: 800, color: W.muted, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', lineHeight: 1.2 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: W.heading, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Medal style={{ width: 18, height: 18, color: '#FBBF24' }} /> Aapke Badges
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {BADGES.map((b, i) => (
              <div key={i} style={{ background: b.color, border: `1.5px solid ${b.border}`, borderRadius: 18, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: i < 3 ? 1 : 0.4 }}>
                <span style={{ fontSize: 28 }}>{b.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 900, color: W.heading, textAlign: 'center', lineHeight: 1.2 }}>{b.label}</span>
                <span style={{ fontSize: 9, color: i < 3 ? '#10B981' : W.muted, fontWeight: 800 }}>{i < 3 ? '✓ ' + b.sub : '🔒 Locked'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: W.heading, marginBottom: 12 }}>More Options ⚙️</h3>
          <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, overflow: 'hidden' }}>
            {MENU_ITEMS.map((item, i) => (
              <div key={i} onClick={() => router.push(item.href)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < MENU_ITEMS.length - 1 ? `1px solid ${W.border}` : 'none', cursor: 'pointer' }}>
                <span style={{ fontSize: 24, width: 36, textAlign: 'center' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: W.heading }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: W.muted, fontWeight: 600, marginTop: 2 }}>{item.desc}</p>
                </div>
                <span style={{ color: '#C4A882', fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <button style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 18, padding: '14px', color: '#DC2626', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer', width: '100%' }}>
          🚪 Sign Out
        </button>

      </div>
    </div>
  );
}
