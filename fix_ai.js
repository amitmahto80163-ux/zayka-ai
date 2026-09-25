const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'ai.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const target =   if (!res.ok) {
    const err = await res.text();
    throw new Error(\Groq Error: \ — \\);
  };

const replacement =   if (!res.ok) {
    const err = await res.text();
    if (res.status === 401 && OPENROUTER_API_KEY) {
      console.warn('Groq failed with 401 (Invalid Key). Falling back to OpenRouter text model.');
      const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': \Bearer \\,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://zayka-ai.vercel.app',
          'X-Title': 'Zayka AI',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages,
          temperature: 0.7,
        }),
      });
      if (orRes.ok) {
        const orData = await orRes.json();
        return orData.choices[0].message.content;
      }
    }
    throw new Error(\Groq Error: \ — \\);
  };

content = content.replace(target, replacement);
fs.writeFileSync(filePath, content);
console.log('Injected fallback');
