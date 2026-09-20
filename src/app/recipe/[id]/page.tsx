'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Users, Flame, Heart, Share2, ChefHat, Play, Camera, Star } from 'lucide-react';
import { useZaykaStore } from '@/store';
import ChefChat from '@/components/chat/ChefChat';
import toast from 'react-hot-toast';

const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

const DUMMY_RECIPES: Record<string, any> = {
  '1': {
    name: 'Butter Chicken', nameHindi: 'बटर चिकन',
    description: 'Creamy, rich, authentic Punjabi style butter chicken.',
    cuisine: 'indian', prepTime: 30, cookTime: 45, servings: 4,
    isVeg: false, calories: 380, rating: 4.8,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
    ingredients: [
      { id: '1', name: 'Chicken', amount: 500, unit: 'g' },
      { id: '2', name: 'Yogurt', amount: 1, unit: 'cup' },
      { id: '3', name: 'Butter', amount: 50, unit: 'g' },
    ],
    steps: [
      { stepNumber: 1, title: 'Marination', description: 'Mix chicken with yogurt, ginger-garlic paste, and spices. Leave for 30 mins.', duration: 30 },
      { stepNumber: 2, title: 'Make Gravy', description: 'Heat butter, add tomato puree and cook until oil separates (10 mins).', duration: 10 },
      { stepNumber: 3, title: 'Combine & Serve', description: 'Add chicken, cream, and kasuri methi. Simmer for 10 mins.', duration: 10 },
    ],
    nutrition: { protein: 28, carbs: 12, fat: 22 },
  },
  '2': {
    name: 'Dal Makhani', nameHindi: 'दाल मखनी',
    description: 'Slow-cooked black lentils in creamy butter and tomato gravy.',
    cuisine: 'indian', prepTime: 15, cookTime: 60, servings: 4,
    isVeg: true, calories: 290, rating: 4.9,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    ingredients: [
      { id: '1', name: 'Black Lentils (Urad)', amount: 1, unit: 'cup' },
      { id: '2', name: 'Butter', amount: 4, unit: 'tbsp' },
      { id: '3', name: 'Fresh Cream', amount: 0.5, unit: 'cup' },
    ],
    steps: [
      { stepNumber: 1, title: 'Boil Lentils', description: 'Pressure cook soaked lentils with salt until soft.', duration: 30 },
      { stepNumber: 2, title: 'Prepare Masala', description: 'Fry onions and tomatoes with butter until mushy.', duration: 15 },
      { stepNumber: 3, title: 'Simmer', description: 'Mix lentils, simmer on low heat for 30 mins, add cream.', duration: 30 },
    ],
    nutrition: { protein: 12, carbs: 40, fat: 14 },
  },
  '3': {
    name: 'Paneer Tikka', nameHindi: 'पनीर टिक्का',
    description: 'Grilled chunks of paneer marinated in spiced yogurt.',
    cuisine: 'indian', prepTime: 20, cookTime: 15, servings: 2,
    isVeg: true, calories: 250, rating: 4.7,
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=800',
    ingredients: [
      { id: '1', name: 'Paneer', amount: 250, unit: 'g' },
      { id: '2', name: 'Capsicum & Onion', amount: 1, unit: 'cup' },
      { id: '3', name: 'Tikka Masala', amount: 2, unit: 'tbsp' },
    ],
    steps: [
      { stepNumber: 1, title: 'Marinate', description: 'Coat paneer and veggies in yogurt masala.', duration: 15 },
      { stepNumber: 2, title: 'Skewer', description: 'Thread alternating paneer and veggies on sticks.', duration: 5 },
      { stepNumber: 3, title: 'Grill', description: 'Grill or pan-fry until charred.', duration: 15 },
    ],
    nutrition: { protein: 14, carbs: 8, fat: 18 },
  },
  '4': {
    name: 'Pasta Arrabbiata', nameHindi: 'पास्ता अरेबियाटा',
    description: 'Spicy tomato sauce pasta with Italian herbs.',
    cuisine: 'italian', prepTime: 10, cookTime: 20, servings: 2,
    isVeg: true, calories: 320, rating: 4.6,
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=800',
    ingredients: [
      { id: '1', name: 'Penne Pasta', amount: 200, unit: 'g' },
      { id: '2', name: 'Tomato Sauce', amount: 1.5, unit: 'cup' },
      { id: '3', name: 'Chili Flakes', amount: 1, unit: 'tsp' },
    ],
    steps: [
      { stepNumber: 1, title: 'Boil Pasta', description: 'Boil pasta in salted water until al dente.', duration: 10 },
      { stepNumber: 2, title: 'Make Sauce', description: 'Heat sauce with chili flakes and garlic.', duration: 5 },
      { stepNumber: 3, title: 'Combine', description: 'Toss pasta in sauce and serve hot.', duration: 5 },
    ],
    nutrition: { protein: 10, carbs: 60, fat: 8 },
  },
  '5': {
    name: 'Hakka Noodles', nameHindi: 'हक्का नूडल्स',
    description: 'Indo-Chinese style stir-fried noodles with crisp veggies.',
    cuisine: 'chinese', prepTime: 15, cookTime: 10, servings: 3,
    isVeg: true, calories: 350, rating: 4.8,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800',
    ingredients: [
      { id: '1', name: 'Noodles', amount: 200, unit: 'g' },
      { id: '2', name: 'Mixed Veggies', amount: 2, unit: 'cup' },
      { id: '3', name: 'Soy Sauce', amount: 2, unit: 'tbsp' },
    ],
    steps: [
      { stepNumber: 1, title: 'Boil Noodles', description: 'Boil noodles, drain and coat with oil.', duration: 5 },
      { stepNumber: 2, title: 'Stir Fry', description: 'Stir fry veggies on high heat.', duration: 3 },
      { stepNumber: 3, title: 'Toss', description: 'Add noodles and sauces, toss well.', duration: 2 },
    ],
    nutrition: { protein: 8, carbs: 65, fat: 12 },
  },
  '6': {
    name: 'Masala Chai', nameHindi: 'मसाला चाय',
    description: 'Classic Indian spiced milk tea.',
    cuisine: 'indian', prepTime: 2, cookTime: 8, servings: 2,
    isVeg: true, calories: 80, rating: 4.9,
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800',
    ingredients: [
      { id: '1', name: 'Milk', amount: 1, unit: 'cup' },
      { id: '2', name: 'Tea Leaves', amount: 2, unit: 'tsp' },
      { id: '3', name: 'Cardamom & Ginger', amount: 1, unit: 'tsp' },
    ],
    steps: [
      { stepNumber: 1, title: 'Boil Water', description: 'Boil water with ginger and cardamom.', duration: 3 },
      { stepNumber: 2, title: 'Add Tea', description: 'Add tea leaves and simmer.', duration: 2 },
      { stepNumber: 3, title: 'Add Milk', description: 'Add milk, bring to a boil, strain and serve.', duration: 3 },
    ],
    nutrition: { protein: 3, carbs: 10, fat: 3 },
  }
};

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const { isFavourite, addFavourite, removeFavourite, setCurrentRecipe, savedRecipes } = useZaykaStore() as any;
  
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'video' | 'chef'>('ingredients');
  const isFav = isFavourite(id);

  useEffect(() => {
    if (!id) return; // Wait for router to be ready
    
    // Check if it's a dynamically generated recipe
    const generated = savedRecipes?.find((r: any) => r.id === id);
    
    if (generated) {
      setRecipe(generated);
      setLoading(false);
      return;
    }

    // Load from dummy catalog
    const timer = setTimeout(() => {
      const data = DUMMY_RECIPES[id] || {
        ...DUMMY_RECIPES['1'],
        name: 'Custom Recipe',
        description: 'A delicious custom generated recipe.'
      };
      setRecipe({ id, ...data });
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id, savedRecipes]);

  const toggleFav = () => {
    if (isFav) {
      removeFavourite(id);
      toast.success('Removed from cookbook');
    } else {
      addFavourite({ id, name: recipe.name, image: recipe.image, time: recipe.prepTime + recipe.cookTime, calories: recipe.calories, isVeg: recipe.isVeg });
      toast.success('Saved to cookbook!');
    }
  };

  const startCooking = () => {
    setCurrentRecipe(recipe);
    router.push('/cook');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: W.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{ width: 48, height: 48, border: `4px solid ${W.saffron}`, borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!recipe) return <div style={{ padding: 40, textAlign: 'center' }}>Recipe not found</div>;

  return (
    <div style={{ minHeight: '100vh', background: W.bg, paddingBottom: 100 }}>
      {/* Hero Image */}
      <div style={{ position: 'relative', height: '45vh', width: '100%', background: '#FFF0E6' }}>
        <img src={recipe.image} alt={recipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #1C1009 0%, transparent 60%)' }} />
        
        {/* Header Actions */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '20px 16px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
          <button onClick={() => router.back()} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <ArrowLeft style={{ width: 22, height: 22 }} />
          </button>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Share2 style={{ width: 20, height: 20 }} />
            </button>
            <button onClick={toggleFav} style={{ width: 44, height: 44, borderRadius: '50%', background: isFav ? 'white' : 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isFav ? '#EF4444' : 'white', transition: 'all 0.2s' }}>
              <Heart style={{ width: 22, height: 22 }} fill={isFav ? '#EF4444' : 'none'} />
            </button>
          </div>
        </div>

        {/* Floating Title Card */}
        <div style={{ position: 'absolute', bottom: -32, left: 16, right: 16, background: W.card, borderRadius: 24, padding: 20, boxShadow: '0 12px 40px rgba(28,16,9,0.08)', border: `1px solid ${W.border}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: W.saffron, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#FFF0E6', padding: '4px 10px', borderRadius: 12 }}>
                  {recipe.cuisine}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star style={{ width: 12, height: 12, color: '#FBBF24' }} fill="#FBBF24" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: W.muted }}>{recipe.rating}</span>
                </div>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: W.heading, lineHeight: 1.1 }}>{recipe.name}</h1>
              <p style={{ fontSize: 14, color: W.muted, marginTop: 4, fontWeight: 600 }}>{recipe.nameHindi}</p>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${recipe.isVeg ? '#10B981' : '#EF4444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: recipe.isVeg ? '#10B981' : '#EF4444' }} />
            </div>
          </div>

          <p style={{ fontSize: 13, color: '#3D2B1F', lineHeight: 1.5, marginBottom: 16 }}>{recipe.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, background: '#FAFAFA', padding: 12, borderRadius: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <Clock style={{ width: 18, height: 18, color: W.saffron, margin: '0 auto 4px' }} />
              <p style={{ fontSize: 10, color: W.muted, fontWeight: 600 }}>Prep</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: W.heading }}>{recipe.prepTime}m</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Flame style={{ width: 18, height: 18, color: '#EF4444', margin: '0 auto 4px' }} />
              <p style={{ fontSize: 10, color: W.muted, fontWeight: 600 }}>Cook</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: W.heading }}>{recipe.cookTime}m</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Users style={{ width: 18, height: 18, color: '#3B82F6', margin: '0 auto 4px' }} />
              <p style={{ fontSize: 10, color: W.muted, fontWeight: 600 }}>Serve</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: W.heading }}>{recipe.servings}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Flame style={{ width: 18, height: 18, color: '#F59E0B', margin: '0 auto 4px' }} />
              <p style={{ fontSize: 10, color: W.muted, fontWeight: 600 }}>Kcal</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: W.heading }}>{recipe.calories}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 50, padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: 8, background: '#F0E6DC', padding: 4, borderRadius: 16, overflowX: 'auto', marginBottom: 24 }} className="no-scrollbar">
          {['ingredients', 'steps', 'chef'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} style={{ flex: 1, padding: '10px 16px', borderRadius: 12, border: 'none', background: activeTab === tab ? W.card : 'transparent', color: activeTab === tab ? W.heading : W.muted, fontWeight: activeTab === tab ? 800 : 600, fontSize: 13, textTransform: 'capitalize', transition: 'all 0.2s', boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', whiteSpace: 'nowrap' }}>
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {activeTab === 'ingredients' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recipe.ingredients.map((ing: any) => (
                  <div key={ing.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: W.card, padding: '14px 16px', borderRadius: 16, border: `1px solid ${W.border}` }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: W.heading }}>{ing.name}</span>
                    <span style={{ fontSize: 14, color: W.muted, fontWeight: 600 }}>{ing.amount} {ing.unit}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'steps' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {recipe.steps.map((step: any, index: number) => (
                  <div key={step.stepNumber} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFF0E6', color: W.saffron, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                        {step.stepNumber}
                      </div>
                      {index !== recipe.steps.length - 1 && (
                        <div style={{ width: 2, flex: 1, background: '#F0E6DC', marginTop: 8 }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: index === recipe.steps.length - 1 ? 0 : 24 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: W.heading, marginBottom: 6 }}>{step.title}</h3>
                      <p style={{ fontSize: 14, color: '#3D2B1F', lineHeight: 1.6, fontWeight: 500 }}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ position: 'fixed', bottom: 20, left: 16, right: 16, zIndex: 40 }}>
        <button onClick={startCooking} style={{ width: '100%', background: 'linear-gradient(135deg, #F97316, #FB923C)', padding: 18, borderRadius: 24, border: 'none', color: 'white', fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 12px 30px rgba(249,115,22,0.3)', cursor: 'pointer' }}>
          <ChefHat style={{ width: 20, height: 20 }} /> Start Cooking AR
        </button>
      </div>
    </div>
  );
}
