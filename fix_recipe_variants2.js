const fs = require('fs');
let rc = fs.readFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', 'utf8');

// If variants doesn't exist at the top, add it
if (!rc.includes('const swipeVariants = {')) {
  const topVariants = `
const swipeVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 30 : -30, opacity: 0 })
};
`;
  rc = rc.replace("import { W } from '@/lib/theme';", "import { W } from '@/lib/theme';\n" + topVariants);
  
  // replace variants={variants} with variants={swipeVariants}
  rc = rc.replace(/variants=\{variants\}/g, 'variants={swipeVariants}');
}

fs.writeFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', rc);
console.log('Fixed variants globally');
