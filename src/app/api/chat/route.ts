// ============================================
// ZAYKA AI — Chef AI Chat API Route
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { chatWithChef } from '@/lib/gemini';
import { AppLanguage, ChefId } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      chefId = 'arjun',
      language = 'hinglish',
      currentRecipe = null,
      chatHistory = [],
    } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message required' },
        { status: 400 }
      );
    }

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
    return NextResponse.json(
      { success: false, error: 'Chef AI temporarily unavailable' },
      { status: 500 }
    );
  }
}
