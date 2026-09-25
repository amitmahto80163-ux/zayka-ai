// ============================================
// ZAYKA AI — Firebase Database (Firestore) Utils
// ============================================

import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { User, Recipe } from '@/types';

// Create or Update User Profile
export async function saveUserProfile(userId: string, data: Partial<User>) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date()
      });
    } else {
      await setDoc(userRef, {
        ...data,
        id: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          isVegetarian: false,
          isVegan: false,
          allergies: [],
          skillLevel: 'beginner',
          favoriteCuisines: [],
          healthGoal: 'none',
          familySize: 1,
          dietaryRestrictions: []
        },
        stats: {
          totalRecipesMade: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalPoints: 0,
          badges: [],
          challengeDaysCompleted: 0,
          skipPassesLeft: 2
        },
        isPremium: false,
        language: 'hinglish',
        selectedChef: 'arjun'
      });
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

// Fetch User Profile
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Save Recipe to Database
export async function saveRecipeToDB(recipe: Recipe) {
  try {
    const recipeRef = doc(db, 'recipes', recipe.id);
    await setDoc(recipeRef, {
      ...recipe,
      savedAt: new Date()
    });
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
}

export async function getCachedData(key: string) {
  try {
    const docRef = doc(db, 'ai_cache', key);
    const snap = await getDoc(docRef);
    if (snap.exists()) return snap.data().result;
  } catch(e) {}
}

export async function setCachedData(key: string, result: any) {
  try {
    const docRef = doc(db, 'ai_cache', key);
    await setDoc(docRef, { result, timestamp: Date.now() });
  } catch(e) {}
}

export function makeCacheKey(...args: any[]) {
  return args.map(a => String(a).toLowerCase().replace(/[^a-z0-9]/g, '')).join('_');
}

export async function syncStateToFirestore(userId: string, state: any) {
  try {
    const docRef = doc(db, 'users', userId, 'appData', 'state');
    await setDoc(docRef, state, { merge: true });
  } catch (error) {
    console.error('Error syncing state to Firestore:', error);
  }
}

export async function loadStateFromFirestore(userId: string) {
  try {
    const docRef = doc(db, 'users', userId, 'appData', 'state');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (error) {
    console.error('Error loading state from Firestore:', error);
  }
  return null;
}
