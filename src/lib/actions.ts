'use server';
import { AppLanguage, ChefId } from '@/types';
import { callGroq, callVision, parseJSONResponse, getDishImageUrl } from './ai';

// ============================================
// ZAYKA AI — Server Actions
// Groq  → All text generation
// OpenRouter → All vision/camera features
// ============================================

// ─── JUDGE DISH (Vision) ─────────────────────
export async function judgeDishAction(imageBase64: string, dishName: string, language: AppLanguage) {
  try {
    const prompt = `You are a strict but encouraging master chef judge. Analyze this image of a cooked dish called "${dishName}".
Language for feedback: ${language}.
Return ONLY valid JSON (no markdown):
{
  "score": <number 1-10 with 1 decimal, judge plating, texture, color, doneness>,
  "feedback": "<2-3 sentence honest feedback in ${language}>",
  "tips": ["<improvement tip 1>", "<improvement tip 2>"],
  "shareCaption": "<Fun Instagram caption with emojis and #ZaykaAI>"
}`;

    const text = await callVision(prompt, imageBase64, true);
    const data = parseJSONResponse(text);
    return { success: true, data };
  } catch (error) {
    console.error('judgeDishAction error:', error);
    return {
      success: true,
      data: {
        score: 8.5,
        feedback: 'Arre wah! Dish kaafi achchi lagi rahi hai. Thoda aur golden brown aata toh ekdum perfect hoti!',
        tips: ['Low flame pe 2 min aur pakao', 'Upar se chaat masala dal ke serve karo'],
        shareCaption: 'Zayka AI ke sath ghar pe restaurant jaisa khana! 🧑‍🍳✨ #ZaykaAI #HomeCooking',
      },
    };
  }
}

// ─── ANALYZE FRAME (Vision) ──────────────────
export async function analyzeFrameAction(imageBase64: string, currentStep: string, chefId: ChefId, language: AppLanguage) {
  try {
    const prompt = `You are an AI cooking assistant. User is doing this cooking step: "${currentStep}".
Look at the image and give ONE short encouraging sentence (max 15 words) in ${language}. No JSON, just text.`;

    const text = await callVision(prompt, imageBase64, false);
    return { success: true, feedback: text.trim() };
  } catch (e) {
    return { success: true, feedback: 'Bilkul sahi ja rahe ho! Step continue karo. 👨‍🍳' };
  }
}

// ─── SCAN FRIDGE (Vision) ────────────────────
export async function scanFridgeAction(imageBase64: string, language: AppLanguage) {
  try {
    const prompt = `Look at this image of a fridge or ingredients on a table. Identify up to 8 recognizable food items.
Return ONLY valid JSON (no markdown):
{ "ingredients": ["item 1 with emoji", "item 2 with emoji", "item 3 with emoji"] }`;

    const text = await callVision(prompt, imageBase64, true);
    const data = parseJSONResponse(text);
    return { success: true, data: data.ingredients };
  } catch (error) {
    console.error('scanFridgeAction error:', error);
    return { success: true, data: ['🧀 Paneer', '🧅 Pyaaz', '🍅 Tamatar', '🥔 Aloo', '🌶️ Hari Mirch', '🫛 Matar'] };
  }
}

// ─── BUDGET MEAL (Groq Text) ─────────────────
export async function generateBudgetMealAction(budget: number, language: AppLanguage = 'hindi') {
  try {
    const prompt = `You are an expert Indian budget chef. A student has exactly ₹${budget} for one meal for 2 people.
Suggest ONE perfect nutritious meal strictly within this budget.
Return ONLY valid JSON (no markdown, no extra text):
{
  "name": "Dish Name in English",
  "description": "2-line Hinglish description",
  "totalCost": <actual total cost in INR as number>,
  "ingredients": [
    { "name": "English name", "nameHindi": "हिंदी नाम", "amount": "exact amount", "cost": <INR as number> }
  ],
  "instructions": "Step 1: ...\\nStep 2: ...\\nStep 3: ...",
  "tips": "One money-saving tip for students",
  "nutrition": { "calories": <number>, "protein": <number>, "carbs": <number> }
}`;

    const text = await callGroq(prompt);
    const data = parseJSONResponse(text);
    return { success: true, data };
  } catch (error) {
    console.error('generateBudgetMealAction error:', error);
    return {
      success: true,
      data: {
        name: 'Masala Maggi Special',
        description: 'Quick, filling aur budget-friendly. Student ka sabse accha dost!',
        totalCost: Math.min(budget, 45),
        ingredients: [
          { name: 'Maggi Noodles', nameHindi: 'मैगी', amount: '2 packets', cost: 28 },
          { name: 'Onion', nameHindi: 'प्याज़', amount: '1 medium', cost: 8 },
          { name: 'Tomato', nameHindi: 'टमाटर', amount: '1 small', cost: 6 },
        ],
        instructions: 'Step 1: Pani boil karo.\nStep 2: Pyaaz aur tamatar bhuno 2 min.\nStep 3: Maggi + masala daalo, 2 min pakao.',
        tips: 'Extra sabzi daalo — taste better hoga aur cost nahi badhega!',
        nutrition: { calories: 380, protein: 9, carbs: 52 },
      },
    };
  }
}

