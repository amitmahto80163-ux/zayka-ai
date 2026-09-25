const fs = require('fs');
const files = [
  'src/app/swipe/page.tsx', 
  'src/app/diet/page.tsx', 
  'src/app/challenge/page.tsx', 
  'src/app/profile/page.tsx', 
  'src/app/world/page.tsx', 
  'src/app/recipe/[id]/page.tsx',
  'src/app/page.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/textTransform:\s*['"]uppercase['"]\s*,?/g, '');
  content = content.replace(/letterSpacing:\s*[-0-9a-zA-Z.'" ]+,?/g, '');
  
  fs.writeFileSync(file, content);
  console.log('Fixed uppercase in ' + file);
});
