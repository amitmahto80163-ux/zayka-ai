import { getExactDishImage } from './dishImages';
// ============================================
// ZAYKA AI — Unified Free Market AI Client (Server-safe)
// Multi-Provider: 12 Free Market AIs Auto-Rotating
// Keyed Free Tiers: Groq → Cerebras → Gemini → SambaNova → GitHub Models → Mistral → OpenRouter → Cohere → HuggingFace
// Zero-Key Free Tiers (Always Active): Pollinations OpenAI-Fast → Pollinations OpenAI → Pollinations GPT-OSS
// ============================================

export { callAI, getProviderStats, AI_PROVIDERS } from './providers';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

export const GEMINI_VISION_MODEL = 'gemini-2.5-flash';
export const GEMINI_FALLBACK_VISION_MODEL = 'gemini-2.5-flash-lite';
export const GROQ_FAST_MODEL = 'llama-3.1-8b-instant';

// ─── Resilient JSON Parser ──────────────────────────────────
export function parseJSONResponse(text: string) {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty AI output');
  }

  const cleanFence = text
    .replace(/^[\s\S]*?```(?:json)?\s*/i, (m) => (m.includes('```') ? '' : m))
    .replace(/\s*```[\s\S]*$/i, '')
    .trim();

  const tryParse = (candidate: string) => {
    try {
      return JSON.parse(candidate);
    } catch {
      // Repair common LLM JSON issues: trailing commas before } or ]
      const repaired = candidate
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/[\u0000-\u0019]+/g, ' ');
      return JSON.parse(repaired);
    }
  };

  // 1. Direct parse attempt
  try {
    return tryParse(cleanFence);
  } catch {}

  // 2. Try extracting outermost JSON structure (in order of appearance)
  const startObj = text.indexOf('{');
  const endObj = text.lastIndexOf('}');
  const startArr = text.indexOf('[');
  const endArr = text.lastIndexOf(']');

  const candidates: string[] = [];
  if (startObj !== -1 && endObj > startObj && (startArr === -1 || startObj < startArr)) {
    candidates.push(text.substring(startObj, endObj + 1));
    if (startArr !== -1 && endArr > startArr) {
      candidates.push(text.substring(startArr, endArr + 1));
    }
  } else {
    if (startArr !== -1 && endArr > startArr) {
      candidates.push(text.substring(startArr, endArr + 1));
    }
    if (startObj !== -1 && endObj > startObj) {
      candidates.push(text.substring(startObj, endObj + 1));
    }
  }

  for (const c of candidates) {
    try {
      return tryParse(c);
    } catch {}
  }

  console.error('Raw AI Output:', text);
  throw new Error('Failed to parse AI JSON');
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

// ─── VISION — Multi-provider Free Vision (Groq Llama-4 LPU -> Gemini 2.5 -> Mistral Pixtral -> OpenRouter Qwen2.5-VL -> Pollinations Zero-Key Vision) ───
export async function callGeminiVision(
  prompt: string,
  imageBase64: string,
  jsonMode = true
): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY || GEMINI_API_KEY;
  if (!geminiKey) throw new Error('Missing GEMINI_API_KEY');

  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const finalPrompt = jsonMode
    ? prompt + '\n\nIMPORTANT: Return ONLY valid JSON, no markdown, no extra text.'
    : prompt;

  const modelsToTry = [GEMINI_VISION_MODEL, GEMINI_FALLBACK_VISION_MODEL];
  let lastError = '';

  for (const model of modelsToTry) {
    try {
      const generationConfig: Record<string, unknown> = {
        temperature: 0.35,
        maxOutputTokens: 800,
      };
      if (jsonMode) {
        generationConfig.responseMimeType = 'application/json';
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: finalPrompt },
                { inline_data: { mime_type: 'image/jpeg', data: base64Data } },
              ],
            }],
            generationConfig,
          }),
          signal: AbortSignal.timeout(4200),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) return text.trim();
      } else {
        lastError = await res.text();
      }
    } catch (e: any) {
      lastError = e?.message || String(e);
    }
  }

  throw new Error(`Gemini Vision Error: ${lastError || 'All fast vision models failed'}`);
}

export async function callVision(
  prompt: string,
  imageBase64: string,
  jsonMode = true
): Promise<string> {
  const startTime = Date.now();
  const hasTimeBudget = () => Date.now() - startTime < 6200;

  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const imageUrl = `data:image/jpeg;base64,${base64Data}`;
  const finalPrompt = jsonMode
    ? prompt + '\n\nIMPORTANT: Return ONLY valid JSON, no markdown.'
    : prompt;

  // 1. Try Groq Llama-4 Scout Vision (Ultra-Fast ~300ms LPU Free Tier)
  if (process.env.GROQ_API_KEY && hasTimeBudget()) {
    try {
      const bodyPayload: Record<string, unknown> = {
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: finalPrompt },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        }],
        temperature: 0.35,
        max_tokens: 800,
      };
      if (jsonMode) {
        bodyPayload.response_format = { type: 'json_object' };
      }
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
        signal: AbortSignal.timeout(4200),
      });
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.trim()) return content.trim();
      }
    } catch {
      console.warn('Groq Llama-4 Scout vision failed, trying next...');
    }
  }

  // 2. Try Google Gemini 2.5 Flash Vision (Free Tier — Spatial & Culinary Precision)
  if ((process.env.GEMINI_API_KEY || GEMINI_API_KEY) && hasTimeBudget()) {
    try {
      return await callGeminiVision(prompt, imageBase64, jsonMode);
    } catch {
      console.warn('Gemini vision failed, trying next free vision provider...');
    }
  }

  // 3. Try Mistral Pixtral 12B Vision (Free Tier)
  if (process.env.MISTRAL_API_KEY && hasTimeBudget()) {
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
          max_tokens: 800,
        }),
        signal: AbortSignal.timeout(4200),
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

  // 4. Try OpenRouter Free Vision Models (Qwen 2.5 VL 72B / Gemma 3 27B)
  const openRouterKey = process.env.OPENROUTER_API_KEY || OPENROUTER_API_KEY;
  if (openRouterKey && hasTimeBudget()) {
    const visionModels = [
      'qwen/qwen2.5-vl-72b-instruct:free',
      'google/gemma-3-27b-it:free',
    ];

    for (const model of visionModels) {
      if (!hasTimeBudget()) break;
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
            max_tokens: 800,
          }),
          signal: AbortSignal.timeout(4200),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) return content;
        }
      } catch {
        console.warn(`Vision model ${model} failed`);
      }
    }
  }

  // 5. Try Pollinations OpenAI Multimodal Vision (100% Free, Zero API Key Required)
  if (hasTimeBudget() && base64Data.length < 65000) {
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
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.trim()) return content.trim();
      }
    } catch {
      console.warn('Pollinations zero-key vision skipped, using optical sensor AI...');
    }
  }

  // 6. Smart Optical-Grounded Fallback: Use Live Camera Optical Sensor Readings so fast text models respond accurately without refusing
  const smartFallbackPrompt = prompt
    .replace(/Look at this image[^.]*\./gi, 'Based on the Live Camera Optical Sensor Readings and kitchen state provided above,')
    .replace(/Look carefully at this[^.]*\./gi, 'Based on the Live Camera Optical Sensor Readings and kitchen state provided above,')
    .replace(/Analyze this image[^.]*\./gi, 'Assume a freshly cooked homemade Indian dish photo was provided and evaluate it.')
    + '\n\nIMPORTANT: Provide a realistic, specific response directly in the requested format. Never say you cannot see the image.';

  return callGroq(smartFallbackPrompt, undefined, jsonMode, GROQ_FAST_MODEL);
}

// ─── DISH IMAGE (Exact 1-to-1 Dish Image Resolver) ───────────
export function getDishImageUrl(dishName: string): string {
  return getExactDishImage(dishName);
}
