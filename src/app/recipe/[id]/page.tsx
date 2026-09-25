import { ALL_DISHES } from '@/data/dishes';
import RecipeClient from './_components/RecipeClient';
import { notFound } from 'next/navigation';

export default async function RecipePage({ params }: { params: { id: string } }) {
  const dish = ALL_DISHES.find(d => d.id === params.id) || null;
  if (!dish) {
    notFound();
  }
  return <RecipeClient initialDish={dish} />;
}
