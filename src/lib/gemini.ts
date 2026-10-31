// ============================================
// ZAYKA AI — AI Integration (Chef Brain)
// Powered by Multi-Provider Free AI Router
// ============================================

import { AppLanguage, ChefId, Recipe } from '@/types';
import { CHEF_PROFILES } from '@/data/chefs';
import { getCachedData, setCachedData, makeCacheKey } from './db';
import { callGroq, callVision, parseJSONResponse, getDishImageUrl, GROQ_FAST_MODEL } from './ai';

// ============================================
// CHEF AI SYSTEM PROMPT
// ============================================

function buildChefSystemPrompt(chefId: ChefId, language: AppLanguage): string {
  const chef = CHEF_PROFILES[chefId] || CHEF_PROFILES['arjun'];

  const languageInstructions: Record<AppLanguage, string> = {
    hindi: 'Sirf Hindi mein baat karo.',
    english: 'Speak only in English.',
    hinglish: 'Hindi aur English mix karke baat karo — natural Hinglish style mein.',
    punjabi: 'Punjabi mein baat karo, thodi Hindi bhi mix kar sakte ho.',
    tamil: 'Tamil mein baat karo, thodi English bhi mix kar sakte ho.',
    telugu: 'Telugu mein baat karo, thodi English bhi mix kar sakte ho.',
    bengali: 'Bangla mein baat karo, thodi English bhi mix kar sakte ho.',
    gujarati: 'Gujarati mein baat karo, thodi Hindi bhi mix kar sakte ho.',
  };

  return `Tum ho ${chef.name} — Zayka AI app ka dedicated cooking assistant.

TUMHARI PERSONALITY:
${chef.personality}

TUMHARE RULES:
1. Cooking, food, nutrition, kitchen hacks aur recipes ke baare mein detail mein help karo
2. ${languageInstructions[language]}
3. Friendly, warm aur encouraging raho — kabhi rude mat hona
4. Agar koi non-cooking sawaal pooche: "Yaar, main sirf cooking mein help kar sakta hoon! Koi recipe poochho 😊"
5. Har step clearly explain karo
6. Safety tips zaroor batao (hot oil, sharp knives etc.)
7. Measurements exact batao
8. Substitutes suggest karo agar ingredients available na ho
9. Emojis use karo — friendly feel ke liye
10. Har response short, practical aur actionable rakho

TUMHARA GREETING STYLE:
"${chef.greeting}"

ENCOURAGEMENT PHRASES:
${chef.encouragement.map(e => `- "${e}"`).join('\n')}

REMEMBER: Tum ek experienced chef ho jo genuinely user ki help karna chahta/chahti hai!`;
}

// ============================================
// MAIN CHEF AI CHAT (Fast Multi-Provider)
// ============================================

export async function chatWithChef(
  message: string,
  chefId: ChefId,
  language: AppLanguage,
  currentRecipe?: Recipe | null,
  chatHistory: { role: string; content: string }[] = []
): Promise<string> {
  try {
    const systemPrompt = buildChefSystemPrompt(chefId, language);

    const recipeContext = currentRecipe
      ? `\n\nUSER ABHI YEH RECIPE BANA RAHA/RAHI HAI: ${currentRecipe.name}
         Ingredients: ${(currentRecipe.ingredients || []).map(i => `${i.amount} ${i.unit} ${i.name}`).join(', ')}`
      : '';

    const historyText = chatHistory
      .slice(-6)
      .map(h => `${h.role === 'user' ? 'User' : 'Chef'}: ${h.content}`)
      .join('\n');

    const userPrompt = `${recipeContext}

CHAT HISTORY:
${historyText}

User: ${message}
Chef:`;

    const response = await callGroq(userPrompt, systemPrompt, false, GROQ_FAST_MODEL);
    return response.trim();
  } catch (error) {
    console.error('Chef AI error:', error);
    return 'Namaste! 👨‍🍳 Bataiye aaj kitchen mein kya banayein? Main har step mein aapki madad karunga!';
  }
}

// ============================================
// RECIPE GENERATION (Fast & Complete JSON)
// ============================================

