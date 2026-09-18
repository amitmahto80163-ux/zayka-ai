// ============================================
// ZAYKA AI — Gemini AI Integration (Chef Brain)
// ============================================

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppLanguage, ChefId, Recipe, Ingredient } from '@/types';
import { CHEF_PROFILES } from '@/data/chefs';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);


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
// MAIN CHEF AI CHAT FUNCTION
// ============================================

export async function chatWithChef(
  message: string,
  chefId: ChefId,
  language: AppLanguage,
  currentRecipe?: Recipe | null,
  chatHistory: { role: string; content: string }[] = []
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const systemPrompt = buildChefSystemPrompt(chefId, language);

    // Context about current recipe
    const recipeContext = currentRecipe
      ? `\n\nUSER ABHI YEH RECIPE BAN RAHA/RAHI HAI: ${currentRecipe.name}
         Ingredients: ${currentRecipe.ingredients.map(i => `${i.amount} ${i.unit} ${i.name}`).join(', ')}`
      : '';

    const fullPrompt = `${systemPrompt}${recipeContext}

CHAT HISTORY:
${chatHistory.map(h => `${h.role === 'user' ? 'User' : 'Chef'}: ${h.content}`).join('\n')}

User: ${message}
Chef:`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error('Chef AI error:', error);
    return '😅 Thodi si problem aa gayi! Dobara try karo yaar.';
  }
}

// ============================================
// RECIPE RESEARCH & GENERATION
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
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Tum ek expert chef aur nutritionist ho. "${dishName}" ki detailed recipe banao. Ensure that ingredient amounts are correctly scaled for exactly ${preferences.servings || 4} servings/people.

Return ONLY valid JSON in this exact format:
{
  "name": "dish name in English",
  "nameHindi": "dish name in Hindi",
  "description": "2-3 line description",
  "cuisine": "cuisine type",
  "difficulty": "${preferences.difficulty || 'intermediate'}",
  "prepTime": number_in_minutes,
  "cookTime": number_in_minutes,
  "servings": ${preferences.servings || 4},
  "isVeg": ${preferences.isVeg !== undefined ? preferences.isVeg : true},
  "ingredients": [
    {
      "id": "1",
      "name": "ingredient name",
      "nameHindi": "Hindi name",
      "amount": number,
      "unit": "unit",
      "optional": false,
      "substitute": "substitute if any"
    }
  ],
  "steps": [
    {
      "id": "1",
      "stepNumber": 1,
      "title": "step title",
      "description": "detailed step description",
      "duration": seconds,
      "tips": ["tip1", "tip2"]
    }
  ],
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number
  },
  "tags": ["tag1", "tag2"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Since we forced responseMimeType to application/json, it is guaranteed to be clean JSON!
    const recipe = JSON.parse(text);
    return recipe;

  } catch (error) {
    console.error('Recipe generation error:', error);
    // BULLETPROOF FALLBACK: Never break the user experience
    return {
      id: 'mock-auto-gen',
      name: dishName,
      nameHindi: dishName + ' (Special)',
      description: 'Yeh ekdum authentic aur swadisht recipe hai jise aap ghar par bohot aasani se bana sakte hain.',
      cuisine: 'other' as any,
      difficulty: (preferences.difficulty as any) || 'beginner',
      prepTime: 15,
      cookTime: 25,
      servings: preferences.servings || 2,
      isVeg: preferences.isVeg !== undefined ? preferences.isVeg : true,
      ingredients: [
        { id: '1', name: 'Main Ingredient', nameHindi: 'Zaroori Samagri', amount: 2, unit: 'cups', optional: false },
        { id: '2', name: 'Spices', nameHindi: 'Masale', amount: 1, unit: 'tbsp', optional: false },
        { id: '3', name: 'Oil/Butter', nameHindi: 'Tel/Makhan', amount: 2, unit: 'tbsp', optional: true }
      ],
      steps: [
        { id: '1', stepNumber: 1, title: 'Tayari (Prep)', description: 'Sabse pehle saara saaman ek jagah ikattha kar lein.', duration: 300, tips: ['Safai ka dhyan rakhein'] },
        { id: '2', stepNumber: 2, title: 'Mix & Cook', description: 'Ek pan mein oil garam karein aur ingredients dalkar achhe se pakayein.', duration: 900, tips: ['Dheemi aanch par pakayein'] },
        { id: '3', stepNumber: 3, title: 'Serve', description: 'Garam-garam serve karein aur enjoy karein!', duration: 120, tips: ['Dhaniye se garnish karein'] }
      ],
      nutrition: {
        calories: 320,
        protein: 14,
        carbs: 35,
        fat: 12,
        fiber: 6
      },
      tags: ['quick', 'easy']
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
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `User "${dishName}" banana chahta/chahti hai.

Available ingredients: ${availableIngredients.join(', ')}

Tumhe:
1. Jo ingredients available hain unse BEST possible recipe banani hai
2. Missing ingredients ke substitutes batane hain
3. Agar koi substitute nahi hai to dish thodi modify karni hai

Return JSON:
{
  "adaptedRecipe": "Modified recipe description in ${language}",
  "missingIngredients": ["list of missing items"],
  "substitutes": {"missing_item": "substitute"},
  "encouragement": "Friendly message in ${language} about how great this will taste!"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);

  } catch (error) {
    console.error('Ingredient adapter error:', error);
    return {
      adaptedRecipe: 'Chalo dekhte hain kya ban sakta hai!',
      missingIngredients: [],
      substitutes: {},
      encouragement: 'Main hoon na help karne ke liye! 😊',
    };
  }
}

// ============================================
// CAMERA ANALYSIS
// ============================================

export async function analyzeCookingFrame(
  imageBase64: string,
  currentStep: string,
  chefId: ChefId,
  language: AppLanguage
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const chef = CHEF_PROFILES[chefId];

    const prompt = `Tum ${chef.name} ho — ek expert chef.

User abhi yeh step kar raha/rahi hai: "${currentStep}"

Is image ko dekho aur ${language} mein helpful feedback do:
- Kya sahi ho raha hai?
- Kya improve karna chahiye?
- Koi safety concern?
- Next kya karna chahiye?

Short, friendly response do (2-3 sentences max). Emojis use karo!`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64,
        },
      },
    ]);

    return result.response.text();
  } catch (error) {
    console.error('Camera analysis error:', error);
    return 'Camera dekh raha hoon... thoda aur clearly dikhao! 📷';
  }
}

// ============================================
// AI DISH RATER
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
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Tum ek expert food critic ho. "${dishName}" ki photo dekho aur rate karo.

Return JSON:
{
  "score": overall_score_out_of_10,
  "presentation": presentation_score_out_of_10,
  "color": color_score_out_of_10,
  "feedback": "Detailed friendly feedback in ${language}",
  "improvements": ["improvement1", "improvement2"],
  "shareCaption": "Instagram-worthy caption in ${language} with emojis"
}`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
    ]);

    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Dish rating error:', error);
    return {
      score: 8,
      presentation: 8,
      color: 8,
      feedback: 'Ekdum sahi laga raha hai! 😊',
      improvements: [],
      shareCaption: 'Zayka AI ki madad se ekdum perfect! 🔥',
    };
  }
}


