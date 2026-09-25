// ============================================
// ZAYKA AI — AI Integration (Chef Brain)
// NOW POWERED BY: Groq + OpenRouter
// ============================================

import { AppLanguage, ChefId, Recipe } from '@/types';
import { CHEF_PROFILES } from '@/data/chefs';
import { getCachedData, setCachedData, makeCacheKey } from './db';
import { callGroq, callVision, parseJSONResponse, getDishImageUrl, GROQ_FAST_MODEL } from './ai';







// ============================================
// CHEF AI SYSTEM PROMPT
// ============================================

function buildChefSystemPrompt(chefId: ChefId, language: AppLanguage): string {
  const chef = CHEF_PROFILES[chefId];

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
1. SIRF cooking ke baare mein baat karo — kuch aur mat batao
2. ${languageInstructions[language]}
3. Friendly, warm aur encouraging raho — kabhi rude mat hona
4. Agar koi non-cooking sawaal pooche: "Yaar, main sirf cooking mein help kar sakta hoon! Koi recipe poochho 😊"
5. Har step clearly explain karo
6. Safety tips zaroor batao (hot oil, sharp knives etc.)
7. Measurements exact batao
8. Substitutes suggest karo agar ingredients available na ho
9. Emojis use karo — friendly feel ke liye
10. Har response short aur actionable rakho

TUMHARA GREETING STYLE:
"${chef.greeting}"

ENCOURAGEMENT PHRASES:
${chef.encouragement.map(e => `- "${e}"`).join('\n')}

REMEMBER: Tum ek experienced chef ho jo genuinely user ki help karna chahta/chahti hai. Unhe kabhi frustrated feel mat karao!`;
}

// ============================================
// MAIN CHEF AI CHAT (Groq — Fast)
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
      ? `\n\nUSER ABHI YEH RECIPE BAN RAHA/RAHI HAI: ${currentRecipe.name}
         Ingredients: ${currentRecipe.ingredients.map(i => `${i.amount} ${i.unit} ${i.name}`).join(', ')}`
      : '';

    const historyText = chatHistory
      .slice(-6) // last 3 exchanges only (keep context small)
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
    return '😅 Thodi si problem aa gayi! Dobara try karo yaar.';
  }
}

// ============================================
// RECIPE GENERATION (Groq — High Quality)
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

    const prompt = `You are an expert chef and nutritionist. Generate a complete detailed recipe for "${dishName}" scaled for exactly ${preferences.servings || 4} servings.

Return ONLY valid JSON (no markdown, no extra text):
{
  "name": "${dishName}",
  "nameHindi": "dish name in Hindi",
  "description": "2-3 line Hinglish description of the dish",
  "cuisine": "indian OR chinese OR italian OR other",
  "difficulty": "${preferences.difficulty || 'intermediate'}",
  "prepTime": <number in minutes>,
  "cookTime": <number in minutes>,
  "servings": ${preferences.servings || 4},
  "isVeg": ${preferences.isVeg !== undefined ? preferences.isVeg : true},
  "calories": <number>,
  "rating": 4.5,
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
      "description": "Detailed Hinglish instruction (3-4 sentences) — what to do, how it looks/smells/sounds when done.",
      "duration": <seconds as number>,
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
  "tags": ["tag1", "tag2"]
}
Generate ALL ingredients and ALL steps (5-8 steps) for a complete recipe.`;

    const text = await callGroq(prompt);
    const recipe = parseJSONResponse(text);
    
    const finalRecipe = { ...recipe, imageUrl: imageUrl };
    await setCachedData(cacheKey, finalRecipe);
    return finalRecipe;

  } catch (error: unknown) {
    console.error('Recipe generation error:', error);
    const imageUrl = getDishImageUrl(dishName);
    return {
      id: 'auto-gen',
      name: `${dishName} (Fallback)`,
      nameHindi: 'Pakwan (AI Unavailable)',
      description: 'Ghar par banao, ekdum restaurant jaisa swad aayega!',
      cuisine: 'indian' as import('@/types').CuisineType,
      difficulty: (preferences.difficulty as import('@/types').DifficultyLevel) || 'beginner',
      prepTime: 15,
      cookTime: 25,
      servings: preferences.servings || 4,
      isVeg: preferences.isVeg !== undefined ? preferences.isVeg : true,
      imageUrl: imageUrl,
      ingredients: [
        { id: '1', name: 'Main Ingredient', nameHindi: 'Zaroori Samagri', amount: 200, unit: 'g', optional: false },
        { id: '2', name: 'Onion', nameHindi: 'Pyaaz', amount: 2, unit: 'pcs', optional: false },
        { id: '3', name: 'Tomato', nameHindi: 'Tamatar', amount: 2, unit: 'pcs', optional: false },
        { id: '4', name: 'Oil', nameHindi: 'Tel', amount: 2, unit: 'tbsp', optional: false },
        { id: '5', name: 'Salt', nameHindi: 'Namak', amount: 1, unit: 'tsp', optional: false },
      ],
      steps: [
        { id: '1', stepNumber: 1, title: 'Taiyari Karo', description: 'Sabhi ingredients measure karke ready kar lo. Vegetables dhoke kaat lo.', duration: 600, tips: ['Pehle se sab ready rakhoge toh cooking smooth hogi'] },
        { id: '2', stepNumber: 2, title: 'Tadka Lagao', description: 'Kadhai mein tel garam karo. Pyaaz daalo aur golden hone tak bhuno.', duration: 480, tips: ['Medium flame pe bhuno — jaldi mat karo'] },
        { id: '3', stepNumber: 3, title: 'Main Ingredient Pakao', description: 'Main ingredient daalo aur achhi tarah bhuno. Dhakkan lagao aur pakne do.', duration: 900, tips: ['Beech beech mein check karte raho'] },
        { id: '4', stepNumber: 4, title: 'Garnish Karo', description: 'Hara dhaniya aur lemon se garnish karo. Garam garam serve karo!', duration: 120, tips: ['Garnish se presentation 10x better hoti hai'] },
      ],
      nutrition: { calories: 320, protein: 14, carbs: 35, fat: 12, fiber: 6 },
      tags: ['homemade', 'indian'],
    };
  }
}

// ============================================
// VOICE INGREDIENT ADAPTER (Groq)
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

    const text = await callGroq(prompt);
    return parseJSONResponse(text);
  } catch (error) {
    console.error('Ingredient adapter error:', error);
    return {
      adaptedRecipe: 'Jo ingredients hain unse ek simple aur tasty dish ban sakti hai!',
      missingIngredients: [],
      substitutes: {},
      encouragement: 'Main hoon na help karne ke liye! Chal banate hain kuch zabardast! 😊',
    };
  }
}

// ============================================
// CAMERA ANALYSIS (OpenRouter Vision)
// ============================================

export async function analyzeCookingFrame(
  imageBase64: string,
  currentStep: string,
  chefId: ChefId,
  language: AppLanguage
): Promise<string> {
  try {
    const chef = CHEF_PROFILES[chefId];
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
// AI DISH RATER (OpenRouter Vision)
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
      score: 8,
      presentation: 8,
      color: 8,
      feedback: 'Ekdum achhi dish lagi rahi hai! Thodi garnishing aur perfect ho jaayegi.',
      improvements: ['Garnish with fresh coriander', 'Serve hot for best taste'],
      shareCaption: 'Ghar pe restaurant jaisa khana! 🧑‍🍳✨ #ZaykaAI #HomeCooking',
    };
  }
}

// ============================================
// FRIDGE SCAN (OpenRouter Vision)
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

    const text = await callVision(prompt, imageBase64, false);
    return parseJSONResponse(text) as string[];
  } catch (error) {
    console.error('Fridge scanning error:', error);
    return ['🧅 Pyaaz', '🍅 Tamatar', '🌶️ Hari Mirch', '🥔 Aloo'];
  }
}

// ============================================
// BUDGET MEAL (Groq Text)
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

    const text = await callGroq(prompt);
    
    const result = parseJSONResponse(text);
    await setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Budget meal error:', error);
    return {
      dishName: 'Masala Maggi with Veggies',
      description: `Sasta, sundar aur tikau! ₹${budget} mein pet bhar jayega.`,
      totalCost: Math.min(budget, 45),
      ingredients: [{ name: 'Maggi', estimatedCost: 14 }, { name: 'Veggies', estimatedCost: 20 }],
      quickRecipe: 'Pani ubalo, maggi aur masala daalo, 2 min wait karo.',
    };
  }
}

// ============================================
// FUSION RECIPE (Groq Text)
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

    const text = await callGroq(prompt);
    
    const result = parseJSONResponse(text);
    await setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Fusion error:', error);
    return {
      fusionName: 'Crazy Mix Bowl',
      emoji: '🍲',
      tagline: 'Sab kuch ek saath!',
      description: 'Jo accha laga sab mila diya — ek unique aur tasty dish!',
      ingredients: likedFoods,
      instructions: 'Step 1: Mix everything. Step 2: Cook on medium flame. Step 3: Enjoy!',
    };
  }
}