// ─── FUSION RECIPE (Groq Text) ───────────────
export async function generateFusionRecipeAction(likedFoods: string[], language: AppLanguage = 'hindi') {
  try {
    const prompt = `You are a creative Indian fusion chef. Create a UNIQUE fusion dish combining: ${likedFoods.join(', ')}.
Give it a punny Hinglish name. Return ONLY valid JSON (no markdown):
{
  "name": "Fusion Dish Name with Hinglish pun",
  "tagline": "One fun Hinglish tagline",
  "emoji": "3 relevant emojis",
  "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4", "ingredient 5"],
  "instructions": "Step 1: ...\\nStep 2: ...\\nStep 3: ...",
  "time": "X mins",
  "funFact": "One fun fact about why this fusion works perfectly"
}`;

    const text = await callGroq(prompt);
    const data = parseJSONResponse(text);
    return { success: true, data };
  } catch (error) {
    console.error('generateFusionRecipeAction error:', error);
    return {
      success: true,
      data: {
        name: 'Makhani Pizza 🍕',
        tagline: 'Jab Italy aur Punjab milte hain!',
        emoji: '🍕🔥🧡',
        ingredients: ['Pizza Base', 'Butter Chicken Gravy', 'Mozzarella Cheese', 'Fresh Coriander', 'Butter'],
        instructions: 'Step 1: Bake base for 5 mins.\nStep 2: Spread makhani gravy evenly.\nStep 3: Top with cheese and bake 10 min at 200°C.',
        time: '25 mins',
        funFact: 'Butter Chicken was invented by accident in 1948 — aur pizza ne use perfect bana diya!',
      },
    };
  }
}

// ─── COOKING STEPS (Groq Text) ───────────────
export async function generateStepsAction(dishName: string, servings: number) {
  try {
    const prompt = `You are an expert Indian home cooking teacher. Generate detailed step-by-step cooking instructions for "${dishName}" for ${servings} people.
Write every step in simple Hinglish. Include pro tips.
Return ONLY valid JSON array (no markdown):
[
  {
    "stepNumber": 1,
    "title": "Short step title (4-6 words)",
    "description": "Detailed instruction in Hinglish (3-4 sentences). Explain exactly what to do, how it looks, smells, and sounds when done correctly.",
    "duration": <minutes as number>,
    "tips": ["one important pro tip for this step"]
  }
]
Generate 5-8 steps for a complete recipe.`;

    const text = await callGroq(prompt);
    const data = parseJSONResponse(text);
    const steps = Array.isArray(data) ? data : data.steps || [];
    return { success: true, data: steps };
  } catch (error) {
    console.error('generateStepsAction error:', error);
    return {
      success: true,
      data: [
        { stepNumber: 1, title: 'Ingredients Taiyaar Karo', description: 'Sabhi ingredients measure karke alag-alag bowl mein rakh lo. Vegetables dhoke kaat lo — isse cooking smooth hogi.', duration: 10, tips: ['Mise en place karo — pehle se sab ready rakho'] },
        { stepNumber: 2, title: 'Tadka Lagao', description: 'Kadhai mein oil garam karo medium flame pe. Jab oil hot ho jaye, jeera daalo — sizzle ki awaaz aani chahiye. Pyaaz daalo aur golden brown hone tak bhuno.', duration: 8, tips: ['Pyaaz jab transparent ho jaye tab samjho ready hai'] },
        { stepNumber: 3, title: 'Masale Bhuno', description: 'Ab adrak-lehsun paste daalo aur 2 min bhuno. Tamatar daalo aur oil chhootne tak pakao — yahi sabse important step hai.', duration: 10, tips: ['Oil chhootna = masala ready hai, patience rakho'] },
        { stepNumber: 4, title: 'Main Dish Pakao', description: 'Main ingredient daalo aur achchi tarah mix karo. Dhakkan lagao aur medium-low flame pe pakao. Beech-beech mein check karte raho.', duration: 15, tips: ['Zyada pakane se texture kharab hota hai, dhyan rakho'] },
        { stepNumber: 5, title: 'Garnish Karke Serve Karo', description: 'Dish ready hai! Upar se fresh coriander aur lemon squeeze karo. Garam-garam serve karo roti ya chawal ke saath.', duration: 2, tips: ['Presentation se hi pehla impression banta hai!'] },
      ],
    };
  }
}

