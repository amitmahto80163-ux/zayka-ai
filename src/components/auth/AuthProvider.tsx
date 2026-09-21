'use client';

import { useEffect, useState } from 'react';
import { useZaykaStore } from '@/store';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, user } = useZaykaStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rely on Zustand persist state or future Firebase integration
    // Removed the forced overwrite that was breaking authentication
    const timer = setTimeout(() => setLoading(false), 500); // Small delay to let hydration finish
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: 32, height: 32, color: '#F97316' }} className="animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
