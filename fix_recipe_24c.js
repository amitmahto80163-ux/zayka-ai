const fs = require('fs');
let client = fs.readFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', 'utf8');

client = client.replace(
  'const [expanded, setExpanded] = useState(false);',
  'const [expanded, setExpanded] = useState(false);\n  const { fridgeIngredients } = useZaykaStore();'
);

fs.writeFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', client);