export async function generateRecipe(
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

    const imageUrl = getDishImageUrl(dishName);

    const prompt = `You are an expert Indian chef and nutritionist. Generate a complete detailed recipe for "${dishName}" scaled for ${preferences.servings || 4} servings.

Return ONLY valid JSON (no markdown, no extra text):
{
  "name": "${dishName}",
  "nameHindi": "dish name in Hindi script",
  "description": "2-3 line mouth-watering Hinglish description of the dish",
  "cuisine": "indian",
  "difficulty": "${preferences.difficulty || 'intermediate'}",
  "prepTime": <number in minutes, e.g. 15>,
  "cookTime": <number in minutes, e.g. 25>,
  "servings": ${preferences.servings || 4},
  "isVeg": ${preferences.isVeg !== undefined ? preferences.isVeg : true},
  "calories": <number, e.g. 340>,
  "rating": 4.8,
  "image": "${imageUrl}",
  "ingredients": [
    {
      "id": "1",
      "name": "ingredient name",
      "nameHindi": "Hindi name",
      "amount": <number>,
      "unit": "g OR kg OR ml OR cup OR tbsp OR tsp OR pcs OR pinch",
      "optional": false,
      "substitute": "substitute if any"
    }
  ],
  "steps": [
    {
      "id": "1",
      "stepNumber": 1,
      "title": "Short step title (4-6 words)",
      "description": "Detailed Hinglish instruction (2-3 sentences) — what to do, how it looks/smells when done.",
      "duration": <minutes as number, e.g. 5>,
      "tips": ["one important pro tip"]
    }
  ],
  "nutrition": {
    "calories": <number>,
    "protein": <number>,
    "carbs": <number>,
    "fat": <number>,
    "fiber": <number>
  },
  "tags": ["homemade", "indian"]
}
Generate 6-10 ingredients and 5-7 detailed cooking steps.`;

    const text = await callGroq(prompt, undefined, true, GROQ_FAST_MODEL);
    const recipe = parseJSONResponse(text);

    const { getSmartDishIngredients, normalizeIngredientList } = await import('@/data/ingredients');
    const targetServings = Number(recipe.servings) || preferences.servings || 4;
    const normalizedIngredients = normalizeIngredientList(
      Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      recipe.name || dishName,
      targetServings
    );

    const finalRecipe = {
      ...recipe,
      name: recipe.name || dishName,
      image: recipe.image || imageUrl,
      imageUrl: imageUrl,
      prepTime: Number(recipe.prepTime) || 15,
      cookTime: Number(recipe.cookTime) || 20,
      calories: Number(recipe.calories || recipe.nutrition?.calories) || 320,
      servings: targetServings,
      ingredients: normalizedIngredients,
      steps: Array.isArray(recipe.steps) ? recipe.steps : [],
    };
    await setCachedData(cacheKey, finalRecipe);
    return finalRecipe;
  } catch (error: unknown) {
    console.error('Recipe generation error:', error);
    const { getSmartDishIngredients } = await import('@/data/ingredients');
    const imageUrl = getDishImageUrl(dishName);
    const targetServings = preferences.servings || 4;
    return {
      id: `recipe-${Date.now()}`,
      name: dishName,
      nameHindi: dishName,
      description: `${dishName} — Ghar par banao, ekdum restaurant jaisa lajawab swad aayega!`,
      cuisine: 'indian' as import('@/types').CuisineType,
      difficulty: (preferences.difficulty as import('@/types').DifficultyLevel) || 'beginner',
      prepTime: 15,
      cookTime: 25,
      servings: targetServings,
      isVeg: preferences.isVeg !== undefined ? preferences.isVeg : !/chicken|mutton|fish|prawn|egg|keema/i.test(dishName),
      image: imageUrl,
      imageUrl: imageUrl,
      calories: 320,
      ingredients: getSmartDishIngredients(dishName, targetServings),
      steps: [
        { id: '1', stepNumber: 1, title: 'Taiyari Karo (Mise en Place)', description: `${dishName} ke liye sabhi ingredients measure karke ready kar lo.`, duration: 5, tips: ['Pehle se sab ready rakhoge toh cooking smooth hogi'] },
        { id: '2', stepNumber: 2, title: 'Base & Aroma Activation', description: 'Pan ya kadhai mein medium flame par base ingredients ko sunehra aur khushbudaar hone tak bhuno.', duration: 6, tips: ['Medium flame pe bhuno — jaldi mat karo'] },
        { id: '3', stepNumber: 3, title: 'Core Spices & Flavouring', description: `Ab मुख्य मसाले और फ्लेवरिंग daalo aur tab tak pakao jab tak ${dishName} ka rich color na aa jaye.`, duration: 7, tips: ['Sahi bhunai hi asli swad ka raaz hai'] },
        { id: '4', stepNumber: 4, title: `${dishName} Pakao`, description: 'Ab main samagri daalo, achhi tarah mix karo aur medium-low flame pe pakne do.', duration: 12, tips: ['Beech-beech mein halka stir karte raho'] },
        { id: '5', stepNumber: 5, title: 'Garnish Aur Garma-Garam Serve', description: `Gas band karo, taza garnish daal kar garma-garam ${dishName} paroso!`, duration: 2, tips: ['Garnish se aroma aur presentation 10x better hoti hai'] },
      ],
      nutrition: { calories: 320, protein: 14, carbs: 35, fat: 12, fiber: 6 },
      tags: ['homemade', 'indian'],
    };
  }
}

