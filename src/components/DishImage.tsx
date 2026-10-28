'use client';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { findVerifiedDishImage, getExactDishImage } from '@/lib/dishImages';

interface DishImageProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  onClick?: () => void;
}

const FOOD_GRADIENTS = [
  'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
  'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
  'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
  'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  'linear-gradient(135deg, #F59E0B 0%, #10B981 100%)',
  'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)',
];

const FOOD_EMOJI_MAP: [string, string][] = [
  ['chicken', '🍗'], ['butter chicken', '🍗'], ['mutton', '🍖'], ['fish', '🐟'],
  ['dal', '🫘'], ['paneer', '🧀'], ['biryani', '🍛'], ['rice', '🍚'],
  ['pulao', '🍚'], ['roti', '🫓'], ['naan', '🫓'], ['paratha', '🫓'],
  ['curry', '🍲'], ['sabzi', '🥬'], ['salad', '🥗'], ['soup', '🍜'],
  ['pizza', '🍕'], ['burger', '🍔'], ['pasta', '🍝'], ['noodles', '🍜'],
  ['sushi', '🍣'], ['taco', '🌮'], ['cake', '🎂'], ['sweet', '🍬'],
  ['chai', '☕'], ['tea', '☕'], ['coffee', '☕'], ['dosa', '🥞'],
  ['idli', '🍱'], ['samosa', '🥟'], ['halwa', '🍮'], ['gulab jamun', '🍡'],
  ['chole', '🥘'], ['rajma', '🫘'], ['maggi', '🍜'], ['sandwich', '🥪'],
];

const wikiResolvedCache = new Map<string, string>();

function getFallbackEmoji(name: string): string {
  const lower = (name || '').toLowerCase();
  for (const [key, emoji] of FOOD_EMOJI_MAP) {
    if (lower.includes(key)) return emoji;
  }
  return '🍽️';
}

function getGradient(name: string): string {
  let hash = 0;
  const str = name || 'dish';
  for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
  return FOOD_GRADIENTS[Math.abs(hash) % FOOD_GRADIENTS.length];
}

export default function DishImage({
  src,
  alt,
  width,
  height,
  fill = false,
  style,
  className,
  priority,
  loading,
  sizes,
  onClick,
}: DishImageProps) {
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [liveWikiSrc, setLiveWikiSrc] = useState<string | null>(null);

  // Resolve exact verified dish image by dish name (`alt`) or fallback to `src`
  const resolvedSrc = useMemo(() => {
    setImgError(false);
    setLoaded(false);
    if (liveWikiSrc) return liveWikiSrc;
    return getExactDishImage(alt, src);
  }, [alt, src, liveWikiSrc]);

  // For custom/unseen AI dishes not in EXACT_DISH_IMAGE_MAP, query Wikipedia pageimages API client-side
  useEffect(() => {
    setLiveWikiSrc(null);
    if (!alt || findVerifiedDishImage(alt)) return;
    if (src && (src.startsWith('data:') || src.startsWith('blob:'))) return;

    const queryKey = alt.trim().toLowerCase();
    const cached = wikiResolvedCache.get(queryKey);
    if (cached) {
      setLiveWikiSrc(cached);
      return;
    }

    let cancelled = false;
    const cleanQuery = alt.replace(/\([^)]*\)/g, '').trim();
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      cleanQuery
    )}&prop=pageimages&format=json&pithumbsize=800&redirects=1&origin=*`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const pages = data?.query?.pages;
        if (!pages) return;
        for (const p of Object.values(pages) as Array<{ thumbnail?: { source?: string } }>) {
          const thumb = p?.thumbnail?.source;
          if (thumb) {
            wikiResolvedCache.set(queryKey, thumb);
            setLiveWikiSrc(thumb);
            break;
          }
        }
      })
      .catch(() => {
        // Keep default fallback
      });

    return () => {
      cancelled = true;
    };
  }, [alt, src]);

  if (!resolvedSrc || imgError) {
    return (
      <div
        className={className}
        onClick={onClick}
        style={{
          ...style,
          background: getGradient(alt),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 6,
          position: fill ? 'absolute' : (style?.position || 'relative'),
          inset: fill ? 0 : undefined,
          width: fill ? '100%' : (width || style?.width || '100%'),
          height: fill ? '100%' : (height || style?.height || '100%'),
          overflow: 'hidden',
          userSelect: 'none',
        }}
        aria-label={alt}
      >
        <span style={{ fontSize: 44, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
          {getFallbackEmoji(alt)}
        </span>
        <span
          style={{
            color: 'white',
            fontWeight: 800,
            fontSize: 12,
            textAlign: 'center',
            padding: '0 8px',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            maxWidth: '90%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {alt}
        </span>
      </div>
    );
  }

  const bypassNextOptimizer =
    resolvedSrc.includes('wikimedia.org') ||
    resolvedSrc.includes('pollinations.ai') ||
    resolvedSrc.startsWith('data:') ||
    resolvedSrc.startsWith('blob:');

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        position: fill ? 'absolute' : (style?.position || 'relative'),
        inset: fill ? 0 : undefined,
        width: fill ? '100%' : (width || style?.width || '100%'),
        height: fill ? '100%' : (height || style?.height || '100%'),
        overflow: 'hidden',
        ...style,
      }}
    >
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #FFF0E6 0%, #FFEDD5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        >
          <span style={{ fontSize: 32, opacity: 0.6 }}>🍽️</span>
        </div>
      )}
      {fill ? (
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          sizes={sizes || '(max-width: 768px) 100vw, 400px'}
          style={{
            objectFit: style?.objectFit || 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          priority={priority}
          loading={loading}
          onError={() => setImgError(true)}
          onLoad={() => setLoaded(true)}
          unoptimized={bypassNextOptimizer}
        />
      ) : (
        <Image
          src={resolvedSrc}
          alt={alt}
          width={width || 400}
          height={height || 400}
          style={{
            width: '100%',
            height: '100%',
            objectFit: style?.objectFit || 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          priority={priority}
          loading={loading}
          onError={() => setImgError(true)}
          onLoad={() => setLoaded(true)}
          unoptimized={bypassNextOptimizer}
        />
      )}
    </div>
  );
}
