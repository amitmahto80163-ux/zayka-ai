const fs = require('fs');
let rc = fs.readFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', 'utf8');

// Remove it from IngredientCard
rc = rc.replace(/const variants = \{[\s\S]*?exit: \(direction: number\) => \(\{ x: direction < 0 \? 30 : -30, opacity: 0 \}\)\s*\};\s*/, '');

// Put it inside RecipeClient instead
rc = rc.replace(
  'const { user, favourites, addFavourite, removeFavourite, currentRecipe, setCurrentRecipe, currentStep, setCurrentStep, fridgeIngredients, lastRecipeTab: activeTab, setLastRecipeTab: setActiveTab } = useZaykaStore();',
  `const { user, favourites, addFavourite, removeFavourite, currentRecipe, setCurrentRecipe, currentStep, setCurrentStep, fridgeIngredients, lastRecipeTab: activeTab, setLastRecipeTab: setActiveTab } = useZaykaStore();\n  const variants = {\n    enter: (direction: number) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),\n    center: { x: 0, opacity: 1 },\n    exit: (direction: number) => ({ x: direction < 0 ? 30 : -30, opacity: 0 })\n  };`
);

fs.writeFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', rc);
console.log('Fixed variants');
