const fs = require('fs');
let store = fs.readFileSync('src/store/index.ts', 'utf8');

store = store.replace(
  "const textToScan = (recipe.title + ' ' + recipe.story + ' ' + recipe.ingredients.join(' ')).toLowerCase();",
  "const textToScan = (recipe.title + ' ' + (recipe.description || '') + ' ' + recipe.ingredients.map(i => i.name).join(' ')).toLowerCase();"
);

fs.writeFileSync('src/store/index.ts', store);
console.log('Fixed recipe type in store');
