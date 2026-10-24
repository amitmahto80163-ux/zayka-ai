// ============================================
// ZAYKA AI — Universal Free Market AI Router
// Integrates ALL 12 Free AI Providers in the Market:
// • 3 Keyless 100% Free Providers (Pollinations OpenAI, Llama, Mistral — 0 API keys needed!)
// • 9 Free-Tier Cloud AI Providers (Groq, Gemini, Cerebras, SambaNova, Mistral, GitHub Models, OpenRouter Free, Cohere, HuggingFace)
// ============================================

export interface AIProvider {
  id: string;
  name: string;
  baseUrl: string;
  endpointUrl?: string;       // Optional full chat completions URL override
  model: string;
  fastModel: string;
  apiKeyEnv: string;
  requiresKey?: boolean;      // false = works with ZERO API key!
  maxDailyRequests: number;   // Free tier daily limit
  avgLatencyMs: number;       // Approximate speed
  supportsJSON: boolean;
  priority: number;           // Lower = try first
}

export const AI_PROVIDERS: AIProvider[] = [
  // ─── TIER 1: ULTRA-FAST FREE TIER API PROVIDERS (IF KEY CONFIGURED) ───
  {
    id: 'groq',
    name: 'Groq Cloud (Free Tier)',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    fastModel: 'llama-3.1-8b-instant',
    apiKeyEnv: 'GROQ_API_KEY',
    requiresKey: true,
    maxDailyRequests: 14400,
    avgLatencyMs: 280,
    supportsJSON: true,
    priority: 1,
  },
  {
    id: 'cerebras',
    name: 'Cerebras Wafer-Scale (Free Tier)',
    baseUrl: 'https://api.cerebras.ai/v1',
    model: 'llama-3.3-70b',
    fastModel: 'llama3.1-8b',
    apiKeyEnv: 'CEREBRAS_API_KEY',
    requiresKey: true,
    maxDailyRequests: 14400,
    avgLatencyMs: 250,
    supportsJSON: true,
    priority: 1,
  },
  {
    id: 'gemini',
    name: 'Google Gemini AI Studio (Free Tier)',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-3.1-flash-lite',
    fastModel: 'gemini-flash-latest',
    apiKeyEnv: 'GEMINI_API_KEY',
    requiresKey: true,
    maxDailyRequests: 1500,
    avgLatencyMs: 350,
    supportsJSON: true,
    priority: 2,
  },
  {
    id: 'sambanova',
    name: 'SambaNova Cloud (Free Tier)',
    baseUrl: 'https://api.sambanova.ai/v1',
    model: 'Meta-Llama-3.3-70B-Instruct',
    fastModel: 'Meta-Llama-3.1-8B-Instruct',
    apiKeyEnv: 'SAMBANOVA_API_KEY',
    requiresKey: true,
    maxDailyRequests: 1000,
    avgLatencyMs: 450,
    supportsJSON: true,
    priority: 2,
  },
  {
    id: 'github',
    name: 'GitHub Models (Free Tier)',
    baseUrl: 'https://models.inference.ai.azure.com',
    model: 'gpt-4o-mini',
    fastModel: 'gpt-4o-mini',
    apiKeyEnv: 'GITHUB_MODELS_KEY',
    requiresKey: true,
    maxDailyRequests: 1000,
    avgLatencyMs: 650,
    supportsJSON: true,
    priority: 3,
  },
  {
    id: 'mistral',
    name: 'Mistral AI La Plateforme (Free Tier)',
    baseUrl: 'https://api.mistral.ai/v1',
    model: 'mistral-small-latest',
    fastModel: 'open-mistral-nemo',
    apiKeyEnv: 'MISTRAL_API_KEY',
    requiresKey: true,
    maxDailyRequests: 2000,
    avgLatencyMs: 700,
    supportsJSON: true,
    priority: 3,
  },
  {
    id: 'openrouter',
    name: 'OpenRouter Free Models',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    fastModel: 'google/gemma-3-27b-it:free',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    requiresKey: true,
    maxDailyRequests: 1000,
    avgLatencyMs: 1100,
    supportsJSON: false,
    priority: 4,
  },
  {
    id: 'cohere',
    name: 'Cohere Trial API (Free Tier)',
    baseUrl: 'https://api.cohere.ai/compatibility/v1',
    model: 'command-r-08-2024',
    fastModel: 'command-r-08-2024',
    apiKeyEnv: 'COHERE_API_KEY',
    requiresKey: true,
    maxDailyRequests: 500,
    avgLatencyMs: 900,
    supportsJSON: false,
    priority: 4,
  },
  {
    id: 'huggingface',
    name: 'HuggingFace Serverless Inference (Free)',
    baseUrl: 'https://router.huggingface.co/hf-inference/models/meta-llama/Llama-3.2-3B-Instruct/v1',
    model: 'meta-llama/Llama-3.2-3B-Instruct',
    fastModel: 'meta-llama/Llama-3.2-3B-Instruct',
    apiKeyEnv: 'HF_TOKEN',
    requiresKey: true,
    maxDailyRequests: 1000,
    avgLatencyMs: 1000,
    supportsJSON: false,
    priority: 5,
  },

  // ─── TIER 2: ZERO-KEY 100% FREE AI PROVIDERS (NO API KEY NEEDED!) ───
  {
    id: 'pollinations-openai',
    name: 'Pollinations Free AI (OpenAI GPT-4o-Mini — No Key Needed)',
    baseUrl: 'https://text.pollinations.ai',
    endpointUrl: 'https://text.pollinations.ai/openai',
    model: 'openai',
    fastModel: 'openai',
    apiKeyEnv: '',
    requiresKey: false,
    maxDailyRequests: 50000,
    avgLatencyMs: 900,
    supportsJSON: false,
    priority: 6,
  },
  {
    id: 'pollinations-llama',
    name: 'Pollinations Free AI (Llama 3.3 70B — No Key Needed)',
    baseUrl: 'https://text.pollinations.ai',
    endpointUrl: 'https://text.pollinations.ai/openai',
    model: 'llama',
    fastModel: 'llama',
    apiKeyEnv: '',
    requiresKey: false,
    maxDailyRequests: 50000,
    avgLatencyMs: 950,
    supportsJSON: false,
    priority: 7,
  },
  {
    id: 'pollinations-mistral',
    name: 'Pollinations Free AI (Mistral Small — No Key Needed)',
    baseUrl: 'https://text.pollinations.ai',
    endpointUrl: 'https://text.pollinations.ai/openai',
    model: 'mistral',
    fastModel: 'mistral',
    apiKeyEnv: '',
    requiresKey: false,
    maxDailyRequests: 50000,
    avgLatencyMs: 1000,
    supportsJSON: false,
    priority: 8,
  },
];

