// ============================================
// ZAYKA AI — Recipe Generation API Route
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { generateRecipe, adaptRecipeToIngredients } from '@/lib/gemini';
import { AppLanguage } from '@/types';

// Generate full recipe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dishName,
      servings = 4,
      isVeg,
      difficulty = 'intermediate',
      language = 'hinglish',
      // For "Bol Ke Banao" feature
      availableIngredients,
      adaptMode = false,
    } = body;

    if (!dishName) {
      return NextResponse.json(
        { success: false, error: 'Dish name required' },
        { status: 400 }
      );
    }

    // "Bol Ke Banao" — Ingredient Adapter Mode
    if (adaptMode && availableIngredients?.length > 0) {
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
      language,
    });

    return NextResponse.json({
      success: true,
      data: { ...recipe, id: Date.now().toString() },
    });
  } catch (error) {
    console.error('Recipe API error:', error);
    return NextResponse.json(
      { success: false, error: 'Recipe generation failed' },
      { status: 500 }
    );
  }
}
