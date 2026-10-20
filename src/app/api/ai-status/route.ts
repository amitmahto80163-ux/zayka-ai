import { NextResponse } from 'next/server';
import { getProviderStats } from '@/lib/ai';

// GET /api/ai-status — Shows which providers are available
// Only accessible in development or with admin key
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  // Simple admin protection
  if (process.env.NODE_ENV === 'production' && key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = getProviderStats();
  const available = Object.entries(stats).filter(([, v]) => v.available).length;
  const total = Object.keys(stats).length;

  return NextResponse.json({
    status: available > 0 ? 'healthy' : 'degraded',
    availableProviders: available,
    totalProviders: total,
    providers: stats,
    message: available > 0
      ? `${available}/${total} AI providers active — ~${available * 200} more requests available today`
      : 'All providers exhausted — try again tomorrow',
    timestamp: new Date().toISOString(),
  });
}
