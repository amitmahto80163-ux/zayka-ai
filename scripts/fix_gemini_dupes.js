const fs = require('fs');
let gemini = fs.readFileSync('src/lib/gemini.ts', 'utf8');

gemini = gemini.replace(/async function getCachedData[\s\S]*?catch\(e\) \{\}\n\}/, '');
gemini = gemini.replace(/async function setCachedData[\s\S]*?catch\(e\) \{\}\n\}/, '');
gemini = gemini.replace(/function makeCacheKey[\s\S]*?join\('_'\);\n\}/, '');
gemini = gemini.replace(/import \{ db \} from '@\/lib\/firebase';\n/, '');

fs.writeFileSync('src/lib/gemini.ts', gemini);
console.log('Removed duplicates from gemini.ts');
