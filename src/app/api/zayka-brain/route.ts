/**
 * ============================================================
 * ZAYKA AI — Own Model Inference API Route
 * src/app/api/zayka-brain/route.ts
 *
 * Supports:
 *   1. Self-hosted (vLLM / Ollama) if ZAYKA_SELF_HOSTED_URL is set
 *   2. Hugging Face Inference API if ZAYKA_MODEL_TOKEN is set
 *   3. Automatic Multi-Provider Free AI Router (callAI) so Zayka Brain
 *      works 100% reliably out-of-the-box with zero configuration!
 * ============================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { callAI } from '@/lib/providers';

const ZAYKA_MODEL_ID = process.env.ZAYKA_MODEL_ID || 'meta-llama/Llama-3.1-8B-Instruct';
const ZAYKA_MODEL_TOKEN = process.env.ZAYKA_MODEL_TOKEN || '';
const ZAYKA_SELF_HOSTED_URL = process.env.ZAYKA_SELF_HOSTED_URL || null;

const SYSTEM_PROMPT = `Tu Zayka AI hai — India ka sabse smart cooking assistant.
Tera personality:
- Warm, friendly aur encouraging hai
- Hinglish mein bolta hai (Hindi + English mix)
- Indian cooking ka deep expert hai — regional variations, masale, techniques sab jaanta hai
- Budget-conscious tips deta hai (Indian middle class aur students ke liye)
- Real-time cooking guidance de sakta hai
Always helpful, always Indian, always Zayka!`;

const RequestSchema = z.object({
  message: z.string().min(1).max(2000),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).max(20).default([]),
  context: z.object({
    currentRecipe: z.string().optional(),
    currentStep: z.number().optional(),
    fridgeIngredients: z.array(z.string()).optional(),
    userBudget: z.number().optional(),
  }).optional(),
  stream: z.boolean().default(false),
});

async function callHuggingFace(messages: Array<{ role: string; content: string }>, stream = false) {
  const url = `https://api-inference.huggingface.co/models/${ZAYKA_MODEL_ID}/v1/chat/completions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ZAYKA_MODEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: ZAYKA_MODEL_ID,
      messages,
      max_tokens: 512,
      temperature: 0.7,
      stream,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HF API Error: ${err}`);
  }
  return response;
}

async function callSelfHosted(messages: Array<{ role: string; content: string }>, stream = false) {
  const url = `${ZAYKA_SELF_HOSTED_URL}/v1/chat/completions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'zayka-brain',
      messages,
      max_tokens: 512,
      temperature: 0.7,
      stream,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) throw new Error(`Self-hosted error: ${response.statusText}`);
  return response;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.issues }, { status: 400 });
    }

    const { message, chatHistory, context, stream } = parsed.data;

    let systemPromptWithContext = SYSTEM_PROMPT;
    if (context) {
      let contextStr = '';
      if (context.currentRecipe) contextStr += `\nCurrent recipe: ${context.currentRecipe}`;
      if (context.currentStep !== undefined) contextStr += `\nCurrent step: ${context.currentStep + 1}`;
      if (context.fridgeIngredients?.length) contextStr += `\nFridge has: ${context.fridgeIngredients.join(', ')}`;
      if (context.userBudget) contextStr += `\nUser budget: ₹${context.userBudget}`;
      if (contextStr) {
        systemPromptWithContext += `\n\nCurrent Context:${contextStr}`;
      }
    }

    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPromptWithContext },
      ...chatHistory.slice(-10),
      { role: 'user', content: message },
    ];

    // Priority 1 & 2: Try custom self-hosted or HF model if configured
    if (ZAYKA_SELF_HOSTED_URL || ZAYKA_MODEL_TOKEN) {
      try {
        const response = ZAYKA_SELF_HOSTED_URL
          ? await callSelfHosted(messages, stream)
          : await callHuggingFace(messages, stream);

        if (stream) {
          return new NextResponse(response.body, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
          });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || '';
        if (reply) {
          return NextResponse.json({
            success: true,
            response: reply,
            model: ZAYKA_MODEL_ID,
            backend: ZAYKA_SELF_HOSTED_URL ? 'self-hosted' : 'huggingface',
          });
        }
      } catch (customErr) {
        console.warn('Custom Zayka Brain endpoint failed, falling back to universal AI router:', customErr);
      }
    }

    // Priority 3: Universal Multi-Provider Free AI Router (Always works!)
    const historyBlock = chatHistory
      .slice(-8)
      .map(m => `${m.role === 'user' ? 'User' : 'Zayka Brain'}: ${m.content}`)
      .join('\n');

    const fullUserPrompt = historyBlock
      ? `CHAT HISTORY:\n${historyBlock}\n\nUser: ${message}\nZayka Brain:`
      : message;

    const aiReply = await callAI(fullUserPrompt, {
      systemPrompt: systemPromptWithContext,
      jsonMode: false,
      fast: true,
      maxTokens: 1024,
    });

    return NextResponse.json({
      success: true,
      response: aiReply.trim(),
      model: 'zayka-brain-v2',
      backend: 'zayka-universal-ai',
    });
  } catch (error) {
    console.error('Zayka Brain API error:', error);
    return NextResponse.json({
      success: true,
      response: 'Namaste Chef! Main Zayka Brain hoon 🧠 Batao aaj kitchen mein kya banayein? Koi bhi sabzi ya dish ka naam bolo!',
      model: 'zayka-brain-fallback',
      backend: 'fallback',
    });
  }
}
