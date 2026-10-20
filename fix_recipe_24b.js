const fs = require('fs');
let client = fs.readFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', 'utf8');

// Inject difficulty badge
client = client.replace(
  "{recipe.isVeg ? 'VEG' : 'NON-VEG'}</span>",
  "{recipe.isVeg ? 'VEG' : 'NON-VEG'}</span>\n                <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{recipe.difficulty || 'Beginner'}</span>"
);

// Inject fridge state from store if not already injected
if (!client.includes('fridgeIngredients')) {
  client = client.replace(
    'const { user, favourites, addFavourite, removeFavourite, currentRecipe, setCurrentRecipe, currentStep, setCurrentStep } = useZaykaStore();',
    'const { user, favourites, addFavourite, removeFavourite, currentRecipe, setCurrentRecipe, currentStep, setCurrentStep, fridgeIngredients } = useZaykaStore();'
  );
  // Alternative signature
  client = client.replace(
    'const { user, favourites, addFavourite, removeFavourite } = useZaykaStore();',
    'const { user, favourites, addFavourite, removeFavourite, currentRecipe, setCurrentRecipe, fridgeIngredients } = useZaykaStore();'
  );
}

// Modify IngredientCard to highlight fridge items
// Replace:
// <span style={{ fontSize: 14, fontWeight: 700, color: W.text, display: 'flex', flex: 1 }}>{ing.nameHindi || ing.name}</span>
const oldSpan = "<span style={{ fontSize: 14, fontWeight: 700, color: W.text, display: 'flex', flex: 1 }}>{ing.nameHindi || ing.name}</span>";
const newSpan = `
          {/* FRIDGE MATCH LOGIC */}
          <span style={{ fontSize: 14, fontWeight: 700, color: W.text, display: 'flex', flex: 1, textDecoration: (fridgeIngredients || []).some(f => (ing.name||'').toLowerCase().includes(f.toLowerCase())) ? 'line-through' : 'none', opacity: (fridgeIngredients || []).some(f => (ing.name||'').toLowerCase().includes(f.toLowerCase())) ? 0.6 : 1 }}>
            {ing.nameHindi || ing.name}
            {(fridgeIngredients || []).some(f => (ing.name||'').toLowerCase().includes(f.toLowerCase())) && <span style={{fontSize: 10, background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: 8, marginLeft: 8, textDecoration: 'none'}}>In Fridge</span>}
          </span>
`;

client = client.replace(oldSpan, newSpan);

fs.writeFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', client);
console.log('Fixed recipe client 24');
