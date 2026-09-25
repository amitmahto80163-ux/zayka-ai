const fs = require('fs');
let ai = fs.readFileSync('src/lib/ai.ts', 'utf8');

// Strip out old trackApiUsage if it exists
ai = ai.replace(/async function trackApiUsage[\s\S]*?\} catch\(e\) \{\}\n\}/, '');

// Strip out old imports if they exist
ai = ai.replace(/import \{ db \} from '\.\/firebase';\n/, '');
ai = ai.replace(/import \{ doc, getDoc, setDoc, increment \} from 'firebase\/firestore';\n/, '');

// Add new tracking
const tracker = `
import { adminDb } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

function trackOpenRouterUsage() {
  if (!adminDb) return;
  (async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const docRef = adminDb.collection('api_usage').doc(today);
      await docRef.set({ openrouter: FieldValue.increment(1) }, { merge: true });

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
}
`;

ai = tracker + '\n' + ai;

fs.writeFileSync('src/lib/ai.ts', ai);
console.log('Added trackOpenRouterUsage to ai.ts');
