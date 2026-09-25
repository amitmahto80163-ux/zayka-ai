const fs = require('fs');
let client = fs.readFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', 'utf8');

client = client.replace(
  'export default function RecipeDetailPage() {',
  'export default function RecipeClient({ initialDish }: { initialDish: any }) {'
);

fs.writeFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', client);
console.log('Fixed export');
