'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Lock, Globe, BookOpen, Trash2 } from 'lucide-react';
import { useZaykaStore } from '@/store';
import toast from 'react-hot-toast';
import { W } from '@/lib/theme';



export default function FamilyVaultPage() {
  const router = useRouter();
  const { familyRecipes, addFamilyRecipe, deleteFamilyRecipe } = useZaykaStore();
  const [showAdd, setShowAdd] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  const handleSave = () => {
    if (!title || !ingredients || !steps) {
      toast.error('Bhai, title, ingredients aur steps zaroori hain!');
      return;
    }
    
    addFamilyRecipe({
      id: Date.now().toString(),
      title,
      description: '',
      origin: origin || 'Mera Ghar',
      ingredients: ingredients.split('\n').filter(i => i.trim()),
      steps: steps.split('\n').filter(s => s.trim()),
      isPrivate,
      createdAt: new Date().toISOString(),
    });
    
    toast.success('Recipe saved in vault! 🔐');
    setShowAdd(false);
    
    // Reset
    setTitle(''); setOrigin(''); setIngredients(''); setSteps(''); setIsPrivate(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: W.bg, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,248,243,0.92)', backdropFilter: 'blur(20px)', padding: '48px 16px 16px', borderBottom: `1px solid ${W.border}`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft style={{ width: 18, height: 18, color: W.text }} />
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: W.text }}>Family Vault</h1>
            <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>Recipes from loved ones 🏠</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button onClick={() => setShowAdd(true)}
          style={{ width: '100%', background: 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 20, padding: '16px', fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 4px 16px rgba(249,115,22,0.3)' }}>
          <Plus style={{ width: 20, height: 20 }} /> Add a Recipe
        </button>

        {familyRecipes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <BookOpen style={{ width: 48, height: 48, color: '#FCD34D', marginBottom: 16 }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: W.text, marginBottom: 8 }}>Vault is Empty!</h3>
            <p style={{ fontSize: 14, color: W.muted, lineHeight: 1.5 }}>Apni Maa ya Nani ki special secret recipe yahan save karke hamesha ke liye preserve karo.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {familyRecipes.map(recipe => (
              <div key={recipe.id} style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 20, position: 'relative' }}>
                <button onClick={() => deleteFamilyRecipe(recipe.id)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <Trash2 style={{ width: 18, height: 18, color: '#EF4444' }} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>📖</span>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: W.text }}>{recipe.title}</h3>
                </div>
                <p style={{ fontSize: 13, color: W.primary, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
                  "{recipe.origin}"
                </p>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 12, background: W.bg, padding: '4px 10px', borderRadius: 100, color: W.muted, fontWeight: 800 }}>
                    {recipe.ingredients.length} ingredients
                  </span>
                  <span style={{ fontSize: 12, background: W.bg, padding: '4px 10px', borderRadius: 100, color: W.muted, fontWeight: 800 }}>
                    {recipe.steps.length} steps
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${W.border}`, paddingTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {recipe.isPrivate ? <Lock style={{ width: 14, height: 14, color: W.muted }} /> : <Globe style={{ width: 14, height: 14, color: '#10B981' }} />}
                    <span style={{ fontSize: 12, fontWeight: 700, color: recipe.isPrivate ? W.muted : '#10B981' }}>
                      {recipe.isPrivate ? 'Private' : 'Shared'}
                    </span>
                  </div>
                  <button onClick={() => {
                    useZaykaStore.getState().setCurrentRecipe({
                      id: recipe.id,
                      name: recipe.title,
                      description: recipe.description || `From ${recipe.origin}`,
                      cuisine: 'family',
                      prepTime: 10, cookTime: 20, servings: 2, isVeg: true, calories: 300, rating: 5,
                      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
                      ingredients: recipe.ingredients.map((i, idx) => ({ id: `i-${idx}`, name: i, amount: 1, unit: 'as needed', category: 'other' })),
                      steps: recipe.steps.map((s, idx) => ({ stepNumber: idx + 1, title: `Step ${idx + 1}`, description: s, duration: 5 })),
                      category: 'dinner', difficulty: 'easy',
                      nutrition: { calories: 300, protein: 10, carbs: 40, fat: 10 },
                      tags: ['family'], createdAt: recipe.createdAt
                    } as any);
                    router.push('/cook');
                  }} style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 900, cursor: 'pointer' }}>
                    Cook This
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Recipe Bottom Sheet */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            
            <div style={{ flex: 1 }} onClick={() => setShowAdd(false)} />
            
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
              style={{ background: W.bg, borderRadius: '24px 24px 0 0', padding: '24px', maxHeight: '85vh', overflowY: 'auto' }}>
              
              <h2 style={{ fontSize: 20, fontWeight: 900, color: W.text, marginBottom: 20 }}>New Family Recipe 🍲</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: W.muted, marginBottom: 6, display: 'block' }}>Recipe Name</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Nani ki Dal Baati"
                    style={{ width: '100%', background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 16, padding: '14px', fontSize: 16, fontWeight: 700, color: W.text, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: W.muted, marginBottom: 6, display: 'block' }}>Origin / Story</label>
                  <input type="text" value={origin} onChange={e => setOrigin(e.target.value)} placeholder="e.g. Rajasthan, 1985"
                    style={{ width: '100%', background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 16, padding: '14px', fontSize: 16, fontWeight: 600, color: W.text, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: W.muted, marginBottom: 6, display: 'block' }}>Ingredients (1 per line)</label>
                  <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} placeholder="1 cup chana dal&#10;2 tbsp ghee" rows={4}
                    style={{ width: '100%', background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 16, padding: '14px', fontSize: 15, fontWeight: 600, color: W.text, outline: 'none', resize: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: W.muted, marginBottom: 6, display: 'block' }}>Steps (1 per line)</label>
                  <textarea value={steps} onChange={e => setSteps(e.target.value)} placeholder="Soak dal for 2 hours&#10;Cook in cooker for 4 whistles" rows={4}
                    style={{ width: '100%', background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 16, padding: '14px', fontSize: 15, fontWeight: 600, color: W.text, outline: 'none', resize: 'none' }} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: W.card, padding: 16, borderRadius: 16, border: `1.5px solid ${W.border}` }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: W.text }}>Private Recipe</p>
                    <p style={{ fontSize: 11, color: W.muted, fontWeight: 600 }}>Only you can see this</p>
                  </div>
                  <div onClick={() => setIsPrivate(!isPrivate)} style={{ width: 44, height: 24, background: isPrivate ? W.primary : '#E5E7EB', borderRadius: 20, position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
                    <div style={{ width: 20, height: 20, background: 'white', borderRadius: '50%', position: 'absolute', top: 2, left: isPrivate ? 22 : 2, transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                  </div>
                </div>

                <button onClick={handleSave}
                  style={{ width: '100%', background: W.primary, color: 'white', border: 'none', borderRadius: 20, padding: '16px', fontSize: 16, fontWeight: 900, cursor: 'pointer', marginTop: 8 }}>
                  Save Recipe 🔒
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
