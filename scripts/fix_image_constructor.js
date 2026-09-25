const fs = require('fs');

const files = [
  'src/app/diet/_components/Client.tsx',
  'src/app/fridge/_components/Client.tsx',
  'src/app/judge/_components/Client.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/new Image\(\)/g, 'new window.Image()');
  fs.writeFileSync(file, content);
});
console.log('Fixed Image constructors');