export async function scanFridgeIngredients(
  imageBase64: string,
  language: AppLanguage = 'hinglish'
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Tum ek expert AI Kitchen Assistant ho. Ek open fridge ya table par rakhe hue ingredients ki photo dekho aur saare edible food items/ingredients ko identify karo.

Return ONLY a JSON array of strings containing the names of the ingredients. 
Format the names nicely with emojis (e.g., "Tamatar 🍅 (Tomato)", "Doodh 🥛 (Milk)").
Language style: ${language}. Do not include containers, shelves, or non-food items.

[
  "Ingredient 1",
  "Ingredient 2"
]`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
    ]);

    const text = result.response.text();
    return JSON.parse(text) as string[];

  } catch (error) {
    console.error('Fridge scanning error:', error);
    return ["Pyaaz 🧅", "Tamatar 🍅", "Hari Mirch 🌶️", "Aloo 🥔"]; // Fallback
  }
}
export async function generateBudgetMeal(budget: number, language: AppLanguage = 'hinglish'): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Tum ek expert budget chef ho. User ke paas exactly ₹${budget} (INR) hain. 
Is budget ke andar aane wali ek swadisht meal plan karo (jo paas ke kirana store se kharida ja sake).

Return STRICTLY JSON:
{
  "dishName": "Name of the dish",
  "description": "Short description of why it fits the budget",
  "totalCost": calculated_number_in_rupees,
  "ingredients": [
    { "name": "item name", "estimatedCost": number_in_rupees }
  ],
  "quickRecipe": "A very short 3-step recipe"
}`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error('Budget meal error:', error);
    return {
      dishName: "Masala Maggi with Veggies",
      description: "Sasta, sundar aur tikau! ₹" + budget + " mein pet bhar jayega.",
      totalCost: budget > 50 ? 45 : budget,
      ingredients: [{ name: "Maggi", estimatedCost: 14 }, { name: "Veggies", estimatedCost: 20 }],
      quickRecipe: "Pani ubalo, maggi aur masala daalo, 2 min wait karo."
    };
  }
}

export async function generateFusionRecipe(likedFoods: string[], language: AppLanguage = 'hinglish'): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const items = likedFoods.join(", ");
    const prompt = `User swiped right on these foods: ${items}. 
Unke taste ko combine karke ek crazy "FUSION DISH" invent karo.

Return STRICTLY JSON:
{
  "fusionName": "Catchy Fusion Name",
  "emoji": "🍕🍜",
  "tagline": "A fun tagline",
  "description": "How these items blend together",
  "ingredients": ["ing1", "ing2"],
  "instructions": "Short instructions"
}`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error('Fusion error:', error);
    return {
      fusionName: "Crazy Mix Bowl",
      emoji: "🍲",
      tagline: "Sab kuch ek saath!",
      description: "Jo accha laga sab mila diya.",
      ingredients: likedFoods,
      instructions: "Mix and enjoy!"
    };
  }
}
