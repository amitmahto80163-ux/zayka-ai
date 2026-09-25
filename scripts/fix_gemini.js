const fs = require('fs');
let ai = fs.readFileSync('src/lib/ai.ts', 'utf8');

if (!ai.includes('GEMINI_VISION_MODEL')) {
  // Add constants
  ai = ai.replace(
    "const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';",
    "const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';\nconst GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';\n\nexport const GEMINI_VISION_MODEL = 'gemini-2.5-flash';"
  );

  // Add callGeminiVision
  const geminiVisionFunc = `
export async function callGeminiVision(prompt: string, imageBase64: string, jsonMode = true): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');
  
  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const finalPrompt = jsonMode ? prompt + '\\n\\nIMPORTANT: Return ONLY valid JSON, no markdown, no extra text.' : prompt;

  const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/\${GEMINI_VISION_MODEL}:generateContent?key=\${GEMINI_API_KEY}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: finalPrompt },
          { inline_data: { mime_type: 'image/jpeg', data: base64Data } }
        ]
      }],
      generationConfig: { temperature: 0.7 }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(\`Gemini Error: \${res.status} - \${err}\`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}
`;

  // Insert before callVision
  ai = ai.replace('export async function callVision', geminiVisionFunc + '\nexport async function callVision');

  // Modify callVision
  const callVisionTarget = `  const imageUrl = \`data:image/jpeg;base64,\${base64Data}\`;

  const visionModels = ['google/gemma-3-27b-it:free', OR_VISION_FALLBACK];
  
  for (const model of visionModels) {`;

  const callVisionReplacement = `  const imageUrl = \`data:image/jpeg;base64,\${base64Data}\`;

  // 1. Try Gemini Vision First
  try {
    return await callGeminiVision(prompt, imageBase64, jsonMode);
  } catch (err) {
    console.warn('Gemini vision failed, falling back to OpenRouter...', err);
  }

  // 2. Fallback to OpenRouter Free Vision Models
  const visionModels = ['google/gemma-3-27b-it:free', OR_VISION_FALLBACK];
  
  for (const model of visionModels) {`;

  ai = ai.replace(callVisionTarget, callVisionReplacement);

  fs.writeFileSync('src/lib/ai.ts', ai);
  console.log('Gemini vision added to ai.ts');
}
