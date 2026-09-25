const fs = require('fs');
let gemini = fs.readFileSync('src/lib/gemini.ts', 'utf8');

const target = `export async function generateRecipe(
  dishName: string,
  preferences: {
    servings?: number;
    isVeg?: boolean;
    difficulty?: string;
    language?: AppLanguage;
  } = {}
): Promise<Partial<Recipe>> {
  try {
    const imageUrl = getDishImageUrl(dishName);`;

const replacement = `export async function generateRecipe(
  dishName: string,
  preferences: {
    servings?: number;
    isVeg?: boolean;
    difficulty?: string;
    language?: AppLanguage;
  } = {}
): Promise<Partial<Recipe>> {
  try {
    const cacheKey = makeCacheKey('recipe', dishName, preferences.servings || 4, preferences.isVeg ? 'veg' : 'all', preferences.language || 'hindi');
    const cached = await getCachedData(cacheKey);
    if (cached) return cached as Partial<Recipe>;

    const imageUrl = getDishImageUrl(dishName);`;

gemini = gemini.replace(target, replacement);

const returnTarget = `    const recipe = parseJSONResponse(text);
    return { ...recipe, imageUrl: imageUrl };
  } catch (error) {`;

const returnReplacement = `    const recipe = parseJSONResponse(text);
    const finalRecipe = { ...recipe, imageUrl: imageUrl };
    await setCachedData(cacheKey, finalRecipe);
    return finalRecipe;
  } catch (error) {`;

gemini = gemini.replace(returnTarget, returnReplacement);

fs.writeFileSync('src/lib/gemini.ts', gemini);
console.log('generateRecipe caching added');