// ============================================
// VOICE INGREDIENT ADAPTER
// ============================================

export async function adaptRecipeToIngredients(
  dishName: string,
  availableIngredients: string[],
  language: AppLanguage = 'hinglish'
): Promise<{
  adaptedRecipe: string;
  missingIngredients: string[];
  substitutes: Record<string, string>;
  encouragement: string;
}> {
  try {
    const prompt = `User "${dishName}" banana chahta/chahti hai.
Available ingredients: ${availableIngredients.join(', ')}

Jo ingredients available hain unse BEST possible recipe banao. Missing items ke substitutes batao.

Return ONLY valid JSON (no markdown):
{
  "adaptedRecipe": "Modified recipe description in ${language}",
  "missingIngredients": ["list of missing items"],
  "substitutes": {"missing_item": "best substitute"},
  "encouragement": "Friendly message in ${language} about how great this will taste!"
}`;

    const text = await callGroq(prompt, undefined, true, GROQ_FAST_MODEL);
    return parseJSONResponse(text);
  } catch (error) {
    console.error('Ingredient adapter error:', error);
    return {
      adaptedRecipe: `Aapke paas jo ingredients (${availableIngredients.join(', ')}) hain unse ekdum swadisht ${dishName} ban jayegi!`,
      missingIngredients: [],
      substitutes: {},
      encouragement: 'Main hoon na help karne ke liye! Chal banate hain kuch zabardast! 😊',
    };
  }
}

// ============================================
// CAMERA ANALYSIS (Vision)
// ============================================

export async function analyzeCookingFrame(
  imageBase64: string,
  currentStep: string,
  chefId: ChefId,
  language: AppLanguage
): Promise<string> {
  try {
    const chef = CHEF_PROFILES[chefId] || CHEF_PROFILES['arjun'];
    const prompt = `You are ${chef.name}, an expert chef. The user is doing this cooking step: "${currentStep}".
Look at the image and give ONE short helpful sentence (max 15 words) in ${language}. Be encouraging!`;

    const text = await callVision(prompt, imageBase64, false);
    return text.trim();
  } catch (error) {
    console.error('Camera analysis error:', error);
    return 'Bilkul sahi ja rahe ho! Step continue karo. 👨‍🍳';
  }
}

// ============================================
// AI DISH RATER (Vision)
// ============================================

export async function rateDish(
  imageBase64: string,
  dishName: string,
  language: AppLanguage
): Promise<{
  score: number;
  presentation: number;
  color: number;
  feedback: string;
  improvements: string[];
  shareCaption: string;
}> {
  try {
    const prompt = `You are an expert food critic. Look at this image of "${dishName}" and rate it honestly.
Return ONLY valid JSON (no markdown):
{
  "score": <overall score 1-10 with 1 decimal>,
  "presentation": <presentation score 1-10>,
  "color": <color/appearance score 1-10>,
  "feedback": "<2-3 sentence detailed friendly feedback in ${language}>",
  "improvements": ["improvement tip 1", "improvement tip 2"],
  "shareCaption": "<fun Instagram caption with emojis and #ZaykaAI>"
}`;

    const text = await callVision(prompt, imageBase64, true);
    return parseJSONResponse(text);
  } catch (error) {
    console.error('Dish rating error:', error);
    return {
      score: 8.5,
      presentation: 8.5,
      color: 8.5,
      feedback: 'Ekdum achhi dish lag rahi hai! Thodi garnishing se aur perfect ho jaayegi.',
      improvements: ['Garnish with fresh coriander', 'Serve hot for best taste'],
      shareCaption: 'Ghar pe restaurant jaisa khana! 🧑‍🍳✨ #ZaykaAI #HomeCooking',
    };
  }
}

