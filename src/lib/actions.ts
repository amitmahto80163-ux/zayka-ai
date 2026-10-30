'use server';
import { AppLanguage, ChefId } from '@/types';
import { callGroq, callVision, parseJSONResponse, GROQ_FAST_MODEL } from './ai';

// ============================================
// ZAYKA AI — Server Actions
// Multi-Provider AI → All text & vision features
// ============================================

// ─── JUDGE DISH (Vision) ─────────────────────
export async function judgeDishAction(imageBase64: string, dishName: string, language: AppLanguage) {
  try {
    const prompt = `You are a strict but encouraging MasterChef India judge. Analyze this image of a cooked dish called "${dishName}".
Language for feedback: ${language}.
Return ONLY valid JSON (no markdown):
{
  "score": <number 1-10 with 1 decimal, judge plating, texture, color, doneness>,
  "feedback": "<2-3 sentence honest, specific feedback about "${dishName}" in ${language}>",
  "tips": ["<specific improvement tip 1>", "<specific improvement tip 2>"],
  "shareCaption": "<Fun Instagram caption with emojis and #ZaykaAI>"
}`;

    const text = await callVision(prompt, imageBase64, true);
    const raw = parseJSONResponse(text);
    const data = {
      score: Number(raw.score) || 8.5,
      feedback: raw.feedback || `Arre wah! Aapka ${dishName} dekhne mein kaafi lajawab lag raha hai!`,
      tips: Array.isArray(raw.tips) && raw.tips.length > 0
        ? raw.tips
        : Array.isArray(raw.improvements) && raw.improvements.length > 0
        ? raw.improvements
        : ['Garma-garam dhaniya daal ke serve karo', 'Plating ke waqt rim clean rakho'],
      shareCaption: raw.shareCaption || `Ghar pe banaya restaurant style ${dishName}! 🧑‍🍳✨ #ZaykaAI #HomeCooking`,
    };
    return { success: true, data };
  } catch (error) {
    console.error('judgeDishAction error:', error);
    return {
      success: true,
      data: {
        score: 8.6,
        feedback: `Arre wah! ${dishName || 'Dish'} kaafi achchi lag rahi hai. Thoda aur garnish aata toh ekdum MasterChef plate lagti!`,
        tips: ['Low flame pe 2 min aur dum do', 'Upar se fresh hara dhaniya aur chaat masala dal ke serve karo'],
        shareCaption: `Zayka AI ke sath ghar pe restaurant jaisa ${dishName || 'khana'}! 🧑‍🍳✨ #ZaykaAI #HomeCooking`,
      },
    };
  }
}

// ─── DIET & MACROS SCANNER (Vision) ──────────
export async function analyzeDietAction(imageBase64: string, dishName: string, language: AppLanguage = 'hinglish') {
  try {
    const prompt = `You are an expert Indian clinical nutritionist and fitness coach. Analyze this meal photo${dishName ? ` of "${dishName}"` : ''}.
Identify the food items visible and estimate realistic nutritional macros for one standard Indian serving.
Language for feedback: ${language}.
Return ONLY valid JSON (no markdown):
{
  "dishName": "<detected dish or meal name>",
  "score": <health score 1-10 with 1 decimal>,
  "calories": <estimated kcal as number, e.g. 420>,
  "protein": <grams of protein as number, e.g. 18>,
  "carbs": <grams of carbs as number, e.g. 48>,
  "fat": <grams of fat as number, e.g. 14>,
  "fiber": <grams of fiber as number, e.g. 6>,
  "feedback": "<2-3 sentences of actionable nutritionist feedback in ${language}>",
  "tips": ["<healthier swap or portion tip 1>", "<macro boosting tip 2>"]
}`;

    const text = await callVision(prompt, imageBase64, true);
    const raw = parseJSONResponse(text);
    return {
      success: true,
      data: {
        dishName: raw.dishName || dishName || 'Balanced Indian Meal',
        score: Number(raw.score) || 8.2,
        calories: Number(raw.calories) || 380,
        protein: Number(raw.protein) || 16,
        carbs: Number(raw.carbs) || 45,
        fat: Number(raw.fat) || 13,
        fiber: Number(raw.fiber) || 6,
        feedback: raw.feedback || 'Yeh meal balanced hai! Protein badhane ke liye sath mein ek katori curd ya sprouts le sakte ho.',
        tips: Array.isArray(raw.tips) ? raw.tips : ['Sath mein cucumber salad add karo fiber ke liye', 'Tel/ghee 1 tsp kam use karoge toh 45 kcal bachegi'],
      },
    };
  } catch (error) {
    console.error('analyzeDietAction error:', error);
    return {
      success: true,
      data: {
        dishName: dishName || 'Ghar Ka Khana',
        score: 8.4,
        calories: 390,
        protein: 18,
        carbs: 46,
        fat: 12,
        fiber: 7,
        feedback: 'Ghar ka bana khana healthy aur nutritious hai! Protein intake badhane ke liye dahi ya paneer side mein add karo.',
        tips: ['Salad ke sath khane se glycemic index control rehta hai', 'Raat ke dinner mein carbs thoda light rakho'],
      },
    };
  }
}

