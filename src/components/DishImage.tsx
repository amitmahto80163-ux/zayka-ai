'use client';
import { useState } from 'react';
import Image from 'next/image';

interface DishImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  layoutId?: string;
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
  ['chicken', '🍗'], ['dal', '🫘'], ['paneer', '🧀'], ['biryani', '🍛'],
  ['rice', '🍚'], ['roti', '🫓'], ['naan', '🫓'], ['curry', '🍲'],
  ['sabzi', '🥬'], ['salad', '🥗'], ['soup', '🍜'], ['pizza', '🍕'],
  ['burger', '🍔'], ['pasta', '🍝'], ['noodles', '🍜'], ['sushi', '🍣'],
  ['taco', '🌮'], ['cake', '🎂'], ['sweet', '🍬'], ['chai', '☕'],
  ['dosa', '🥞'], ['idli', '🍱'], ['samosa', '🥟'], ['halwa', '🍮'],
];

function getFallbackEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of FOOD_EMOJI_MAP) {
    if (lower.includes(key)) return emoji;
  }
  return '🍽️';
}

function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return FOOD_GRADIENTS[hash % FOOD_GRADIENTS.length];
}

export default function DishImage({ src, alt, width = 400, height = 400, style, className, priority, loading }: DishImageProps) {
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (imgError) {
    return (
      <div
        className={className}
        style={{
          ...style,
          background: getGradient(alt),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 6,
        }}
        aria-label={alt}
      >
        <span style={{ fontSize: 48 }}>{getFallbackEmoji(alt)}</span>
        <span style={{ color: 'white', fontWeight: 800, fontSize: 12, textAlign: 'center', padding: '0 8px', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
          {alt}
        </span>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div
          className={className}
          style={{
            ...style,
            background: 'linear-gradient(135deg, #FFF0E6, #FFEDD5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            inset: 0,
          }}
        >
          <span style={{ fontSize: 36, opacity: 0.5 }}>🍽️</span>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ ...style, opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
        priority={priority}
        loading={loading}
        onError={() => setImgError(true)}
        onLoad={() => setLoaded(true)}
        unoptimized={src.startsWith('https://image.pollinations.ai')}
      />
    </>
  );
}
