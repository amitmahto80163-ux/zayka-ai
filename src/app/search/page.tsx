'use client';

import { Suspense } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, Search, Loader2, X, ChefHat, Sparkles, Clock, Users, Flame } from 'lucide-react';
import { useZaykaStore } from '@/store';
import { CHEF_PROFILES } from '@/data/chefs';
import toast from 'react-hot-toast';

const POPULAR_DISHES = [
  'Butter Chicken', 'Dal Makhani', 'Biryani', 'Paneer Tikka',
  'Chole Bhature', 'Pasta', 'Pizza', 'Hakka Noodles',
  'Rajma Chawal', 'Aloo Paratha', 'Masala Dosa', 'Idli Sambar',
];

const QUICK_CATEGORIES = [
  { emoji: '🇮🇳', label: 'Indian' },
  { emoji: '🍝', label: 'Italian' },
  { emoji: '🍜', label: 'Chinese' },
  { emoji: '🌮', label: 'Mexican' },
  { emoji: '🥗', label: 'Healthy' },
  { emoji: '⚡', label: 'Quick' },
];

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#FFF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: 32, height: 32, color: '#F97316' }} className="animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedChef, language } = useZaykaStore();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [servings, setServings] = useState(2);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceStep, setVoiceStep] = useState<'dish' | 'ingredients' | null>(null);
  const [dishName, setDishName] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);
  const [adaptedResult, setAdaptedResult] = useState<any>(null);
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);
  const chef = CHEF_PROFILES[selectedChef];

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) { setQuery(q); handleGenerateRecipe(q); }
  }, []);

  const startListening = (step: 'dish' | 'ingredients') => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice support nahi hai. Type karo!');
      return;
    }
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => { setIsListening(true); setVoiceStep(step); };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (step === 'dish') { setDishName(transcript); setQuery(transcript); setTimeout(() => startListening('ingredients'), 1500); }
      else { const ing = transcript.split(/,|aur|and/).map((s: string) => s.trim()).filter(Boolean); setAvailableIngredients(ing); handleAdaptRecipe(dishName, ing); }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => { setIsListening(false); toast.error('Voice error — dobara try karo!'); };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); setVoiceStep(null); };

  const handleAdaptRecipe = async (dish: string, ingredients: string[]) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/recipe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dishName: dish, ingredients, chefId: selectedChef, language, servings }) });
      const data = await res.json();
      if (data.success) setAdaptedResult(data.data);
    } catch { toast.error('Recipe nahi mili!'); }
    finally { setIsLoading(false); }
  };

  const handleGenerateRecipe = async (q: string) => {
    if (!q.trim()) return;
    setIsLoading(true);
    setGeneratedRecipe(null);
    try {
      const res = await fetch('/api/recipe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dishName: q, chefId: selectedChef, language, servings }) });
      const data = await res.json();
      if (data.success) setGeneratedRecipe(data.data);
      else toast.error('Recipe generate nahi hui, dobara try karo!');
    } catch { toast.error('Connection error!'); }
    finally { setIsLoading(false); }
  };

  const W = { bg: '#FFF8F3', card: '#FFFFFF', border: '#F0E6DC', saffron: '#F97316', muted: '#92745A', heading: '#1C1009' };

  return (
    <div style={{ minHeight: '100vh', background: W.bg, paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,248,243,0.92)', backdropFilter: 'blur(20px)', padding: '48px 16px 16px', borderBottom: `1px solid ${W.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: W.card, border: `1.5px solid ${W.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft style={{ width: 18, height: 18, color: W.heading }} />
          </button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: W.heading }}>Kya Banayein? 🍽️</h1>
            <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>AI se recipe generate karo</p>
          </div>
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 18, padding: '12px 14px', marginBottom: 10, boxShadow: '0 2px 10px rgba(249,115,22,0.07)' }}>
          <Search style={{ color: '#C4A882', width: 18, height: 18, flexShrink: 0 }} />
          <input
            type="text" value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerateRecipe(query)}
            placeholder="Recipe search karo... (Enter dabao)"
            style={{ flex: 1, background: 'transparent', outline: 'none', fontSize: 14, fontFamily: 'Nunito, sans-serif', fontWeight: 600, color: W.heading, border: 'none' }}
          />
          {query && <button onClick={() => { setQuery(''); setGeneratedRecipe(null); }}><X style={{ width: 16, height: 16, color: '#C4A882' }} /></button>}
          <button onClick={() => handleGenerateRecipe(query)} style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', borderRadius: 12, padding: '7px 14px', color: 'white', border: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
            Search
          </button>
        </div>

        {/* Servings */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 14, padding: '10px 14px' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: W.muted }}>👥 Kitne logon ke liye?</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setServings(Math.max(1, servings - 1))} style={{ width: 30, height: 30, borderRadius: '50%', background: '#FFF8F3', border: `1.5px solid ${W.border}`, fontSize: 18, fontWeight: 900, color: W.heading, cursor: 'pointer' }}>−</button>
            <span style={{ fontWeight: 900, fontSize: 16, color: W.saffron, minWidth: 16, textAlign: 'center' }}>{servings}</span>
            <button onClick={() => setServings(Math.min(20, servings + 1))} style={{ width: 30, height: 30, borderRadius: '50%', background: '#FFF8F3', border: `1.5px solid ${W.border}`, fontSize: 18, fontWeight: 900, color: W.heading, cursor: 'pointer' }}>+</button>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Voice Section */}
        <div style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, padding: 20, boxShadow: '0 4px 20px rgba(249,115,22,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #F97316, #FB923C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mic style={{ width: 16, height: 16, color: 'white' }} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: W.heading }}>🎤 Bol Ke Banao</h2>
          </div>
          <p style={{ fontSize: 12, color: W.muted, fontWeight: 600, marginBottom: 16, lineHeight: 1.5 }}>
            Bolo kya banana hai → AI poochega kya kya ghar mein hai → Jo hai usi se best recipe!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => isListening ? stopListening() : startListening('dish')} className="mic-button">
              {isListening ? <MicOff style={{ width: 28, height: 28 }} /> : <Mic style={{ width: 28, height: 28 }} />}
            </button>
          </div>
          {voiceStep === 'dish' && <p style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: W.saffron, fontWeight: 700 }}>🎤 Bolo: "Aaj mujhe ___ banana hai"</p>}
          {voiceStep === 'ingredients' && <p style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: '#10B981', fontWeight: 700 }}>🎤 Ab bolo: "Mere paas ___ hai, ___ hai..."</p>}
        </div>

        {/* Popular Dishes */}
        {!generatedRecipe && !isLoading && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: W.heading, marginBottom: 12 }}>Trending Dishes 🔥</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {POPULAR_DISHES.map(dish => (
                <button key={dish} onClick={() => { setQuery(dish); handleGenerateRecipe(dish); }}
                  style={{ padding: '8px 14px', borderRadius: 50, background: W.card, border: `1.5px solid ${W.border}`, fontSize: 13, fontWeight: 700, color: W.muted, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Nunito, sans-serif' }}>
                  {dish}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Categories */}
        {!generatedRecipe && !isLoading && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: W.heading, marginBottom: 12 }}>Cuisine by Country 🌍</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {QUICK_CATEGORIES.map(cat => (
                <button key={cat.label} onClick={() => { setQuery(cat.label + ' recipe'); handleGenerateRecipe(cat.label + ' recipe'); }}
                  style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 16, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                  <span style={{ fontSize: 28 }}>{cat.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: W.muted }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #FFEDD5, #FED7AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🤖</div>
            <div>
              <p style={{ fontWeight: 900, color: W.heading, textAlign: 'center', fontSize: 16 }}>AI Recipe Bana Raha Hai...</p>
              <p style={{ fontSize: 12, color: W.muted, textAlign: 'center', marginTop: 4 }}>Chef {chef?.name} is at work! 👨‍🍳</p>
            </div>
            <div style={{ width: '60%', height: 4, background: '#F0E6DC', borderRadius: 50, overflow: 'hidden' }}>
              <motion.div animate={{ x: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: '50%', height: '100%', background: 'linear-gradient(90deg, #F97316, #FBBF24)', borderRadius: 50 }} />
            </div>
          </motion.div>
        )}

        {/* Generated Recipe Result */}
        {generatedRecipe && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: W.card, border: `1.5px solid ${W.border}`, borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 32px rgba(249,115,22,0.1)' }}>
            {/* Recipe Header */}
            <div style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', padding: '20px 20px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <ChefHat style={{ width: 20, height: 20, color: 'white' }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Generated Recipe</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: 'white', marginBottom: 4 }}>{generatedRecipe.name}</h2>
              {generatedRecipe.nameHindi && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{generatedRecipe.nameHindi}</p>}
            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${W.border}` }}>
              {[
                { icon: <Clock style={{ width: 14, height: 14, color: W.saffron }} />, val: `${(generatedRecipe.prepTime || 0) + (generatedRecipe.cookTime || 0)}m`, label: 'Time' },
                { icon: <Users style={{ width: 14, height: 14, color: '#3B82F6' }} />, val: `${servings}`, label: 'Serves' },
                { icon: <Flame style={{ width: 14, height: 14, color: '#EF4444' }} />, val: `${generatedRecipe.calories || '~'}`, label: 'Kcal' },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, borderRight: i < 2 ? `1px solid ${W.border}` : 'none' }}>
                  {s.icon}
                  <span style={{ fontWeight: 900, fontSize: 14, color: W.heading }}>{s.val}</span>
                  <span style={{ fontSize: 10, color: W.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Ingredients */}
              {generatedRecipe.ingredients?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: W.heading, marginBottom: 10 }}>🥘 Ingredients</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {generatedRecipe.ingredients.map((ing: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFF8F3', borderRadius: 12, padding: '10px 14px', border: `1px solid ${W.border}` }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: W.heading }}>{ing.name}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: W.saffron }}>{ing.amount} {ing.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Steps */}
              {generatedRecipe.steps?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: W.heading, marginBottom: 10 }}>📋 Steps</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {generatedRecipe.steps.map((step: any, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: 12 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #FBBF24)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 900, fontSize: 12 }}>{i + 1}</div>
                        <div style={{ background: '#FFF8F3', borderRadius: 14, padding: '10px 14px', flex: 1, border: `1px solid ${W.border}` }}>
                          {step.title && <p style={{ fontWeight: 800, fontSize: 13, color: W.heading, marginBottom: 4 }}>{step.title}</p>}
                          <p style={{ fontSize: 13, color: '#3D2B1F', lineHeight: 1.5, fontWeight: 600 }}>{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cook Button */}
              <button onClick={() => { toast.success('Cooking mode shuru!'); router.push('/cook'); }}
                style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', color: 'white', border: 'none', borderRadius: 18, padding: '16px', fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 900, cursor: 'pointer', width: '100%', boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}>
                🍳 Start AR Cooking Mode
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
