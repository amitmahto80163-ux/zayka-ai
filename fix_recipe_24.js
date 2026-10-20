const fs = require('fs');
let client = fs.readFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', 'utf8');

if (!client.includes('fridgeIngredients')) {
  // Inject fridgeIngredients into the hook
  client = client.replace(
    'const { user, favourites, addFavourite, removeFavourite, currentRecipe, setCurrentRecipe, currentStep, setCurrentStep } = useZaykaStore();',
    'const { user, favourites, addFavourite, removeFavourite, currentRecipe, setCurrentRecipe, currentStep, setCurrentStep, fridgeIngredients, setFridgeIngredients } = useZaykaStore();'
  );
  // Same for alternative pattern
  client = client.replace(
    'const { user, favourites, addFavourite, removeFavourite } = useZaykaStore();',
    'const { user, favourites, addFavourite, removeFavourite, currentRecipe, setCurrentRecipe, fridgeIngredients, setFridgeIngredients } = useZaykaStore();'
  );

  // Add difficulty badge near time/calories
  const diffBadge = `
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: W.card, padding: '10px 16px', borderRadius: 16, border: \`1.5px solid \${W.border}\` }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: W.text, textTransform: 'capitalize' }}>{recipe.difficulty || 'Beginner'}</span>
              </div>
  `;
  client = client.replace(
    /<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* TABS \*\/\}/s,
    `</div>\n              ${diffBadge}\n            </div>\n          </div>\n\n          {/* TABS */}`
  );

  // Replace map in ingredients with the fridge matcher
  client = client.replace(
    /<span style=\{\{ fontSize: 14, fontWeight: 700, color: W\.text, display: 'flex', flex: 1 \}\}>\{ing\.nameHindi \|\| ing\.name\}<\/span>/g,
    `<span style={{ fontSize: 14, fontWeight: 700, color: W.text, display: 'flex', flex: 1, textDecoration: (fridgeIngredients || []).some(f => (ing.nameHindi||ing.name).toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes((ing.nameHindi||ing.name).toLowerCase())) ? 'line-through' : 'none', opacity: (fridgeIngredients || []).some(f => (ing.nameHindi||ing.name).toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes((ing.nameHindi||ing.name).toLowerCase())) ? 0.5 : 1 }}>{ing.nameHindi || ing.name}</span>`
  );

  fs.writeFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', client);
  console.log('Fixed recipe client 24');
}
