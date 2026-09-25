const fs = require('fs');
let ai = fs.readFileSync('src/lib/ai.ts', 'utf8');

if (!ai.includes('export const GROQ_FAST_MODEL')) {
  ai = ai.replace(
    "const GROQ_FAST_MODEL = 'llama-3.1-8b-instant';", 
    "export const GROQ_FAST_MODEL = 'llama-3.1-8b-instant';"
  );
  fs.writeFileSync('src/lib/ai.ts', ai);
}

let gemini = fs.readFileSync('src/lib/gemini.ts', 'utf8');
if (!gemini.includes('GROQ_FAST_MODEL')) {
  gemini = gemini.replace(
    "import { callGroq, callVision, parseJSONResponse, getDishImageUrl } from './ai';",
    "import { callGroq, callVision, parseJSONResponse, getDishImageUrl, GROQ_FAST_MODEL } from './ai';"
  );
  gemini = gemini.replace(
    "const response = await callGroq(userPrompt, systemPrompt, false);",
    "const response = await callGroq(userPrompt, systemPrompt, false, GROQ_FAST_MODEL);"
  );
  fs.writeFileSync('src/lib/gemini.ts', gemini);
}
console.log('Updated gemini.ts to use GROQ_FAST_MODEL');