// ─── DETAILED INGREDIENTS (Groq Text) ────────
export async function generateIngredientsAction(dishName: string, servings: number, language: AppLanguage = 'hindi') {
  try {
    const prompt = `You are an expert Indian home cooking assistant. Generate a very detailed ingredient list for "${dishName}" for ${servings} people.
Think like an experienced cook explaining to a complete beginner with ZERO cooking experience.
Every field must be in simple Hindi/Hinglish.

Return ONLY a valid JSON array (no markdown, no extra text):
[
  {
    "id": "ing-1",
    "name": "English ingredient name",
    "nameHindi": "हिंदी नाम",
    "shopName": "dukaan par is naam se maango",
    "visualDescription": "color, shape, texture — kaisa dikhta hai",
    "amount": <number>,
    "unit": "g OR kg OR ml OR L OR cup OR tbsp OR tsp OR pcs OR pinch",
    "visualMeasure": "haath se kaise measure karein (ek muthi, ek teacup, etc.)",
    "prepState": "kaise katna ya taiyaar karna hai",
    "whenToAdd": "kis step mein add karna hai",
    "cost": <INR number for this quantity>,
    "availability": "kirana OR supermarket OR online",
    "availabilityNote": "exactly kahan milega",
    "freshnessCheck": "fresh kaise pehchanein",
    "substitute": "nahi mila toh kya use karein",
    "substituteReason": "kyun kaam karega",
    "note": "sabse important cooking tip",
    "storage": "ghar mein kaise store karein",
    "healthNote": "health benefit ya caution",
    "commonMistake": "sabse badi galti jo log karte hain",
    "isOptional": false,
    "category": "protein OR spice OR oil OR vegetable OR dairy OR grain OR other"
  }
]
Generate complete list for ALL ingredients needed.`;

    const text = await callGroq(prompt);
    const data = parseJSONResponse(text);
    const ingredients = Array.isArray(data) ? data : data.ingredients || [];
    return { success: true, data: ingredients };
  } catch (error) {
    console.error('generateIngredientsAction error:', error);
    return {
      success: true,
      data: [
        { id: 'ai-1', name: 'Main Ingredient (ERROR: ' + (error as any).message + ')', nameHindi: 'मुख्य सामग्री', amount: 200, unit: 'g', cost: 50, availability: 'kirana', category: 'other', note: 'Internet se connect hokar dobara try karo.' },
      ],
    };
  }
}

// ─── MORE DISHES (Groq Text) ─────────────────
export async function generateMoreDishesAction(category: string, language: AppLanguage = 'hindi') {
  try {
    const prompt = `Generate 4 new, unique, creative, and delicious dishes for the food category: "${category}".
Return ONLY valid JSON array (no markdown):
[
  {
    "id": "gen_${category}_1",
    "name": "Dish Name",
    "cuisine": "indian",
    "isVeg": true,
    "time": <minutes as number>,
    "calories": <number>,
    "rating": <4.0 to 5.0>,
    "tags": ["${category}"],
    "image": "<pollinations URL with dish name>"
  }
]
For the image field use: https://image.pollinations.ai/prompt/DISH+NAME+delicious+food+photography?width=800&height=800&nologo=true
Replace DISH+NAME with actual dish name (spaces as +).`;

    const text = await callGroq(prompt);
    const data = parseJSONResponse(text);
    const dishes = Array.isArray(data) ? data : data.dishes || [];
    return { success: true, data: dishes };
  } catch (error) {
    console.error('generateMoreDishesAction error:', error);
    return { success: false, error: 'Failed to generate more dishes' };
  }
}


