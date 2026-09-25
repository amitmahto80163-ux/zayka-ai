'use client';
import { useEffect } from 'react';
import { W } from '@/lib/theme';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: W.bg, color: W.text, padding: 24, textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 24, color: W.primary, marginBottom: 16 }}>Oops! Something went wrong</h2>
      <button onClick={() => reset()} style={{ background: W.primary, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 24, cursor: 'pointer' }}>Try Again</button>
    </div>
  );
}
