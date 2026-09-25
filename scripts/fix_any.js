const fs = require('fs');
let gemini = fs.readFileSync('src/lib/gemini.ts', 'utf8');

// fix generateBudgetMeal
gemini = gemini.replace(
  "export async function generateBudgetMeal(budget: number, language: AppLanguage = 'hinglish'): Promise<any> {",
  "export async function generateBudgetMeal(budget: number, language: AppLanguage = 'hinglish'): Promise<{dishName: string, description: string, totalCost: number, ingredients: {name: string, estimatedCost: number}[], quickRecipe: string}> {"
);

// fix generateFusionRecipe
gemini = gemini.replace(
  "export async function generateFusionRecipe(likedFoods: string[], language: AppLanguage = 'hinglish'): Promise<any> {",
  "export async function generateFusionRecipe(likedFoods: string[], language: AppLanguage = 'hinglish'): Promise<{fusionName: string, emoji: string, reason: string, cuisineBlend: string, quickRecipe: string}> {"
);

// fix any casts in fallback
gemini = gemini.replace(
  "cuisine: 'indian' as any,",
  "cuisine: 'indian',"
);
gemini = gemini.replace(
  "difficulty: (preferences.difficulty as any) || 'beginner',",
  "difficulty: preferences.difficulty || 'beginner',"
);

// fix catch (error: any)
gemini = gemini.replace(
  /catch \(error: any\) \{/g,
  "catch (error: unknown) {"
);
gemini = gemini.replace(
  "console.error('Recipe generation error:', error);",
  "console.error('Recipe generation error:', error);"
);

fs.writeFileSync('src/lib/gemini.ts', gemini);

let actions = fs.readFileSync('src/lib/actions.ts', 'utf8');
actions = actions.replace(
  "name: 'Main Ingredient (ERROR: ' + (error as any).message + ')'",
  "name: 'Main Ingredient (ERROR: ' + (error instanceof Error ? error.message : 'Unknown') + ')'"
);
fs.writeFileSync('src/lib/actions.ts', actions);

console.log('Fixed any types');
