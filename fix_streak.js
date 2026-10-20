const fs = require('fs');
let store = fs.readFileSync('src/store/index.ts', 'utf8');

store = store.replace(
  /const newStreak = last === yesterday \? state\.currentStreak \+ 1 : 1;/g,
  "const newStreak = last === today ? state.currentStreak : (last === yesterday ? state.currentStreak + 1 : 1);"
);

fs.writeFileSync('src/store/index.ts', store);
console.log('Fixed streak logic bug');
