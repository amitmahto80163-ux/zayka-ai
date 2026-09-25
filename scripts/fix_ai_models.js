const fs = require('fs');
let ai = fs.readFileSync('src/lib/ai.ts', 'utf8');

ai = ai.replace("const GROQ_TEXT_MODEL = 'qwen/qwen3.8-27b';", "const GROQ_TEXT_MODEL = 'llama-3.3-70b-versatile';\nconst GROQ_FAST_MODEL = 'llama-3.1-8b-instant';");
ai = ai.replace("const OR_VISION_MODEL = 'qwen/qwen3.8-27b:free';", "");
ai = ai.replace("const visionModels = [OR_VISION_MODEL, OR_VISION_FALLBACK, 'google/gemma-4-31b-it:free'];", "const visionModels = ['google/gemma-3-27b-it:free', OR_VISION_FALLBACK];");

// Also check for callGroq to accept a model override, or we can just add it
if (!ai.includes('model: modelOverride || GROQ_TEXT_MODEL')) {
  ai = ai.replace(
    'jsonMode = true',
    'jsonMode = true,\n  modelOverride?: string'
  );
  ai = ai.replace(
    'model: GROQ_TEXT_MODEL,',
    'model: modelOverride || GROQ_TEXT_MODEL,'
  );
}

fs.writeFileSync('src/lib/ai.ts', ai);
console.log('Updated ai.ts models');
