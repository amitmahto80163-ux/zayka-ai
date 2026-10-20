'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';

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

  // Normalize src
  const validSrc = useMemo(() => {
    if (!src || typeof src !== 'string' || src.trim() === '') return null;
    return src.trim();
  }, [src]);

  // If no source or error occurred, show rich gradient + emoji fallback
  if (!validSrc || imgError) {
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

  const isExternalOrData = validSrc.startsWith('http') || validSrc.startsWith('data:') || validSrc.startsWith('blob:');
  const isPollinations = validSrc.includes('pollinations.ai');

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
          src={validSrc}
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
          unoptimized={isPollinations || validSrc.startsWith('data:') || validSrc.startsWith('blob:')}
        />
      ) : (
        <Image
          src={validSrc}
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
          unoptimized={isPollinations || validSrc.startsWith('data:') || validSrc.startsWith('blob:')}
        />
      )}
    </div>
  );
}
