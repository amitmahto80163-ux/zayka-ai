import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCC6Ixo__q8X4QFMI-UA1I1CydD8C8QFxM",
  authDomain: "zayka-ai.firebaseapp.com",
  projectId: "zayka-ai",
  storageBucket: "zayka-ai.firebasestorage.app",
  messagingSenderId: "656092612044",
  appId: "1:656092612044:web:62dc7f2c34c1e4a37e4969",
};

let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
} catch (error) {
  console.warn('Firebase initialization failed:', error);
}

export const auth = app ? getAuth(app) : {} as any;
export const db = app ? getFirestore(app) : {} as any;
export const storage = app ? getStorage(app) : {} as any;
export default app;