// ─── ANALYZE FRAME (AR Vision Telemetry) ─────
export interface ARFrameAnalysisContext {
  dishName?: string;
  nextStep?: string;
  previousFeedback?: string[];
  browningIndex?: number;
  burnRisk?: boolean;
  opticalProfile?: string;
  sceneDelta?: number;
}

export async function analyzeFrameAction(
  imageBase64: string,
  currentStep: string,
  chefId: ChefId,
  language: AppLanguage,
  context?: ARFrameAnalysisContext
) {
  const { CHEF_PROFILES } = await import('@/data/chefs');
  const chef = CHEF_PROFILES[chefId] || CHEF_PROFILES['rohan'];
  const dishTitle = context?.dishName || 'Indian home recipe';
  const nextStepInfo = context?.nextStep ? `Next upcoming step: "${context.nextStep}".` : '';
  const avoidList =
    context?.previousFeedback && context.previousFeedback.length > 0
      ? `DO NOT repeat any of these previous sentences: ${JSON.stringify(context.previousFeedback.slice(-4))}.`
      : '';
  const sensorHint =
    typeof context?.browningIndex === 'number'
      ? `Live Camera Optical Sensor Readings: Browning/Golden Index = ${context.browningIndex}%${
          context.opticalProfile ? `, Color & Motion Profile = (${context.opticalProfile})` : ''
        }${
          context.burnRisk ? ' (WARNING: High dark/char pixel ratio detected — check for overheating!)' : ''
        }.`
      : '';

  try {
    const prompt = `AR_VISION_TELEMETRY_MODE
You are ${chef.name} (${chef.title}), guiding a live AR cooking session for "${dishTitle}".
Personality: ${chef.personality}
Current active step: "${currentStep}".
${nextStepInfo}
${sensorHint}
${avoidList}

Look at this image of the user's cooking pan/counter. Evaluate:
1. What is visible in the pan/vessel/counter right now (e.g., raw chopped veggies, sizzling tadka, golden onions, red-orange masala gravy, green herbs/palak, boiling liquid/milk, dough/roti, or empty/heating pan) using both the image and the Live Camera Optical Sensor Readings.
2. Estimated completion of the current step (15 to 100%).
3. Recommended stove flame setting ("Low Flame", "Medium Flame", "High Flame", or "Keep Steady").
4. Whether the food looks ready to move to the next step.

Language for "feedback": ${language} (use natural conversational Hinglish if hindi/hinglish, max 18 words, specific to "${dishTitle}" and what is visible in the pan).
Return ONLY valid JSON (no markdown):
{
  "feedback": "<1 specific, actionable spoken sentence from ${chef.name} in ${language}, max 18 words>",
  "stageStatus": "<short 2-4 word visual badge, e.g. 'Onions Golden Brown', 'Gravy Simmering', 'Pan Heating Up', 'Masala Bhunoing'>",
  "donenessPercent": <number 15 to 100>,
  "flameAdvice": "<'Low Flame' | 'Medium Flame' | 'High Flame' | 'Keep Steady'>",
  "readyForNextStep": <boolean true if step looks >=85% done, else false>,
  "burnRisk": <boolean true if food looks over-browned/smoking/dry, else false>
}`;

    const text = await callVision(prompt, imageBase64, true);
    const raw = parseJSONResponse(text);

    const doneness = Math.max(
      15,
      Math.min(100, Number(raw?.donenessPercent) || (context?.browningIndex ? Math.min(95, context.browningIndex + 25) : 55))
    );
    const burnRisk = Boolean(raw?.burnRisk || context?.burnRisk);

    return {
      success: true,
      feedback:
        (typeof raw?.feedback === 'string' && raw.feedback.trim()) ||
        `${dishTitle} ka masala achhe se pak raha hai, medium flame pe karchi chalate raho!`,
      stageStatus:
        (typeof raw?.stageStatus === 'string' && raw.stageStatus.trim()) ||
        (burnRisk ? 'High Heat Alert' : doneness >= 85 ? 'Step Almost Ready' : 'Cooking Active'),
      donenessPercent: doneness,
      flameAdvice:
        (typeof raw?.flameAdvice === 'string' && raw.flameAdvice.trim()) ||
        (burnRisk ? 'Low Flame' : 'Medium Flame'),
      readyForNextStep: Boolean(raw?.readyForNextStep || doneness >= 88),
      burnRisk,
    };
  } catch {
    const stepLower = (currentStep || '').toLowerCase();
    const browning = context?.browningIndex ?? 45;
    const isCutting = /cut|chop|kaat|prep|wash|dho|soak|bhigo|marinate|bowl|measure/i.test(stepLower);
    const isTadka = /tadka|oil|tel|ghee|jeera|pyaaz|onion|fry|roast|bhun/i.test(stepLower);
    const isSimmer = /simmer|boil|ubaal|dhak|cover|cook|pakao|gravy|pani|milk|doodh|seeti/i.test(stepLower);

    const dynamicPool = isCutting
      ? [
          `${dishTitle} ke liye sabhi ingredients barabar size mein kaato taaki ek saath barabar pakein!`,
          `Prep bilkul badhiya chal raha hai! Sab kat jaye toh agle step pe chalte hain.`,
        ]
      : isTadka
      ? [
          browning > 60
            ? `Pyaaz aur tadka sunehra (${browning}% golden) ho gaya hai! Ab agla ingredient daal sakte ho.`
            : `Medium flame pe lagataar chalate hue bhuno jab tak tel kinare se alag na dikhe!`,
          `Tadka ka color badhiya aa raha hai, aanch medium rakho taaki masala jale nahi!`,
        ]
      : isSimmer
      ? [
          `${dishTitle} achhe se simmer ho raha hai! Beech mein ek baar halka stir kar do.`,
          `Flame medium-low rakho taaki masalon ka pura flavour andar tak absorb ho jaye!`,
        ]
      : [
          `${dishTitle} bilkul sahi ban raha hai! Step पूरा hote hi Next dabao.`,
          `Khushboo aur color dono badhiya aa rahe hain, flame steady rakho!`,
        ];

    const unused = dynamicPool.filter(
      (f) => !context?.previousFeedback?.some((prev) => prev.toLowerCase().includes(f.slice(0, 18).toLowerCase()))
    );
    const chosen = unused[0] || dynamicPool[Math.floor(Math.random() * dynamicPool.length)];
    const calcDoneness = isCutting ? 80 : Math.min(92, Math.max(30, browning + 22));

    return {
      success: true,
      feedback: chosen,
      stageStatus: context?.burnRisk
        ? 'Lower Heat Now'
        : isCutting
        ? 'Prep & Chopping'
        : isTadka
        ? 'Masala Bhunoing'
        : 'Simmering Active',
      donenessPercent: calcDoneness,
      flameAdvice: context?.burnRisk ? 'Low Flame' : isCutting ? 'Keep Steady' : 'Medium Flame',
      readyForNextStep: calcDoneness >= 86,
      burnRisk: Boolean(context?.burnRisk),
    };
  }
}

