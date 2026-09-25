const fs = require('fs');
let gemini = fs.readFileSync('src/lib/gemini.ts', 'utf8');

// I will just add the import at the top
if (!gemini.includes("import { getCachedData, setCachedData, makeCacheKey } from './db';")) {
  gemini = gemini.replace("import { callGroq", "import { getCachedData, setCachedData, makeCacheKey } from './db';\nimport { callGroq");
}

// Remove the local definitions using indexOf
const startGet = gemini.indexOf('async function getCachedData(key: string) {');
const endMake = gemini.indexOf('}', gemini.indexOf('function makeCacheKey(...args: any[]) {')) + 1;

if (startGet !== -1 && endMake !== -1 && endMake > startGet) {
  gemini = gemini.slice(0, startGet) + gemini.slice(endMake);
}

// Also remove `import { doc, getDoc, setDoc } from 'firebase/firestore';`
gemini = gemini.replace(/import \{ doc, getDoc, setDoc \} from 'firebase\/firestore';\n?/, '');

// Also remove `import { db } from '@/lib/firebase';` if it's there
gemini = gemini.replace(/import \{ db \} from '@\/lib\/firebase';\n?/, '');

fs.writeFileSync('src/lib/gemini.ts', gemini);
console.log('Fixed gemini.ts');
