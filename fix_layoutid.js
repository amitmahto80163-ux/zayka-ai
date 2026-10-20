const fs = require('fs');

let home = fs.readFileSync('src/app/_components/HomeClient.tsx', 'utf8');
home = home.replace(
  /<Image src=\{dish\.image\}.*?alt=\{dish\.name\}.*?\/>/s,
  (match) => `<motion.div layoutId={\`recipe-img-\${dish.id}\`} style={{ width: '100%', height: '100%', position: 'absolute' }}>\n              ${match}\n            </motion.div>`
);
home = home.replace(
  /<h3 style=\{\{ fontSize: 16, fontWeight: 900, color: '#1C1009'.*?\}\}>\{dish\.name\}<\/h3>/s,
  `<motion.h3 layoutId={\`recipe-title-\${dish.id}\`} style={{ fontSize: 16, fontWeight: 900, color: '#1C1009', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dish.name}</motion.h3>`
);
fs.writeFileSync('src/app/_components/HomeClient.tsx', home);

let recipe = fs.readFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', 'utf8');
recipe = recipe.replace(
  /<Image src=\{recipe\.image\}.*?alt=\{recipe\.name\}.*?\/>/s,
  (match) => `<motion.div layoutId={\`recipe-img-\${recipe.id}\`} style={{ width: '100%', height: '100%', position: 'absolute' }}>\n            ${match}\n          </motion.div>`
);
recipe = recipe.replace(
  /<p style=\{\{ color: 'rgba\(255,255,255,0\.8\)', fontSize: 13, fontWeight: 600, marginBottom: 10 \}\}>\{recipe\.name\}<\/p>/s,
  `<motion.p layoutId={\`recipe-title-\${recipe.id}\`} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{recipe.name}</motion.p>`
);
fs.writeFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', recipe);
console.log('Added layoutIds');
