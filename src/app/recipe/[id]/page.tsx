'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Heart, Star, Clock, Play, Globe, MapPin, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useZaykaStore } from '@/store';
import toast from 'react-hot-toast';
import ChefChat from '@/components/chat/ChefChat';
import { DISH_INGREDIENTS } from '@/data/ingredients';
import { generateIngredientsAction } from '@/lib/actions';
import { ALL_DISHES } from '@/data/dishes';
import { W } from '@/lib/theme';



function getCategoryEmoji(cat?: string) {
  const map: Record<string, string> = { protein: '🍗', spice: '🌶️', oil: '🫙', vegetable: '🥦', dairy: '🥛', grain: '🌾', other: '🧂' };
  return map[cat || 'other'] || '🧂';
}
function getCategoryLabel(cat?: string) {
  const map: Record<string, string> = { protein: 'Main Protein', spice: 'Masale & Spices', oil: 'Oil & Fats', vegetable: 'Vegetables', dairy: 'Dairy', grain: 'Grains & Flour', other: 'Others' };
  return map[cat || 'other'] || 'Others';
}
function groupByCategory(ingredients: any[]) {
  const order = ['protein', 'grain', 'vegetable', 'dairy', 'oil', 'spice', 'other'];
  const groups: Record<string, any[]> = {};
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];
  for (const ing of safeIngredients) {
    if (!ing) continue;
    const cat = ing.category || 'other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(ing);
  }
  return order.filter(k => groups[k]?.length > 0).map(k => ({ category: k, items: groups[k] }));
}

