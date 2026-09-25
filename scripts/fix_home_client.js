const fs = require('fs');
let client = fs.readFileSync('src/app/_components/HomeClient.tsx', 'utf8');

client = client.replace(
  'export default function HomePage() {',
  'export default function HomeClient({ initialDishes }: { initialDishes: any[] }) {'
);

client = client.replace("import { ALL_DISHES } from '@/data/dishes';\n", "");
client = client.replace(/ALL_DISHES/g, 'initialDishes');

fs.writeFileSync('src/app/_components/HomeClient.tsx', client);
console.log('Fixed HomeClient');
