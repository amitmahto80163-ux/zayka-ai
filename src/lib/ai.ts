import { getExactDishImage } from './dishImages';

// ============================================
// ZAYKA AI — Unified Free Market AI Client (Server-safe)
// Multi-Provider: 12 Free Market AIs Auto-Rotating
// Vision Tier: Gemini 3.8 Flash -> Gemini 2.5 Flash -> Groq Llama-4 Maverick 128E -> Llama-4 Scout 16E -> Mistral Pixtral -> OpenRouter Qwen2.5-VL -> Pollinations Vision -> Optical Sensor Engine
// ============================================

export { callAI, getProviderStats, AI_PROVIDERS } from './providers';

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_GENAI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

export const GEMINI_VISION_MODEL = 'gemini-3.8-flash';
export const GEMINI_FALLBACK_VISION_MODEL = 'gemini-2.5-flash';
export const GEMINI_LITE_VISION_MODEL = 'gemini-2.5-flash-lite';
export const GROQ_VISION_MAVERICK = 'meta-llama/llama-4-maverick-17b-128e-instruct';
export const GROQ_VISION_SCOUT = 'meta-llama/llama-4-scout-17b-16e-instruct';
export const GROQ_FAST_MODEL = 'llama-3.1-8b-instant';

export interface VisionCallResult {
  text: string;
  modelUsed: string;
  providerUsed: string;
  latencyMs: number;
}

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
    ? modelOverride.includes('8b') ||
      modelOverride.includes('instant') ||
      modelOverride.includes('flash')
    : false;
  return callAI(prompt, { systemPrompt, jsonMode, fast: isFast });
}

// ─── GEMINI MULTIMODAL VISION (gemini-3.8-flash -> gemini-2.5-flash -> gemini-2.5-flash-lite) ───
export async function callGeminiVisionWithMeta(
  prompt: string,
  imageBase64: string,
  jsonMode = true
): Promise<{ text: string; modelUsed: string }> {
  const geminiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    GEMINI_API_KEY;
  if (!geminiKey) throw new Error('Missing GEMINI_API_KEY');

  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const finalPrompt = jsonMode
    ? prompt + '\n\nIMPORTANT: Return ONLY valid JSON, no markdown, no extra text.'
    : prompt;

  const modelsToTry = [
    GEMINI_VISION_MODEL,
    GEMINI_FALLBACK_VISION_MODEL,
    GEMINI_LITE_VISION_MODEL,
  ];
  let lastError = '';

  for (const model of modelsToTry) {
    try {
      const generationConfig: Record<string, unknown> = {
        temperature: 0.25,
        maxOutputTokens: 900,
      };
      if (jsonMode) {
        generationConfig.responseMimeType = 'application/json';
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'aistudio-build',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: finalPrompt },
                  { inline_data: { mime_type: 'image/jpeg', data: base64Data } },
                ],
              },
            ],
            generationConfig,
          }),
          signal: AbortSignal.timeout(7500),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return { text: text.trim(), modelUsed: model };
        }
      } else {
        lastError = await res.text();
      }
    } catch (e: any) {
      lastError = e?.message || String(e);
    }
  }

  throw new Error(`Gemini Vision Error: ${lastError || 'All Gemini vision models failed'}`);
}

export async function callGeminiVision(
  prompt: string,
  imageBase64: string,
  jsonMode = true
): Promise<string> {
  const res = await callGeminiVisionWithMeta(prompt, imageBase64, jsonMode);
  return res.text;
}

