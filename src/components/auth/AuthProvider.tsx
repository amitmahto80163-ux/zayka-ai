'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/db';
import { useZaykaStore } from '@/store';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, user } = useZaykaStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userProfile = await getUserProfile(firebaseUser.uid);
            if (userProfile) {
              setUser(userProfile);
            } else {
              setUser({
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                phone: firebaseUser.phoneNumber || '',
                isPremium: false,
                preferences: { isVegetarian: false, spiceLevel: 'medium', skillLevel: 'beginner', cuisineTypes: [], allergies: [], goals: [], budgetPerMeal: 100 },
                stats: { totalRecipesMade: 0, currentStreak: 0, longestStreak: 0, badges: [], points: 0, level: 1, weeklyGoal: 3, weeklyCompleted: 0, dailyChallengesCompleted: 0 }
              } as any);
            }
          } catch (e) {
            console.error("DB Fetch Error", e);
          }
        } else {
          setUser(null);
          // Redirect to auth page if they are not logged in and not already on the auth page
          if (pathname !== '/auth') {
            router.push('/auth');
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase Auth Error:", error);
      setLoading(false);
    }
  }, [setUser, pathname, router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: 32, height: 32, color: '#F97316' }} className="animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
