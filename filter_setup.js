const fs = require('fs');
let store = fs.readFileSync('src/store/index.ts', 'utf8');

const filterLogic = `
        addFamilyRecipe: (recipe) => set((state) => {
          const badWords = ['fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'slut'];
          const textToScan = (recipe.title + ' ' + recipe.story + ' ' + recipe.ingredients.join(' ')).toLowerCase();
          if (badWords.some(word => textToScan.includes(word))) {
            console.warn('Inappropriate content detected in family recipe. Rejecting.');
            return state;
          }
          return { familyRecipes: [recipe, ...state.familyRecipes] };
        }),`;

store = store.replace(
  /addFamilyRecipe: \(recipe\) => set\(\(state\) => \(\{\s*familyRecipes: \[recipe, \.\.\.state\.familyRecipes\]\s*\}\)\),/g,
  filterLogic
);

fs.writeFileSync('src/store/index.ts', store);
console.log('Added content filtering to store');
