// ============================================
// ZAYKA AI — Firebase Authentication Utils
// ============================================

import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { deleteUser } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { saveUserProfile, getUserProfile } from './db';

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Setup or update user profile in Firestore
    await saveUserProfile(user.uid, {
      name: user.displayName || 'User',
      email: user.email || '',
      photoUrl: user.photoURL || '',
    });

    return user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
}

export { onAuthStateChanged };

export async function deleteAccount() {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    
    // Delete user data from Firestore
    await deleteDoc(doc(db, 'users', user.uid, 'appData', 'state'));
    await deleteDoc(doc(db, 'users', user.uid));
    
    // Delete Firebase Auth user
    await deleteUser(user);
  } catch (error) {
    console.error('Delete Account Error:', error);
    throw error;
  }
}
