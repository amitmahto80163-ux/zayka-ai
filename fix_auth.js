const fs = require('fs');
let authTs = fs.readFileSync('src/lib/auth.ts', 'utf8');

if (!authTs.includes('deleteAccount')) {
  authTs = authTs.replace(
    "import { auth } from './firebase';",
    "import { deleteUser } from 'firebase/auth';\nimport { auth, db } from './firebase';\nimport { doc, deleteDoc } from 'firebase/firestore';"
  );
  
  const delFunc = `
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
`;
  authTs += delFunc;
  fs.writeFileSync('src/lib/auth.ts', authTs);
  console.log('Added deleteAccount');
}
