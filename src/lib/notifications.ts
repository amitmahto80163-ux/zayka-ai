import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function requestNotificationPermission(userId: string) {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const msg = await messaging();
      if (msg) {
        const token = await getToken(msg, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY || 'BM3mF9XvB64KkK2G5X595Q' }); // Fallback generic vapid just to satisfy SDK type if not provided
        if (token) {
          await setDoc(doc(db, 'users', userId, 'tokens', 'fcm'), {
            token,
            updatedAt: new Date().toISOString()
          });
          console.log('FCM Token registered for streak notifications');
        }
      }
    }
  } catch (error) {
    console.error('Notification permission denied or failed:', error);
  }
}
