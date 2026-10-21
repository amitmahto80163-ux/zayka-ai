'use client';

import { Home, Search, ChefHat, Globe, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useZaykaStore } from '@/store';
import { W } from '@/lib/theme';

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

  const isMainTab = ['/', '/search', '/world', '/profile'].includes(pathname);
  if (!isMainTab) return null;

  const tabs = [
    { id: 'home', path: '/', icon: Home, label: 'Home' },
    { id: 'search', path: '/search', icon: Search, label: 'Search' },
    { id: 'cook', path: '/cook', icon: ChefHat, label: 'Cook', isSpecial: true },
    { id: 'world', path: '/world', icon: Globe, label: 'World' },
    { id: 'profile', path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 249, 245, 0.94)',
        backdropFilter: 'blur(24px)',
        borderTop: `1px solid ${W.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px 14px 24px 14px',
        zIndex: 50,
        boxShadow: '0 -4px 24px rgba(154, 52, 18, 0.06)'
      }}
    >
      {tabs.map(tab => {
        const isActive = pathname === tab.path;
        const Icon = tab.icon;
        
        // Special styling for Cook tab
        if (tab.isSpecial) {
          return (
            <a 
              href="/cook" 
              onClick={handleCookClick} 
              key={tab.id} 
              style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', width: 64 }}
            >
              <motion.div 
                whileTap={{ scale: 0.92 }} 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: currentRecipe ? 'absolute' : 'relative',
                  top: currentRecipe ? -24 : 0
                }}
              >
                <div 
                  style={{
                    width: currentRecipe ? 56 : 42,
                    height: currentRecipe ? 56 : 42,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: currentRecipe 
                      ? W.primaryGradient 
                      : (isActive ? 'linear-gradient(135deg, #FFF1E8 0%, #FED7AA 100%)' : 'transparent'),
                    color: currentRecipe ? 'white' : (isActive ? W.primary : W.muted),
                    boxShadow: currentRecipe ? W.shadowGold : 'none',
                    border: currentRecipe ? `3px solid ${W.bg}` : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Icon size={currentRecipe ? 26 : 22} strokeWidth={2.2} />
                </div>
                {!currentRecipe && (
                  <span style={{ 
                    fontSize: 11, 
                    fontWeight: isActive ? 800 : 600, 
                    color: isActive ? W.heading : W.muted, 
                    marginTop: 3 
                  }}>
                    {tab.label}
                  </span>
                )}
                {currentRecipe && (
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: W.primary, marginTop: 6 }} />
                )}
              </motion.div>
            </a>
          );
        }

        return (
          <Link href={tab.path} key={tab.id} style={{ textDecoration: 'none' }}>
            <motion.div 
              whileTap={{ scale: 0.92 }} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                width: 52,
                position: 'relative'
              }}
            >
              <Icon 
                size={22} 
                color={isActive ? W.primary : W.muted} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span style={{ 
                fontSize: 11, 
                fontWeight: isActive ? 800 : 600, 
                color: isActive ? W.heading : W.muted 
              }}>
                {tab.label}
              </span>
              
              {/* Active Golden Saffron Dot */}
              {isActive && (
                <motion.div 
                  layoutId="activeNavDot" 
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: W.primary,
                    position: 'absolute',
                    bottom: -8
                  }} 
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