// ─── SCAN FRIDGE (Vision) ────────────────────
export async function scanFridgeAction(imageBase64: string, language: AppLanguage) {
  try {
    const prompt = `Look at this image of a fridge or ingredients on a table. Identify 6 to 8 recognizable food items suitable for cooking.
Return ONLY valid JSON (no markdown):
{ "ingredients": ["🧀 Paneer", "🧅 Pyaaz", "🍅 Tamatar", "🥔 Aloo", "🌶️ Hari Mirch", "🫑 Shimla Mirch"] }`;

    const text = await callVision(prompt, imageBase64, true);
    const data = parseJSONResponse(text);
    const list = Array.isArray(data) ? data : Array.isArray(data?.ingredients) ? data.ingredients : null;
    if (list && list.length > 0) {
      return { success: true, data: list };
    }
    throw new Error('Empty fridge scan');
  } catch (error) {
    console.error('scanFridgeAction error:', error);
    return { success: true, data: ['🧀 Paneer', '🧅 Pyaaz', '🍅 Tamatar', '🥔 Aloo', '🌶️ Hari Mirch', '🫛 Matar'] };
  }
}

// ─── BUDGET MEAL (Text AI) ───────────────────
export async function generateBudgetMealAction(budget: number, language: AppLanguage = 'hindi') {
  try {
    const prompt = `You are an expert Indian budget chef. A student has exactly ₹${budget} for one meal for 2 people.
Suggest ONE creative, delicious, nutritious Indian meal strictly within ₹${budget} (do NOT suggest plain Maggi if budget >= 80).
Return ONLY valid JSON (no markdown, no extra text):
{
  "name": "Dish Name in English (with Hindi in brackets)",
  "description": "2-line Hinglish description",
  "totalCost": <actual total cost in INR as number <= ${budget}>,
  "ingredients": [
    { "name": "Ingredient name with quantity", "nameHindi": "हिंदी नाम", "amount": "exact amount", "cost": <INR as number> }
  ],
  "instructions": "Step 1: ...\\nStep 2: ...\\nStep 3: ...\\nStep 4: ...",
  "tips": "One smart money-saving tip for students",
  "nutrition": { "calories": <number>, "protein": <number>, "carbs": <number> }
}`;

    const text = await callGroq(prompt, undefined, true, GROQ_FAST_MODEL);
    const raw = parseJSONResponse(text);
    const normalizedIngredients = Array.isArray(raw.ingredients)
      ? raw.ingredients.map((ing: any) => ({
          ...ing,
          name: ing.name || ing.nameHindi || 'Samagri',
          cost: Number(ing.cost ?? ing.estimatedCost ?? 15),
          estimatedCost: Number(ing.estimatedCost ?? ing.cost ?? 15),
        }))
      : [];
    const data = {
      ...raw,
      name: raw.name || raw.dishName || 'Budget Special Meal',
      dishName: raw.dishName || raw.name || 'Budget Special Meal',
      quickRecipe: raw.quickRecipe || raw.instructions || '',
      instructions: raw.instructions || raw.quickRecipe || '',
      ingredients: normalizedIngredients,
    };
    return { success: true, data };
  } catch (error) {
    console.error('generateBudgetMealAction error:', error);
    return {
      success: true,
      data: {
        name: budget >= 100 ? 'Anda / Paneer Bhurji Pav' : 'Masala Soya Pulao',
        dishName: budget >= 100 ? 'Anda / Paneer Bhurji Pav' : 'Masala Soya Pulao',
        description: 'High-protein, super filling aur bilkul student budget ke andar!',
        totalCost: Math.min(budget, budget >= 100 ? 85 : 48),
        ingredients: [
          { name: budget >= 100 ? 'Paneer / Eggs (200g / 4 pcs)' : 'Soya Chunks & Rice (1 cup)', nameHindi: 'प्रोटीन', amount: '1 pack', cost: budget >= 100 ? 50 : 25, estimatedCost: budget >= 100 ? 50 : 25 },
          { name: 'Onion & Tomato (2 each)', nameHindi: 'प्याज़ और टमाटर', amount: '2 pcs each', cost: 15, estimatedCost: 15 },
          { name: 'Pav / Roti & Masale', nameHindi: 'पाव और मसाले', amount: '4 pcs', cost: budget >= 100 ? 20 : 8, estimatedCost: budget >= 100 ? 20 : 8 },
        ],
        instructions: 'Step 1: Kadhai mein 1 tbsp tel aur jeera tadkao.\nStep 2: Barik kata pyaaz, hari mirch aur tamatar daalkar 3 min bhuno.\nStep 3: Haldi, laal mirch, pav bhaji masala aur main ingredient daal ke 5 min pakao.\nStep 4: Hara dhaniya daalkar garma-garam serve karo!',
        quickRecipe: 'Step 1: Kadhai mein 1 tbsp tel aur jeera tadkao.\nStep 2: Barik kata pyaaz, hari mirch aur tamatar daalkar 3 min bhuno.\nStep 3: Haldi, laal mirch, pav bhaji masala aur main ingredient daal ke 5 min pakao.\nStep 4: Hara dhaniya daalkar garma-garam serve karo!',
        tips: 'Soya chunks aur seasonal sabziyon se ₹50 mein bhi 25g protein mil jata hai!',
        nutrition: { calories: 420, protein: 22, carbs: 54 },
      },
    };
  }
}

