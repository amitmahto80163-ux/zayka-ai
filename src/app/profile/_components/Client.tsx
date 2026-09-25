import Image from 'next/image';
'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Flame, Trophy, Heart, Star, Medal } from 'lucide-react';
import { useZaykaStore } from '@/store';
import { W } from '@/lib/theme';

const BADGES = [
  { emoji: '🔥', label: 'First Step', sub: 'Unlocked', color: '#FFF7ED', border: '#FED7AA' },
  { emoji: '⭐', label: 'Recipe Star', sub: '5 recipes', color: '#FFFBEB', border: '#FDE68A' },
  { emoji: '🌍', label: 'World Tour', sub: 'Visit World Kitchen', color: '#EFF6FF', border: '#BFDBFE' },
  { emoji: '🧪', label: 'Lab Rat', sub: 'Try X-Labs', color: '#F5F3FF', border: '#DDD6FE' },
  { emoji: '🔥', label: 'Food Critic', sub: 'Rate a dish', color: '#FDF2F8', border: '#F9A8D4' },
  { emoji: '🏆', label: 'Champion', sub: '30-day streak', color: '#F0FDF4', border: '#BBF7D0' },
];

const MENU_ITEMS = [
  { icon: '📖', label: 'Family Recipe Vault', desc: 'Maa-Nani ki purani recipes', href: '/family' },
  { icon: '⚙️', label: 'Settings & Preferences', desc: 'Language, diet, skill level', href: '/onboarding' },
  { icon: '🥗', label: 'Diet Plan', desc: 'Personalized meal planner', href: '/diet' },
  { icon: '🏆', label: 'Challenges', desc: 'Weekly cooking challenges', href: '/challenge' },
  { icon: '🌍', label: 'World Kitchen', desc: 'Explore global cuisines', href: '/world' },
  { icon: '🧪', label: 'X-Labs', desc: 'Experimental AI features', href: '/x-labs' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, memory, currentStreak } = useZaykaStore();
  

  const weeklyProgress = memory ? (memory.weeklyCompleted / memory.weeklyGoal) * 100 : 0;
  const totalCooked = memory ? memory.cookingHistory.length : 0;

  const badgeUnlocked = [
    true,                                          // First Step
    totalCooked >= 5,                              // Recipe Star
    memory?.cookingHistory.some(h => ['world', 'italian', 'chinese'].some(c => h.recipeId.includes(c))),  // World Tour
    typeof window !== 'undefined' && window.location.href.includes('x-labs'),  // Lab Rat
    memory?.cookingHistory.some(h => h.rating !== null && h.rating > 0),  // Food Critic
    currentStreak >= 30,                           // Champion
  ];

  return (
    <div style={{ minHeight: '100vh', background: W.bg, paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,248,243,0.92)', backdropFilter: 'blur(20px)', padding: '48px 16px 16px', borderBottom: `1px solid ${W.border}`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 18, height: 18, color: W.heading }} />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: W.heading }}>Mera Profile ✨</h1>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Profile Hero Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg, #F97316, #FB923C, #FBBF24)', borderRadius: 28, padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ position: 'absolute', bottom: -30, right: 30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              {user?.photoUrl ? <Image src={user.photoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} width={400} height={400} /> : '👨‍🍳'}
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>{user?.name || 'Zayka Dost'}</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600, marginTop: 2 }}>
                {memory?.isVegetarian ? '🟢 Vegetarian' : '🔴 Non-Veg'} • {memory?.skillLevel || 'Beginner'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 50, padding: '4px 10px', width: 'fit-content' }}>
                <Flame style={{ width: 14, height: 14, color: 'white' }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>{currentStreak || 0} din streak!</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Phase 3: Weekly Goal Progress */}
        {memory && (
          <div style={{ background: W.card, borderRadius: 20, padding: '20px', border: `1px solid ${W.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontWeight: 800, color: W.heading, fontSize: 16 }}>This Week's Goal</h3>
              <span style={{ fontWeight: 700, color: W.saffron }}>{memory.weeklyCompleted}/{memory.weeklyGoal} meals</span>
            </div>
            <div style={{ background: W.border, borderRadius: 100, height: 10, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(weeklyProgress, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', background: W.saffron, borderRadius: 100 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>🔥 {currentStreak} day streak</span>
              {weeklyProgress >= 100 && <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 700 }}>✅ Goal Achieved!</span>}
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { icon: <Trophy style={{ width: 20, height: 20, color: '#FBBF24' }} />, val: currentStreak || 0, label: 'Day Streak', bg: '#FFFBEB', border: '#FDE68A' },
            { icon: <Heart style={{ width: 20, height: 20, color: '#F97316' }} />, val: totalCooked, label: 'Dishes Made', bg: '#FFF7ED', border: '#FED7AA' },
            { icon: <Star style={{ width: 20, height: 20, color: '#8B5CF6' }} />, val: badgeUnlocked.filter(Boolean).length, label: 'Badges', bg: '#F5F3FF', border: '#DDD6FE' },
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 20, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              {s.icon}
              <span style={{ fontSize: 22, fontWeight: 900, color: W.heading }}>{s.val}</span>
              <span style={{ fontSize: 9, fontWeight: 800, color: W.muted,   textAlign: 'center', lineHeight: 1.2 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: W.heading, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Medal style={{ width: 18, height: 18, color: '#FBBF24' }} /> Aapke Badges
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {BADGES.map((b, i) => {
              const unlocked = badgeUnlocked[i];
              return (
                <div key={i} style={{ background: b.color, border: `1.5px solid ${b.border}`, borderRadius: 18, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: unlocked ? 1 : 0.4 }}>
                  <span style={{ fontSize: 28 }}>{b.emoji}</span>
                  <span style={{ fontSize: 10, fontWeight: 900, color: W.heading, textAlign: 'center', lineHeight: 1.2 }}>{b.label}</span>
                  <span style={{ fontSize: 9, color: unlocked ? '#10B981' : W.muted, fontWeight: 800 }}>{unlocked ? '✅ ' + b.sub : '🔒 Locked'}</span>
                </div>
              );
            })}
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
        <button 
          onClick={async () => {
            try {
              const { auth } = await import('@/lib/firebase');
              const { signOut } = await import('firebase/auth');
              await signOut(auth);
            } catch (err) {
              console.error(err);
            }
            useZaykaStore.getState().setUser(null);
            router.push('/auth');
          }}
          style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 18, padding: '14px', color: '#DC2626', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer', width: '100%' }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
