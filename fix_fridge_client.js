const fs = require('fs');
let client = fs.readFileSync('src/app/fridge/_components/Client.tsx', 'utf8');

client = client.replace(
  'const [ingredients, setIngredients] = useState<string[]>([]);',
  'const { fridgeIngredients: ingredients, setFridgeIngredients: setIngredients } = useZaykaStore();'
);

fs.writeFileSync('src/app/fridge/_components/Client.tsx', client);
console.log('Fixed fridge client');
