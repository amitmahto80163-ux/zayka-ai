const fs = require('fs');
let ai = fs.readFileSync('src/lib/ai.ts', 'utf8');

// 1. Replace imports and tracker logic
const targetTrackerRegex = /import \{ db \} from '\.\/firebase';\nimport \{ doc, getDoc, setDoc, increment \} from 'firebase\/firestore';\n\nasync function trackApiUsage[\s\S]*?\} catch\(e\) \{\}\n\}/;

const replacementTracker = `import { adminDb } from './firebase-admin';
import * as admin from 'firebase-admin';

function trackOpenRouterUsage() {
  if (!adminDb) return;
  // Fire and forget
  (async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const docRef = adminDb.collection('api_usage').doc(today);
      await docRef.set({ openrouter: admin.firestore.FieldValue.increment(1) }, { merge: true });

      const snap = await docRef.get();
      if (snap.exists) {
         const count = snap.data()?.openrouter || 0;
         if (count >= 40) {
            console.warn(\`WARNING: OpenRouter usage is at \${count}/50 for today!\`);
         }
      }
    } catch(e) {
      console.error('Usage tracking error:', e);
    }
  })();
}`;

ai = ai.replace(targetTrackerRegex, replacementTracker);

// 2. Remove trackApiUsage('groq');
ai = ai.replace(/trackApiUsage\('groq'\);\n\s*/g, '');

// 3. Remove trackApiUsage('gemini');
ai = ai.replace(/trackApiUsage\('gemini'\);\n\s*/g, '');

// 4. Change trackApiUsage('openrouter'); to trackOpenRouterUsage();
ai = ai.replace(/trackApiUsage\('openrouter'\);/g, 'trackOpenRouterUsage();');

fs.writeFileSync('src/lib/ai.ts', ai);
console.log('Fixed API tracking in ai.ts');
