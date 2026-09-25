const fs = require('fs');
let gemini = fs.readFileSync('src/lib/gemini.ts', 'utf8');
let db = fs.readFileSync('src/lib/db.ts', 'utf8');

// Extract functions from gemini.ts
const getCacheStr = `async function getCachedData(key: string) {
  try {
    const docRef = doc(db, 'ai_cache', key);
    const snap = await getDoc(docRef);
    if (snap.exists()) return snap.data().result;
  } catch(e) {}
}`;

const setCacheStr = `async function setCachedData(key: string, result: any) {
  try {
    const docRef = doc(db, 'ai_cache', key);
    await setDoc(docRef, { result, timestamp: Date.now() });
  } catch(e) {}
}`;

const makeCacheStr = `function makeCacheKey(...args: any[]) {
  return args.map(a => String(a).toLowerCase().replace(/[^a-z0-9]/g, '')).join('_');
}`;

// Remove from gemini.ts
gemini = gemini.replace(getCacheStr, '');
gemini = gemini.replace(setCacheStr, '');
gemini = gemini.replace(makeCacheStr, '');
// Also remove import { doc, getDoc, setDoc } from 'firebase/firestore'; if it's there
gemini = gemini.replace(/import { doc, getDoc, setDoc } from 'firebase\/firestore';\n?/, '');

// Add to db.ts as exports
const newExports = `
export async function getCachedData(key: string) {
  try {
    const docRef = doc(db, 'ai_cache', key);
    const snap = await getDoc(docRef);
    if (snap.exists()) return snap.data().result;
  } catch(e) {}
}

export async function setCachedData(key: string, result: any) {
  try {
    const docRef = doc(db, 'ai_cache', key);
    await setDoc(docRef, { result, timestamp: Date.now() });
  } catch(e) {}
}

export function makeCacheKey(...args: any[]) {
  return args.map(a => String(a).toLowerCase().replace(/[^a-z0-9]/g, '')).join('_');
}
`;
db += newExports;

// Add import to gemini.ts
gemini = gemini.replace("import { callGroq, callVision", "import { getCachedData, setCachedData, makeCacheKey } from './db';\nimport { callGroq, callVision");

fs.writeFileSync('src/lib/gemini.ts', gemini);
fs.writeFileSync('src/lib/db.ts', db);
console.log('Moved cache helpers to db.ts');