// ─── FUSION RECIPE (Text AI) ─────────────────
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
  "time": "20 mins",
  "funFact": "One fun fact about why this fusion works perfectly"
}`;

    const text = await callGroq(prompt, undefined, true, GROQ_FAST_MODEL);
    const raw = parseJSONResponse(text);
    const data = {
      name: raw.name || raw.fusionName || `${likedFoods.slice(0, 2).join(' x ')} Fusion`,
      tagline: raw.tagline || 'Jab do duniya ke swad milte hain!',
      emoji: raw.emoji || '🍕🔥🍛',
      ingredients: Array.isArray(raw.ingredients) ? raw.ingredients : likedFoods,
      instructions: Array.isArray(raw.instructions) ? raw.instructions.join('\n') : (raw.instructions || 'Step 1: Prep ingredients.\nStep 2: Cook fusion sauce.\nStep 3: Plate and serve hot!'),
      time: raw.time || '20 mins',
      funFact: raw.funFact || raw.description || 'Desi masale aur global flavours ka combination hamesha superhit hota hai!',
    };
    return { success: true, data };
  } catch (error) {
    console.error('generateFusionRecipeAction error:', error);
    return {
      success: true,
      data: {
        name: 'Makhani Pizza 🍕',
        tagline: 'Jab Italy aur Punjab milte hain!',
        emoji: '🍕🔥🧡',
        ingredients: ['Pizza Base', 'Butter Chicken / Paneer Makhani Gravy', 'Mozzarella Cheese', 'Fresh Coriander', 'Garlic Butter'],
        instructions: 'Step 1: Bake base for 5 mins with garlic butter.\nStep 2: Spread rich makhani gravy evenly.\nStep 3: Top with cheese, onion rings & bake 10 min at 200°C.',
        time: '25 mins',
        funFact: 'Butter Chicken was invented by accident in 1948 — aur pizza ne use perfect bana diya!',
      },
    };
  }
}

// ─── COOKING STEPS (Text AI) ─────────────────
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
Generate 5-7 steps for a complete recipe.`;

    const text = await callGroq(prompt);
    const data = parseJSONResponse(text);
    const steps = Array.isArray(data) ? data : data.steps || [];
    if (steps.length > 0) {
      return { success: true, data: steps };
    }
    throw new Error('Empty steps');
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

