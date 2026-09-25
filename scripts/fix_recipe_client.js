const fs = require('fs');
let client = fs.readFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', 'utf8');

// Replace export default function RecipeDetail() with export default function RecipeClient({ initialDish }: { initialDish: any })
client = client.replace(
  'export default function RecipeDetail() {',
  'export default function RecipeClient({ initialDish }: { initialDish: any }) {'
);

// Remove the ALL_DISHES import
client = client.replace("import { ALL_DISHES } from '@/data/dishes';\n", "");

// The old code did `const dish = ALL_DISHES.find((d) => d.id === unwrappedParams.id);`
// We need to change it to `const dish = initialDish;`
client = client.replace(
  /const dish = ALL_DISHES\.find\(\(d\) => d\.id === unwrappedParams\.id\);/,
  'const dish = initialDish;'
);

fs.writeFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', client);
console.log('Updated RecipeClient');