// ─── In-memory request tracker (resets on server restart) ──
const dailyUsage: Record<string, { count: number; date: string }> = {};

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getUsage(providerId: string): number {
  const today = getToday();
  if (!dailyUsage[providerId] || dailyUsage[providerId].date !== today) {
    dailyUsage[providerId] = { count: 0, date: today };
  }
  return dailyUsage[providerId].count;
}

function incrementUsage(providerId: string): void {
  const today = getToday();
  if (!dailyUsage[providerId] || dailyUsage[providerId].date !== today) {
    dailyUsage[providerId] = { count: 0, date: today };
  }
  dailyUsage[providerId].count++;
}

function isProviderConfigured(p: AIProvider): boolean {
  if (p.requiresKey === false) return true;
  return Boolean(p.apiKeyEnv && process.env[p.apiKeyEnv]);
}

// ─── Get available providers sorted by priority ──────────────
function getAvailableProviders(preferFast = false): AIProvider[] {
  return AI_PROVIDERS
    .filter(p => {
      if (!isProviderConfigured(p)) return false;
      const usage = getUsage(p.id);
      return usage < p.maxDailyRequests * 0.95;
    })
    .sort((a, b) => {
      // Always prefer configured keyed fast providers first, then keyless providers
      const aKeyed = a.requiresKey !== false ? 0 : 1;
      const bKeyed = b.requiresKey !== false ? 0 : 1;
      if (aKeyed !== bKeyed) return aKeyed - bKeyed;
      if (preferFast) return a.avgLatencyMs - b.avgLatencyMs;
      return a.priority - b.priority;
    });
}

