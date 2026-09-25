'use client';
import { W } from '@/lib/theme';
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#FFF8F3', color: '#1C1009', padding: 24, textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, color: '#F97316', marginBottom: 16 }}>Critical Error</h2>
          <button onClick={() => reset()} style={{ background: '#F97316', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 24, cursor: 'pointer' }}>Restart App</button>
        </div>
      </body>
    </html>
  );
}
