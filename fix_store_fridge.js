const fs = require('fs');
let store = fs.readFileSync('src/store/index.ts', 'utf8');

if (!store.includes('fridgeIngredients')) {
  // Add to ZaykaStore interface
  store = store.replace(
    '// User state',
    '// Fridge\n  fridgeIngredients: string[];\n  setFridgeIngredients: (ingredients: string[]) => void;\n\n  // User state'
  );
  
  // Add to store implementation
  store = store.replace(
    '// User',
    '// Fridge\n        fridgeIngredients: [],\n        setFridgeIngredients: (fridgeIngredients) => set({ fridgeIngredients }),\n\n        // User'
  );
  
  // Add to sync keys
  store = store.replace(
    "const keys = ['memory'",
    "const keys = ['fridgeIngredients', 'memory'"
  );
  
  // Add to hydration
  store = store.replace(
    "user: state.user,",
    "user: state.user,\n          fridgeIngredients: state.fridgeIngredients,"
  );
  
  fs.writeFileSync('src/store/index.ts', store);
  console.log('Added fridgeIngredients to store');
}
