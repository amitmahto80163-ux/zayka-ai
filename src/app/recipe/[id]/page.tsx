import { ALL_DISHES } from '@/data/dishes';
import RecipeClient from './_components/RecipeClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const dish = ALL_DISHES.find(d => d.id === params.id);
  if (!dish) return {};
  return {
    title: `${dish.name} Recipe - Zayka AI`,
    description: `Learn how to make ${dish.name} (${dish.nameHindi}). Complete recipe, ingredients, and step-by-step instructions.`,
  };
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  const dish = ALL_DISHES.find(d => d.id === params.id) || null;
  if (!dish) {
    notFound();
  }

  const jsonLd = {
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
      text: s.description
    })) || []
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecipeClient initialDish={dish} />
    </>
  );
}
