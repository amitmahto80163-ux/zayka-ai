const fs = require('fs');

const files = [
  'src/app/_components/HomeClient.tsx',
  'src/app/auth/_components/Client.tsx',
  'src/app/recipe/[id]/_components/RecipeClient.tsx',
  'src/app/cook/_components/Client.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // For standard motion.button
    content = content.replace(
      /<motion\.button\s+whileTap=\{\{ scale: 0\.95 \}\}/g,
      '<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}'
    );
    // Find plain buttons with specific backgrounds and make them motion.button
    // We only want to convert major ones. I'll convert the main ones in HomeClient.
    if (file.includes('HomeClient')) {
      content = content.replace(
        /<button onClick=\{\(\) => router\.push\('\/search'\)\}/,
        '<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => router.push(\'/search\')}'
      );
      content = content.replace(
        /<\/button>/g,
        (match, offset, str) => {
          const prefix = str.substring(offset - 200, offset);
          if (prefix.includes('<motion.button')) return '</motion.button>';
          return match;
        }
      );
    }
    fs.writeFileSync(file, content);
  }
});
console.log('Added button micro-interactions');
