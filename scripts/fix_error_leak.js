const fs = require('fs');
let gemini = fs.readFileSync('src/lib/gemini.ts', 'utf8');

gemini = gemini.replace(
  /\`\$\{dishName\} \(ERROR: \$\{error\.message\}\)\`/g,
  "`${dishName} (Fallback)`"
);

gemini = gemini.replace(
  /'Error aaya hai, API key check karo'/g,
  "'Pakwan (AI Unavailable)'"
);

fs.writeFileSync('src/lib/gemini.ts', gemini);
console.log('Fixed error leak in generateRecipe');
