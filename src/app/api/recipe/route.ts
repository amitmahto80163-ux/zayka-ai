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
  language: z.enum([
    'hindi', 'english', 'hinglish', 'punjabi', 'tamil', 'telugu', 'bengali', 'gujarati'
  ]).default('hinglish'),
  chefId: z.string().optional(),
  availableIngredients: z.array(z.string().max(100)).max(50).optional(),
  ingredients: z.array(z.string().max(100)).max(50).optional(),
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

    const { dishName, servings, isVeg, difficulty, language, availableIngredients, ingredients, adaptMode } = parsed.data;
    const ingList = availableIngredients?.length ? availableIngredients : ingredients;

    // "Bol Ke Banao" - Ingredient Adapter Mode
    if (ingList && ingList.length > 0) {
      const [adapted, fullRecipe] = await Promise.all([
        adaptRecipeToIngredients(dishName, ingList, language as AppLanguage),
        generateRecipe(`${dishName} using ${ingList.join(', ')}`, {
          servings,
          isVeg,
          difficulty,
          language: language as AppLanguage,
        }),
      ]);
      return NextResponse.json({
        success: true,
        data: {
          ...fullRecipe,
          id: Date.now().toString(),
          description: adapted.adaptedRecipe || fullRecipe.description,
          adaptedInfo: adapted,
        },
        mode: 'adapted',
      });
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
