const fs = require('fs');
let fb = fs.readFileSync('src/lib/firebase.ts', 'utf8');

if (!fb.includes('getMessaging')) {
  fb = fb.replace(
    "import { getStorage } from 'firebase/storage';",
    "import { getStorage } from 'firebase/storage';\nimport { getMessaging, isSupported } from 'firebase/messaging';"
  );
  
  fb += `\nexport const messaging = async () => {\n  if (app && await isSupported()) {\n    return getMessaging(app);\n  }\n  return null;\n};\n`;
  fs.writeFileSync('src/lib/firebase.ts', fb);
}
