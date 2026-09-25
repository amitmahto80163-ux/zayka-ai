const fs = require('fs');
let ai = fs.readFileSync('src/lib/ai.ts', 'utf8');

const imports = `import { db } from './firebase';\nimport { doc, getDoc, setDoc, increment } from 'firebase/firestore';\n\n`;

const tracker = `
async function trackApiUsage(provider: 'groq' | 'gemini' | 'openrouter') {
  try {
    const today = new Date().toISOString().split('T')[0];
    const docRef = doc(db, 'api_usage', today);
    await setDoc(docRef, { [provider]: increment(1) }, { merge: true });

    if (provider === 'openrouter') {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
         const count = snap.data().openrouter || 0;
         if (count >= 40) {
            console.warn(\`WARNING: OpenRouter usage is at \${count}/50 for today!\`);
         }
      }
    }
  } catch(e) {}
}
`;

ai = imports + tracker + ai;

// Insert tracking
ai = ai.replace(
  "const res = await fetch('https://api.groq.com/",
  "trackApiUsage('groq');\n  const res = await fetch('https://api.groq.com/"
);

ai = ai.replace(
  "const res = await fetch(`https://generativelanguage.googleapis.com/",
  "trackApiUsage('gemini');\n  const res = await fetch(`https://generativelanguage.googleapis.com/"
);

ai = ai.replace(
  "const res = await fetch('https://openrouter.ai/",
  "trackApiUsage('openrouter');\n        const res = await fetch('https://openrouter.ai/"
);

fs.writeFileSync('src/lib/ai.ts', ai);
console.log('API Usage tracking added');
