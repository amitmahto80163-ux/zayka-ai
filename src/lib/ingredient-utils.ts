export interface ScannedIngredientItem {
  id: string;
  name: string;
  confidence: number; // 0 to 100
  needsVerification: boolean; // true when confidence < 70
  verified: boolean;
  alternatives: string[];
  reason?: string;
}

export function getLookalikeAlternatives(ingredientName: string): string[] {
  const lower = (ingredientName || '').toLowerCase();
  if (/paneer|tofu|cheese|malai|cottage/i.test(lower)) {
    return ['🧀 Paneer', '🧈 Tofu (Soy Paneer)', '🧀 Mozzarella / Cheese Cubes', '🥥 Fresh Malai'];
  }
  if (/dhaniya|coriander|pudina|mint|palak|spinach|methi|leaf|leaves|green/i.test(lower)) {
    return ['🌿 Hara Dhaniya (Coriander)', '🌿 Pudina (Mint Leaves)', '🥬 Palak (Spinach)', '🌿 Kasuri / Fresh Methi'];
  }
  if (/adrak|ginger|lehsun|garlic|arbi|galangal/i.test(lower)) {
    return ['🫚 Adrak (Ginger)', '🧄 Lehsun (Garlic)', '🫙 Ginger-Garlic Paste', '🥔 Arbi (Colocasia)'];
  }
  if (/pyaaz|onion|shallot|cabbage/i.test(lower)) {
    return ['🧅 Pyaaz (Onion)', '🧅 Hara Pyaaz (Spring Onion)', '🥬 Patta Gobhi (Cabbage)', '🧄 Lehsun (Garlic)'];
  }
  if (/tamatar|tomato|capsicum|bell pepper|red/i.test(lower)) {
    return ['🍅 Tamatar (Tomato)', '🫑 Lal Shimla Mirch (Red Bell Pepper)', '🌶️ Kashmiri Lal Mirch Paste', '🥕 Gajar (Carrot)'];
  }
  if (/aloo|potato|gobhi|cauliflower|mooli|turnip/i.test(lower)) {
    return ['🥔 Aloo (Potato)', '🥦 Phool Gobhi (Cauliflower)', '🥕 Mooli (Radish)', '🍠 Shakarkandi (Sweet Potato)'];
  }
  if (/mirch|chilli|beans|bhindi|okra|matar|pea/i.test(lower)) {
    return ['🌶️ Hari Mirch (Green Chilli)', '🫑 Shimla Mirch (Capsicum)', '🫛 Hari Matar (Green Peas)', '🥗 French Beans / Bhindi'];
  }
  if (/atta|maida|besan|suji|rava|rice|chawal|flour/i.test(lower)) {
    return ['🌾 Gehu Atta (Wheat Flour)', '🥟 Maida (All-Purpose Flour)', '🟡 Besan (Gram Flour)', '🍚 Chawal / Suji'];
  }
  if (/dahi|curd|milk|doodh|cream|butter|ghee/i.test(lower)) {
    return ['🥣 Dahi (Curd/Yogurt)', '🥛 Fresh Cream (Malai)', '🧈 Makhan / Butter', '🥛 Doodh (Milk)'];
  }
  return [
    ingredientName || '🥘 Mixed Sabzi',
    '🧀 Paneer',
    '🧅 Pyaaz (Onion)',
    '🍅 Tamatar (Tomato)',
    '🥔 Aloo (Potato)',
  ];
}
