import { NextRequest, NextResponse } from 'next/server';
import { analyzeFrameAction } from '@/lib/actions';
import { AppLanguage, ChefId } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      imageBase64,
      currentStep = 'Cooking step in progress',
      chefId = 'rohan',
      language = 'hinglish',
      context = {},
    } = body as {
      imageBase64?: string;
      currentStep?: string;
      chefId?: ChefId;
      language?: AppLanguage;
      context?: Record<string, unknown>;
    };

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json(
        { error: 'imageBase64 is required for AR Vision analysis' },
        { status: 400 }
      );
    }

    const result = await analyzeFrameAction(
      imageBase64,
      currentStep,
      chefId,
      language,
      context as any
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[/api/vision] Error:', err);
    return NextResponse.json(
      {
        error: err?.message || 'Vision analysis failed',
      },
      { status: 500 }
    );
  }
}
