import { ALL_DISHES } from '@/data/dishes';
import RecipeClient from './_components/RecipeClient';
import { Metadata } from 'next';

type RouteProps = {
  params: Promise<{ id: string }> | { id: string };
};

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const rawId = resolvedParams?.id ? decodeURIComponent(resolvedParams.id) : '';
  const dish = ALL_DISHES.find(d => d.id === rawId);
  const displayName = dish?.name || (rawId ? rawId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Recipe');

  return {
    title: `${displayName} Recipe - Zayka AI`,
    description: dish
      ? `Learn how to make ${dish.name} (${dish.nameHindi || dish.name}). Complete recipe, ingredients, and step-by-step instructions.`
      : `Learn how to make ${displayName} with Zayka AI step-by-step instructions.`,
  };
}

export default async function RecipePage({ params }: RouteProps) {
  const resolvedParams = await Promise.resolve(params);
  const rawId = resolvedParams?.id ? decodeURIComponent(resolvedParams.id) : '';
  const dish = ALL_DISHES.find(d => d.id === rawId) || null;

  const jsonLd = dish
    ? {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: dish.name,
        image: dish.image,
        description: `Learn how to make ${dish.name}.`,
        recipeCuisine: dish.cuisine,
        prepTime: `PT${dish.time || 15}M`,
        cookTime: `PT${dish.time || 20}M`,
        recipeYield: '4 servings',
        nutrition: {
          '@type': 'NutritionInformation',
          calories: `${dish.calories || 300} calories`,
        },
        recipeIngredient: (dish as any).ingredients?.map((i: any) => `${i.amount} ${i.unit} ${i.name}`) || [],
        recipeInstructions: (dish as any).steps?.map((s: any, idx: number) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: s.title,
          text: s.description,
        })) || [],
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <RecipeClient initialDish={dish} recipeId={rawId} />
    </>
  );
}
