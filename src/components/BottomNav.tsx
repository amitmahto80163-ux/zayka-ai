'use client';
import { Home, Search, ChefHat, Globe, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useZaykaStore } from '@/store';

const W = { primary: '#F97316', muted: '#C4A882', activeText: '#1C1009', bg: '#FFFFFF' };

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRecipe } = useZaykaStore();

  const handleCookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentRecipe) {
      router.push('/search');
    } else {
      router.push('/cook');
    }
  };

  if (pathname === '/auth' || pathname === '/onboarding' || pathname === '/cook') return null;

  const tabs = [
    { id: 'home', path: '/', icon: Home, label: 'Home' },
    { id: 'search', path: '/search', icon: Search, label: 'Search' },
    { id: 'cook', path: '/cook', icon: ChefHat, label: 'Cook', isSpecial: true },
    { id: 'world', path: '/world', icon: Globe, label: 'World' },
    { id: 'profile', path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: W.bg, borderTop: '1.5px solid #F0E6DC',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '8px 10px 24px 10px', zIndex: 50,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.03)'
    }}>
      {tabs.map(tab => {
        const isActive = pathname === tab.path;
        const Icon = tab.icon;
        
        // Special styling for Cook tab if there's an active recipe
        if (tab.isSpecial) {
          return (
            <a href="/cook" onClick={handleCookClick} key={tab.id} style={{ textDecoration: 'none' }}>
              <motion.div whileTap={{ scale: 0.9 }} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                position: 'relative', top: currentRecipe ? -15 : 0
              }}>
                <div style={{
                  width: currentRecipe ? 56 : 40, height: currentRecipe ? 56 : 40,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: currentRecipe ? 'linear-gradient(135deg, #F97316, #EA580C)' : (isActive ? '#FFF0E6' : 'transparent'),
                  color: currentRecipe ? 'white' : (isActive ? W.primary : W.muted),
                  boxShadow: currentRecipe ? '0 8px 16px rgba(249,115,22,0.3)' : 'none',
                  transition: 'all 0.3s'
                }}>
                  <Icon size={currentRecipe ? 28 : 24} />
                </div>
                {!currentRecipe && (
                  <span style={{ fontSize: 11, fontWeight: isActive ? 800 : 600, color: isActive ? W.activeText : W.muted }}>
                    {tab.label}
                  </span>
                )}
                {currentRecipe && <div style={{ width: 4, height: 4, borderRadius: '50%', background: W.primary, marginTop: 4 }} />}
              </motion.div>
            </a>
          );
        }

        return (
          <Link href={tab.path} key={tab.id} style={{ textDecoration: 'none' }}>
            <motion.div whileTap={{ scale: 0.9 }} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              width: 50
            }}>
              <Icon size={24} color={isActive ? W.primary : W.muted} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ fontSize: 11, fontWeight: isActive ? 800 : 600, color: isActive ? W.activeText : W.muted }}>
                {tab.label}
              </span>
              {/* Active Dot indicator */}
              {isActive && (
                <motion.div layoutId="navDot" style={{
                  width: 4, height: 4, borderRadius: '50%', background: W.primary, position: 'absolute', bottom: -8
                }} />
              )}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
