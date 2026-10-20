const fs = require('fs');

const files = [
  'src/app/api/chat/route.ts',
  'src/app/api/recipe/route.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('@sentry/nextjs')) {
    content = "import * as Sentry from '@sentry/nextjs';\n" + content;
  }
  
  content = content.replace(
    /console\.error\('.*?', error\);/g,
    (match) => {
      return match + "\n    Sentry.captureException(error);";
    }
  );
  
  fs.writeFileSync(file, content);
});

console.log('Added Sentry to API routes');