const DUMMY_RECIPES: Record<string, any> = {
  'butter-chicken': {
    name: 'Butter Chicken', nameHindi: 'बटर चिकन',
    description: 'Creamy, rich, authentic Punjabi style butter chicken with a smoky tandoori aroma.',
    cuisine: 'indian', prepTime: 30, cookTime: 45, servings: 4, isVeg: false, calories: 380, rating: 4.8,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
    ingredients: DISH_INGREDIENTS['butter-chicken'] || [],
    steps: [
      { stepNumber: 1, title: 'Marination (30 min)', description: 'Chicken ko dahi, ginger-garlic paste, Kashmiri mirch, namak aur thoda oil mein ache se coat karo. Dhak ke 30 min ke liye rakh do — jitna zyada waqt utna better.', duration: 30, tips: ['Raat bhar bhi marain sakte ho fridge mein — flavour 10x ho jaata hai'] },
      { stepNumber: 2, title: 'Gravy Ka Base (10 min)', description: 'Kadai mein butter + oil medium flame pe garam karo. Jab foam aaye toh ginger-garlic paste daalo — 2 min bhunao. Phir tomato puree daalo, namak, Kashmiri mirch. Medium flame pe 10 min pakao JABB TAK oil sides pe alag nahi dikhe.', duration: 10, tips: ['Oil separate hona zaroori hai — tab hi gravy ka raw taste jaata hai'] },
      { stepNumber: 3, title: 'Chicken Cook Karo (15 min)', description: 'Marinated chicken directly gravy mein daalo. High flame pe 5 min pakao, phir medium pe 10 min dhakke ke saath. Chicken ke andar se white aur juicy banana tak.', duration: 15, tips: ['Beech mein ek baar hi hilaao — zyada hilane se chicken toot jaata hai'] },
      { stepNumber: 4, title: 'Finishing Touch (5 min)', description: 'Flame band karo. Fresh cream, garam masala, kasuri methi (haath mein malke) daalo. Ek baar ache se mix karo — ab gas mat jalao. Coriander se garnish karo.', duration: 5, tips: ['Gas band ke baad cream daalna MOST IMPORTANT hai — boiling se cream separate ho jaati hai'] },
    ],
    nutrition: { protein: 28, carbs: 12, fat: 22, calories: 380 },
  },
  'dal-makhani': {
    name: 'Dal Makhani', nameHindi: 'दाल मखनी',
    description: 'Slow-cooked black dal with rajma in a rich buttery tomato gravy. Restaurant wali taste ghar pe.',
    cuisine: 'indian', prepTime: 20, cookTime: 60, servings: 4, isVeg: true, calories: 290, rating: 4.9,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    ingredients: DISH_INGREDIENTS['dal-makhani'] || [],
    steps: [
      { stepNumber: 1, title: 'Dal Pressure Cook Karo', description: 'Bhigi hui urad dal aur rajma ko pressure cooker mein 4-5 cups pani ke saath daalo. 5-6 seeti aane do. Phir 20 min sim pe pakne do — woh jitni naram hogi, dish utni creamy hogi.', duration: 30, tips: ['Bahut naram karo — spoon se easily mashal ho jaaye'] },
      { stepNumber: 2, title: 'Masala Tadka (10 min)', description: 'Alag pan mein butter garam karo, pyaaz golden brown karo (8 min), ginger-garlic 2 min, phir tomato puree daalo. Oil separate hone tak pakao.', duration: 10 },
      { stepNumber: 3, title: 'Mix & Simmer (30 min)', description: 'Tadka ko cooked dal mein daalo. Low flame pe 30 min tak pakne do — stirring karte raho. Jitna zyada simmer karega utna creamy banega.', duration: 30, tips: ['Slow cooking ka raaz hai restaurant wali dal makhani — jaldi mat karo'] },
      { stepNumber: 4, title: 'Finishing', description: 'Fresh cream daalo, kasuri methi malke daalo, ek bada chamach butter daalo. Mix karo, serve karo.', duration: 5 },
    ],
    nutrition: { protein: 12, carbs: 35, fat: 14, calories: 290 },
  },
  'paneer-tikka': {
    name: 'Paneer Tikka', nameHindi: 'पनीर टिक्का',
    description: 'Smoky, charred restaurant-style paneer tikka — ghar ke tawa pe bhi ekdum same taste.',
    cuisine: 'indian', prepTime: 20, cookTime: 15, servings: 2, isVeg: true, calories: 250, rating: 4.7,
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=800',
    ingredients: DISH_INGREDIENTS['paneer-tikka'] || [],
    steps: [
      { stepNumber: 1, title: 'Marinade Banao', description: 'Hung curd mein sab masale, ginger-garlic paste, Kashmiri mirch, mustard oil mix karo. Paneer aur veggies isme coat karo. 30 min minimum rest do.', duration: 35 },
      { stepNumber: 2, title: 'Tawa Garam Karo', description: 'Cast iron tawa ya non-stick pan HIGH flame pe bahut garam karo — 3-4 min. Thoda oil spread karo.', duration: 4, tips: ['Tawa bahut garam hona chahiye — yahi charred look aata hai'] },
      { stepNumber: 3, title: 'Cook Karo', description: 'Skewers ya pieces tawa pe rakho. Ek side 3-4 min, phir palto, doosri side 3 min. Char marks aane chahiye. Zyada mat pakao — andar se soft rehna chahiye.', duration: 8 },
      { stepNumber: 4, title: 'Serve Karo', description: 'Chaat masala sprinkle karo, nimbu ka ras squeeze karo. Green chutney ke saath serve karo.', duration: 2, tips: ['Tawa se seedha serve karo — cooling se soft ho jaata hai'] },
    ],
    nutrition: { protein: 15, carbs: 8, fat: 18, calories: 250 },
  },
  'aloo-paratha': {
    name: 'Aloo Paratha', nameHindi: 'आलू पराठा',
    description: 'Crispy golden parathas stuffed with spiced mashed potato — Punjab ka breakfast king.',
    cuisine: 'indian', prepTime: 30, cookTime: 20, servings: 4, isVeg: true, calories: 320, rating: 4.8,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
    ingredients: DISH_INGREDIENTS['aloo-paratha'] || [],
    steps: [
      { stepNumber: 1, title: 'Dough Banao (20 min rest)', description: 'Atta, namak, thoda oil mix karo. Dheere dheere pani daalo aur soft dough banaao. Ek kapde se dhak ke 20 min rest do — bahut zaroori step.', duration: 25, tips: ['Jitna soft dough, utna soft paratha'] },
      { stepNumber: 2, title: 'Stuffing Banao', description: 'Boiled aloo ko ache se mash karo — koi bhi lump nahi rehna chahiye. Isme barik katey pyaaz, hari mirch, dhaniya, sab masale mix karo. Check karein — tasty lagni chahiye.', duration: 10, tips: ['Lump-free mash most important — ek lump bhi paratha phadta hai'] },
      { stepNumber: 3, title: 'Paratha Roll & Fill', description: 'Dough ka medium ball banaao. Thoda roll karo. Ek badi chamach stuffing beech mein rakho. Edges band karo jaise momo. Phir dhyan se gol roll karo — stuffing bahar nahi nikalni chahiye.', duration: 10 },
      { stepNumber: 4, title: 'Tawa Pe Pakao', description: 'Garam tawa pe medium flame pe paratha rakho. Ek side 2 min, palto, ghee laao, 2 min aur. Palto, ghee aur side pe bhi. Golden brown aur crispy hone tak.', duration: 5, tips: ['Generous ghee — isi se crispy hota hai'] },
    ],
    nutrition: { protein: 8, carbs: 45, fat: 12, calories: 320 },
  },
  'chole-bhature': {
    name: 'Chole Bhature', nameHindi: 'छोले भटूरे',
    description: 'Spicy tangy chole with fluffy puffed bhature — Delhi ki famous street food.',
    cuisine: 'indian', prepTime: 20, cookTime: 40, servings: 4, isVeg: true, calories: 450, rating: 4.8,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
    ingredients: DISH_INGREDIENTS['chole-bhature'] || [],
    steps: [
      { stepNumber: 1, title: 'Chole Pakao', description: 'Bhige hue chane pressure cooker mein 5-6 seeti ke saath pakao. Soft hone chahiye.', duration: 30 },
      { stepNumber: 2, title: 'Chole Gravy Banao', description: 'Oil mein pyaaz bhunao, ginger-garlic paste, tomato, sab masale daalo. Cooked chane daalo, 15 min sim karo. Ek cup pani bhi daalo.', duration: 20 },
      { stepNumber: 3, title: 'Bhatura Dough Banao', description: 'Maida, dahi, baking soda, namak mix karo. Soft dough banaao. 2 ghante cover karke rest do — fermentation zaroori hai.', duration: 125 },
      { stepNumber: 4, title: 'Bhature Fry Karo', description: 'Deep kadai mein oil garam karo 170°C pe. Dough balls belo oval shape mein. Oil mein daalo — turat puff up hoga. Dono side 1-2 min each. Drain karo.', duration: 15, tips: ['Oil temperature perfect hona chahiye — test karo small piece se'] },
    ],
    nutrition: { protein: 14, carbs: 65, fat: 18, calories: 450 },
  },
  'sushi': {
    name: 'Veggie Sushi Roll', nameHindi: 'वेज सुशी',
    description: 'Japanese classic re-imagined with Indian kirana store ingredients.',
    cuisine: 'japanese', prepTime: 20, cookTime: 20, servings: 2, isVeg: true, calories: 310, rating: 4.9,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
    isGlobalWithDesiOptions: true,
    desiSubstituteNote: 'Nori ki jagah thin spinach paratha, sushi rice ki jagah sticky jeera rice!',
    ingredients: [
      { id: 'd1', name: 'Spinach Paratha (Very thin)', nameHindi: 'पालक पराठा (पतला)', amount: 2, unit: 'pcs', cost: 20, availability: 'kirana', category: 'grain', note: 'Bahut patla belna zaroori hai', substitute: 'Normal thin roti bhi chalegi' },
      { id: 'd2', name: 'Sticky Jeera Rice', nameHindi: 'चिपचिपा जीरा चावल', amount: 1, unit: 'cup', cost: 30, availability: 'kirana', category: 'grain', note: 'Thoda zyada pani mein pakao taaki sticky ho', prepState: 'Paka ke thanda karo' },
      { id: 'd3', name: 'Cucumber & Carrot Strips', nameHindi: 'खीरा और गाजर के टुकड़े', amount: 1, unit: 'cup', cost: 15, availability: 'kirana', category: 'vegetable', prepState: 'Lambi thin strips mein kaato' },
      { id: 'd4', name: 'Spicy Mayo', nameHindi: 'स्पाइसी मेयो', amount: 2, unit: 'tbsp', cost: 10, availability: 'supermarket', category: 'other', substitute: 'Hung curd + chilli sauce mix karo' },
    ],
    authenticIngredients: [
      { id: 'a1', name: 'Nori Seaweed Sheets', nameHindi: 'नोरी सीवीड शीट', amount: 2, unit: 'pcs', cost: 150, availability: 'online', category: 'other' },
      { id: 'a2', name: 'Japanese Sushi Rice', nameHindi: 'सुशी राइस', amount: 1, unit: 'cup', cost: 200, availability: 'supermarket', category: 'grain' },
      { id: 'a3', name: 'Avocado & Cucumber', nameHindi: 'एवोकाडो और खीरा', amount: 1, unit: 'cup', cost: 120, availability: 'supermarket', category: 'vegetable' },
      { id: 'a4', name: 'Soy Sauce & Wasabi', nameHindi: 'सोया सॉस और वसाबी', amount: 2, unit: 'tbsp', cost: 80, availability: 'supermarket', category: 'spice' },
    ],
    steps: [
      { stepNumber: 1, title: 'Prep the Roll Base', description: 'Take a very thin spinach paratha. Spread sticky rice evenly over it.', duration: 5 },
      { stepNumber: 2, title: 'Add Veggies', description: 'Place cucumber and carrot strips horizontally in the middle.', duration: 2 },
      { stepNumber: 3, title: 'Roll it Up', description: 'Roll it tightly just like a frankie, slice into sushi-sized rounds, serve with spicy mayo.', duration: 3 },
    ],
    authenticSteps: [
      { stepNumber: 1, title: 'Prep Sushi Rice', description: 'Cook sushi rice, mix with rice vinegar, sugar, salt while warm. Let cool.', duration: 15 },
      { stepNumber: 2, title: 'Assemble on Nori', description: 'Place Nori on bamboo mat (shiny side down). Spread rice leaving 1 inch at top.', duration: 5 },
      { stepNumber: 3, title: 'Roll & Cut', description: 'Add avocado/cucumber, use mat to roll tightly. Cut with wet knife into 8 pieces.', duration: 5 },
    ],
    nutrition: { protein: 8, carbs: 45, fat: 12, calories: 310 },
  },
  'fallback': {
    name: 'Special Recipe', nameHindi: 'खास रेसिपी',
    description: 'A delicious Zayka AI special recipe generated just for you.',
    cuisine: 'indian', prepTime: 10, cookTime: 20, servings: 2, isVeg: true, calories: 250, rating: 4.5,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    ingredients: [],
    steps: [
      { stepNumber: 1, title: 'Prep', description: 'Chop everything nicely.', duration: 10 },
      { stepNumber: 2, title: 'Cook', description: 'Cook until delicious.', duration: 20 },
    ],
    nutrition: { protein: 5, carbs: 30, fat: 10, calories: 250 },
  }
};