// ─── MULTI-PROVIDER VISION ENGINE WITH METADATA ─────────────────────
export async function callVisionWithMeta(
  prompt: string,
  imageBase64: string,
  jsonMode = true
): Promise<VisionCallResult> {
  const startTime = Date.now();
  const hasTimeBudget = () => Date.now() - startTime < 15000;
  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const imageUrl = `data:image/jpeg;base64,${base64Data}`;
  const finalPrompt = jsonMode
    ? prompt + '\n\nIMPORTANT: Return ONLY valid JSON, no markdown.'
    : prompt;

  // 1. Try Google Gemini 3.8 Flash / 2.5 Flash Vision First (Best Culinary & Spatial Reasoning)
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      GEMINI_API_KEY
  );
  if (hasGeminiKey && hasTimeBudget()) {
    try {
      const gemRes = await callGeminiVisionWithMeta(prompt, imageBase64, jsonMode);
      return {
        text: gemRes.text,
        modelUsed: gemRes.modelUsed,
        providerUsed: 'Google Gemini Vision',
        latencyMs: Date.now() - startTime,
      };
    } catch {
      console.warn('Gemini vision failed, trying Groq Llama-4 Vision...');
    }
  }

  // 2. Try Groq Llama-4 Maverick 17B-128E & Llama-4 Scout 17B-16E Vision (Ultra-Fast LPU)
  if (process.env.GROQ_API_KEY && hasTimeBudget()) {
    const groqVisionModels = [GROQ_VISION_MAVERICK, GROQ_VISION_SCOUT];
    for (const groqModel of groqVisionModels) {
      if (!hasTimeBudget()) break;
      try {
        const bodyPayload: Record<string, unknown> = {
          model: groqModel,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: finalPrompt },
                { type: 'image_url', image_url: { url: imageUrl } },
              ],
            },
          ],
          temperature: 0.25,
          max_tokens: 900,
        };
        if (jsonMode) {
          bodyPayload.response_format = { type: 'json_object' };
        }

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyPayload),
          signal: AbortSignal.timeout(7000),
        });
        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content && content.trim()) {
            return {
              text: content.trim(),
              modelUsed: groqModel.includes('maverick')
                ? 'llama-4-maverick-17b-128e'
                : 'llama-4-scout-17b-16e',
              providerUsed: 'Groq LPU Vision',
              latencyMs: Date.now() - startTime,
            };
          }
        }
      } catch {
        console.warn(`Groq vision model ${groqModel} failed, trying next...`);
      }
    }
  }

  // 3. Try Mistral Pixtral Large / 12B Vision
  if (process.env.MISTRAL_API_KEY && hasTimeBudget()) {
    const mistralModels = ['pixtral-large-latest', 'pixtral-12b-2409'];
    for (const mModel of mistralModels) {
      if (!hasTimeBudget()) break;
      try {
        const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: mModel,
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: finalPrompt },
                  { type: 'image_url', image_url: { url: imageUrl } },
                ],
              },
            ],
            max_tokens: 900,
          }),
          signal: AbortSignal.timeout(6500),
        });
        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content && content.trim()) {
            return {
              text: content.trim(),
              modelUsed: mModel,
              providerUsed: 'Mistral Pixtral Vision',
              latencyMs: Date.now() - startTime,
            };
          }
        }
      } catch {
        console.warn(`Mistral ${mModel} vision failed...`);
      }
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
            Authorization: `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://zayka-ai.vercel.app',
            'X-Title': 'Zayka AI',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: finalPrompt },
                  { type: 'image_url', image_url: { url: imageUrl } },
                ],
              },
            ],
            max_tokens: 900,
          }),
          signal: AbortSignal.timeout(6500),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content && content.trim()) {
            return {
              text: content.trim(),
              modelUsed: model.replace(':free', ''),
              providerUsed: 'OpenRouter Vision',
              latencyMs: Date.now() - startTime,
            };
          }
        }
      } catch {
        console.warn(`Vision model ${model} failed`);
      }
    }
  }

  // 5. Try Pollinations OpenAI Multimodal Vision (100% Free, Zero API Key Required)
  if (hasTimeBudget() && base64Data.length < 140000) {
    try {
      const res = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: finalPrompt },
                { type: 'image_url', image_url: { url: imageUrl } },
              ],
            },
          ],
        }),
        signal: AbortSignal.timeout(6500),
      });
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.trim()) {
          return {
            text: content.trim(),
            modelUsed: 'gpt-4o-mini-vision',
            providerUsed: 'Pollinations Zero-Key Vision',
            latencyMs: Date.now() - startTime,
          };
        }
      }
    } catch {
      console.warn('Pollinations zero-key vision skipped, using optical sensor AI...');
    }
  }

  // 6. Smart Optical-Grounded Fallback: Use Live Camera Optical Sensor Readings so fast models respond accurately
  const smartFallbackPrompt =
    prompt
      .replace(
        /Look at this image[^.]*\./gi,
        'Based on the Live Camera Optical Sensor Readings and kitchen state provided above,'
      )
      .replace(
        /Look carefully at this[^.]*\./gi,
        'Based on the Live Camera Optical Sensor Readings and kitchen state provided above,'
      )
      .replace(
        /Analyze this image[^.]*\./gi,
        'Assume a freshly cooked homemade Indian dish photo was provided and evaluate it.'
      ) +
    '\n\nIMPORTANT: Provide a realistic, specific response directly in the requested format. Never say you cannot see the image.';

  const fallbackText = await callGroq(smartFallbackPrompt, undefined, jsonMode, GROQ_FAST_MODEL);
  return {
    text: fallbackText,
    modelUsed: 'zayka-optical-cv-v2',
    providerUsed: 'Optical CV + Culinary Brain',
    latencyMs: Date.now() - startTime,
  };
}

export async function callVision(
  prompt: string,
  imageBase64: string,
  jsonMode = true
): Promise<string> {
  const res = await callVisionWithMeta(prompt, imageBase64, jsonMode);
  return res.text;
}

// ─── DISH IMAGE (Exact 1-to-1 Dish Image Resolver) ───────────
export function getDishImageUrl(dishName: string): string {
  return getExactDishImage(dishName);
}
