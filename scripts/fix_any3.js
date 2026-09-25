const fs = require('fs');
let gemini = fs.readFileSync('src/lib/gemini.ts', 'utf8');

gemini = gemini.replace(
  "Promise<{fusionName: string, emoji: string, reason: string, cuisineBlend: string, tagline?: string, quickRecipe: string}>",
  "Promise<{fusionName: string, emoji: string, tagline: string, description: string, ingredients: string[], instructions: string}>"
);

fs.writeFileSync('src/lib/gemini.ts', gemini);
console.log('Fixed Promise type');
