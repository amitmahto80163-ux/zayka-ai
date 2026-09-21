'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Heart, Share2, ChefHat, Play, Star } from 'lucide-react';
import { useZaykaStore } from '@/store';
import ChefChat from '@/components/chat/ChefChat';
import toast from 'react-hot-toast';

const W = { bg: '#FFF8F3', primary: '#F97316', card: '#FFFFFF', text: '#1C1009', muted: '#92745A', border: '#F0E6DC' };

const DUMMY_RECIPES: Record<string, any> = {
  '1': {
    name: 'Butter Chicken', nameHindi: 'बटर चिकन',
    description: 'Creamy, rich, authentic Punjabi style butter chicken.',
    cuisine: 'indian', prepTime: 30, cookTime: 45, servings: 4,
    isVeg: false, calories: 380, rating: 4.8,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
    ingredients: [
      { id: '1', name: 'Chicken', amount: 500, unit: 'g', cost: 120 },
      { id: '2', name: 'Yogurt', amount: 1, unit: 'cup', cost: 30 },
      { id: '3', name: 'Butter', amount: 50, unit: 'g', cost: 25 },
    ],
    steps: [
      { stepNumber: 1, title: 'Marination', description: 'Mix chicken with yogurt, ginger-garlic paste, and spices. Leave for 30 mins.', duration: 30 },
      { stepNumber: 2, title: 'Make Gravy', description: 'Heat butter, add tomato puree and cook until oil separates (10 mins).', duration: 10 },
      { stepNumber: 3, title: 'Combine & Serve', description: 'Add chicken, cream, and kasuri methi. Simmer for 10 mins.', duration: 10 },
    ],
    nutrition: { protein: 28, carbs: 12, fat: 22 },
  },
  'fallback': {
    name: 'Special Recipe', nameHindi: 'स्पेशल रेसिपी',
    description: 'A delicious Zayka AI special recipe generated just for you.',
    cuisine: 'indian', prepTime: 10, cookTime: 20, servings: 2,
    isVeg: true, calories: 250, rating: 4.5,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    ingredients: [
      { id: '1', name: 'Magic Masala', amount: 1, unit: 'pkt', cost: 10 },
      { id: '2', name: 'Fresh Veggies', amount: 2, unit: 'cup', cost: 40 },
    ],
    steps: [
      { stepNumber: 1, title: 'Prep', description: 'Chop everything nicely.', duration: 10 },
      { stepNumber: 2, title: 'Cook', description: 'Cook until delicious.', duration: 20 },
    ]
  }
};

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const { isFavourite, addFavourite, removeFavourite, setCurrentRecipe, savedRecipes } = useZaykaStore() as any;
  
  const [recipe, setRecipe] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'chef'>('ingredients');
  const isFav = isFavourite(id);

  useEffect(() => {
    if (!id) return;
    const generated = savedRecipes?.find((r: any) => r.id === id);
    if (generated) {
      setRecipe(generated);
    } else {
      setRecipe(DUMMY_RECIPES[id] || DUMMY_RECIPES['fallback']);
    }
  }, [id, savedRecipes]);

  if (!recipe) return <div style={{ background: W.bg, minHeight: '100vh' }}></div>;

  const toggleFav = () => {
    if (isFav) {
      removeFavourite(id);
      toast.success('Removed from cookbook');
    } else {
      addFavourite(id);
      toast.success('Saved to cookbook!');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: `Zayka AI par ${recipe.name} ki recipe dekho!`,
        url: window.location.href,
      }).catch(() => toast.error('Sharing failed'));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const startCooking = () => {
    setCurrentRecipe(recipe);
    router.push('/cook');
  };

  return (
    <div style={{ minHeight: '100vh', background: W.bg, paddingBottom: 100 }}>
      {/* Top Image & Floating Header */}
      <div style={{ position: 'relative', width: '100%', height: 320 }}>
        <img src={recipe.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800'} alt={recipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        
        {/* Gradient Overlay for Text */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.8) 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 20px'
        }}>
          {/* Top Floating Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => router.back()} style={{
              width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: 'white', cursor: 'pointer'
            }}>
              <ArrowLeft size={24} />
            </motion.button>
            <div style={{ display: 'flex', gap: 12 }}>
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleShare} style={{
                width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: 'white', cursor: 'pointer'
              }}>
                <Share2 size={22} />
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={toggleFav} style={{
                width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: isFav ? '#EF4444' : 'white', cursor: 'pointer'
              }}>
                <Heart size={22} fill={isFav ? '#EF4444' : 'transparent'} />
              </motion.button>
            </div>
          </div>

          {/* Title & Tags over Image */}
          <div style={{ paddingBottom: 10 }}>
            <h1 style={{ color: 'white', fontSize: 32, fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>
              {recipe.name}
            </h1>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', color: 'white', padding: '4px 10px', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>
                <Star size={14} fill="#FCD34D" color="#FCD34D" /> {recipe.rating || '4.8'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', color: 'white', padding: '4px 10px', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>
                <Clock size={14} /> {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
              </span>
              <span style={{ background: recipe.isVeg ? '#22C55E' : '#EF4444', color: 'white', padding: '4px 10px', borderRadius: 100, fontSize: 13, fontWeight: 800 }}>
                {recipe.isVeg ? 'VEG' : 'NON-VEG'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div style={{ padding: '24px 20px' }}>
        {recipe.description && (
          <p style={{ color: W.muted, fontSize: 15, lineHeight: 1.5, fontWeight: 500, marginBottom: 24 }}>
            {recipe.description}
          </p>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, background: W.border, padding: 4, borderRadius: 100, marginBottom: 24 }}>
          {['ingredients', 'steps', 'chef'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} style={{
              flex: 1, padding: '12px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: activeTab === tab ? W.card : 'transparent',
              color: activeTab === tab ? W.primary : W.muted,
              fontWeight: activeTab === tab ? 800 : 600, fontSize: 14,
              textTransform: 'capitalize', transition: 'all 0.2s',
              boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
            }}>
              {tab === 'chef' ? '👨‍🍳 Ask Chef' : tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            
            {activeTab === 'ingredients' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recipe.ingredients?.map((ing: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: W.card, padding: '16px', borderRadius: 16, border: `1px solid ${W.border}` }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: W.text }}>{ing.name}</span>
                      <span style={{ fontSize: 13, color: W.muted, fontWeight: 600, marginTop: 4 }}>{ing.amount} {ing.unit}</span>
                    </div>
                    {ing.cost && (
                      <span style={{ fontSize: 15, fontWeight: 800, color: W.primary }}>₹{ing.cost}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'steps' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {recipe.steps?.map((step: any, index: number) => (
                  <div key={index} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: W.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                        {step.stepNumber || (index + 1)}
                      </div>
                      {index !== (recipe.steps.length - 1) && (
                        <div style={{ width: 2, flex: 1, background: W.border, marginTop: 8 }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: index === (recipe.steps.length - 1) ? 0 : 20 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: W.text, marginBottom: 6 }}>{step.title || `Step ${index + 1}`}</h3>
                      <p style={{ fontSize: 15, color: W.muted, lineHeight: 1.5, fontWeight: 500 }}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'chef' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <ChefChat recipeData={recipe} context="recipe_detail" />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Bottom CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 24px 32px 24px',
        background: 'linear-gradient(to top, rgba(255,248,243,1) 50%, rgba(255,248,243,0) 100%)',
        zIndex: 40, display: 'flex', justifyContent: 'center', pointerEvents: 'none'
      }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={startCooking}
          style={{
            pointerEvents: 'auto',
            width: '100%', maxWidth: 400, background: 'linear-gradient(135deg, #F97316, #EA580C)',
            color: 'white', border: 'none', padding: '18px', borderRadius: 100, cursor: 'pointer',
            fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 8px 24px rgba(249,115,22,0.3)'
          }}
        >
          Start Cooking <Play size={20} fill="white" />
        </motion.button>
      </div>
    </div>
  );
}
