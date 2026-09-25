// ============================================
// ZAYKA AI — Unified AI Client
// Groq  → Text generation (fast + free)
// OpenRouter → Vision tasks (image analysis)
// Pollinations → Dish images (unlimited, no key)
// ============================================

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export const GEMINI_VISION_MODEL = 'gemini-2.5-flash';

// Working Models (tested 25-Sep-2026)
const GROQ_TEXT_MODEL = 'llama-3.3-70b-versatile';
export const GROQ_FAST_MODEL = 'llama-3.1-8b-instant';           // Fast + JSON support ✅
      // Vision capable free model ✅
const OR_VISION_FALLBACK = 'openrouter/free';          // Fallback if main fails

export function parseJSONResponse(text: string) {
  try {
    // Find the first { or [ and the last } or ]
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
      const cleanText = text.substring(startIndex, endIndex + 1);
      return JSON.parse(cleanText);
    }
    
    // Fallback if no brackets found (unlikely if it's JSON, but just in case)
    const cleanText = text.replace(/^```(?:json)?/gim, '').replace(/```$/gim, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error('Raw AI Output:', text);
    throw new Error('Failed to parse AI JSON');
  }
}

// ─── TEXT GENERATION (Groq) ───────────────────
export async function callGroq(
  prompt: string,
  systemPrompt?: string,
  jsonMode = true,
  modelOverride?: string
): Promise<string> {
  const messages: { role: string; content: string }[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  
  // Append JSON instruction directly in prompt (qwen doesn't support response_format)
  const finalPrompt = jsonMode
    ? prompt + '\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no code blocks. Just raw JSON.'
    : prompt;
  messages.push({ role: 'user', content: finalPrompt });

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelOverride || GROQ_TEXT_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    if (res.status === 401 && OPENROUTER_API_KEY) {
      console.warn('Groq failed with 401. Falling back to OpenRouter text model.');
      const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + OPENROUTER_API_KEY,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://zayka-ai.vercel.app',
          'X-Title': 'Zayka AI'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: messages,
          temperature: 0.7
        })
      });
      if (orRes.ok) {
        const orData = await orRes.json();
        return orData.choices[0].message.content;
      }
    }
    throw new Error('Groq Error: ' + res.status + ' - ' + err);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Groq returned empty response');
  return content;
}

// ─── VISION (OpenRouter with Groq fallback) ──────

export async function callGeminiVision(prompt: string, imageBase64: string, jsonMode = true): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');
  
  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const finalPrompt = jsonMode ? prompt + '\n\nIMPORTANT: Return ONLY valid JSON, no markdown, no extra text.' : prompt;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_VISION_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
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
  // Strip data URL prefix if present
  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const imageUrl = `data:image/jpeg;base64,${base64Data}`;

  // Try OpenRouter vision models in order
  const visionModels = ['google/gemma-3-27b-it:free', OR_VISION_FALLBACK];
  
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
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: jsonMode ? prompt + '\n\nIMPORTANT: Return ONLY valid JSON, no markdown, no extra text.' : prompt },
                { type: 'image_url', image_url: { url: imageUrl } },
              ],
            },
          ],
          max_tokens: 2048,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch (e) {
      console.warn(`Vision model ${model} failed, trying next...`);
    }
  }

  // Final fallback: Use Groq text model (no image, just context)
  console.warn('All vision models failed, using Groq text fallback');
  return await callGroq(prompt + '\n\n(Note: Image analysis unavailable, provide best estimate based on context)', undefined, jsonMode);
}

// ─── DISH IMAGE (Pollinations — No key needed) ─
export function getDishImageUrl(dishName: string): string {
  const encoded = encodeURIComponent(dishName).replace(/%20/g, '+');
  return `https://image.pollinations.ai/prompt/${encoded}+delicious+indian+food+photography+highly+detailed?width=800&height=800&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
}
