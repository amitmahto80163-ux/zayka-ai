// ============================================
// ZAYKA AI — Unified AI Client
// Groq  → Text generation (fast + free)
// OpenRouter → Vision tasks (image analysis)
// Pollinations → Dish images (unlimited, no key)
// ============================================

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

// Models
const GROQ_TEXT_MODEL = 'llama-3.3-70b-versatile';
const OR_VISION_MODEL = 'meta-llama/llama-3.2-11b-vision-instruct:free';

export function parseJSONResponse(text: string) {
  try {
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
  jsonMode = true
): Promise<string> {
  const messages: { role: string; content: string }[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_TEXT_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq Error: ${res.status} — ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

// ─── VISION (OpenRouter — Llama Vision) ──────
export async function callVision(
  prompt: string,
  imageBase64: string,
  jsonMode = true
): Promise<string> {
  // Strip data URL prefix if present
  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const imageUrl = `data:image/jpeg;base64,${base64Data}`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://zayka-ai.vercel.app',
      'X-Title': 'Zayka AI',
    },
    body: JSON.stringify({
      model: OR_VISION_MODEL,
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

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter Vision Error: ${res.status} — ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

// ─── DISH IMAGE (Pollinations — No key needed) ─
export function getDishImageUrl(dishName: string): string {
  const encoded = encodeURIComponent(dishName).replace(/%20/g, '+');
  return `https://image.pollinations.ai/prompt/${encoded}+delicious+indian+food+photography+highly+detailed?width=800&height=800&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
}