// ─── Core OpenAI-compatible caller ────────────────────────────
async function callProvider(
  provider: AIProvider,
  messages: { role: string; content: string }[],
  jsonMode: boolean,
  fast: boolean,
  maxTokens = 4096
): Promise<string> {
  const apiKey = provider.apiKeyEnv ? process.env[provider.apiKeyEnv] : '';
  if (provider.requiresKey !== false && !apiKey) {
    throw new Error(`No API key for ${provider.name}`);
  }

  const model = fast ? provider.fastModel : provider.model;

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: 0.7,
    max_tokens: maxTokens,
  };

  // Ultra-fast Gemini: disable thinking tokens when calling Gemini via OpenAI compatibility
  if (provider.id === 'gemini') {
    body.thinking_config = { thinking_budget: 0 };
    body.extra_body = { thinking_config: { thinking_budget: 0 } };
  }

  if (jsonMode && provider.supportsJSON) {
    body.response_format = { type: 'json_object' };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  if (provider.id === 'openrouter') {
    headers['HTTP-Referer'] = 'https://zayka-ai.vercel.app';
    headers['X-Title'] = 'Zayka AI';
  }

  const targetUrl = provider.endpointUrl || `${provider.baseUrl}/chat/completions`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`${provider.name} error ${res.status}: ${errText.substring(0, 200)}`);
    }

    const rawText = await res.text();
    let content = '';
    try {
      const data = JSON.parse(rawText);
      content = data.choices?.[0]?.message?.content || '';
    } catch {
      // Some keyless endpoints may return plain text directly
      content = rawText;
    }

    if (!content || !content.trim()) {
      throw new Error(`${provider.name} returned empty content`);
    }

    incrementUsage(provider.id);
    return content;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// ============================================
// MAIN EXPORT — Smart Multi-Provider Caller
// Automatically rotates through all free providers
// ============================================
export async function callAI(
  prompt: string,
  options: {
    systemPrompt?: string;
    jsonMode?: boolean;
    fast?: boolean;
    maxTokens?: number;
    preferProvider?: string;
  } = {}
): Promise<string> {
  const {
    systemPrompt,
    jsonMode = true,
    fast = false,
    maxTokens = 4096,
    preferProvider,
  } = options;

  const messages: { role: string; content: string }[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });

  const finalPrompt = jsonMode
    ? prompt + '\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no code blocks. Just raw JSON.'
    : prompt;

  messages.push({ role: 'user', content: finalPrompt });

  let providers = getAvailableProviders(fast);

  if (preferProvider) {
    const preferred = providers.find(p => p.id === preferProvider);
    if (preferred) {
      providers = [
        preferred,
        ...providers.filter(p => p.id !== preferProvider),
      ];
    }
  }

  if (providers.length === 0) {
    throw new Error('All AI providers exhausted for today.');
  }

  const errors: string[] = [];
  for (const provider of providers) {
    try {
      console.log(`[AI] Trying ${provider.name} (usage: ${getUsage(provider.id)}/${provider.maxDailyRequests})`);
      const result = await callProvider(provider, messages, jsonMode, fast, maxTokens);
      console.log(`[AI] ✅ ${provider.name} succeeded`);
      return result;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[AI] ❌ ${provider.name} failed: ${errMsg}`);
      errors.push(`${provider.name}: ${errMsg}`);
    }
  }

  throw new Error(`All AI providers failed:\n${errors.join('\n')}`);
}

// ─── Usage stats (for monitoring) ────────────────────────────
export function getProviderStats(): Record<string, { name: string; model: string; requiresKey: boolean; usage: number; limit: number; available: boolean; hasKey: boolean }> {
  const stats: Record<string, { name: string; model: string; requiresKey: boolean; usage: number; limit: number; available: boolean; hasKey: boolean }> = {};
  for (const p of AI_PROVIDERS) {
    const requiresKey = p.requiresKey !== false;
    const hasKey = !requiresKey || Boolean(p.apiKeyEnv && process.env[p.apiKeyEnv]);
    const usage = getUsage(p.id);
    stats[p.id] = {
      name: p.name,
      model: p.model,
      requiresKey,
      usage,
      limit: p.maxDailyRequests,
      available: hasKey && usage < p.maxDailyRequests * 0.95,
      hasKey,
    };
  }
  return stats;
}