function IngredientCard({ ing, servings, baseServings }: { ing: any, servings: number, baseServings: number }) {
  const [expanded, setExpanded] = useState(false);
  const displayAmount = Math.round(((ing.amount / baseServings) * servings) * 10) / 10;
  const displayCost = ing.cost ? Math.round((ing.cost / baseServings) * servings) : null;
  const avBg = ing.availability === 'kirana' ? '#DCFCE7' : ing.availability === 'supermarket' ? '#DBEAFE' : '#F3E8FF';
  const avColor = ing.availability === 'kirana' ? '#166534' : ing.availability === 'supermarket' ? '#1D4ED8' : '#7E22CE';
  const avLabel = ing.availability === 'kirana' ? '✅ Kirana' : ing.availability === 'supermarket' ? '🏪 Supermarket' : '📦 Online';

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: ing.isOptional ? '#FAFAFA' : W.card, borderRadius: 20, border: `1.5px solid ${ing.isOptional ? '#E5E7EB' : W.border}`, overflow: 'hidden', opacity: ing.isOptional ? 0.85 : 1 }}>
      
      {/* Collapsed Row */}
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
        <span style={{ fontSize: 28, flexShrink: 0 }}>{getCategoryEmoji(ing.category)}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <p style={{ fontWeight: 900, fontSize: 15, color: W.text }}>{ing.nameHindi || ing.name}</p>
            {ing.isOptional && <span style={{ fontSize: 10, background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 100, fontWeight: 800 }}>Optional</span>}
          </div>
          <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>{ing.name} • {displayAmount} {ing.unit}</p>
          {ing.visualMeasure && <p style={{ fontSize: 11, color: W.primary, fontWeight: 700 }}>≈ {ing.visualMeasure}</p>}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {displayCost && <p style={{ fontWeight: 900, fontSize: 16, color: W.primary }}>₹{displayCost}</p>}
          {ing.availability && <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 100, fontWeight: 800, background: avBg, color: avColor }}>{avLabel}</span>}
        </div>
        <div style={{ color: W.muted, flexShrink: 0 }}>{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>

            {(ing.shopName || ing.visualDescription) && (
              <div style={{ padding: '10px 16px', background: '#FFFBEB', borderTop: `1px solid ${W.border}` }}>
                {ing.shopName && <p style={{ fontSize: 13, color: '#78350F', fontWeight: 700 }}>🏷️ <b>Dukaan pe maango:</b> "{ing.shopName}"</p>}
                {ing.visualDescription && <p style={{ fontSize: 13, color: '#78350F', fontWeight: 600, marginTop: 4 }}>👀 <b>Kaisa dikhta hai:</b> {ing.visualDescription}</p>}
              </div>
            )}

            {(ing.priceRange || ing.freshnessCheck || ing.brandTip) && (
              <div style={{ padding: '10px 16px', background: '#F0FDF4', borderTop: `1px solid ${W.border}` }}>
                {ing.priceRange && <p style={{ fontSize: 13, color: '#166534', fontWeight: 700 }}>💰 <b>Market mein:</b> {ing.priceRange}</p>}
                {ing.freshnessCheck && <p style={{ fontSize: 13, color: '#166534', fontWeight: 600, marginTop: 4 }}>✅ <b>Fresh kaise pehchanein:</b> {ing.freshnessCheck}</p>}
                {ing.brandTip && <p style={{ fontSize: 13, color: '#166534', fontWeight: 600, marginTop: 4 }}>⭐ <b>Brand tip:</b> {ing.brandTip}</p>}
              </div>
            )}

            {(ing.prepState || ing.whenToAdd) && (
              <div style={{ padding: '10px 16px', background: '#EFF6FF', borderTop: `1px solid ${W.border}` }}>
                {ing.prepState && <p style={{ fontSize: 13, color: '#1E3A8A', fontWeight: 700 }}>🔪 <b>Taiyaar kaise karein:</b> {ing.prepState}</p>}
                {ing.whenToAdd && <p style={{ fontSize: 13, color: '#1E3A8A', fontWeight: 600, marginTop: 4 }}>⏱️ <b>Kab daalo:</b> {ing.whenToAdd}</p>}
              </div>
            )}

            {ing.substitute && (
              <div style={{ padding: '10px 16px', background: '#FFF1F2', borderTop: `1px solid ${W.border}` }}>
                <p style={{ fontSize: 13, color: '#BE123C', fontWeight: 700 }}>🔄 <b>Nahi mila toh:</b> {ing.substitute}</p>
                {ing.substituteReason && <p style={{ fontSize: 12, color: '#9F1239', fontWeight: 600, marginTop: 2 }}>({ing.substituteReason})</p>}
              </div>
            )}

            {(ing.note || ing.storage || ing.healthNote || ing.commonMistake) && (
              <div style={{ padding: '10px 16px', background: '#F5F3FF', borderTop: `1px solid ${W.border}` }}>
                {ing.note && <p style={{ fontSize: 13, color: '#5B21B6', fontWeight: 700 }}>💡 <b>Tip:</b> {ing.note}</p>}
                {ing.storage && <p style={{ fontSize: 13, color: '#5B21B6', fontWeight: 600, marginTop: 4 }}>🏠 <b>Store kaise karein:</b> {ing.storage}</p>}
                {ing.healthNote && <p style={{ fontSize: 13, color: '#5B21B6', fontWeight: 600, marginTop: 4 }}>❤️ <b>Health note:</b> {ing.healthNote}</p>}
                {ing.commonMistake && <p style={{ fontSize: 13, color: '#B91C1C', fontWeight: 700, marginTop: 4 }}>⚠️ <b>Galti mat karna:</b> {ing.commonMistake}</p>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const { isFavourite, addFavourite, removeFavourite, setCurrentRecipe, savedRecipes, memory } = useZaykaStore() as any;

  const [recipe, setRecipe] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'cost' | 'chef'>('ingredients');
  const [recipeVersion, setRecipeVersion] = useState<'desi' | 'authentic'>('desi');
  const [servings, setServings] = useState(2);
  const [activeTimer, setActiveTimer] = useState<{ stepIndex: number; remaining: number } | null>(null);
  const [aiIngredients, setAiIngredients] = useState<any[] | null>(null);
  const [aiSteps, setAiSteps] = useState<any[] | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const isFav = isFavourite(id);

  useEffect(() => {
    if (!id) return;
    const searchParams = new URLSearchParams(window.location.search);
    const versionParam = searchParams.get('version');
    if (versionParam === 'authentic' || versionParam === 'desi') {
      setRecipeVersion(versionParam);
    }
    
    const generated = savedRecipes?.find((r: any) => r.id === id);
    let r = generated || DUMMY_RECIPES[id];
    
    if (!r) {
      const fromAllDishes = ALL_DISHES.find(d => d.id === id);
      if (fromAllDishes) {
        r = {
          ...fromAllDishes,
          description: `Enjoy this delicious ${fromAllDishes.nameHindi || fromAllDishes.name} prepared Zayka style!`,
          prepTime: 10, cookTime: fromAllDishes.time || 20, servings: 2,
          image: fromAllDishes.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
          ingredients: [], steps: []
        };
      }
    }
    
    const finalRecipe = r || DUMMY_RECIPES['fallback'];
    setRecipe(finalRecipe);
    setServings(finalRecipe.servings || 2);
  }, [id, savedRecipes]);

  // Timer
  useEffect(() => {
    if (!activeTimer || activeTimer.remaining <= 0) return;
    const interval = setInterval(() => setActiveTimer(t => t ? { ...t, remaining: t.remaining - 1 } : null), 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);
  
  useEffect(() => {
    if (activeTimer?.remaining === 0) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(500);
      toast.success('Timer done! ✅');
      setActiveTimer(null);
    }
  }, [activeTimer?.remaining]);

  const loadAIContent = async () => {
    setLoadingAI(true);
    try {
      if (recipe && recipe.name) {
        // Load ingredients
        if (!aiIngredients && (!recipe.ingredients || recipe.ingredients.length === 0)) {
          const result = await generateIngredientsAction(recipe.name, servings, 'hindi');
          if (result.success && result.data) setAiIngredients(result.data);
        }
        // Load steps
        if (!aiSteps && (!recipe.steps || recipe.steps.length === 0)) {
          const { generateStepsAction } = await import('@/lib/actions');
          const stepResult = await generateStepsAction(recipe.name, servings);
          if (stepResult.success && stepResult.data) setAiSteps(stepResult.data);
        }
      }
    } catch {}
    setLoadingAI(false);
  };

  useEffect(() => {
    if (recipe && !DISH_INGREDIENTS[id]) {
      const needsIngredients = (!aiIngredients && (!recipe.ingredients || recipe.ingredients.length === 0));
      const needsSteps = (!aiSteps && (!recipe.steps || recipe.steps.length === 0));
      if (needsIngredients || needsSteps) {
        loadAIContent();
      }
    }
  }, [recipe, id, aiIngredients, aiSteps]);

  if (!recipe) return <div style={{ background: W.bg, minHeight: '100vh' }} />;

  const baseServings = recipe.servings || 2;
  const displayedIngredients = (recipeVersion === 'authentic' ? (recipe.authenticIngredients || recipe.ingredients) : recipe.ingredients) || [];
  const displayedSteps = aiSteps || (recipeVersion === 'authentic' ? (recipe.authenticSteps || recipe.steps) : recipe.steps) || [];

  // Enrich with static data if available
  const rawEnriched = DISH_INGREDIENTS[id]
    ? (recipeVersion === 'desi' || !recipe.isGlobalWithDesiOptions ? DISH_INGREDIENTS[id] : (recipe.authenticIngredients || DISH_INGREDIENTS[id]))
    : (aiIngredients || displayedIngredients);
    
  const enrichedIngredients: any[] = Array.isArray(rawEnriched) ? rawEnriched : [];
  const grouped = groupByCategory(enrichedIngredients);

  const kiranaCost = Math.round(enrichedIngredients.filter(i => i?.availability === 'kirana').reduce((s: number, i: any) => s + ((i.cost || 0) / baseServings) * servings, 0));
  const superCost = Math.round(enrichedIngredients.filter(i => i?.availability === 'supermarket').reduce((s: number, i: any) => s + ((i.cost || 0) / baseServings) * servings, 0));
  const onlineCost = Math.round(enrichedIngredients.filter(i => i?.availability === 'online').reduce((s: number, i: any) => s + ((i.cost || 0) / baseServings) * servings, 0));
  const totalCost = kiranaCost + superCost + onlineCost;

  const chefNote = memory?.allergies?.length
    ? `⚠️ Teri ${memory.allergies.join(', ')} allergy hai. Zayka AI ne check kiya — yeh recipe safe hai!`
    : memory?.isVegetarian && !recipe.isVeg
    ? `⚠️ Yeh non-veg recipe hai. 'Desi Jugaad' tab mein veg substitute dekho!`
    : null;

  const handleShare = () => {
    if (navigator.share) { navigator.share({ title: recipe.name, text: `${recipe.name} ki recipe dekho!`, url: window.location.href }).catch(() => {}); }
    else { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }
  };

  const handleCopyList = (filter?: 'kirana' | 'supermarket' | 'online') => {
    const items = filter ? enrichedIngredients.filter((i: any) => i?.availability === filter) : enrichedIngredients;
    const list = items.filter(Boolean).map((i: any) => {
      const amt = Math.round(((i.amount / baseServings) * servings) * 10) / 10;
      return `• ${i.nameHindi || i.name} — ${amt} ${i.unit}`;
    }).join('\n');
    const label = filter ? (filter === 'kirana' ? '✅ Kirana List' : '🏪 Supermarket List') : '📋 Shopping List';
    navigator.clipboard.writeText(`${label} for ${recipe.name} (${servings} log)\n\n${list}\n\nTotal: ₹${totalCost}`);
    toast.success(`${label} copied!`);
  };

  return (
    <div style={{ minHeight: '100vh', background: W.bg, paddingBottom: 100 }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 300, background: '#ccc' }}>
        <img src={recipe.image || recipe.imageUrl} alt={recipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 35%, rgba(28,16,9,0.92) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => router.back()} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: 'white', cursor: 'pointer' }}>
              <ArrowLeft size={24} />
            </motion.button>
            <div style={{ display: 'flex', gap: 12 }}>
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleShare} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: 'white', cursor: 'pointer' }}><Share2 size={22} /></motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => { isFav ? removeFavourite(id) : addFavourite(id); toast.success(isFav ? 'Removed' : 'Saved! ❤️'); }} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: isFav ? '#EF4444' : 'white', cursor: 'pointer' }}><Heart size={22} fill={isFav ? '#EF4444' : 'transparent'} /></motion.button>
            </div>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <h1 style={{ color: 'white', fontSize: 30, fontWeight: 900, lineHeight: 1.1, marginBottom: 6 }}>{recipe.nameHindi || recipe.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{recipe.name}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}><Star size={12} fill="#FCD34D" color="#FCD34D" /> {recipe.rating || '4.8'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}><Clock size={12} /> {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
              <span style={{ background: recipe.isVeg ? '#22C55E' : '#EF4444', color: 'white', padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 800 }}>{recipe.isVeg ? 'VEG' : 'NON-VEG'}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Nutrition Row */}
        {recipe.nutrition && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'Cal', val: Math.round(((recipe.nutrition.calories || 0) / baseServings) * servings), unit: 'kcal', color: '#F97316', bg: '#FFF7ED' },
              { label: 'Protein', val: Math.round(((recipe.nutrition.protein || 0) / baseServings) * servings), unit: 'g', color: '#10B981', bg: '#F0FDF4' },
              { label: 'Carbs', val: Math.round(((recipe.nutrition.carbs || 0) / baseServings) * servings), unit: 'g', color: '#3B82F6', bg: '#EFF6FF' },
              { label: 'Fat', val: Math.round(((recipe.nutrition.fat || 0) / baseServings) * servings), unit: 'g', color: '#8B5CF6', bg: '#F5F3FF' },
            ].map(n => (
              <div key={n.label} style={{ background: n.bg, borderRadius: 14, padding: '10px 8px', textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 900, color: n.color }}>{n.val}</p>
                <p style={{ fontSize: 9, fontWeight: 800, color: W.muted, }}>{n.label}</p>
                <p style={{ fontSize: 10, color: W.muted }}>{n.unit}</p>
              </div>
            ))}
          </div>
        )}

        {recipe.description && <p style={{ color: W.muted, fontSize: 14, lineHeight: 1.6, fontWeight: 500, marginBottom: 16 }}>{recipe.description}</p>}

        {/* Global vs Desi Toggle */}
        {recipe.isGlobalWithDesiOptions && (
          <div style={{ background: '#FFF1F2', border: '1.5px solid #FECDD3', borderRadius: 20, padding: 14, marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 900, color: '#BE123C', marginBottom: 8 }}>🌍 Global Dish, Desi Dil</h3>
            {recipeVersion === 'desi' && recipe.desiSubstituteNote && <p style={{ fontSize: 12, color: '#9F1239', fontWeight: 600, marginBottom: 10 }}>💡 {recipe.desiSubstituteNote}</p>}
            <div style={{ display: 'flex', background: 'white', borderRadius: 100, padding: 4, border: '1px solid #FECDD3' }}>
              <button onClick={() => setRecipeVersion('desi')} style={{ flex: 1, padding: '9px', borderRadius: 100, border: 'none', background: recipeVersion === 'desi' ? '#E11D48' : 'transparent', color: recipeVersion === 'desi' ? 'white' : '#BE123C', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><MapPin size={14} /> Desi Jugaad</button>
              <button onClick={() => setRecipeVersion('authentic')} style={{ flex: 1, padding: '9px', borderRadius: 100, border: 'none', background: recipeVersion === 'authentic' ? '#E11D48' : 'transparent', color: recipeVersion === 'authentic' ? 'white' : '#BE123C', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Globe size={14} /> Authentic</button>
            </div>
          </div>
        )}

        {/* Servings Adjuster */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: W.card, border: `1px solid ${W.border}`, borderRadius: 20, padding: '14px 18px', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, color: W.muted, }}>Kitne Logon Ke Liye?</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: W.text }}>{servings} {servings === 1 ? 'Person' : 'Log'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setServings(s => Math.max(1, s - 1))} style={{ width: 36, height: 36, borderRadius: '50%', background: W.border, border: 'none', fontSize: 20, fontWeight: 900, cursor: 'pointer', color: W.text }}>−</button>
            <span style={{ fontSize: 20, fontWeight: 900, color: W.primary, minWidth: 24, textAlign: 'center' }}>{servings}</span>
            <button onClick={() => setServings(s => Math.min(20, s + 1))} style={{ width: 36, height: 36, borderRadius: '50%', background: W.primary, border: 'none', fontSize: 20, fontWeight: 900, cursor: 'pointer', color: 'white' }}>+</button>
          </div>
        </div>

        {/* 4 TABS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, background: W.border, padding: 4, borderRadius: 16, marginBottom: 20 }}>
          {[
            { id: 'ingredients', label: '🛒 Samagri', emoji: '' },
            { id: 'steps', label: '👨‍🍳 Steps', emoji: '' },
            { id: 'cost', label: '💰 Cost', emoji: '' },
            { id: 'chef', label: '🤖 Chef', emoji: '' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{ padding: '10px 4px', borderRadius: 12, border: 'none', cursor: 'pointer', background: activeTab === t.id ? W.card : 'transparent', color: activeTab === t.id ? W.primary : W.muted, fontWeight: activeTab === t.id ? 800 : 600, fontSize: 11, boxShadow: activeTab === t.id ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab + recipeVersion} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>

            {/* ===== TAB 1: INGREDIENTS (Category-wise) ===== */}
            {activeTab === 'ingredients' && (
              <div>
                {chefNote && <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: 16, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#92400E', fontWeight: 600 }}>{chefNote}</div>}

                {loadingAI ? (
                  <div style={{ padding: 40, textAlign: 'center' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: 12 }}>
                      <Loader2 size={36} color={W.primary} />
                    </motion.div>
                    <h3 style={{ fontWeight: 800, color: W.text, marginBottom: 6 }}>Zayka AI ingredients dhoondh raha hai...</h3>
                    <p style={{ color: W.muted, fontSize: 13 }}>{recipe.name} ki detailed list bana raha hai</p>
                  </div>
                ) : (
                  <div>
                    {grouped.length > 0 ? grouped.map(group => (
                      <div key={group.category} style={{ marginBottom: 20 }}>
                        <p style={{ fontSize: 12, fontWeight: 900,  color: W.muted, marginBottom: 10,  display: 'flex', alignItems: 'center', gap: 6 }}>
                          {getCategoryEmoji(group.category)} {getCategoryLabel(group.category)}
                          <span style={{ background: W.border, color: W.muted, fontSize: 11, padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>{group.items.length}</span>
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {group.items.map((ing: any) => <IngredientCard key={ing.id} ing={ing} servings={servings} baseServings={baseServings} />)}
                        </div>
                      </div>
                    )) : (
                      <div style={{ padding: 20, textAlign: 'center', color: W.muted }}>
                        <p style={{ fontSize: 14 }}>Tap karo toh AI ingredients generate karega ✨</p>
                        <button onClick={loadAIContent} style={{ marginTop: 12, background: W.primary, color: 'white', border: 'none', padding: '12px 24px', borderRadius: 100, fontWeight: 800, cursor: 'pointer' }}>Generate with AI</button>
                      </div>
                    )}

                    {/* Shopping List Buttons */}
                    {enrichedIngredients.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                        <button onClick={() => handleCopyList()} style={{ width: '100%', background: W.card, border: `1.5px solid ${W.border}`, padding: '13px', borderRadius: 16, color: W.text, fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>
                          📋 Poori Shopping List Copy Karo
                        </button>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <button onClick={() => handleCopyList('kirana')} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '11px', borderRadius: 14, color: '#166534', fontWeight: 800, cursor: 'pointer', fontSize: 12 }}>✅ Kirana List</button>
                          <button onClick={() => handleCopyList('supermarket')} style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '11px', borderRadius: 14, color: '#1D4ED8', fontWeight: 800, cursor: 'pointer', fontSize: 12 }}>🏪 Supermarket List</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ===== TAB 2: STEPS (Step by Step) ===== */}
            {activeTab === 'steps' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 16, padding: '12px 16px', fontSize: 13, color: '#78350F', fontWeight: 600 }}>
                  💡 Har step ka timer tap karke start karo — aur phone vibrate karega jab time ho jaaye!
                </div>
                {displayedSteps.map((step: any, index: number) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }}
                    style={{ display: 'flex', gap: 14 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${W.primary}, #EA580C)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, flexShrink: 0 }}>{step.stepNumber || (index + 1)}</div>
                      {index !== displayedSteps.length - 1 && <div style={{ width: 2, flex: 1, background: W.border, marginTop: 8 }} />}
                    </div>
                    <div style={{ paddingBottom: index === displayedSteps.length - 1 ? 0 : 20, flex: 1 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 900, color: W.text, marginBottom: 6 }}>{step.title || `Step ${index + 1}`}</h3>
                      <p style={{ fontSize: 14, color: W.muted, lineHeight: 1.7, fontWeight: 500 }}>{step.description}</p>
                      {step.tips?.map((tip: string, ti: number) => (
                        <div key={ti} style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '8px 12px', marginTop: 8 }}>
                          <p style={{ fontSize: 12, color: '#78350F', fontWeight: 700 }}>💡 Pro Tip: {tip}</p>
                        </div>
                      ))}
                      {step.duration && (
                        <button onClick={() => setActiveTimer({ stepIndex: index, remaining: step.duration * 60 })}
                          style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, background: activeTimer?.stepIndex === index ? '#FEF2F2' : '#EFF6FF', border: 'none', borderRadius: 100, padding: '7px 16px', cursor: 'pointer' }}>
                          <Clock size={14} color={activeTimer?.stepIndex === index ? '#EF4444' : '#3B82F6'} />
                          <span style={{ fontSize: 13, fontWeight: 800, color: activeTimer?.stepIndex === index ? '#EF4444' : '#3B82F6' }}>
                            {activeTimer?.stepIndex === index
                              ? `⏱️ ${Math.floor(activeTimer.remaining / 60)}:${String(activeTimer.remaining % 60).padStart(2, '0')} baki`
                              : `⏱️ ${step.duration} min ka timer`}
                          </span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ===== TAB 3: COST BREAKDOWN ===== */}
            {activeTab === 'cost' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: W.card, border: `1px solid ${W.border}`, borderRadius: 20, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', borderBottom: `1px solid ${W.border}` }}>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: W.text }}>💰 Cost Breakdown</h3>
                    <p style={{ fontSize: 12, color: W.muted, fontWeight: 600 }}>{servings} log ke liye</p>
                  </div>
                  <div style={{ padding: '0 20px' }}>
                    {[
                      { label: '✅ Kirana se milne wali cheezein', count: enrichedIngredients.filter((i: any) => i.availability === 'kirana').length, cost: kiranaCost, color: '#166534', bg: '#F0FDF4' },
                      { label: '🏪 Supermarket se milne wali cheezein', count: enrichedIngredients.filter((i: any) => i.availability === 'supermarket').length, cost: superCost, color: '#1D4ED8', bg: '#EFF6FF' },
                      { label: '📦 Online milne wali cheezein', count: enrichedIngredients.filter((i: any) => i.availability === 'online').length, cost: onlineCost, color: '#7E22CE', bg: '#F5F3FF' },
                    ].filter(r => r.count > 0).map((row, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${W.border}` }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: W.text }}>{row.label}</p>
                          <p style={{ fontSize: 12, color: W.muted }}>{row.count} cheezein</p>
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 900, color: row.color, background: row.bg, padding: '4px 12px', borderRadius: 100 }}>₹{row.cost}</span>
                      </div>
                    ))}
                    <div style={{ padding: '16px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 900, color: W.text }}>Total Market Cost</span>
                        <span style={{ fontSize: 22, fontWeight: 900, color: W.primary }}>₹{totalCost}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: W.muted, fontWeight: 600 }}>Per Plate ({servings} log mein)</span>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>₹{Math.round(totalCost / servings)}/plate</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ingredient wise cost breakdown */}
                <div style={{ background: W.card, border: `1px solid ${W.border}`, borderRadius: 20, padding: '16px 20px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 900, color: W.text, marginBottom: 12 }}>Ingredient-wise Cost</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {enrichedIngredients.filter((i: any) => i.cost).sort((a: any, b: any) => b.cost - a.cost).map((ing: any, i: number) => {
                      const scaledCost = Math.round((ing.cost / baseServings) * servings);
                      const pct = totalCost > 0 ? Math.round((scaledCost / totalCost) * 100) : 0;
                      return (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: W.text }}>{ing.nameHindi || ing.name}</span>
                            <span style={{ fontSize: 13, fontWeight: 800, color: W.primary }}>₹{scaledCost}</span>
                          </div>
                          <div style={{ height: 6, background: W.border, borderRadius: 100, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.05 }}
                              style={{ height: '100%', background: `linear-gradient(90deg, ${W.primary}, #EA580C)`, borderRadius: 100 }} />
                          </div>
                          {ing.priceRange && <p style={{ fontSize: 11, color: W.muted, marginTop: 2 }}>Market: {ing.priceRange}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ===== TAB 4: CHEF CHAT ===== */}
            {activeTab === 'chef' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <ChefChat recipeData={recipe} context="recipe_detail" />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Start Cooking CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 24px 32px', background: 'linear-gradient(to top, rgba(255,248,243,1) 50%, rgba(255,248,243,0))', zIndex: 40, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => { setCurrentRecipe({ ...recipe, servings, ingredients: enrichedIngredients, steps: displayedSteps }); router.push('/cook'); }}
          style={{ pointerEvents: 'auto', width: '100%', maxWidth: 400, background: 'linear-gradient(135deg, #F97316, #EA580C)', color: 'white', border: 'none', padding: '18px', borderRadius: 100, cursor: 'pointer', fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(249,115,22,0.3)' }}>
          Start Cooking <Play size={20} fill="white" />
        </motion.button>
      </div>
    </div>
  );
}
