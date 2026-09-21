'use client';
import { Home, Search, ChefHat, Globe, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useZaykaStore } from '@/store';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRecipe } = useZaykaStore();

  const handleCookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentRecipe) {
      router.push('/search');
    } else {
      router.push('/cook');
    }
  };

  if (pathname === '/auth' || pathname === '/onboarding') return null;

  return (
    <nav className="bottom-nav">
      <Link href="/">
        <div className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
          <Home /><span>Home</span>
        </div>
      </Link>
      <Link href="/search">
        <div className={`nav-item ${pathname === '/search' ? 'active' : ''}`}>
          <Search /><span>Search</span>
        </div>
      </Link>
      <a href="/cook" onClick={handleCookClick}>
        <div className={`nav-item ${pathname === '/cook' ? 'active' : ''}`}>
          <ChefHat /><span>Cook</span>
        </div>
      </a>
      <Link href="/world">
        <div className={`nav-item ${pathname === '/world' ? 'active' : ''}`}>
          <Globe /><span>World</span>
        </div>
      </Link>
      <Link href="/profile">
        <div className={`nav-item ${pathname === '/profile' ? 'active' : ''}`}>
          <User /><span>Profile</span>
        </div>
      </Link>
    </nav>
  );
}
