const fs = require('fs');
let store = fs.readFileSync('src/store/index.ts', 'utf8');

store = store.replace(
  /addFavourite: \(recipeId\) =>\s*set\(\(state\) => \(\{\s*favourites: \[\.\.\.state\.favourites, recipeId\],\s*\}\)\),/g,
  `addFavourite: (recipeId) =>
        set((state) => 
          state.favourites.includes(recipeId) 
            ? state 
            : { favourites: [...state.favourites, recipeId] }
        ),`
);

fs.writeFileSync('src/store/index.ts', store);
console.log('Fixed addFavourite deduplication');
