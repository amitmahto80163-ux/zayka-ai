'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/db';
import { useZaykaStore } from '@/store';
import { Loader2 } from 'lucide-react';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useZaykaStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Firebase keys are actually set, if not use a mock user to prevent crashes
    const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_firebase_api_key';
    
    if (!isFirebaseConfigured) {
      console.warn("Firebase not configured. Bypassing auth.");
      setUser({
        id: 'guest-123',
        name: 'Guest User',
        email: 'guest@zaykaai.com',
        photoUrl: '',
        createdAt: new Date(),
        updatedAt: new Date()
      } as any);
      setLoading(false);
      return;
    }

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
                email: firebaseUser.email || '',
                photoUrl: firebaseUser.photoURL || '',
                createdAt: new Date(),
                updatedAt: new Date()
              } as any);
            }
          } catch (e) {
            console.error("DB Fetch Error", e);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase Auth Error:", error);
      setLoading(false);
    }
  }, [setUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF5A5F] animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
