// ============================================
// ZAYKA AI - Firebase Configuration
// ============================================

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
try {
  // Only initialize if we have a real API key (not the dummy one)
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_firebase_api_key') {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error);
}

// Export mock objects if Firebase is not configured yet so the app doesn't crash
export const auth = app ? getAuth(app) : {} as any;
export const db = app ? getFirestore(app) : {} as any;
export const storage = app ? getStorage(app) : {} as any;
export default app;
