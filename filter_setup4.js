const fs = require('fs');
let store = fs.readFileSync('src/store/index.ts', 'utf8');

store = store.replace(
  "recipe.ingredients.map(i => i.name).join(' ')",
  "recipe.ingredients.join(' ')"
);

fs.writeFileSync('src/store/index.ts', store);
console.log('Fixed recipe type in store');
