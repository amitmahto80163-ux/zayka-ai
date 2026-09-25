import * as Sentry from '@sentry/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { generateRecipe, adaptRecipeToIngredients } from '@/lib/gemini';
import { AppLanguage } from '@/types';
import { z } from 'zod';

const recipeSchema = z.object({
  dishName: z.string().min(1, 'Dish name required').max(150, 'Dish name too long'),
  servings: z.number().int().min(1).max(20).default(4),
  isVeg: z.boolean().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'expert']).default('intermediate'),
  language: z.enum(['hinglish', 'hindi', 'english']).default('hinglish'),
  availableIngredients: z.array(z.string().max(100)).max(50).optional(),
  adaptMode: z.boolean().default(false)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = recipeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { dishName, servings, isVeg, difficulty, language, availableIngredients, adaptMode } = parsed.data;

    // "Bol Ke Banao" - Ingredient Adapter Mode
    if (adaptMode && availableIngredients && availableIngredients.length > 0) {
      const adapted = await adaptRecipeToIngredients(
        dishName,
        availableIngredients,
        language as AppLanguage
      );
      return NextResponse.json({ success: true, data: adapted, mode: 'adapted' });
    }

    // Normal recipe generation
    const recipe = await generateRecipe(dishName, {
      servings,
      isVeg,
      difficulty,
      language: language as AppLanguage,
    });

    return NextResponse.json({
      success: true,
      data: { ...recipe, id: Date.now().toString() },
    });
  } catch (error) {
    console.error('Recipe API error:', error);
    Sentry.captureException(error);
    return NextResponse.json(
      { success: false, error: 'Recipe generation failed' },
      { status: 500 }
    );
  }
}
