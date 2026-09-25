const fs = require('fs');
let c = fs.readFileSync('src/app/layout.tsx', 'utf8');
c = c.replace('Inter', 'Playfair_Display');
c = c.replace('const inter = Inter', 'const playfair = Playfair_Display');
c = c.replace('--font-inter', '--font-playfair');
c = c.replace('\', '\');
c = c.replace('weight: ["400", "500", "600"]', 'weight: ["400", "500", "600", "700", "800", "900"]');
fs.writeFileSync('src/app/layout.tsx', c);
console.log('Playfair added');
