// ============================================
// ZAYKA AI — Unified Free Market AI Client (Server-safe)
// Multi-Provider: 12 Free Market AIs Auto-Rotating
// Keyed Free Tiers: Groq → Cerebras → Gemini → SambaNova → GitHub Models → Mistral → OpenRouter → Cohere → HuggingFace
// Zero-Key Free Tiers (Always Active): Pollinations OpenAI → Pollinations Llama → Pollinations Mistral
// ============================================

export { callAI, getProviderStats, AI_PROVIDERS } from './providers';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

export const GEMINI_VISION_MODEL = 'gemini-3.1-flash-lite';
export const GEMINI_FALLBACK_VISION_MODEL = 'gemini-flash-latest';
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

// ─── TEXT GENERATION — 12 free market providers auto-rotating ───────
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

// ─── VISION — Multi-provider Free Vision (Gemini -> Groq -> Mistral -> OpenRouter -> Pollinations Keyless) ───
export async function callGeminiVision(
  prompt: string,
  imageBase64: string,
  jsonMode = true
): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY || GEMINI_API_KEY;
  if (!geminiKey) throw new Error("Missing GEMINI_API_KEY");

  const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
  const finalPrompt = jsonMode
    ? prompt + "\n\nIMPORTANT: Return ONLY valid JSON, no markdown, no extra text."
    : prompt;

  // Ultra-fast Gemini Vision: zero thinking budget + auto model fallback
  const modelsToTry = [GEMINI_VISION_MODEL, GEMINI_FALLBACK_VISION_MODEL, "gemini-3.8-flash"];
  let lastError = "";

  for (const model of modelsToTry) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: finalPrompt },
                { inline_data: { mime_type: "image/jpeg", data: base64Data } }
              ]
            }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 2048,
              thinkingConfig: {
                thinkingBudget: 0,
              },
            }
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        lastError = await res.text();
      }
    } catch (e: any) {
      lastError = e?.message || String(e);
    }
  }

  throw new Error(`Gemini Error: ${lastError || "All fast vision models failed"}`);
}

export async function callVision(
  prompt: string,
  imageBase64: string,
  jsonMode = true
): Promise<string> {
  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const imageUrl = `data:image/jpeg;base64,${base64Data}`;
  const finalPrompt = jsonMode
    ? prompt + '\n\nIMPORTANT: Return ONLY valid JSON, no markdown.'
    : prompt;

  // 1. Try Google Gemini Vision (Free Tier)
  if (process.env.GEMINI_API_KEY || GEMINI_API_KEY) {
    try {
      return await callGeminiVision(prompt, imageBase64, jsonMode);
    } catch (e) {
      console.warn('Gemini vision failed, trying next free vision provider...');
    }
  }

  // 2. Try Groq Llama-4 Scout Vision (Free Tier)
  if (process.env.GROQ_API_KEY) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: finalPrompt },
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
    } catch {
      console.warn('Groq vision failed, trying next free vision provider...');
    }
  }

  // 3. Try Mistral Pixtral 12B Vision (Free Tier)
  if (process.env.MISTRAL_API_KEY) {
    try {
      const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'pixtral-12b-2409',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: finalPrompt },
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
    } catch {
      console.warn('Mistral Pixtral vision failed, trying next free vision provider...');
    }
  }

  // 4. Try OpenRouter Free Vision Models
  const openRouterKey = process.env.OPENROUTER_API_KEY || OPENROUTER_API_KEY;
  if (openRouterKey) {
    const visionModels = [
      'google/gemma-3-27b-it:free',
      'meta-llama/llama-3.2-11b-vision-instruct:free',
    ];

    for (const model of visionModels) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://zayka-ai.vercel.app',
            'X-Title': 'Zayka AI',
          },
          body: JSON.stringify({
            model,
            messages: [{
              role: 'user',
              content: [
                { type: 'text', text: finalPrompt },
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

  // 5. Try Pollinations Keyless Free Vision (100% Free, NO API KEY REQUIRED!)
  try {
    const res = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: finalPrompt },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        }],
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    }
  } catch {
    console.warn('Pollinations keyless vision failed, using text fallback');
  }

  // Final fallback: text-only
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