// ============================================
// FRIDGE SCAN (Vision)
// ============================================

export async function scanFridgeIngredients(
  imageBase64: string,
  language: AppLanguage = 'hinglish'
): Promise<string[]> {
  try {
    const prompt = `Look at this image of a fridge or food items on a table. Identify all visible food ingredients.
Return ONLY a valid JSON array of ingredient names with emojis (no markdown):
["🧅 Pyaaz (Onion)", "🍅 Tamatar (Tomato)", "🥔 Aloo (Potato)"]
Language style: ${language}. List only food items, not containers or non-food objects.`;

    const text = await callVision(prompt, imageBase64, true);
    const parsed = parseJSONResponse(text);
    return Array.isArray(parsed) ? parsed : (parsed.ingredients || ['🧅 Pyaaz', '🍅 Tamatar', '🌶️ Hari Mirch', '🥔 Aloo']);
  } catch (error) {
    console.error('Fridge scanning error:', error);
    return ['🧅 Pyaaz', '🍅 Tamatar', '🌶️ Hari Mirch', '🥔 Aloo'];
  }
}

// ============================================
// BUDGET MEAL
// ============================================

export async function generateBudgetMeal(budget: number, language: AppLanguage = 'hinglish'): Promise<{dishName: string, description: string, totalCost: number, ingredients: {name: string, estimatedCost: number}[], quickRecipe: string}> {
  try {
    const cacheKey = makeCacheKey('budget', budget, language);
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;

    const prompt = `You are an expert Indian budget chef. User has exactly ₹${budget} for one meal for 2 people.
Suggest ONE perfect nutritious meal within this budget.
Return ONLY valid JSON (no markdown):
{
  "dishName": "Name of the dish",
  "description": "Short description of why it fits the budget",
  "totalCost": <calculated cost in INR as number>,
  "ingredients": [
    { "name": "item name", "estimatedCost": <number in rupees> }
  ],
  "quickRecipe": "A very short 3-step recipe"
}`;

    const text = await callGroq(prompt, undefined, true, GROQ_FAST_MODEL);
    const result = parseJSONResponse(text);
    await setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Budget meal error:', error);
    return {
      dishName: 'Masala Soya Pulao',
      description: `Sasta, sundar aur tikau! ₹${budget} mein high-protein meal.`,
      totalCost: Math.min(budget, 48),
      ingredients: [{ name: 'Rice & Soya Chunks', estimatedCost: 28 }, { name: 'Pyaaz, Tamatar & Masale', estimatedCost: 20 }],
      quickRecipe: 'Step 1: Tel mein jeera aur pyaaz bhuno. Step 2: Bhige soya chunks aur chawal daalo. Step 3: 2 seeti lagao aur serve karo!',
    };
  }
}

// ============================================
// FUSION RECIPE
// ============================================

export async function generateFusionRecipe(likedFoods: string[], language: AppLanguage = 'hinglish'): Promise<{fusionName: string, emoji: string, tagline: string, description: string, ingredients: string[], instructions: string}> {
  try {
    const cacheKey = makeCacheKey('fusion', likedFoods.sort().join(''), language);
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;

    const prompt = `User swiped right on these foods: ${likedFoods.join(', ')}.
Create a unique creative "FUSION DISH" combining their taste.
Return ONLY valid JSON (no markdown):
{
  "fusionName": "Catchy Fusion Name",
  "emoji": "🍕🍜",
  "tagline": "A fun tagline",
  "description": "How these items blend together beautifully",
  "ingredients": ["ing1", "ing2", "ing3", "ing4"],
  "instructions": "Short 3-step instructions"
}`;

    const text = await callGroq(prompt, undefined, true, GROQ_FAST_MODEL);
    const result = parseJSONResponse(text);
    await setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Fusion error:', error);
    return {
      fusionName: 'Desi Fusion Bowl',
      emoji: '🍲',
      tagline: 'Sab kuch ek saath!',
      description: 'Jo accha laga sab mila diya — ek unique aur tasty dish!',
      ingredients: likedFoods,
      instructions: 'Step 1: Mix everything. Step 2: Cook on medium flame. Step 3: Enjoy!',
    };
  }
}
