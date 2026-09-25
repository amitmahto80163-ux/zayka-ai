const fs = require('fs');
let store = fs.readFileSync('src/store/index.ts', 'utf8');

const importSync = `import { syncStateToFirestore, loadStateFromFirestore } from '@/lib/db';\n`;
if (!store.includes('syncStateToFirestore')) {
  store = store.replace("import { create } from 'zustand';", "import { create } from 'zustand';\n" + importSync);
}

// Modify setUser to load state
store = store.replace(
  /setUser: \(user\) => set\(\{ user \}\),/g,
  `setUser: async (user) => {
          set({ user });
          if (user?.uid) {
            const serverState = await loadStateFromFirestore(user.uid);
            if (serverState) {
              set((state) => ({ ...state, ...serverState }));
            }
          }
        },`
);

// Add subscription at bottom
const subscription = `
let syncTimeout: any = null;
useZaykaStore.subscribe((state, prevState) => {
  if (state.user?.uid) {
    const keys = ['memory', 'favourites', 'savedRecipes', 'familyRecipes', 'currentStreak', 'lastCookDate'] as const;
    const changed = keys.some(key => state[key] !== prevState[key]);
    
    if (changed) {
      const stateToSync = keys.reduce((acc, key) => {
        acc[key] = state[key];
        return acc;
      }, {} as any);
      
      if (syncTimeout) clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        syncStateToFirestore(state.user!.uid, stateToSync);
      }, 2000);
    }
  }
});
`;

store += '\n' + subscription;

fs.writeFileSync('src/store/index.ts', store);
console.log('Fixed store.ts sync');
