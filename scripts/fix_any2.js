const fs = require('fs');
let gemini = fs.readFileSync('src/lib/gemini.ts', 'utf8');

gemini = gemini.replace(
  "cuisine: 'indian',",
  "cuisine: 'indian' as import('@/types').CuisineType,"
);
gemini = gemini.replace(
  "difficulty: preferences.difficulty || 'beginner',",
  "difficulty: (preferences.difficulty as import('@/types').DifficultyLevel) || 'beginner',"
);

gemini = gemini.replace(
  "Promise<{fusionName: string, emoji: string, reason: string, cuisineBlend: string, quickRecipe: string}>",
  "Promise<{fusionName: string, emoji: string, reason: string, cuisineBlend: string, tagline?: string, quickRecipe: string}>"
);

fs.writeFileSync('src/lib/gemini.ts', gemini);
console.log('Fixed TS errors in gemini');
