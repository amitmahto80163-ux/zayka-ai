const fs = require('fs');
let rc = fs.readFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', 'utf8');

rc = rc.replace(
  "const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'cost' | 'chef'>('ingredients');",
  "const { lastRecipeTab: activeTab, setLastRecipeTab: setActiveTab } = useZaykaStore();"
);

if (!rc.includes('lastRecipeTab')) {
  rc = rc.replace(
    'const { user, favourites, addFavourite, removeFavourite, currentRecipe, setCurrentRecipe, currentStep, setCurrentStep, fridgeIngredients } = useZaykaStore();',
    'const { user, favourites, addFavourite, removeFavourite, currentRecipe, setCurrentRecipe, currentStep, setCurrentStep, fridgeIngredients, lastRecipeTab, setLastRecipeTab } = useZaykaStore();'
  );
}

fs.writeFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', rc);
console.log('Fixed RecipeClient tab sync');
