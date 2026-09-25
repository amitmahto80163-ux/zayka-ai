const fs = require('fs');
let db = fs.readFileSync('src/lib/db.ts', 'utf8');

const newCode = `
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
`;

db += newCode;
fs.writeFileSync('src/lib/db.ts', db);
console.log('Added sync functions to db.ts');
