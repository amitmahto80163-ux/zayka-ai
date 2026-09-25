import { MetadataRoute } from 'next';
import { ALL_DISHES } from '@/data/dishes';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zayka.ai'; // Replace with actual domain

  const staticRoutes = [
    '',
    '/auth',
    '/budget',
    '/challenge',
    '/cook',
    '/diet',
    '/family',
    '/fridge',
    '/judge',
    '/onboarding',
    '/profile',
    '/search',
    '/swipe',
    '/world',
    '/x-labs',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const dynamicRoutes = ALL_DISHES.map((dish) => ({
    url: `${baseUrl}/recipe/${dish.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
