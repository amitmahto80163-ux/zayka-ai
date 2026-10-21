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
      className="fixed bottom-0 md:bottom-6 left-0 md:left-1/2 md:-translate-x-1/2 right-0 md:right-auto md:w-[440px] md:rounded-full md:border md:shadow-2xl z-50 flex justify-around items-center px-3.5 py-2 pb-6 md:pb-2 transition-all duration-300"
      style={{
        background: 'rgba(255, 249, 245, 0.94)',
        backdropFilter: 'blur(24px)',
        borderColor: W.border,
        boxShadow: '0 -4px 24px rgba(154, 52, 18, 0.08)'
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
              style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', width: 60 }}
            >
              <motion.div 
                whileTap={{ scale: 0.92 }} 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: currentRecipe ? 'absolute' : 'relative',
                  top: currentRecipe ? -22 : 0
                }}
              >
                <div 
                  style={{
                    width: currentRecipe ? 52 : 38,
                    height: currentRecipe ? 52 : 38,
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
                  <Icon size={currentRecipe ? 24 : 20} strokeWidth={2.2} />
                </div>
                {!currentRecipe && (
                  <span style={{ 
                    fontSize: 10.5, 
                    fontWeight: isActive ? 800 : 600, 
                    color: isActive ? W.heading : W.muted, 
                    marginTop: 2 
                  }}>
                    {tab.label}
                  </span>
                )}
                {currentRecipe && (
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: W.primary, marginTop: 4 }} />
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
                gap: 2,
                width: 48,
                position: 'relative'
              }}
            >
              <Icon 
                size={20} 
                color={isActive ? W.primary : W.muted} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span style={{ 
                fontSize: 10.5, 
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
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: W.primary,
                    position: 'absolute',
                    bottom: -6
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