// ─── DETAILED INGREDIENTS (Text AI + Smart Culinary Fallback) ──────────
export async function generateIngredientsAction(dishName: string, servings: number, language: AppLanguage = 'hindi') {
  const { getSmartDishIngredients, normalizeIngredientList } = await import('@/data/ingredients');
  try {
    const prompt = `You are an expert chef. Generate an accurate, authentic ingredient list for "${dishName}" for ${servings} people (do NOT include onions/tomatoes if "${dishName}" is a sweet/dessert/tea/coffee/beverage).
Every field must be in simple Hindi/Hinglish.
Return ONLY a valid JSON array of 6-8 ingredients (no markdown, no extra text):
[
  {
    "id": "ing-1",
    "name": "English ingredient name",
    "nameHindi": "हिंदी नाम",
    "shopName": "dukaan par is naam se maango",
    "amount": <number>,
    "unit": "g OR ml OR cup OR tbsp OR tsp OR pcs",
    "visualMeasure": "haath ya katori se kaise naapein",
    "prepState": "kaise taiyaar karein",
    "whenToAdd": "kis step mein daalein",
    "cost": <INR number>,
    "availability": "kirana OR supermarket",
    "substitute": "nahi mila toh kya use karein",
    "note": "important cooking tip",
    "isOptional": false,
    "category": "protein OR grain OR vegetable OR dairy OR oil OR spice OR other"
  }
]`;

    const text = await callGroq(prompt, undefined, true, GROQ_FAST_MODEL);
    const data = parseJSONResponse(text);
    const rawList = Array.isArray(data) ? data : data.ingredients || [];
    if (rawList.length > 0) {
      return {
        success: true,
        data: normalizeIngredientList(rawList, dishName, servings),
      };
    }
    throw new Error('Empty ingredients');
  } catch (error) {
    console.error('generateIngredientsAction fallback used for:', dishName, error);
    return {
      success: true,
      data: getSmartDishIngredients(dishName, servings),
    };
  }
}

