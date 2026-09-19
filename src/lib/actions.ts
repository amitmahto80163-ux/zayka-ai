'use server';
import { rateDish, analyzeCookingFrame, scanFridgeIngredients } from './gemini';
import { routeFusionToClaude, routeBudgetToClaude, routeFridgeScanToGemini } from './ai-router';
import { AppLanguage, ChefId } from '@/types';

export async function judgeDishAction(imageBase64: string, dishName: string, language: AppLanguage) {
  try { return { success: true, data: await rateDish(imageBase64, dishName, language) }; } 
  catch { return { success: false, error: "AI failed to judge the dish." }; }
}

export async function analyzeFrameAction(imageBase64: string, currentStep: string, chefId: ChefId, language: AppLanguage) {
  try { return { success: true, feedback: await analyzeCookingFrame(imageBase64, currentStep, chefId, language) }; } 
  catch { return { success: false, error: "Failed to analyze frame." }; }
}

export async function scanFridgeAction(imageBase64: string, language: AppLanguage) {
  try { 
    const rawString = await routeFridgeScanToGemini(imageBase64, language);
    // Split by comma and clean up spaces to return a string array
    const dataArray = rawString.split(',').map(s => s.trim()).filter(Boolean);
    return { success: true, data: dataArray }; 
  } 
  catch { return { success: false, error: "AI failed to scan fridge." }; }
}

export async function generateBudgetMealAction(budget: number, language: AppLanguage) {
  try { return { success: true, data: await routeBudgetToClaude(budget, language) }; } 
  catch { return { success: false, error: "Failed to generate budget meal" }; }
}

export async function generateFusionRecipeAction(likedFoods: string[], language: AppLanguage) {
  try { return { success: true, data: await routeFusionToClaude(likedFoods, language) }; } 
  catch { return { success: false, error: "Failed to generate fusion recipe" }; }
}
