'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Flame, Heart, Share2, ChefHat, Play, Camera, Star } from 'lucide-react';
import { useZaykaStore } from '@/store';
import ChefChat from '@/components/chat/ChefChat';
import toast from 'react-hot-toast';

const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { isFavourite, addFavourite, removeFavourite, setCurrentRecipe } = useZaykaStore();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'video' | 'chef'>('ingredients');
  const isFav = isFavourite(id);

  useEffect(() => {
    setTimeout(() => {
      setRecipe({
        id, name: 'Butter Chicken', nameHindi: 'बटर चिकन',
        description: 'Creamy, rich, authentic Punjabi style butter chicken.',
        cuisine: 'indian', prepTime: 30, cookTime: 45, servings: 4,
        isVeg: false, calories: 380, rating: 4.8,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
        ingredients: [
          { id: '1', name: 'Chicken', amount: 500, unit: 'g' },
          { id: '2', name: 'Yogurt', amount: 1, unit: 'cup' },
          { id: '3', name: 'Butter', amount: 50, unit: 'g' },
          { id: '4', name: 'Tomato Puree', amount: 1, unit: 'cup' },
          { id: '5', name: 'Fresh Cream', amount: 100, unit: 'ml' },
          { id: '6', name: 'Kasuri Methi', amount: 1, unit: 'tbsp' },
        ],
        steps: [
          { stepNumber: 1, title: 'Marination', description: 'Mix chicken with yogurt, ginger-garlic paste, and spices. Leave for 30 mins.' },
          { stepNumber: 2, title: 'Cook Chicken', description: 'Pan fry or grill chicken pieces until golden brown.' },
          { stepNumber: 3, title: 'Make Gravy', description: 'Heat butter, add tomato puree and cook until oil separates (10 mins).' },
          { stepNumber: 4, title: 'Combine & Serve', description: 'Add chicken, cream, and kasuri methi. Simmer for 10 mins. Serve hot!' },
        ],
        nutrition: { protein: 28, carbs: 12, fat: 22 },
      });
      setLoading(false);
    }, 800);
  }, [id]);

  const handleToggleFav = () => {
    if (isFav) { removeFavourite(id); toast('Removed from saved!', { icon: '💔' }); }
    else { addFavourite(id); toast.success('Saved! ❤️'); }
  };

  const startCooking = () => { setCurrentRecipe(recipe); router.push('/cook'); };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: W.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #FFEDD5, #FED7AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🍽️</div>
        <p style={{ fontWeight: 800, color: W.saffron, fontSize: 16 }}>Loading Deliciousness...</p>
        <div style={{ width: 120, height: 4, background: '#F0E6DC', borderRadius: 50, overflow: 'hidden' }}>
          <motion.div animate={{ x: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ width: '50%', height: '100%', background: 'linear-gradient(90deg, #F97316, #FBBF24)', borderRadius: 50 }} />
        </div>
      </div>
    );
  }

  const TABS = ['ingredients', 'steps', 'video', 'chef'] as const;

  return (
    <div style={{ minHeight: '100vh', background: W.bg, paddingBottom: 120 }}>

      {/* Hero Image */}
      <div style={{ position: 'relative', height: 300, overflow: 'hidden', background: '#1C1009' }}>
        {recipe.image && (
          <img src={recipe.image} alt={recipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
        )}
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,16,9,0.85) 0%, rgba(28,16,9,0.1) 60%)' }} />

        {/* Top Actions */}
        <div style={{ position: 'absolute', top: 48, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <button onClick={() => router.back()} style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft style={{ width: 20, height: 20, color: 'white' }} />
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Share2 style={{ width: 18, height: 18, color: 'white' }} />
            </button>
            <button onClick={handleToggleFav} style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Heart style={{ width: 18, height: 18, color: isFav ? '#FB7185' : 'white', fill: isFav ? '#FB7185' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Title */}
        <div style={{ position: 'absolute', bottom: 20, left: 16, right: 16, zIndex: 10 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 50, background: recipe.isVeg ? '#10B981' : '#EF4444', color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {recipe.isVeg ? 'Vegetarian' : 'Non-Veg'}
            </span>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 50, background: '#FBBF24', color: '#92400E', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star style={{ width: 10, height: 10, fill: '#92400E' }} /> {recipe.rating}
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{recipe.name}</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 600, marginTop: 4 }}>{recipe.nameHindi}</p>
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>

        {/* Stats */}
        <div style={{ display: 'flex', background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, overflow: 'hidden', marginBottom: 20, boxShadow: '0 4px 20px rgba(249,115,22,0.08)' }}>
          {[
            { icon: <Clock style={{ width: 18, height: 18, color: W.saffron }} />, val: `${recipe.prepTime + recipe.cookTime}m`, label: 'Total Time' },
            { icon: <Users style={{ width: 18, height: 18, color: '#3B82F6' }} />, val: `${recipe.servings}`, label: 'Serves' },
            { icon: <Flame style={{ width: 18, height: 18, color: '#EF4444' }} />, val: `${recipe.calories}`, label: 'Kcal' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, borderRight: i < 2 ? `1px solid ${W.border}` : 'none' }}>
              {s.icon}
              <span style={{ fontSize: 18, fontWeight: 900, color: W.heading }}>{s.val}</span>
              <span style={{ fontSize: 10, color: W.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#F0E6DC', borderRadius: 16, padding: 4, marginBottom: 20, gap: 4 }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: '9px 4px', borderRadius: 12, fontFamily: 'Nunito, sans-serif', fontSize: 11, fontWeight: 800, textTransform: 'capitalize', cursor: 'pointer', border: 'none', transition: 'all 0.2s', background: activeTab === tab ? 'white' : 'transparent', color: activeTab === tab ? W.heading : W.muted, boxShadow: activeTab === tab ? '0 2px 8px rgba(28,16,9,0.1)' : 'none' }}>
              {tab === 'chef' ? '👨‍🍳 Chef' : tab === 'video' ? '▶ Video' : tab === 'ingredients' ? '🥘 Ingr.' : '📋 Steps'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

          {activeTab === 'ingredients' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recipe.ingredients.map((ing: any, i: number) => (
                <div key={ing.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 16, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.saffron, fontWeight: 900, fontSize: 12 }}>{i + 1}</div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: W.heading }}>{ing.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 900, color: W.saffron }}>{ing.amount} <span style={{ fontSize: 11, color: W.muted, fontWeight: 600 }}>{ing.unit}</span></span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'steps' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recipe.steps.map((step: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #FBBF24)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 900, fontSize: 13, marginTop: 2 }}>{step.stepNumber}</div>
                  <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 20, padding: '14px 16px', flex: 1 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 900, color: W.heading, marginBottom: 6 }}>{step.title}</h4>
                    <p style={{ fontSize: 13, color: '#3D2B1F', lineHeight: 1.6, fontWeight: 600 }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'video' && (
            <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, overflow: 'hidden' }}>
              <div style={{ aspectRatio: '16/9', background: '#1C1009' }}>
                <iframe className="w-full h-full" src="https://www.youtube.com/embed/1_8lEitD6H0" title="Recipe Video" frameBorder="0" allowFullScreen />
              </div>
              <div style={{ padding: 16 }}>
                <p style={{ fontSize: 13, color: W.muted, fontWeight: 600, lineHeight: 1.6 }}>Pehle is video mein technique dekhein. Jab ready ho jayein, toh AR Cooking mode on karein! 🚀</p>
              </div>
            </div>
          )}

          {activeTab === 'chef' && (
            <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, overflow: 'hidden', height: 400 }}>
              <ChefChat context="recipe_detail" recipeData={recipe} />
            </div>
          )}

        </motion.div>
      </div>

      {/* Floating CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', background: 'rgba(255,248,243,0.96)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${W.border}`, zIndex: 50 }}>
        <button onClick={startCooking} style={{ width: '100%', background: 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 20, padding: '16px', fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(249,115,22,0.4)' }}>
          <Camera style={{ width: 20, height: 20 }} />
          Start AR Cooking Mode 🍳
        </button>
      </div>
    </div>
  );
}
