'use client';

import { useEffect, useState } from 'react';
import { useZaykaStore } from '@/store';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, user } = useZaykaStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BYPASS LOGIN FOR MVP / TESTING
    setUser({
      id: 'demo-user-123',
      name: 'Startup Judge',
      phone: '+919999999999',
      isPremium: true,
      preferences: { isVegetarian: false, spiceLevel: 'medium', skillLevel: 'beginner', cuisineTypes: [], allergies: [], goals: [], budgetPerMeal: 100 },
      stats: { totalRecipesMade: 0, currentStreak: 0, longestStreak: 0, badges: [], points: 0, level: 1, weeklyGoal: 3, weeklyCompleted: 0, dailyChallengesCompleted: 0 }
    } as any);
    
    setLoading(false);
  }, [setUser]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: 32, height: 32, color: '#F97316' }} className="animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
