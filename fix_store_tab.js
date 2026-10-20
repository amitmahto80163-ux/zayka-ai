const fs = require('fs');
let store = fs.readFileSync('src/store/index.ts', 'utf8');

// interface ZaykaStore
store = store.replace(
  '  // Current recipe (cooking mode)',
  '  // Recipe UI\n  lastRecipeTab: string;\n  setLastRecipeTab: (tab: string) => void;\n\n  // Current recipe (cooking mode)'
);

// implementation
store = store.replace(
  '        // Recipe\n        currentRecipe: null,',
  '        // Recipe UI\n        lastRecipeTab: "overview",\n        setLastRecipeTab: (lastRecipeTab) => set({ lastRecipeTab }),\n\n        // Recipe\n        currentRecipe: null,'
);

// hydration
store = store.replace(
  "fridgeIngredients: state.fridgeIngredients,",
  "fridgeIngredients: state.fridgeIngredients,\n          lastRecipeTab: state.lastRecipeTab,"
);

fs.writeFileSync('src/store/index.ts', store);
console.log('Fixed store with lastRecipeTab');
