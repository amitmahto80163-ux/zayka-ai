const fs = require('fs');
let store = fs.readFileSync('src/store/index.ts', 'utf8');

store = store.replace(/user\?\.uid/g, 'user?.id');
store = store.replace(/user\.uid/g, 'user.id');
store = store.replace(/user!\.uid/g, 'user!.id');

fs.writeFileSync('src/store/index.ts', store);
console.log('Fixed uid -> id');
