const fs = require('fs');

let page = fs.readFileSync('src/app/recipe/[id]/page.tsx', 'utf8');
page = page.replace('dish.ingredients?', '(dish as any).ingredients?');
page = page.replace('dish.steps?', '(dish as any).steps?');
fs.writeFileSync('src/app/recipe/[id]/page.tsx', page);

let fb = fs.readFileSync('src/lib/firebase.ts', 'utf8');
fb = fb.replace('let app;', 'let app: import("firebase/app").FirebaseApp | undefined;');
fs.writeFileSync('src/lib/firebase.ts', fb);

console.log('Fixed types');
