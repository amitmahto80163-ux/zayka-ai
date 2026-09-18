import { Anthropic } from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppLanguage, Recipe } from '@/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || 'your_anthropic_key' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your_gemini_key');

export async function routeFusionToClaude(likedFoods: string[], language: AppLanguage): Promise<Recipe> {
  const items = likedFoods.join(", ");
  const systemPrompt = `You are Zayka AI, a world-class Indian Fusion Chef. 
Language: Respond entirely in ${language === 'hinglish' ? 'Hinglish (Hindi written in English alphabet)' : language === 'hindi' ? 'Hindi script' : 'English'}.
You MUST return ONLY a valid JSON object matching this exact structure:
{
  "id": "fusion_123",
  "title": "Creative Name",
  "description": "...",
  "chef": "ananya",
  "time": "30 mins",
  "difficulty": "medium",
  "diet": "non-vegetarian",
  "calories": 450,
  "spiceLevel": "medium",
  "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  "tags": ["fusion"],
  "ingredients": [{"id": "i1", "name": "Ingredient 1", "amount": "1 cup", "optional": false}],
  "steps": [{"id": "s1", "description": "Step 1", "duration": "5 mins", "tip": "Tip"}],
  "matchScore": 99,
  "healthScore": 85
}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: `The user swiped right on these foods: ${items}. Combine their flavor profiles into a mind-blowing fusion dish.` }]
    });
    const textContent = response.content.find(c => c.type === 'text')?.text || "{}";
    const cleanJson = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanJson) as Recipe;
  } catch (error) { throw new Error("Claude Error"); }
}

export async function routeBudgetToClaude(budget: number, language: AppLanguage): Promise<Recipe> {
  const systemPrompt = `You are Zayka AI, an expert at making delicious Indian meals on a very tight budget.
Language: ${language}. Return ONLY a JSON object matching the Recipe structure (with title, description, ingredients with cheap prices in amount field, steps).`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: `Create a full meal recipe for under ₹${budget}. It must be delicious but use very cheap local Indian ingredients.` }]
    });
    const textContent = response.content.find(c => c.type === 'text')?.text || "{}";
    const cleanJson = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanJson) as Recipe;
  } catch (error) { throw new Error("Claude Error"); }
}

export async function routeFridgeScanToGemini(imageBase64: string, language: AppLanguage): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent([`List raw ingredients (max 10) in ${language}. Comma separated.`, { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }]);
    return result.response.text();
  } catch (error) { throw new Error("Gemini Error"); }
}
