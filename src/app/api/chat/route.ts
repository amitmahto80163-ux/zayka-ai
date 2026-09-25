import * as Sentry from '@sentry/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { chatWithChef } from '@/lib/gemini';
import { AppLanguage, ChefId } from '@/types';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  chefId: z.enum(['arjun', 'zara', 'nani', 'sanjeev_kapoor']).default('arjun'),
  language: z.enum(['hinglish', 'hindi', 'english']).default('hinglish'),
  currentRecipe: z.any().nullable().optional(),
  chatHistory: z.array(z.object({
    role: z.string(),
    content: z.string().max(2000)
  })).max(50).default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { message, chefId, language, currentRecipe, chatHistory } = parsed.data;

    const response = await chatWithChef(
      message,
      chefId as ChefId,
      language as AppLanguage,
      currentRecipe,
      chatHistory
    );

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('Chat API error:', error);
    Sentry.captureException(error);
    return NextResponse.json(
      { success: false, error: 'Chef AI temporarily unavailable' },
      { status: 500 }
    );
  }
}
