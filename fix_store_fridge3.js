const fs = require('fs');
let store = fs.readFileSync('src/store/index.ts', 'utf8');

// interface ZaykaStore
if (!store.includes('fridgeIngredients: string[]')) {
  store = store.replace(
    /interface ZaykaStore \{/,
    "interface ZaykaStore {\n  // Fridge\n  fridgeIngredients: string[];\n  setFridgeIngredients: (ingredients: string[]) => void;\n"
  );
}

// implementation
if (!store.includes('fridgeIngredients: [],')) {
  store = store.replace(
    /\(set, get\) => \(\{/,
    "(set, get) => ({\n        // Fridge\n        fridgeIngredients: [],\n        setFridgeIngredients: (fridgeIngredients) => set({ fridgeIngredients }),\n"
  );
}

// sync keys
if (!store.includes("'fridgeIngredients'")) {
  store = store.replace(
    /const keys = \['memory'/,
    "const keys = ['fridgeIngredients', 'memory'"
  );
}

fs.writeFileSync('src/store/index.ts', store);
console.log('Fixed store correctly');
