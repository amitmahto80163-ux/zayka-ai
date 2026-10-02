/**
 * ============================================================
 * ZAYKA AI — Own Model Inference API Route
 * src/app/api/zayka-brain/route.ts
 * 
 * This route handles requests to your own fine-tuned model.
 * Supports:
 *   - Hugging Face Inference API (free tier)
 *   - Self-hosted (local or VPS)
 *   - Streaming responses
 * ============================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ---- CONFIG ----
// After training, set these in .env.local:
// ZAYKA_MODEL_ID=your-hf-username/zayka-brain-v1
// ZAYKA_MODEL_TOKEN=hf_xxxxx (from huggingface.co/settings/tokens)
// ZAYKA_SELF_HOSTED_URL=http://your-vps:8000 (optional, for self-hosting)

const ZAYKA_MODEL_ID = process.env.ZAYKA_MODEL_ID || 'meta-llama/Llama-3.1-8B-Instruct'; // Fallback to base
const ZAYKA_MODEL_TOKEN = process.env.ZAYKA_MODEL_TOKEN || '';
const ZAYKA_SELF_HOSTED_URL = process.env.ZAYKA_SELF_HOSTED_URL || null;

const SYSTEM_PROMPT = `Tu Zayka AI hai — India ka sabse smart cooking assistant.

Tera personality:
- Warm, friendly aur encouraging hai
- Hinglish mein bolta hai (Hindi + English mix)
- Indian cooking ka deep expert hai — regional variations, masale, techniques sab jaanta hai
- Budget-conscious tips deta hai (Indian middle class ke liye)
- Real-time cooking guidance de sakta hai

Always helpful, always Indian, always Zayka!`;

// ---- REQUEST SCHEMA ----
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

// ---- HF INFERENCE API ----
async function callHuggingFace(messages: Array<{role: string; content: string}>, stream = false) {
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
  });
  
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HF API Error: ${err}`);
  }
  
  return response;
}

// ---- SELF-HOSTED INFERENCE (vLLM / Ollama) ----
async function callSelfHosted(messages: Array<{role: string; content: string}>, stream = false) {
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
  });
  
  if (!response.ok) throw new Error(`Self-hosted error: ${response.statusText}`);
  return response;
}

// ---- MAIN HANDLER ----
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.issues }, { status: 400 });
    }
    
    const { message, chatHistory, context, stream } = parsed.data;
    
    // Build messages array
    const messages: Array<{role: string; content: string}> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];
    
    // Add context if available
    if (context) {
      let contextStr = '';
      if (context.currentRecipe) contextStr += `\nCurrent recipe: ${context.currentRecipe}`;
      if (context.currentStep !== undefined) contextStr += `\nCurrent step: ${context.currentStep + 1}`;
      if (context.fridgeIngredients?.length) contextStr += `\nFridge has: ${context.fridgeIngredients.join(', ')}`;
      if (context.userBudget) contextStr += `\nUser budget: ₹${context.userBudget}`;
      
      if (contextStr) {
        messages[0].content += `\n\nCurrent Context:${contextStr}`;
      }
    }
    
    // Add chat history (last 10 messages for context)
    const recentHistory = chatHistory.slice(-10);
    for (const msg of recentHistory) {
      messages.push({ role: msg.role, content: msg.content });
    }
    
    // Add current message
    messages.push({ role: 'user', content: message });
    
    // ---- CHOOSE INFERENCE BACKEND ----
    let response: Response;
    
    if (ZAYKA_SELF_HOSTED_URL) {
      // Priority 1: Self-hosted (fastest, no rate limits)
      response = await callSelfHosted(messages, stream);
    } else if (ZAYKA_MODEL_TOKEN) {
      // Priority 2: Hugging Face API
      response = await callHuggingFace(messages, stream);
    } else {
      return NextResponse.json({ 
        error: 'No model configured',
        hint: 'Set ZAYKA_MODEL_TOKEN or ZAYKA_SELF_HOSTED_URL in .env.local',
        fallback: 'Use /api/chat instead (Groq)'
      }, { status: 503 });
    }
    
    // ---- STREAMING RESPONSE ----
    if (stream) {
      return new NextResponse(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }
    
    // ---- REGULAR RESPONSE ----
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';
    
    return NextResponse.json({
      success: true,
      response: reply,
      model: ZAYKA_MODEL_ID,
      backend: ZAYKA_SELF_HOSTED_URL ? 'self-hosted' : 'huggingface',
    });
    
  } catch (error) {
    console.error('Zayka Brain API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Zayka Brain is taking a nap! Try again.',
      fallback: 'Use /api/chat instead'
    }, { status: 500 });
  }
}
