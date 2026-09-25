const GROQ_API_KEY = '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';
const GROQ_TEXT_MODEL = 'qwen/qwen3.8-27b';

async function testGenerateRecipe() {
  const prompt = `You are an expert chef and nutritionist. Generate a complete detailed recipe for "butter chicken" scaled for exactly 4 servings.

Return ONLY valid JSON (no markdown, no extra text):
{
  "name": "butter chicken",
  "nameHindi": "dish name in Hindi",
  "description": "2-3 line Hinglish description of the dish",
  "cuisine": "indian OR chinese OR italian OR other",
  "difficulty": "intermediate",
  "prepTime": 15,
  "cookTime": 30,
  "servings": 4,
  "isVeg": false,
  "calories": 400,
  "rating": 4.5,
  "image": "url",
  "ingredients": [
    {
      "id": "1",
      "name": "ingredient name",
      "nameHindi": "Hindi name",
      "amount": 100,
      "unit": "g",
      "optional": false,
      "substitute": "substitute"
    }
  ],
  "steps": [
    {
      "id": "1",
      "stepNumber": 1,
      "title": "Short title",
      "description": "Detailed description",
      "duration": 600,
      "tips": ["tip"]
    }
  ],
  "nutrition": {
    "calories": 400,
    "protein": 20,
    "carbs": 10,
    "fat": 10,
    "fiber": 2
  },
  "tags": ["tag"]
}
Generate ALL ingredients and ALL steps (5-8 steps) for a complete recipe.
IMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no code blocks. Just raw JSON.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_TEXT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });
    
    if (!res.ok) {
      console.log('API Error:', await res.text());
      return;
    }
    
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    console.log('--- RAW AI OUTPUT START ---');
    console.log(content);
    console.log('--- RAW AI OUTPUT END ---');
    
    try {
      const cleanText = content.replace(/^```(?:json)?/gim, '').replace(/```$/gim, '').trim();
      const parsed = JSON.parse(cleanText);
      console.log('✅ PARSED SUCCESSFULLY! Keys:', Object.keys(parsed));
    } catch (e) {
      console.log('❌ PARSE FAILED:', e.message);
    }
  } catch (err) {
    console.log('Fetch Failed:', err);
  }
}

testGenerateRecipe();
