'use server';

import { rateDish, analyzeCookingFrame, scanFridgeIngredients, generateBudgetMeal, generateFusionRecipe } from './gemini';
import { AppLanguage, ChefId } from '@/types';

export async function judgeDishAction(imageBase64: string, dishName: string, language: AppLanguage) {
  try {
    const result = await rateDish(imageBase64, dishName, language);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to judge dish:", error);
    return { success: false, error: "AI failed to judge the dish." };
  }
}

export async function analyzeFrameAction(imageBase64: string, currentStep: string, chefId: ChefId, language: AppLanguage) {
  try {
    const result = await analyzeCookingFrame(imageBase64, currentStep, chefId, language);
    return { success: true, feedback: result };
  } catch (error) {
    return { success: false, error: "Failed to analyze frame." };
  }
}

export async function scanFridgeAction(imageBase64: string, language: AppLanguage) {
  try {
    const ingredients = await scanFridgeIngredients(imageBase64, language);
    return { success: true, data: ingredients };
  } catch (error) {
    console.error("Failed to scan fridge:", error);
    return { success: false, error: "AI failed to scan fridge." };
  }
}

export async function generateBudgetMealAction(budget: number, language: AppLanguage) {
  try {
    const meal = await generateBudgetMeal(budget, language);
    return { success: true, data: meal };
  } catch (error) {
    return { success: false, error: "Failed to generate budget meal" };
  }
}

export async function generateFusionRecipeAction(likedFoods: string[], language: AppLanguage) {
  try {
    const fusion = await generateFusionRecipe(likedFoods, language);
    return { success: true, data: fusion };
  } catch (error) {
    return { success: false, error: "Failed to generate fusion recipe" };
  }
}
