const fs = require('fs');
let store = fs.readFileSync('src/store/index.ts', 'utf8');

// interface ZaykaStore
store = store.replace(
  '  // User state\n  user: User | null;',
  '  // Fridge\n  fridgeIngredients: string[];\n  setFridgeIngredients: (ingredients: string[]) => void;\n\n  // User state\n  user: User | null;'
);

// implementation
store = store.replace(
  '        // User\n        user: null,',
  '        // Fridge\n        fridgeIngredients: [],\n        setFridgeIngredients: (fridgeIngredients) => set({ fridgeIngredients }),\n\n        // User\n        user: null,'
);

// sync keys
store = store.replace(
  "const keys = ['memory'",
  "const keys = ['fridgeIngredients', 'memory'"
);

// hydration
store = store.replace(
  "user: state.user,",
  "user: state.user,\n          fridgeIngredients: state.fridgeIngredients,"
);

fs.writeFileSync('src/store/index.ts', store);
console.log('Fixed store correctly');
