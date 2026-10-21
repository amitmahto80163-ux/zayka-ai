// ============================================
// ZAYKA AI — Unified AI Client (Server-safe)
// Multi-Provider: 7 free AIs auto-rotating
// Groq → DeepSeek → Zhipu → Yi → Qwen → Kimi → OpenRouter
// ============================================

// Re-export from providers (pure fetch, no Node.js deps)
export { callAI, getProviderStats } from './providers';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

export const GEMINI_VISION_MODEL = 'gemini-1.5-flash';
export const GROQ_FAST_MODEL = 'llama-3.1-8b-instant';

// ─── JSON Parser ────────────────────────────────────────────
export function parseJSONResponse(text: string) {
  try {
    const startObj = text.indexOf('{');
    const startArr = text.indexOf('[');
    const endObj = text.lastIndexOf('}');
    const endArr = text.lastIndexOf(']');

    let startIndex = -1;
    let endIndex = -1;

    if (startObj !== -1 && (startArr === -1 || startObj < startArr)) {
      startIndex = startObj;
      endIndex = endObj;
    } else if (startArr !== -1) {
      startIndex = startArr;
      endIndex = endArr;
    }

    if (startIndex !== -1 && endIndex !== -1 && endIndex >= startIndex) {
      return JSON.parse(text.substring(startIndex, endIndex + 1));
    }

    const cleanText = text.replace(/^```(?:json)?/gim, '').replace(/```$/gim, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error('Raw AI Output:', text);
    throw new Error('Failed to parse AI JSON');
  }
}

// ─── TEXT GENERATION — 7 free providers auto-rotating ───────
export async function callGroq(
  prompt: string,
  systemPrompt?: string,
  jsonMode = true,
  modelOverride?: string
): Promise<string> {
  const { callAI } = await import('./providers');
  const isFast = modelOverride
    ? modelOverride.includes('8b') || modelOverride.includes('instant') || modelOverride.includes('flash')
    : false;
  return callAI(prompt, { systemPrompt, jsonMode, fast: isFast });
}

// ─── VISION — Gemini first, OpenRouter fallback ─────────────
export async function callGeminiVision(
  prompt: string,
  imageBase64: string,
  jsonMode = true
): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');

  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const finalPrompt = jsonMode
    ? prompt + '\n\nIMPORTANT: Return ONLY valid JSON, no markdown, no extra text.'
    : prompt;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_VISION_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
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
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini Error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

export async function callVision(
  prompt: string,
  imageBase64: string,
  jsonMode = true
): Promise<string> {
  // Try Gemini first
  if (GEMINI_API_KEY) {
    try {
      return await callGeminiVision(prompt, imageBase64, jsonMode);
    } catch (e) {
      console.warn('Gemini vision failed, trying OpenRouter...');
    }
  }

  // Fallback: OpenRouter vision models
  if (OPENROUTER_API_KEY) {
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const imageUrl = `data:image/jpeg;base64,${base64Data}`;
    const visionModels = [
      'google/gemma-3-27b-it:free',
      'meta-llama/llama-3.2-11b-vision-instruct:free',
    ];

    for (const model of visionModels) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://zayka-ai.vercel.app',
            'X-Title': 'Zayka AI',
          },
          body: JSON.stringify({
            model,
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: jsonMode
                    ? prompt + '\n\nIMPORTANT: Return ONLY valid JSON, no markdown.'
                    : prompt
                },
                { type: 'image_url', image_url: { url: imageUrl } },
              ],
            }],
            max_tokens: 2048,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) return content;
        }
      } catch (e) {
        console.warn(`Vision model ${model} failed`);
      }
    }
  }

  // Final fallback: text-only
  console.warn('All vision models failed, using text fallback');
  return callGroq(
    prompt + '\n\n(Note: Image unavailable, give best estimate)',
    undefined,
    jsonMode
  );
}

// ─── DISH IMAGE (Pollinations — unlimited, no key) ───────────
export function getDishImageUrl(dishName: string): string {
  const encoded = encodeURIComponent(dishName).replace(/%20/g, '+');
  return `https://image.pollinations.ai/prompt/${encoded}+delicious+indian+food+photography+highly+detailed?width=800&height=800&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
}
