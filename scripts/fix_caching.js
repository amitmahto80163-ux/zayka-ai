const fs = require('fs');
let content = fs.readFileSync('src/lib/gemini.ts', 'utf8');

const cacheLogic = `
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

async function getCachedData(key: string) {
  try {
    const docRef = doc(db, 'ai_cache', key);
    const snap = await getDoc(docRef);
    if (snap.exists()) return snap.data().result;
  } catch(e) {}
  return null;
}

async function setCachedData(key: string, result: any) {
  try {
    const docRef = doc(db, 'ai_cache', key);
    await setDoc(docRef, { result, timestamp: Date.now() });
  } catch(e) {}
}

function makeCacheKey(...args: any[]) {
  return args.map(a => String(a).toLowerCase().replace(/[^a-z0-9]/g, '')).join('_');
}
`;

// Insert the cache logic and imports right after the other imports
content = content.replace(
  "import { callGroq, callVision, parseJSONResponse, getDishImageUrl, GROQ_FAST_MODEL } from './ai';",
  "import { callGroq, callVision, parseJSONResponse, getDishImageUrl, GROQ_FAST_MODEL } from './ai';\n" + cacheLogic
);

// Inject into generateRecipe
const oldRecipeTarget = "const prompt = `Generate a highly detailed";
const newRecipeTarget = `
    const cacheKey = makeCacheKey('recipe', dishName, preferences.servings, preferences.isVeg, language);
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;
    
    const prompt = \`Generate a highly detailed`;
content = content.replace(oldRecipeTarget, newRecipeTarget);

const oldRecipeReturn = "return { ...recipe, imageUrl: imageUrl };";
const newRecipeReturn = `
    const finalRecipe = { ...recipe, imageUrl: imageUrl };
    await setCachedData(cacheKey, finalRecipe);
    return finalRecipe;`;
content = content.replace(oldRecipeReturn, newRecipeReturn);

// Inject into generateBudgetMeal
const oldBudgetTarget = "const prompt = `You are an expert Indian budget chef";
const newBudgetTarget = `
    const cacheKey = makeCacheKey('budget', budget, language);
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;
    
    const prompt = \`You are an expert Indian budget chef`;
content = content.replace(oldBudgetTarget, newBudgetTarget);

const oldBudgetReturn = "return parseJSONResponse(text);";
const newBudgetReturn = `
    const result = parseJSONResponse(text);
    await setCachedData(cacheKey, result);
    return result;`;
// Only replace the FIRST occurrence of `return parseJSONResponse(text);` for budget meal
let idx = content.indexOf(oldBudgetReturn, content.indexOf('export async function generateBudgetMeal'));
if (idx !== -1) {
  content = content.substring(0, idx) + newBudgetReturn + content.substring(idx + oldBudgetReturn.length);
}

// Inject into generateFusionRecipe
const oldFusionTarget = "const prompt = `User swiped right on these foods:";
const newFusionTarget = `
    const cacheKey = makeCacheKey('fusion', likedFoods.sort().join(''), language);
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;
    
    const prompt = \`User swiped right on these foods:`;
content = content.replace(oldFusionTarget, newFusionTarget);

// Only replace the next occurrence of `return parseJSONResponse(text);` for fusion meal
idx = content.indexOf(oldBudgetReturn, content.indexOf('export async function generateFusionRecipe'));
if (idx !== -1) {
  content = content.substring(0, idx) + newBudgetReturn + content.substring(idx + oldBudgetReturn.length);
}

fs.writeFileSync('src/lib/gemini.ts', content);
console.log('Cache logic added to gemini.ts');