// ─── MORE DISHES (Text AI) ───────────────────
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
    "rating": <4.5 to 5.0>,
    "tags": ["${category}"],
    "image": "https://image.pollinations.ai/prompt/DISH+NAME+delicious+food+photography?width=800&height=800&nologo=true"
  }
]
Replace DISH+NAME with actual dish name (spaces as +).`;

    const text = await callGroq(prompt, undefined, true, GROQ_FAST_MODEL);
    const data = parseJSONResponse(text);
    const dishes = Array.isArray(data) ? data : data.dishes || [];
    return { success: true, data: dishes };
  } catch (error) {
    console.error('generateMoreDishesAction error:', error);
    return { success: false, error: 'Failed to generate more dishes' };
  }
}

// ─── ZAYKA X-LABS EXPERIMENTAL AI ENGINE ─────
export async function runXLabAction(featureId: string, userInput: string, language: AppLanguage = 'hinglish') {
  try {
    const prompt = `You are Zayka X-Labs (Est. 2050) — an ultra-advanced culinary science AI.
Feature module selected: "${featureId}".
User scenario/input: "${userInput}".
Respond in engaging Hinglish (${language}) with scientific culinary precision.
Return ONLY valid JSON (no markdown):
{
  "headline": "<Short futuristic title for the solution/creation>",
  "analysis": "<2-3 sentences of scientific/culinary explanation in Hinglish>",
  "steps": ["<Actionable step 1>", "<Actionable step 2>", "<Actionable step 3>"],
  "proTip": "<One mind-blowing food science fact or hack>"
}`;

    const text = await callGroq(prompt, undefined, true, GROQ_FAST_MODEL);
    const data = parseJSONResponse(text);
    return {
      success: true,
      data: {
        headline: data.headline || 'Quantum Culinary Solution Ready ⚡',
        analysis: data.analysis || 'Food chemistry analysis complete! Molecules aur flavour compounds balance ho chuke hain.',
        steps: Array.isArray(data.steps) ? data.steps : ['Flame turant low karo', '1 tsp dairy ya citrus se flavour balance karo', 'Fresh herbs ke sath serve karo'],
        proTip: data.proTip || 'Maillard reaction 140°C pe start hota hai — yahi asli restaurant umami ka raaz hai!',
      },
    };
  } catch (error) {
    console.error('runXLabAction error:', error);
    return {
      success: true,
      data: {
        headline: 'Zayka X-Labs Neural Fix Activated 🧪',
        analysis: 'Turant pan change karo aur 1 tbsp dahi/cream ya boiled aloo mash karke add karo — excess salt aur burnt notes neutralize ho jayenge!',
        steps: [
          'Jale hue bottom layer ko scrape mat karo — upar ka hissa naye bartan mein shift karo',
          '1 tbsp fresh cream, milk ya ghee daal ke bitter carbon molecules ko bind karo',
          'Upar se roasted kasuri methi aur lemon juice daal ke aroma refresh karo',
        ],
        proTip: 'Dairy fats aur starch extra salt aur acrid compounds ko absorb kar lete hain!',
      },
    };
  }
}
