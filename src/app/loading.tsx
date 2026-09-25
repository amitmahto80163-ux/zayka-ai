import { W } from '@/lib/theme';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: W.bg, color: W.primary }}>
      <Loader2 size={48} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ marginTop: 16, fontFamily: 'var(--font-playfair)' }}>Zayka is cooking...</p>
    </div>
  );
}
