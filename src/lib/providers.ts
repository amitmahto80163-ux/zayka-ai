// ============================================
// ZAYKA AI — Multi-Provider Load Balancer
// 7 FREE AI providers rotating automatically
// Capacity: ~10,000 users/day at ₹0 cost!
// ============================================

export interface AIProvider {
  id: string;
  name: string;
  baseUrl: string;
  model: string;
  fastModel: string;
  apiKeyEnv: string;
  maxDailyRequests: number;   // Free tier daily limit
  avgLatencyMs: number;       // Approximate speed
  supportsJSON: boolean;
  priority: number;           // Lower = try first
}

// All 7 providers — all free tiers
export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'qwen/qwen3.8-27b',
    fastModel: 'openai/gpt-oss-20b',
    apiKeyEnv: 'GROQ_API_KEY',
    maxDailyRequests: 14400,
    avgLatencyMs: 300,
    supportsJSON: true,
    priority: 1, // PRIMARY AI — 100% Free, active & ultra-fast!
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    fastModel: 'deepseek-chat',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    maxDailyRequests: 5000,
    avgLatencyMs: 1200,
    supportsJSON: true,
    priority: 2, // Secondary fallback
  },
  {
    id: 'zhipu',
    name: 'Zhipu GLM',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-flash',
    fastModel: 'glm-4-flash',
    apiKeyEnv: 'ZHIPU_API_KEY',
    maxDailyRequests: 1000,
    avgLatencyMs: 1500,
    supportsJSON: true,
    priority: 3, // Free forever!
  },
  {
    id: 'yi',
    name: 'Yi (01.ai)',
    baseUrl: 'https://api.lingyiwanwu.com/v1',
    model: 'yi-lightning',
    fastModel: 'yi-lightning',
    apiKeyEnv: 'YI_API_KEY',
    maxDailyRequests: 500,
    avgLatencyMs: 800,
    supportsJSON: false,
    priority: 4, // Ultra fast!
  },
  {
    id: 'qwen',
    name: 'Qwen (Alibaba)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-turbo',
    fastModel: 'qwen-turbo',
    apiKeyEnv: 'QWEN_API_KEY',
    maxDailyRequests: 500,
    avgLatencyMs: 1800,
    supportsJSON: true,
    priority: 5, // Best Hindi!
  },
  {
    id: 'kimi',
    name: 'Kimi (Moonshot)',
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-8k',
    fastModel: 'moonshot-v1-8k',
    apiKeyEnv: 'KIMI_API_KEY',
    maxDailyRequests: 300,
    avgLatencyMs: 2500,
    supportsJSON: true,
    priority: 6, // Long context specialist
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'minimax/minimax-m3.1-flash:free',
    fastModel: 'minimax/minimax-m3.1-flash:free',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    maxDailyRequests: 500,
    avgLatencyMs: 1500,
    supportsJSON: false,
    priority: 3, // Verified free backup
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

// ─── Get available providers sorted by priority ──────────────
function getAvailableProviders(preferFast = false): AIProvider[] {
  return AI_PROVIDERS
    .filter(p => {
      const key = process.env[p.apiKeyEnv];
      if (!key) return false; // Skip if no API key configured
      const usage = getUsage(p.id);
      return usage < p.maxDailyRequests * 0.9; // 90% limit — leave 10% buffer
    })
    .sort((a, b) => {
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
  const apiKey = process.env[provider.apiKeyEnv];
  if (!apiKey) throw new Error(`No API key for ${provider.name}`);

  const model = fast ? provider.fastModel : provider.model;

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: 0.7,
    max_tokens: maxTokens,
  };

  // Only add response_format for providers that support it
  if (jsonMode && provider.supportsJSON) {
    body.response_format = { type: 'json_object' };
  }

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  // OpenRouter needs extra headers
  if (provider.id === 'openrouter') {
    headers['HTTP-Referer'] = 'https://zayka-ai.vercel.app';
    headers['X-Title'] = 'Zayka AI';
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const res = await fetch(`${provider.baseUrl}/chat/completions`, {
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

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error(`${provider.name} returned empty content`);

    incrementUsage(provider.id);
    return content;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// ============================================
// MAIN EXPORT — Smart Multi-Provider Caller
// Automatically rotates through all providers
// ============================================

export async function callAI(
  prompt: string,
  options: {
    systemPrompt?: string;
    jsonMode?: boolean;
    fast?: boolean;          // true = use fast models (chat)
    maxTokens?: number;
    preferProvider?: string; // Force a specific provider id
  } = {}
): Promise<string> {
  const {
    systemPrompt,
    jsonMode = true,
    fast = false,
    maxTokens = 4096,
    preferProvider,
  } = options;

  // Build messages
  const messages: { role: string; content: string }[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });

  // Add JSON instruction in prompt if jsonMode (for providers without native JSON mode)
  const finalPrompt = jsonMode
    ? prompt + '\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no code blocks. Just raw JSON.'
    : prompt;
  messages.push({ role: 'user', content: finalPrompt });

  // Get sorted available providers
  let providers = getAvailableProviders(fast);

  // If a specific provider is preferred, put it first
  if (preferProvider) {
    providers = [
      ...providers.filter(p => p.id === preferProvider),
      ...providers.filter(p => p.id !== preferProvider),
    ];
  }

  if (providers.length === 0) {
    throw new Error('All AI providers exhausted for today. Please try again tomorrow or add more API keys.');
  }

  // Try each provider in order
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
      // Continue to next provider
    }
  }

  // All providers failed
  throw new Error(`All AI providers failed:\n${errors.join('\n')}`);
}

// ─── Usage stats (for monitoring) ────────────────────────────
export function getProviderStats(): Record<string, { usage: number; limit: number; available: boolean; hasKey: boolean }> {
  const stats: Record<string, { usage: number; limit: number; available: boolean; hasKey: boolean }> = {};
  for (const p of AI_PROVIDERS) {
    const hasKey = !!process.env[p.apiKeyEnv];
    const usage = getUsage(p.id);
    stats[p.id] = {
      usage,
      limit: p.maxDailyRequests,
      available: hasKey && usage < p.maxDailyRequests * 0.9,
      hasKey,
    };
  }
  return stats;
}
