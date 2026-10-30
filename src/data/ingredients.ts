// ============================================
// ZAYKA AI - Rich Ingredient Database
// Zero Doubt — Har cheez ki puri detail
// ============================================

import { Ingredient } from '@/types';

export const DISH_INGREDIENTS: Record<string, Ingredient[]> = {

  // ============================================
  // 1. BUTTER CHICKEN
  // ============================================
  'butter-chicken': [
    {
      id: 'bc-1', category: 'protein',
      name: 'Boneless Chicken', nameHindi: 'बोनलेस चिकन',
      shopName: 'Broiler murga, bina haddi wala maango',
      visualDescription: 'Light pink color ka, soft tukda — yellow ya gray nahi hona chahiye',
      amount: 500, unit: 'g', visualMeasure: 'Ek bade bowl ke barabar',
      prepState: '2 inch ke tukdon mein kaato — na zyada chote na zyada bade',
      whenToAdd: 'Step 1 mein marinade karo, Step 3 mein gravy mein daalo',
      cost: 120, costPerUnit: '₹240/kg', priceRange: '₹100-140 ke beech milega',
      availability: 'supermarket', availabilityNote: 'Kisi bhi local butcher ya Big Bazaar mein milega',
      freshnessCheck: 'Pink hona chahiye, smell bilkul nahi aani chahiye. Agar thoda bhi smell aaye, mat lo.',
      brandTip: 'Local fresh butcher best hai. Frozen market wala avoid karo.',
      substitute: 'Paneer 200g (veg ke liye) ya Mushroom 300g (vegan ke liye)',
      substituteReason: 'Paneer same protein deta hai aur marinade bhi utna hi achha absorb karta hai',
      note: 'Banana banane se 30 min pehle fridge se nikalo — room temperature pe cooking better hoti hai',
      storage: 'Fridge mein 2 din tak rakho. Zyada rakhna ho toh freeze karo.',
      healthNote: 'High protein (25g/100g). Diabetics aur gym jaaney waalon ke liye best.',
      commonMistake: 'Frozen chicken directly kadai mein mat daalo — pehle completely thaw karo warna andar se kacha rehta hai',
      isOptional: false,
    },
    {
      id: 'bc-2', category: 'dairy',
      name: 'Full Fat Curd (Dahi)', nameHindi: 'मोटी दही',
      shopName: 'Mota dahi maango — pani wala nahi',
      visualDescription: 'Thick, white, khatta smell wala — pani tairta hua nahi hona chahiye',
      amount: 100, unit: 'g', visualMeasure: '4-5 bade chamach ke barabar',
      prepState: 'Waise hi use karo — beat karke smooth bana lo pehle',
      whenToAdd: 'Step 1 mein — marinade mein mix karo chicken ke saath',
      cost: 15, costPerUnit: '₹40/250g', priceRange: '₹30-50 ke beech milega',
      availability: 'kirana', availabilityNote: 'Har kirana shop aur dairy wale ke paas milta hai',
      freshnessCheck: 'Khatta smell achha hai, lekin kadwa ya off smell nahi hona chahiye. Fresh wala lo.',
      brandTip: 'Mother Dairy ya Amul dahi theek hai. Ghar ki banai dahi sabse best!',
      substitute: 'Thick coconut yogurt (vegan ke liye) ya hung curd aur bhi achha hoga',
      substituteReason: 'Curd chicken ko soft aur juicy banata hai aur spices ko andar tak le jaata hai',
      note: 'Agar dahi pani wala hai toh muslin kapde se strain kar lo 30 min pehle',
      storage: 'Fridge mein 3-4 din tak fresh rehta hai',
      healthNote: 'Probiotics se bhara hai — gut health ke liye achha. Lactose intolerant hain toh skip karo.',
      commonMistake: 'Pani wala patla dahi mat use karo — marinade runny ho jaata hai aur chicken coat nahi hota',
      isOptional: false,
    },
    {
      id: 'bc-3', category: 'dairy',
      name: 'Butter (Makhan)', nameHindi: 'मक्खन',
      shopName: 'Amul butter ya white butter maango',
      visualDescription: 'Yellow ya cream color ka block — solid hona chahiye',
      amount: 50, unit: 'g', visualMeasure: '3 bade chamach ke barabar',
      prepState: 'Waise hi use karo — kadai mein seedha daal do',
      whenToAdd: 'Step 2 mein — gravy base banate waqt sabse pehle daalo',
      cost: 28, costPerUnit: '₹55/100g', priceRange: '₹25-35 ke beech milega',
      availability: 'kirana', availabilityNote: 'Har kirana shop mein milta hai',
      freshnessCheck: 'Creamy yellow hona chahiye, rancid ya khatta smell nahi hona chahiye',
      brandTip: 'Amul salted butter perfect hai is recipe ke liye',
      substitute: '2 tbsp Ghee (aur rich flavour deta hai) ya refined oil',
      substituteReason: 'Ghee ka smoke point zyada hai aur flavour aur authentic aata hai',
      note: 'Medium flame pe use karo — zyada garam karne pe burn ho jaata hai aur kadwa ho jaata hai',
      storage: 'Fridge mein 3 hafte tak fresh rehta hai',
      healthNote: 'Saturated fat zyada hai — heart patients thoda limit karein',
      commonMistake: 'Butter ko zyada garam mat karo — jaise hi foam aana band ho, next ingredient daalo',
      isOptional: false,
    },
    {
      id: 'bc-4', category: 'spice',
      name: 'Kashmiri Red Chilli Powder', nameHindi: 'कश्मीरी लाल मिर्च',
      shopName: 'Kashmiri mirch ya deghi mirch maango',
      visualDescription: 'Dark bright red color — normal mirch se zyada red aur less tikh',
      amount: 2, unit: 'tsp', visualMeasure: '2 choti chamach',
      prepState: 'Waise hi use karo — powder form mein hai',
      whenToAdd: 'Step 1 mein marinade mein aur Step 2 mein gravy mein',
      cost: 5, costPerUnit: '₹80/100g', priceRange: '₹3-8 ke beech milega',
      availability: 'kirana', availabilityNote: 'Masale wali dukaan pe zaroor milega',
      freshnessCheck: 'Bright red hona chahiye — orange ya brown ho gayi toh purani hai, mat lo',
      brandTip: 'MDH ya Everest Kashmiri Chilli best hai',
      substitute: 'Normal lal mirch (half quantity) + 1 tsp paprika — color similar aayega',
      substituteReason: 'Kashmiri mirch mainly color ke liye use hoti hai, zyada tikh nahi hoti',
      note: 'Is mirch se woh beautiful orange-red color aata hai — yahi butter chicken ka signature look hai',
      storage: 'Airtight dabba mein rakho, 6 mahine tak fresh rehti hai',
      healthNote: 'Vitamin C se bhara — immunity ke liye achha. Stomach sensitive ho toh thoda kam dalo.',
      commonMistake: 'Normal tikh mirch ki jagah mat use karo — dish bahut spicy ho jaayegi',
      isOptional: false,
    },
    {
      id: 'bc-5', category: 'spice',
      name: 'Ginger-Garlic Paste', nameHindi: 'अदरक-लहसुन पेस्ट',
      shopName: 'Adrak lahsun paste maango — ya fresh adrak lahsun lo',
      visualDescription: 'Light yellowish-green color ka smooth paste',
      amount: 2, unit: 'tbsp', visualMeasure: '2 bade chamach',
      prepState: 'Ready-made hai toh directly use karo. Fresh banana ho toh 1 inch adrak + 6 lahsun grind karo',
      whenToAdd: 'Step 1 marinade mein aur Step 2 mein gravy mein',
      cost: 10, costPerUnit: '₹40/200g', priceRange: '₹8-15 ke beech milega',
      availability: 'kirana', availabilityNote: 'Har kirana shop mein ready-made milta hai',
      freshnessCheck: 'Fresh smell hona chahiye — fermented ya khatta smell aaye toh purana hai',
      brandTip: 'Ghar ka freshly ground sabse best! Ready-made use karo toh MDH ya Patanjali',
      substitute: '1 inch grated ginger + 4 cloves garlic (fresh)',
      substituteReason: 'Fresh se 10x better flavour — baad mein zaroor banao',
      note: 'Ready-made paste mein preservatives hote hain — toh cooking ke baad thoda add karo na pehle',
      storage: 'Fridge mein 1 hafte tak rakho. Freezer mein 3 mahine.',
      healthNote: 'Adrak digestive hai, lahsun immunity badhata hai. Daily use recommended.',
      commonMistake: 'Paste ko cold pan mein mat daalo — pehle butter/oil garam karo, phir paste',
      isOptional: false,
    },
    {
      id: 'bc-6', category: 'vegetable',
      name: 'Tomato Puree', nameHindi: 'टमाटर प्यूरी',
      shopName: 'Tomato puree ya tamatar ka ras maango',
      visualDescription: 'Deep red color, smooth liquid — seeds nahi hone chahiye',
      amount: 200, unit: 'ml', visualMeasure: 'Ek badi katori ke barabar',
      prepState: 'Packet wala directly daalo. Fresh banana ho toh 4 tamaatar blend karke strain karo',
      whenToAdd: 'Step 2 mein — ginger-garlic ke baad daalo',
      cost: 20, costPerUnit: '₹35/200ml', priceRange: '₹15-25 ke beech milega',
      availability: 'kirana', availabilityNote: 'Har kirana shop mein Kissan ya Del Monte milta hai',
      freshnessCheck: 'Deep red hona chahiye, khatta smell aana chahiye — packet swollen nahi hona chahiye',
      brandTip: 'Kissan ya Heinz tomato puree best hai. Fresh tamaatar se bhi bana sakte ho.',
      substitute: '4 medium red tamaatar (blend karke strain karo)',
      substituteReason: 'Fresh tamaatar thoda zyada khatta hoga — thoda sugar add kar dena',
      note: 'Puree daalne ke baad medium flame pe 8-10 minute pakao jab tak oil alag na ho jaaye — yahi gravy ka base hai',
      storage: 'Khuley packet ko fridge mein 3 din mein use karo',
      healthNote: 'Lycopene se bhara — cancer prevention ke liye achha. Heart ke liye bhi beneficial.',
      commonMistake: 'Puree ko kachcha mat chhodo — jab tak oil surface pe na aaye tab tak pakate raho',
      isOptional: false,
    },
    {
      id: 'bc-7', category: 'dairy',
      name: 'Fresh Cream (Heavy Cream)', nameHindi: 'फ्रेश क्रीम',
      shopName: 'Amul fresh cream ya malai maango',
      visualDescription: 'White, thick liquid — dahi se thoda patla',
      amount: 50, unit: 'ml', visualMeasure: '3 bade chamach ke barabar',
      prepState: 'Fridge se nikaal ke room temperature pe rakhna 15 min pehle',
      whenToAdd: 'Step 4 — bilkul end mein, gas band karne se 2 min pehle',
      cost: 20, costPerUnit: '₹60/200ml', priceRange: '₹15-25 ke beech milega',
      availability: 'supermarket', availabilityNote: 'Big Bazaar, DMart ya dairy shop mein milega',
      freshnessCheck: 'White hona chahiye, khatta smell nahi — expiry date zaroor dekho',
      brandTip: 'Amul Fresh Cream sabse widely available aur reliable hai',
      substitute: 'Malai (milk cream) ya cashew paste (1/4 cup cashew + pani blend karo vegan ke liye)',
      substituteReason: 'Malai utna hi creamy texture deta hai, thoda desi flavour aata hai',
      note: 'Gas band karne ke baad daalo — boiling se cream fat separate ho jaati hai aur dish grainy ho jaata hai',
      storage: 'Fridge mein 1 hafte tak. Ek baar khuley toh 3 din mein use karo.',
      healthNote: 'High calories — weight loss pe ho toh amount half karo ya skip karo',
      commonMistake: 'Cream ko boil mat karo — yahi sabse badi galti hai jo dish ka texture kharab karti hai',
      isOptional: false,
    },
    {
      id: 'bc-8', category: 'spice',
      name: 'Kasuri Methi', nameHindi: 'कसूरी मेथी',
      shopName: 'Kasuri methi ya sookhi methi maango',
      visualDescription: 'Small green-brown dried leaves — aromatic smell aata hai',
      amount: 1, unit: 'tbsp', visualMeasure: '1 badi chamach (haath mein malke daalo)',
      prepState: 'Haaton ke beech malke add karo — yahi fragrance release karta hai',
      whenToAdd: 'Bilkul end mein — cream ke baad, gas band karne se 1 min pehle',
      cost: 3, costPerUnit: '₹20/25g', priceRange: '₹2-5 ke beech milega',
      availability: 'kirana', availabilityNote: 'Kisi bhi masale ki dukaan mein ₹10-20 ka packet milta hai',
      freshnessCheck: 'Green-brown hona chahiye, strong aromatic smell aana chahiye',
      brandTip: 'MDH Kasuri Methi ya koi bhi local brand sab theek hai',
      substitute: 'Skip kar sakte ho — flavour miss hoga par dish phir bhi achhi banegi',
      substituteReason: 'Yeh mainly aroma ke liye hai — optional hai technically',
      note: 'Haaton mein ache se malo — friction se essential oils release hote hain jo dish ka flavour 3x kar dete hain',
      storage: 'Airtight jar mein rakho, 6 mahine tak fresh rehta hai',
      healthNote: 'Digestive properties hain — stomach gas ke liye achha',
      commonMistake: 'Bina malke directly mat daalo — aroma half ho jaata hai',
      isOptional: true,
    },
    {
      id: 'bc-9', category: 'spice',
      name: 'Garam Masala', nameHindi: 'गरम मसाला',
      shopName: 'Garam masala — MDH, Everest ya koi bhi brand',
      amount: 1, unit: 'tsp', visualMeasure: '1 choti chamach',
      prepState: 'Waise hi use karo',
      whenToAdd: 'Step 4 — bilkul end mein daalo',
      cost: 4, costPerUnit: '₹60/50g', priceRange: '₹3-6 ke beech milega',
      availability: 'kirana',
      freshnessCheck: 'Strong spicy-sweet smell aana chahiye. Bland smell aaye toh purana hai.',
      brandTip: 'MDH Garam Masala sabse consistent flavour deta hai',
      substitute: 'Pinch of cinnamon + cardamom + clove powder mix karo',
      note: 'End mein daalo — agar pehle daalo toh aroma ud jaata hai cooking mein',
      storage: 'Airtight jar mein 6 mahine',
      healthNote: 'Warming spices — metabolism boost karte hain. Winter mein extra beneficial.',
      commonMistake: 'Zyada mat daalo — 1 tsp se zyada dish bitter ho jaati hai',
      isOptional: false,
    },
    {
      id: 'bc-10', category: 'oil',
      name: 'Cooking Oil / Ghee', nameHindi: 'तेल / घी',
      shopName: 'Koi bhi refined oil ya ghee',
      amount: 2, unit: 'tbsp', visualMeasure: '2 bade chamach',
      prepState: 'Waise hi use karo',
      whenToAdd: 'Step 2 mein — butter ke saath mix karo',
      cost: 8, costPerUnit: '₹120/L', priceRange: '₹5-12 ke beech milega',
      availability: 'kirana',
      substitute: 'Pure ghee for richer flavour',
      note: 'Oil + butter mix karne se butter burn nahi hota — yeh pro tip hai',
      storage: 'Room temperature pe rakho',
      healthNote: 'Ghee better choice hai — good fats hote hain aur high smoke point',
      commonMistake: 'Oil ko zyada garam mat karo — smoke aane lage toh flame low karo',
      isOptional: false,
    },
  ],

  // ============================================
  // 2. DAL MAKHANI
  // ============================================
  'dal-makhani': [
    {
      id: 'dm-1', category: 'grain',
      name: 'Whole Black Urad Dal', nameHindi: 'साबुत काली उड़द दाल',
      shopName: 'Saabut kali urad dal maango — na dhuli na split',
      visualDescription: 'Small black colored seeds — inside white hote hain',
      amount: 200, unit: 'g', visualMeasure: '1 cup ke barabar',
      prepState: 'Raat bhar pani mein bhigo do — 8 hours minimum',
      whenToAdd: 'Ek dum pehle — pressure cooker mein pakao',
      cost: 30, costPerUnit: '₹120/kg', priceRange: '₹22-35 ke beech milega',
      availability: 'kirana',
      freshnessCheck: 'Shiny black hona chahiye, matte nahi. Chhune pe fresh smell aaye.',
      brandTip: 'Local kirana se loose lena better hai — packet wale se taza milta hai often',
      substitute: 'Rajma dal alone bhi chalega — flavour thoda alag hoga',
      note: 'Jitna zyada bhigoge utna jaldi aur achha pakegi. Minimum 8 ghante zaroori hain.',
      storage: 'Airtight dabba mein 6 mahine tak. Bhigo di ho toh 24 ghante fridge mein.',
      healthNote: 'High protein aur fiber. Iron se bhara — anemia patients ke liye excellent.',
      commonMistake: 'Bhigaye bina direct pressure cook karne se dal tight aur uncooked rehti hai',
      isOptional: false,
    },
    {
      id: 'dm-2', category: 'grain',
      name: 'Rajma (Red Kidney Beans)', nameHindi: 'राजमा',
      shopName: 'Chota rajma maango — bada wala nahi',
      amount: 50, unit: 'g', visualMeasure: '4 bade chamach',
      prepState: 'Urad dal ke saath hi bhi gao — raat bhar',
      whenToAdd: 'Urad dal ke saath pressure cook karo',
      cost: 10, costPerUnit: '₹100/kg',
      availability: 'kirana',
      freshnessCheck: 'Dark red, plump hona chahiye — wrinkled ya faded nahi',
      substitute: 'Skip kar sakte ho — pure urad se bhi banta hai',
      note: 'Rajma 20% proportion mein — zyada dalo toh flavour change ho jaata hai',
      storage: 'Dry store 6 mahine. Bhigo di toh fridge mein 24 ghante.',
      healthNote: 'Plant protein ka best source. Cholesterol-free.',
      commonMistake: 'Bhigoye bina use karna — kabhi bhi achhi nahi pakti',
      isOptional: false,
    },
    {
      id: 'dm-3', category: 'dairy',
      name: 'Butter', nameHindi: 'मक्खन',
      amount: 60, unit: 'g', visualMeasure: '4 bade chamach',
      prepState: 'Waise hi use karo',
      whenToAdd: 'Step 1 mein tadka ke liye aur bilkul end mein ek chamach aur daalo',
      cost: 35, costPerUnit: '₹55/100g',
      availability: 'kirana',
      brandTip: 'Amul butter — salted best hai is recipe ke liye',
      substitute: 'Ghee 3 tbsp',
      note: 'End mein ek bada chamach butter aur daalna — yahi Dal Makhani ki richness ka raaz hai',
      storage: 'Fridge mein 3 hafte',
      healthNote: 'Saturated fat — limited use karein',
      commonMistake: 'Sirf cooking mein use karna — end mein finishing butter bhool jaana biggest mistake hai',
      isOptional: false,
    },
    {
      id: 'dm-4', category: 'vegetable',
      name: 'Onion (Pyaaz)', nameHindi: 'प्याज',
      amount: 2, unit: 'pcs', visualMeasure: '2 medium sized onions',
      prepState: 'Barik slice karo — ya finely chop karo',
      whenToAdd: 'Step 2 mein — butter mein saunten karo',
      cost: 10, costPerUnit: '₹30/kg',
      availability: 'kirana',
      freshnessCheck: 'Firm, dry outer skin. Soft ya sprouted mat lo.',
      substitute: 'Shallots (छोटे प्याज) use kar sakte ho — thoda meetha flavour aata hai',
      note: 'Golden brown hone tak bhunao — light brown se stop mat karo — yahi base hai',
      storage: 'Pantry mein cool dry place pe 2 hafte',
      healthNote: 'Prebiotics hote hain — gut health ke liye excellent',
      commonMistake: 'Raw pyaaz jaisi smell aaye toh aur pakao — properly caramelized hone do',
      isOptional: false,
    },
    {
      id: 'dm-5', category: 'vegetable',
      name: 'Tomato Puree', nameHindi: 'टमाटर प्यूरी',
      amount: 150, unit: 'ml', visualMeasure: 'Ek badi katori se thoda kam',
      prepState: 'Packet se seedha use karo',
      whenToAdd: 'Step 3 mein — pyaaz ke baad',
      cost: 15, costPerUnit: '₹35/200ml',
      availability: 'kirana',
      substitute: '3-4 fresh tamaatar blend karke strain karo',
      note: 'Oil separate hone tak pakao — minimum 8-10 min',
      storage: 'Khuley packet ko fridge mein 3 din',
      commonMistake: 'Jaldi mein kachcha chhod dena — raw tomato taste aata hai',
      isOptional: false,
    },
    {
      id: 'dm-6', category: 'dairy',
      name: 'Heavy Cream', nameHindi: 'फ्रेश क्रीम',
      amount: 60, unit: 'ml', visualMeasure: '4 bade chamach',
      prepState: 'Fridge se nikaal ke 15 min room temp pe rakhna',
      whenToAdd: 'Bilkul end mein — gas band karne se pehle',
      cost: 22, costPerUnit: '₹60/200ml',
      availability: 'supermarket',
      brandTip: 'Amul Fresh Cream',
      substitute: 'Malai ya cashew cream (vegan)',
      note: 'Boiling ke baad mat daalo — texture kharab ho jaata hai',
      storage: 'Fridge mein 1 hafte',
      commonMistake: 'Boil karna cream ko — kabhi mat karo',
      isOptional: false,
    },
    {
      id: 'dm-7', category: 'spice',
      name: 'Ginger-Garlic Paste', nameHindi: 'अदरक-लहसुन पेस्ट',
      amount: 1, unit: 'tbsp',
      prepState: 'Waise hi use karo',
      whenToAdd: 'Step 2 mein — pyaaz ke baad',
      cost: 5, costPerUnit: '₹40/200g',
      availability: 'kirana',
      substitute: 'Fresh grated ginger + garlic',
      note: 'Raw smell jaane tak bhunao — 2 min',
      commonMistake: 'Kachcha chhod dena — raw taste aata hai',
      isOptional: false,
    },
    {
      id: 'dm-8', category: 'spice',
      name: 'Kasuri Methi', nameHindi: 'कसूरी मेथी',
      amount: 1, unit: 'tsp',
      prepState: 'Haath mein malke daalo',
      whenToAdd: 'Bilkul end mein',
      cost: 2, availability: 'kirana',
      substitute: 'Skip kar sakte ho',
      note: 'Dal Makhani ka signature finishing touch',
      isOptional: true,
    },
  ],

  // ============================================
  // 3. PANEER TIKKA
  // ============================================
  'paneer-tikka': [
    {
      id: 'pt-1', category: 'protein',
      name: 'Fresh Paneer', nameHindi: 'ताज़ा पनीर',
      shopName: 'Ek piece paneer maango — soft hona chahiye',
      visualDescription: 'White, smooth block — press karo toh thoda bounce back kare',
      amount: 250, unit: 'g', visualMeasure: 'Ek medium packet ke barabar',
      prepState: '1.5 inch ke cubes mein kaato — na zyada chote na bade',
      whenToAdd: 'Marinade mein cover karo, phir tawa ya oven mein pakao',
      cost: 60, costPerUnit: '₹250/kg', priceRange: '₹50-75 ke beech milega',
      availability: 'kirana',
      freshnessCheck: 'White hona chahiye, yellow nahi. Soft feel ho, crumbly nahi.',
      brandTip: 'Amul ya Mother Dairy. Ghar ka banaya sabse fresh hota hai.',
      substitute: 'Tofu (vegan ke liye) ya thick mushrooms',
      note: 'Room temp pe lo pehle nahi toh marinade properly coat nahi karega',
      storage: 'Fridge mein 3-4 din. Pani mein duba ke rakho freshness ke liye.',
      healthNote: 'High protein aur calcium. Vegetarians ke liye best protein source.',
      commonMistake: 'Cold paneer directly tawa pe daalna — andar se hard reh jaata hai',
      isOptional: false,
    },
    {
      id: 'pt-2', category: 'dairy',
      name: 'Thick Hung Curd', nameHindi: 'गाढ़ी दही (हंग कर्ड)',
      shopName: 'Dahi — ghar pe muslin mein 1 ghante ke liye strain karo',
      amount: 100, unit: 'g', visualMeasure: 'Ek chamach se thada zyada — thick paste jaise',
      prepState: 'Normal dahi ko muslin kapde mein 1 ghanta rack pe rakhdo — pani nikal jaayega',
      whenToAdd: 'Marinade banate waqt sabse pehle',
      cost: 15, costPerUnit: '₹40/250g',
      availability: 'kirana',
      substitute: 'Greek yogurt directly use kar sakte ho — already thick hota hai',
      note: 'Hung curd bahut zaroori hai — pani wala dahi se tikka soft nahi hota',
      storage: 'Fridge mein 2 din after straining',
      commonMistake: 'Normal runny dahi use karna — marinade toot jaata hai cooking mein',
      isOptional: false,
    },
    {
      id: 'pt-3', category: 'spice',
      name: 'Kashmiri Red Chilli Powder', nameHindi: 'कश्मीरी लाल मिर्च',
      amount: 1, unit: 'tbsp', cost: 5, availability: 'kirana',
      prepState: 'Waise hi mix karo marinade mein',
      whenToAdd: 'Marinade mein',
      substitute: 'Normal mirch (half quantity) + paprika',
      note: 'Beautiful red color ke liye — zyada tikh nahi hoti',
      commonMistake: 'Normal red chilli use karna — dish bahut spicy ho jaati hai',
      isOptional: false,
    },
    {
      id: 'pt-4', category: 'spice',
      name: 'Chaat Masala', nameHindi: 'चाट मसाला',
      amount: 1, unit: 'tsp', cost: 3, availability: 'kirana',
      whenToAdd: 'Bilkul end mein — serve karte waqt upar se sprinkle karo',
      note: 'Serving se pehle daalo — yahi khatta punchy flavour deta hai',
      isOptional: false,
    },
    {
      id: 'pt-5', category: 'vegetable',
      name: 'Bell Pepper & Onion (Capsicum-Pyaaz)', nameHindi: 'शिमला मिर्च और प्याज',
      shopName: 'Shimla mirch aur pyaaz',
      amount: 2, unit: 'pcs each', visualMeasure: '1-1 medium size',
      prepState: 'Square pieces mein kaato — paneer ke barabar size',
      whenToAdd: 'Paneer ke saath skewer mein alternate karke lagao',
      cost: 20, costPerUnit: '₹40/kg',
      availability: 'kirana',
      substitute: 'Zucchini ya tomato bhi use kar sakte ho',
      note: 'Alag alag color ki shimla mirch use karo — dish colourful aur photogenic lagti hai',
      commonMistake: 'Zyada pakana — thoda crunch rehna chahiye',
      isOptional: false,
    },
    {
      id: 'pt-6', category: 'oil',
      name: 'Mustard Oil', nameHindi: 'सरसों का तेल',
      shopName: 'Sarson tel maango',
      amount: 1, unit: 'tbsp', cost: 5,
      availability: 'kirana',
      note: 'Marinade mein daalne se authentic tandoori flavour aata hai',
      substitute: 'Any neutral oil but flavour alag hoga',
      healthNote: 'Good for heart in moderation',
      commonMistake: 'Skip karna — yahi authentic flavour ka raaz hai',
      isOptional: true,
    },
  ],

  // ============================================
  // 4. ALOO PARATHA
  // ============================================
  'aloo-paratha': [
    {
      id: 'ap-1', category: 'grain',
      name: 'Whole Wheat Flour (Atta)', nameHindi: 'गेहूं का आटा',
      shopName: 'Gehun ka atta — chakki fresh hoga toh best',
      visualDescription: 'Light brown powder — maida (white) se alag hota hai',
      amount: 250, unit: 'g', visualMeasure: 'Ek bowl ke barabar (2 cups)',
      prepState: 'Ek pinch namak mix karo. Thoda thoda pani dal ke soft dough goondho. 20 min rest dena.',
      whenToAdd: 'Sabse pehle — dough banana',
      cost: 12, costPerUnit: '₹35/kg',
      availability: 'kirana',
      freshnessCheck: 'Fresh smell aana chahiye. Khatta ya musty smell aaye toh purana hai.',
      brandTip: 'Aashirvaad ya Pillsbury whole wheat. Chakki fresh atta aur bhi better.',
      substitute: 'Multigrain atta (healthier version)',
      note: 'Dough bahut soft hona chahiye — earlobes jitna soft. Tight dough se paratha hard banega.',
      storage: 'Airtight dabba mein 1 mahine. Dough bana lo toh 24 ghante fridge mein.',
      healthNote: 'Whole wheat mein fiber zyada — maida se much healthier',
      commonMistake: 'Tight dough banana — soft goondho, rest do, phir roll karo',
      isOptional: false,
    },
    {
      id: 'ap-2', category: 'vegetable',
      name: 'Boiled Potatoes (Aloo)', nameHindi: 'उबले हुए आलू',
      shopName: 'Gol aloo (round potatoes) maango',
      visualDescription: 'Yellow inside wala round aloo — chips wala nahi',
      amount: 300, unit: 'g', visualMeasure: '3-4 medium size aloo',
      prepState: 'Pehle pressure cook karo (2 seeti). Thand ho toh chheelke aur ache se mash karo — koi bhi lump nahi rehna chahiye',
      whenToAdd: 'Stuffing ke liye — mash karke masala mix karo',
      cost: 15, costPerUnit: '₹25/kg',
      availability: 'kirana',
      freshnessCheck: 'Firm aur blemish-free hona chahiye — sprouts ya green patches wale mat lo',
      substitute: 'Mooli (radish) stuffing bhi bana sakte ho',
      note: 'Ek bhi lump raha toh rolling karte waqt paratha phat jaata hai — perfectly smooth mash zaroori',
      storage: 'Boiled aloo 2 din fridge mein. Raw aloo cool dry place pe 2 hafte.',
      healthNote: 'Potassium rich — muscle cramps ke liye achha. Energy dense.',
      commonMistake: 'Lampy mash use karna — ek bhi lump se paratha roll karte waqt phat jaata hai',
      isOptional: false,
    },
    {
      id: 'ap-3', category: 'spice',
      name: 'Green Chilli (Hari Mirch)', nameHindi: 'हरी मिर्च',
      amount: 2, unit: 'pcs', cost: 2, availability: 'kirana',
      prepState: 'Barik barik kaato — ya grind kar lo paste mein',
      whenToAdd: 'Aloo stuffing mein mix karo',
      visualMeasure: '2 choti hari mirchein',
      substitute: 'Skip karo agar tikh nahi pasand — ya lal mirch dum dal do',
      note: 'Seeds seedless karo agar kam tikh chahiye',
      healthNote: 'Vitamin C se bhara',
      isOptional: true,
    },
    {
      id: 'ap-4', category: 'spice',
      name: 'Garam Masala + Amchur + Jeera', nameHindi: 'गरम मसाला, अमचूर, जीरा',
      shopName: 'Masale ki dukaan se teeno alag lena',
      amount: 1, unit: 'tsp each',
      prepState: 'Waise hi mix karo stuffing mein',
      whenToAdd: 'Aloo stuffing mein',
      cost: 8, availability: 'kirana',
      note: 'Amchur (dry mango powder) — yahi paratha ka khatta punch deta hai',
      substitute: 'Amchur nahi hai toh thoda nimbu ras dal do',
      isOptional: false,
    },
    {
      id: 'ap-5', category: 'dairy',
      name: 'Ghee or Butter', nameHindi: 'घी या मक्खन',
      amount: 3, unit: 'tbsp', visualMeasure: '3 bade chamach',
      whenToAdd: 'Tawa pe daalne ke liye aur end mein upar se lagane ke liye',
      cost: 20, availability: 'kirana',
      brandTip: 'Amul ghee ya ghar ka banaya desi ghee',
      substitute: 'Oil use kar sakte ho healthier version ke liye',
      note: 'Generous amount use karo — issi se paratha crispy aur golden hota hai',
      healthNote: 'Ghee mein good fats hain — in moderation healthy',
      commonMistake: 'Kam ghee lagana — then paratha soggy aur chewy hota hai',
      isOptional: false,
    },
    {
      id: 'ap-6', category: 'other',
      name: 'Fresh Coriander (Dhaniya)', nameHindi: 'हरा धनिया',
      amount: 2, unit: 'tbsp', cost: 3, availability: 'kirana',
      prepState: 'Barik barik kaato',
      whenToAdd: 'Aloo stuffing mein',
      freshnessCheck: 'Bright green, fresh smell — yellow nahi hona chahiye',
      substitute: 'Mint (pudina) bhi achha lagta hai',
      note: 'Freshness ke liye stems ke saath use karo',
      isOptional: true,
    },
  ],

  // ============================================
  // 5. CHOLE BHATURE
  // ============================================
  'chole-bhature': [
    {
      id: 'cb-1', category: 'grain',
      name: 'Kabuli Chana (White Chickpeas)', nameHindi: 'काबुली चना',
      shopName: 'Kabuli chana — bada wala safed wala',
      amount: 250, unit: 'g', visualMeasure: '1.5 cups dry',
      prepState: 'Raat bhar 8-10 ghante pani mein bhigo do. Next day pressure cook karo 4-5 seeti.',
      whenToAdd: 'Gravy mein sabse pehle — paka hua hona chahiye',
      cost: 35, costPerUnit: '₹100/kg',
      availability: 'kirana',
      freshnessCheck: 'Cream/beige color, plump. Dark ya wrinkled ho toh purana hai.',
      substitute: 'Canned chickpeas use kar sakte ho directly (wash karke) — time bachega',
      note: 'Properly cooked hona chahiye — press karo toh easily crush ho jaaye',
      storage: 'Paka hua 3 din fridge mein. Dry 6 mahine.',
      healthNote: 'Excellent protein aur fiber. Blood sugar control karta hai.',
      commonMistake: 'Bhigoye bina cook karna — kabhi properly nahi pakte',
      isOptional: false,
    },
    {
      id: 'cb-2', category: 'spice',
      name: 'Chole Masala (Special)', nameHindi: 'छोले मसाला',
      shopName: 'MDH Chole Masala ya Everest Chole Masala maango',
      amount: 2, unit: 'tbsp', cost: 8, availability: 'kirana',
      note: 'Regular garam masala se alag — chole wala specifically lena',
      substitute: 'Ghar pe bana sakte ho: amchur + anardana + jeera + dhania + mirch',
      brandTip: 'MDH Chole Masala — most authentic result',
      isOptional: false,
    },
    {
      id: 'cb-3', category: 'spice',
      name: 'Dry Pomegranate Seeds (Anardana)', nameHindi: 'अनारदाना',
      shopName: 'Anardana — masale ki dukaan pe milega',
      amount: 1, unit: 'tbsp', cost: 5,
      availability: 'kirana',
      visualDescription: 'Dark purple-red dried seeds — khatte hote hain',
      note: 'Yahi Chole ka signature tartness deta hai — must have ingredient',
      substitute: 'Amchur powder 1 tsp',
      isOptional: false,
    },
    {
      id: 'cb-4', category: 'grain',
      name: 'Maida (All Purpose Flour) for Bhature', nameHindi: 'मैदा (भटूरे के लिए)',
      amount: 250, unit: 'g', cost: 10,
      prepState: 'Curd + baking soda + salt mix karo, soft dough banaao. 2 ghante rest do.',
      whenToAdd: 'Bhature ke liye dough banana',
      availability: 'kirana',
      note: 'Dough rest karna zaroori — soft puffy bhature ke liye fermentation honi chahiye',
      storage: 'Dough 24 ghante fridge mein reh sakta hai',
      commonMistake: 'Dough ko rest na dena — phir bhature flat aur hard ban jaate hain',
      isOptional: false,
    },
    {
      id: 'cb-5', category: 'oil',
      name: 'Oil for Deep Frying', nameHindi: 'तलने का तेल',
      amount: 500, unit: 'ml',
      prepState: 'Deep kadai mein bharo — medium-high flame pe garam karo',
      whenToAdd: 'Bhature fry karne ke liye',
      cost: 40, availability: 'kirana',
      note: 'Oil 170-180°C hona chahiye — ek chota piece dough daalo, turat upar aaye toh ready',
      commonMistake: 'Thanda ya bahut garam oil — thande mein bhatura oil absorb karta hai, zyada garam mein outer layer jal jaati hai',
      isOptional: false,
    },
  ],

};

// Map catalog dish IDs for the top 5 detailed static recipes
DISH_INGREDIENTS['dish_1'] = DISH_INGREDIENTS['butter-chicken'];
DISH_INGREDIENTS['dish_2'] = DISH_INGREDIENTS['dal-makhani'];
DISH_INGREDIENTS['dish_3'] = DISH_INGREDIENTS['paneer-tikka'];
DISH_INGREDIENTS['dish_4'] = DISH_INGREDIENTS['chole-bhature'];
DISH_INGREDIENTS['dish_5'] = DISH_INGREDIENTS['aloo-paratha'];

export type ValidIngredientCategory =
  | 'protein'
  | 'grain'
  | 'vegetable'
  | 'dairy'
  | 'oil'
  | 'spice'
  | 'other';

export function normalizeIngredientCategory(
  rawCat?: string,
  nameHint = ''
): ValidIngredientCategory {
  const c = (rawCat || '').toLowerCase().trim();
  const n = (nameHint || '').toLowerCase();

  if (
    c === 'protein' ||
    c.includes('meat') ||
    c.includes('chicken') ||
    c.includes('mutton') ||
    c.includes('fish') ||
    c.includes('egg') ||
    c.includes('paneer') ||
    c.includes('lentil') ||
    c.includes('dal') ||
    c.includes('pulse') ||
    /chicken|mutton|fish|prawn|egg|paneer|tofu|soya|rajma|chole|chana|dal|lentil|keema/i.test(n)
  ) {
    return 'protein';
  }
  if (
    c === 'grain' ||
    c.includes('flour') ||
    c.includes('rice') ||
    c.includes('bread') ||
    c.includes('carb') ||
    c.includes('noodle') ||
    c.includes('pasta') ||
    /rice|chawal|atta|maida|besan|sooji|rava|poha|sabudana|noodle|pasta|bread|pav|bhatura|roti|dosa|idli|oats|cornflour/i.test(n)
  ) {
    return 'grain';
  }
  if (
    c === 'dairy' ||
    c.includes('milk') ||
    c.includes('cheese') ||
    c.includes('curd') ||
    c.includes('cream') ||
    /milk|doodh|curd|dahi|cream|malai|cheese|mozzarella|khoya|mawa|yogurt|lassi|rabri|chenna/i.test(n)
  ) {
    return 'dairy';
  }
  if (
    c === 'oil' ||
    c.includes('fat') ||
    c.includes('butter') ||
    c.includes('ghee') ||
    /oil|tel|ghee|butter|makkhan|olive/i.test(n)
  ) {
    return 'oil';
  }
  if (
    c === 'vegetable' ||
    c.includes('veg') ||
    c.includes('produce') ||
    c.includes('herb') ||
    c.includes('fruit') ||
    /onion|pyaaz|tomato|tamatar|potato|aloo|palak|spinach|gobi|cauliflower|bhindi|baingan|matar|pea|capsicum|shimla|carrot|gajar|cabbage|garlic|lehsun|ginger|adrak|coriander|dhaniya|mint|pudina|lemon|nimbu|mango|banana|avocado|mushroom|corn|cucumber/i.test(n)
  ) {
    return 'vegetable';
  }
  if (
    c === 'spice' ||
    c.includes('masala') ||
    c.includes('seasoning') ||
    c.includes('condiment') ||
    c.includes('sauce') ||
    /masala|haldi|turmeric|mirch|chilli|jeera|cumin|hing|cardamom|elaichi|saffron|kesar|salt|namak|pepper|kali mirch|clove|cinnamon|amchur|anardana|kasuri|soy sauce|vinegar|ketchup|chutney|mustard|rai|oregano/i.test(n)
  ) {
    return 'spice';
  }
  return 'other';
}

export function parseNumericAmount(val: unknown, fallback = 1): number {
  if (typeof val === 'number' && Number.isFinite(val) && val > 0) return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.includes('/')) {
      const [num, den] = trimmed.split('/').map((s) => parseFloat(s));
      if (Number.isFinite(num) && Number.isFinite(den) && den > 0) {
        return Math.round((num / den) * 100) / 100;
      }
    }
    const match = trimmed.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      const parsed = parseFloat(match[1]);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
  }
  return fallback;
}

export function normalizeIngredientList(
  rawList: any[],
  dishName = 'Dish',
  servings = 2
): Ingredient[] {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return getSmartDishIngredients(dishName, servings);
  }

  return rawList
    .filter(Boolean)
    .map((item: any, idx: number) => {
      if (typeof item === 'string') {
        const cleanName = item.replace(/^[^\w\u0900-\u097F]+/, '').trim() || `Ingredient ${idx + 1}`;
        return {
          id: `ing-${idx + 1}`,
          name: cleanName,
          nameHindi: cleanName,
          amount: 1,
          unit: 'cup',
          visualMeasure: '1 katori / jaroorat anusaar',
          prepState: 'Saaf karke ready rakho',
          whenToAdd: 'Cooking step ke anusaar',
          cost: 15,
          availability: 'kirana',
          category: normalizeIngredientCategory(undefined, cleanName),
          isOptional: false,
          note: `${dishName} ke authentic swad ke liye fresh use karein`,
        } as Ingredient;
      }

      const name = (item.name || item.nameHindi || `Ingredient ${idx + 1}`).trim();
      const nameHindi = (item.nameHindi || item.name || name).trim();
      const amount = parseNumericAmount(item.amount, 1);

      let unit = typeof item.unit === 'string' && item.unit.trim() ? item.unit.trim() : '';
      if (!unit && typeof item.amount === 'string') {
        const unitMatch = item.amount.replace(/[\d./\s]+/g, '').trim();
        unit = unitMatch || 'pcs';
      }
      if (!unit) unit = amount >= 50 ? 'g' : 'tbsp';

      const category = normalizeIngredientCategory(item.category, `${name} ${nameHindi}`);
      const availability: 'kirana' | 'supermarket' | 'online' =
        item.availability === 'supermarket' || item.availability === 'online'
          ? item.availability
          : 'kirana';
      const cost = parseNumericAmount(item.cost ?? item.estimatedCost, 15);

      return {
        ...item,
        id: item.id ? String(item.id) : `ing-${idx + 1}-${name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8)}`,
        name,
        nameHindi,
        shopName: item.shopName || `${nameHindi} (${name})`,
        amount,
        unit,
        visualMeasure: item.visualMeasure || `${amount} ${unit}`,
        prepState: item.prepState || 'Saaf karke naap ke rakh lo',
        whenToAdd: item.whenToAdd || 'Step instruction ke hisaab se add karo',
        cost,
        availability,
        category,
        isOptional: Boolean(item.isOptional ?? item.optional ?? false),
        substitute: item.substitute || undefined,
        note: item.note || `${dishName} mein isse badhiya flavour aata hai`,
      } as Ingredient;
    });
}

/**
 * Generates accurate, dish-specific ingredients for ANY Indian or Global dish
 * (Desserts, Beverages, South Indian, Biryani, Paratha, Street Chaat, Indo-Chinese, Continental, Dal, Paneer, Non-Veg, Sabzi).
 */
export function getSmartDishIngredients(dishName: string, servings = 2): Ingredient[] {
  const clean = (dishName || 'Special Dish').trim();
  const lower = clean.toLowerCase();
  const scale = Math.max(0.5, servings / 2);
  const s = (n: number) => Math.round(n * scale * 10) / 10;
  const c = (n: number) => Math.max(2, Math.round(n * scale));

  // Check static slug match first
  const slug = lower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (DISH_INGREDIENTS[slug]) return DISH_INGREDIENTS[slug];
  for (const [key, list] of Object.entries(DISH_INGREDIENTS)) {
    if (lower.includes(key.replace(/-/g, ' '))) return list;
  }

  // 1. TEA / CHAI / COFFEE / LASSI / SHAKES / BEVERAGES
  if (/chai|tea|coffee|lassi|shake|smoothie|thandai|sharbat|chaas|buttermilk|nimbu pani|mojito|hot chocolate|badam milk|haldi doodh/i.test(lower)) {
    const isCoffee = /coffee|cappuccino|latte|mocha/i.test(lower);
    const isLassi = /lassi|chaas|buttermilk/i.test(lower);
    const isMango = /mango|aam/i.test(lower);

    if (isLassi) {
      return [
        { id: 'bev-1', category: 'dairy', name: 'Thick Fresh Curd (Dahi)', nameHindi: 'गाढ़ा ताज़ा दही', shopName: 'Mota meetha dahi', amount: s(300), unit: 'g', visualMeasure: '1.5 bada bowl', prepState: 'Chilled dahi ko mathani ya whisk se smooth phent lo', whenToAdd: 'Sabse pehle', cost: c(30), availability: 'kirana', note: 'Dahi bilkul taza hona chahiye, khatta nahi', isOptional: false },
        ...(isMango ? [{ id: 'bev-2', category: 'vegetable' as const, name: 'Ripe Alphonso Mango Pulp', nameHindi: 'पके आम का पल्प', shopName: 'Meetha Aam (Alphonso/Safeda)', amount: s(150), unit: 'g', visualMeasure: '1 bada aam', prepState: 'Chheel kar cubes kaat lo', whenToAdd: 'Dahi ke sath blender mein', cost: c(35), availability: 'kirana' as const, note: 'Reshe (fibers) bina wala meetha aam best rehta hai', isOptional: false }] : []),
        { id: 'bev-3', category: 'other', name: 'Sugar or Honey (Cheeni)', nameHindi: 'चीनी या शहद', shopName: 'Cheeni', amount: s(3), unit: 'tbsp', visualMeasure: '3 bade chammach', prepState: 'Seedha blender mein daalo', whenToAdd: 'Dahi phent-te waqt', cost: c(5), availability: 'kirana', note: 'Swad anusaar meetha kam-zyada kar sakte hain', isOptional: false },
        { id: 'bev-4', category: 'spice', name: 'Green Cardamom Powder (Elaichi)', nameHindi: 'हरी इलायची पाउडर', shopName: 'Hari Elaichi', amount: s(0.5), unit: 'tsp', visualMeasure: '2-3 elaichi koot kar', prepState: 'Taza koot kar chhilka hata do', whenToAdd: 'Blend karne ke baad', cost: c(5), availability: 'kirana', note: 'Taza kuti elaichi se punjabi lassi wali asli khushboo aati hai', isOptional: false },
        { id: 'bev-5', category: 'other', name: 'Chopped Pistachios, Almonds & Malai', nameHindi: 'पिस्ता, बादाम और मलाई', shopName: 'Kaju Badam Pista', amount: s(2), unit: 'tbsp', visualMeasure: '1 muthi barik kate dry fruits', prepState: 'Patle slivers mein kaat lo', whenToAdd: 'Glass mein serve karte waqt upar se', cost: c(20), availability: 'kirana', note: 'Upar se 1 chammach malai daalne se Amritsari Lassi banti hai', isOptional: true },
      ];
    }

    return [
      { id: 'chai-1', category: 'dairy', name: 'Full Cream Milk (Doodh)', nameHindi: 'फुल क्रीम दूध', shopName: 'Amul Gold / Mother Dairy Full Cream', amount: s(300), unit: 'ml', visualMeasure: '1.5 cup doodh', prepState: 'Seedha saucepan mein ubaalo', whenToAdd: 'Pani aur adrak ubalne ke baad', cost: c(22), availability: 'kirana', note: 'Full cream doodh se tapri jaisi gaadhi aur malai-daar chai/coffee banti hai', isOptional: false },
      { id: 'chai-2', category: 'other', name: isCoffee ? 'Instant Filter Coffee Powder' : 'Assam CTC Tea Leaves (Chai Patti)', nameHindi: isCoffee ? 'कॉफ़ी पाउडर' : 'असम चाय पत्ती', shopName: isCoffee ? 'Bru / Nescafe Coffee' : 'Kadak Chai Patti', amount: s(2), unit: 'tsp', visualMeasure: '2 chhote chammach', prepState: isCoffee ? '1 tbsp garam pani aur cheeni ke sath 3 min froth hone tak beat karo' : 'Ubalte pani mein daalo', whenToAdd: isCoffee ? 'Cup ke base mein' : 'Adrak-elaichi ubalne ke baad', cost: c(10), availability: 'kirana', note: isCoffee ? 'Jitna achha beat karoge utni frothy cafe-style coffee banegi' : 'Patti daalne ke baad 2-3 ubaal zaroor lagao', isOptional: false },
      { id: 'chai-3', category: 'spice', name: isCoffee ? 'Cocoa Powder / Cinnamon Dust' : 'Fresh Ginger (Adrak) & Green Cardamom (Elaichi)', nameHindi: isCoffee ? 'कोको पाउडर / दालचीनी' : 'ताज़ा अदरक और हरी इलायची', shopName: isCoffee ? 'Cocoa Powder' : 'Adrak aur Hari Elaichi', amount: s(1), unit: 'tbsp', visualMeasure: isCoffee ? '1 chutki' : '1 inch adrak + 2 elaichi', prepState: isCoffee ? 'Upar se sprinkle karo' : 'Imamdaste mein achhe se koot lo (grate mat karo)', whenToAdd: isCoffee ? 'Garnish ke waqt' : 'Sabse pehle ubalte pani mein', cost: c(6), availability: 'kirana', note: 'Adrak ko koot kar dalne se ras poora nikalta hai aur doodh phat-ta nahi', isOptional: false },
      { id: 'chai-4', category: 'other', name: 'Sugar / Gud (Jaggery)', nameHindi: 'चीनी या गुड़', shopName: 'Cheeni', amount: s(2), unit: 'tsp', visualMeasure: 'Swad anusaar (1 chammach per cup)', prepState: 'Seedha add karo', whenToAdd: 'Ubaal aane par', cost: c(4), availability: 'kirana', note: 'Gud (jaggery) use kar rahe ho toh gas band karne ke baad milao', isOptional: false },
    ];
  }

  // 2. INDIAN SWEETS / MITHAI / HALWA / KHEER / DESSERTS / CAKES
  if (/gulab jamun|rasgulla|rasmalai|jalebi|halwa|kheer|payasam|barfi|laddu|ladoo|peda|mysore pak|shrikhand|rabri|malpua|ghevar|modak|sandesh|cake|brownie|pastry|tiramisu|ice cream|kulfi|pudding|mousse|sweet/i.test(lower)) {
    const isHalwa = /halwa|sheera|kesari/i.test(lower);
    const isKheer = /kheer|payasam|phirni|rabri|rasmalai/i.test(lower);
    const isBake = /cake|brownie|pastry|muffin|cookie/i.test(lower);

    return [
      {
        id: 'swt-1',
        category: isBake || isHalwa ? 'grain' : 'dairy',
        name: isBake ? 'Refined Flour (Maida) & Cocoa/Vanilla Base' : isHalwa ? `${clean.replace(/halwa/i, '').trim() || 'Sooji / Gajar / Moong'} Base` : isKheer ? 'Full Fat Milk & Basmati Tukda / Vermicelli' : 'Khoya (Mawa) & Fresh Chenna',
        nameHindi: isBake ? 'मैदा और कोको/वनीला बेस' : isHalwa ? `${clean} की मुख्य सामग्री (सूजी/गाजर/दाल)` : isKheer ? 'फुल क्रीम दूध और चावल/सेवई' : 'मावा (खोया) और ताज़ा छेना',
        shopName: isBake ? 'Maida + Cocoa Powder' : isHalwa ? 'Fresh Halwa Base' : isKheer ? 'Full Cream Doodh' : 'Taza Chikna Khoya',
        amount: isKheer ? s(750) : s(200),
        unit: isKheer ? 'ml' : 'g',
        visualMeasure: isKheer ? '3 bade cup' : '1.5 katori',
        prepState: isHalwa ? 'Saaf karke grate ya soak kar lo' : isKheer ? 'Doodh ko heavy bottom kadhai mein kadhne do' : 'Hatheli se 5 min masal kar ekdum chikna (smooth) kar lo',
        whenToAdd: 'Step 1 — Sabse pehle',
        cost: c(65),
        availability: 'kirana',
        note: 'Mithai mein main base jitna fresh hoga, texture utna hi halwai jaisa aayega',
        isOptional: false,
      },
      {
        id: 'swt-2',
        category: 'oil',
        name: isBake ? 'Unsalted Butter (Melted)' : 'Pure Desi Ghee (देसी घी)',
        nameHindi: isBake ? 'अनसॉल्टेड मक्खन' : 'शुद्ध देसी घी',
        shopName: 'Amul / Gowardhan Desi Ghee',
        amount: s(4),
        unit: 'tbsp',
        visualMeasure: '4 bade chammach',
        prepState: 'Halka pighla lo',
        whenToAdd: 'Bhunai ya frying ke waqt',
        cost: c(40),
        availability: 'kirana',
        note: 'Asli desi ghee mein slow flame par bhunai se hi shahi khushboo aati hai',
        isOptional: false,
      },
      {
        id: 'swt-3',
        category: 'other',
        name: 'Sugar / Chashni Base (चीनी)',
        nameHindi: 'चीनी (शक्कर)',
        shopName: 'Saaf Daanedar Cheeni',
        amount: s(120),
        unit: 'g',
        visualMeasure: '3/4 katori',
        prepState: 'Zaroorat anusaar 1 taar chashni ya direct add karo',
        whenToAdd: 'Jab base 80% pak jaye tab',
        cost: c(10),
        availability: 'kirana',
        substitute: 'Desi Khand ya Jaggery (Gud)',
        note: 'Cheeni hamesha base pakne ke baad hi daalein warna pakne mein 2x waqt lagta hai',
        isOptional: false,
      },
      {
        id: 'swt-4',
        category: 'spice',
        name: 'Green Cardamom (Elaichi) & Saffron (Kesar)',
        nameHindi: 'हरी इलायची और केसर के धागे',
        shopName: 'Hari Elaichi + Kesar',
        amount: s(1),
        unit: 'tsp',
        visualMeasure: '4 elaichi + 8-10 kesar dhaage',
        prepState: 'Kesar ko 2 tbsp gungune doodh mein 10 min bhigo do',
        whenToAdd: 'Finishing stage mein',
        cost: c(20),
        availability: 'kirana',
        note: 'Gungune doodh mein bhiga kesar shahi sunehra rang aur aroma deta hai',
        isOptional: false,
      },
      {
        id: 'swt-5',
        category: 'other',
        name: 'Cashews, Almonds & Pistachios (काजू, बादाम, पिस्ता)',
        nameHindi: 'बारीक कटे काजू, बादाम और पिस्ता',
        shopName: 'Dry Fruits Mix',
        amount: s(30),
        unit: 'g',
        visualMeasure: '3 bade chammach',
        prepState: 'Lambi patli katran (slivers) mein kaat kar 1 tsp ghee mein roast kar lo',
        whenToAdd: 'Garnish aur finishing mein',
        cost: c(30),
        availability: 'kirana',
        note: 'Ghee mein halke bhune dry fruits ka crunch mithai ka swad दोगुना kar deta hai',
        isOptional: false,
      },
    ];
  }

  // 3. SOUTH INDIAN (DOSA / IDLI / UTTAPAM / VADA / SAMBHAR / UPMA / PONGAL / APPAM)
  if (/dosa|idli|uttapam|vada|sambhar|sambar|rasam|upma|pongal|appam|pesarattu|paniyaram|coconut chutney/i.test(lower)) {
    const isDosaOrIdli = /dosa|idli|uttapam|paniyaram|appam/i.test(lower);
    const isMasalaDosa = /masala dosa|mysore/i.test(lower);
    return [
      {
        id: 'si-1',
        category: 'grain',
        name: isDosaOrIdli ? 'Fermented Idli-Dosa Rice & Urad Dal Batter' : 'Roasted Rava (Sooji) / Rice & Moong Dal',
        nameHindi: isDosaOrIdli ? 'इडली-डोसा का खमीर उठा बैटर' : 'भुनी हुई सूजी (रवा) / चावल-दाल',
        shopName: isDosaOrIdli ? 'Ready Idli-Dosa Batter (ID / Local) ya Idli Rice + Urad Dal' : 'Moti Sooji (Rava) / Toor Dal',
        amount: s(400),
        unit: 'g',
        visualMeasure: '2 bade bowl',
        prepState: isDosaOrIdli ? 'Fridge se 30 min pehle nikaal kar halka namak aur 2 tbsp pani mila lo' : 'Dry roast karke alag rakh lo',
        whenToAdd: 'Step 1 — Main base',
        cost: c(45),
        availability: 'kirana',
        note: isDosaOrIdli ? 'Batter room temperature par hoga tabhi dosa crispy aur idli रुई jaisi soft banegi' : 'Medium flame par khushboo aane tak roast karein',
        isOptional: false,
      },
      ...(isMasalaDosa
        ? [
            {
              id: 'si-2',
              category: 'vegetable' as const,
              name: 'Boiled Potatoes & Sliced Onions (for Aloo Masala)',
              nameHindi: 'उबले आलू और लच्छेदार प्याज़ (मसाले के लिए)',
              shopName: 'Aloo aur Pyaaz',
              amount: s(250),
              unit: 'g',
              visualMeasure: '3 medium uble aloo + 1 pyaaz',
              prepState: 'Aloo ko haath se halka phod lo (zyada paste mat banao)',
              whenToAdd: 'Rai-kadi patta tadka ke baad',
              cost: c(20),
              availability: 'kirana' as const,
              note: 'Aloo masala mein 2 tbsp pani chhidak kar dhakne se hotel jaisa moist masala banta hai',
              isOptional: false,
            },
          ]
        : []),
      {
        id: 'si-3',
        category: 'spice',
        name: 'Mustard Seeds (Rai), Chana-Urad Dal & Fresh Curry Leaves (Kadi Patta)',
        nameHindi: 'राई (सरसों), चना-उड़द दाल और ताज़ा कड़ी पत्ता',
        shopName: 'Barik Rai + Kadi Patta + Chana Dal',
        amount: s(2),
        unit: 'tbsp',
        visualMeasure: '1 tsp rai + 10-12 kadi patte + 1 tsp chana dal',
        prepState: 'Kadi patte dho kar sukha lo',
        whenToAdd: 'Garam tel mein sabse pehle tadka lagate waqt',
        cost: c(10),
        availability: 'kirana',
        note: 'Rai jab poori tarah chatak jaye tabhi kadi patta aur chana dal daalein',
        isOptional: false,
      },
      {
        id: 'si-4',
        category: 'vegetable',
        name: 'Fresh Grated Coconut, Green Chillies & Ginger (for Chutney)',
        nameHindi: 'ताज़ा कद्दूकस नारियल, हरी मिर्च और अदरक',
        shopName: 'Kacha Pani Wala Nariyal',
        amount: s(100),
        unit: 'g',
        visualMeasure: '1 katori taza nariyal',
        prepState: '2 tbsp bhuna chana dal aur hari mirch ke sath pees lo',
        whenToAdd: 'Chutney ya finishing mein',
        cost: c(25),
        availability: 'kirana',
        note: 'Nariyal chutney mein bhuna chana dalne se hotel jaisi thickness aati hai',
        isOptional: false,
      },
      {
        id: 'si-5',
        category: 'oil',
        name: 'Gingelly (Sesame) Oil / Desi Ghee',
        nameHindi: 'तिल का तेल या देसी घी',
        shopName: 'Til ka Tel / Desi Ghee',
        amount: s(2),
        unit: 'tbsp',
        visualMeasure: '2 bade chammach',
        prepState: 'Seedha tawa ya tadka pan mein use karo',
        whenToAdd: 'Tadka aur tawa roasting ke waqt',
        cost: c(18),
        availability: 'kirana',
        note: 'Dosa ke kinare par 1 tsp ghee lagane se golden crispiness aati hai',
        isOptional: false,
      },
    ];
  }

  // 4. BIRYANI / PULAO / FRIED RICE / KHICHDI
  if (/biryani|pulao|pulav|fried rice|khichdi|tahiri|jeera rice|lemon rice|curd rice|tamarind rice|bisi bele/i.test(lower)) {
    const isChicken = /chicken|murgh/i.test(lower);
    const isMutton = /mutton|gosht/i.test(lower);
    const isEgg = /egg|anda/i.test(lower);
    const isPaneer = /paneer/i.test(lower);

    return [
      {
        id: 'rice-1',
        category: 'grain',
        name: 'Long-Grain Aged Basmati Rice',
        nameHindi: 'लंबे दाने वाला बासमती चावल',
        shopName: 'India Gate / Daawat Classic Basmati Rice',
        amount: s(250),
        unit: 'g',
        visualMeasure: '1.5 bada cup chawal',
        prepState: '3 baar halke haath se dho kar 30 minute pani mein bhigo do',
        whenToAdd: 'Step 1 mein soak karo, phir khade masalon ke sath boil/dum karo',
        cost: c(40),
        availability: 'kirana',
        note: '30 min soaking se har daana lamba aur khila-khila banta hai',
        isOptional: false,
      },
      {
        id: 'rice-2',
        category: isChicken || isMutton || isEgg || isPaneer ? 'protein' : 'vegetable',
        name: isChicken
          ? 'Bone-in Chicken (Biryani Cut)'
          : isMutton
          ? 'Tender Goat Mutton (Curry/Biryani Cut)'
          : isEgg
          ? 'Boiled Eggs (Scored & Golden Fried)'
          : isPaneer
          ? 'Fresh Malai Paneer Cubes'
          : 'Mixed Veggies (Gajar, Beans, Gobhi, Matar & Aloo)',
        nameHindi: isChicken
          ? 'चिकन (बिरयानी कट)'
          : isMutton
          ? 'मटन (बिरयानी कट)'
          : isEgg
          ? 'उबले अंडे'
          : isPaneer
          ? 'ताज़ा पनीर क्यूब्स'
          : 'मिक्स सब्ज़ियाँ (गाजर, बीन्स, गोभी, मटर, आलू)',
        shopName: isChicken ? 'Fresh Biryani Cut Chicken' : isMutton ? 'Raan/Seena Mutton' : 'Taza Sabziyan / Paneer',
        amount: s(300),
        unit: 'g',
        visualMeasure: '2 bade bowl',
        prepState: 'Dahi, adrak-lehsun aur biryani masala mein 20 min marinate kar lo',
        whenToAdd: 'Gravy base / yakhni banate waqt',
        cost: c(isMutton ? 180 : isChicken ? 95 : isPaneer ? 75 : 35),
        availability: 'kirana',
        note: 'Dahi-masala marination se har bite ke andar tak flavour jata hai',
        isOptional: false,
      },
      {
        id: 'rice-3',
        category: 'vegetable',
        name: 'Thinly Sliced Onions (for Crispy Golden Birista) & Fresh Mint-Coriander',
        nameHindi: 'लच्छेदार प्याज़ (बरिस्ता के लिए), पुदीना और हरा धनिया',
        shopName: 'Lal Pyaaz + Taza Pudina + Hara Dhaniya',
        amount: s(150),
        unit: 'g',
        visualMeasure: '2 bade pyaaz + 1 muthi pudina-dhaniya',
        prepState: 'Pyaaz ko ek barabar patla slice karke golden crispy fry (Birista) kar lo',
        whenToAdd: 'Adha marination mein, adha chawal ki layering (dum) ke upar',
        cost: c(20),
        availability: 'kirana',
        note: 'Crispy Birista aur taza pudina hi asli Hyderabadi/Lucknowi Biryani ki jaan hai',
        isOptional: false,
      },
      {
        id: 'rice-4',
        category: 'spice',
        name: 'Whole Khade Masale (Tej Patta, Shahi Jeera, Hari/Badi Elaichi, Laung, Dalchini) & Biryani Masala',
        nameHindi: 'खड़े गरम मसाले (तेज पत्ता, शाही जीरा, इलायची, लौंग, दालचीनी) और बिरयानी मसाला',
        shopName: 'Khade Garam Masale ka packet + Shahi Biryani Masala',
        amount: s(2),
        unit: 'tbsp',
        visualMeasure: '2 bade chammach',
        prepState: 'Sabut masale alag प्लेट mein nikaal lo',
        whenToAdd: 'Ghee garam hote hi sabse pehle tadke mein',
        cost: c(18),
        availability: 'kirana',
        note: 'Khade masalon ko ghee mein 30 sec bhunne se khushboo poore ghar mein mehek uthti hai',
        isOptional: false,
      },
      {
        id: 'rice-5',
        category: 'dairy',
        name: 'Thick Curd (Dahi), Desi Ghee & Saffron Milk',
        nameHindi: 'गाढ़ा दही, देसी घी और केसर वाला दूध',
        shopName: 'Dahi + Desi Ghee + Kesar',
        amount: s(100),
        unit: 'g',
        visualMeasure: '1/2 katori dahi + 2 tbsp ghee',
        prepState: 'Dahi ko phent lo taaki dana na rahe',
        whenToAdd: 'Dahi base mein, Ghee aur Kesar doodh dum lagate waqt upar se',
        cost: c(35),
        availability: 'kirana',
        note: 'Dum lagate waqt upar se 2 chammach desi ghee chawal ko moist aur glossy banata hai',
        isOptional: false,
      },
    ];
  }

  // 5. INDO-CHINESE / NOODLES / MANCHURIAN / MOMOS / CHILLI PANEER
  if (/noodle|chowmein|manchurian|chilli|momos|spring roll|schezwan|hakka|chop suey|fried wonton|soup|ramen/i.test(lower)) {
    const isMomo = /momo|dimsum|dumpling/i.test(lower);
    const isNoodle = /noodle|chowmein|hakka|ramen|chop suey/i.test(lower);
    return [
      {
        id: 'ic-1',
        category: 'grain',
        name: isMomo ? 'Refined Flour (Maida) for Thin Wrapper' : isNoodle ? 'Hakka Noodles (Boiled Al-Dente)' : 'Cornflour & Maida (for Crispy Coating)',
        nameHindi: isMomo ? 'मैदा (पतली परत के लिए)' : isNoodle ? 'हक्का नूडल्स' : 'कॉर्नफ्लोर और मैदा (क्रिस्पी कोटिंग के लिए)',
        shopName: isNoodle ? 'Ching’s Hakka Noodles packet' : 'Maida + Cornflour',
        amount: s(200),
        unit: 'g',
        visualMeasure: isNoodle ? '1 packet noodles' : '1.5 cup',
        prepState: isNoodle ? 'Ubalte pani mein 1 tsp oil ke sath 85% boil karke thande pani se dho lo' : 'Chhaan kar taiyaar rakho',
        whenToAdd: 'Step 1',
        cost: c(35),
        availability: 'kirana',
        note: isNoodle ? 'Boil karne ke baad 1 tsp oil lagane se noodles bilkul nahi chipakte' : 'Cornflour se restaurant jaisa extra crunch aata hai',
        isOptional: false,
      },
      {
        id: 'ic-2',
        category: 'vegetable',
        name: 'Finely Chopped Garlic, Ginger, Green Chilli & Spring Onion (Hara Pyaaz)',
        nameHindi: 'बारीक कटा लहसुन, अदरक, हरी मिर्च और हरा प्याज़',
        shopName: 'Lehsun, Adrak aur Hara Pyaaz (Spring Onion)',
        amount: s(80),
        unit: 'g',
        visualMeasure: '2 tbsp barik lehsun + 1 cup hara pyaaz',
        prepState: 'Paste mat banao — ekdum fine chop (barik tukde) karo',
        whenToAdd: 'Smoking hot wok/kadhai mein sabse pehle (30 sec toss)',
        cost: c(20),
        availability: 'kirana',
        note: 'Indo-Chinese mein paste nahi, barik kata lehsun high flame par smoky aroma deta hai',
        isOptional: false,
      },
      {
        id: 'ic-3',
        category: /paneer/i.test(lower) ? 'protein' : /chicken/i.test(lower) ? 'protein' : 'vegetable',
        name: /paneer/i.test(lower)
          ? 'Fresh Paneer Cubes & Diced Capsicum-Onion'
          : /chicken/i.test(lower)
          ? 'Boneless Chicken Cubes & Bell Peppers'
          : 'Shredded Cabbage, Carrot & Capsicum (Shimla Mirch)',
        nameHindi: /paneer/i.test(lower)
          ? 'ताज़ा पनीर क्यूब्स और शिमला मिर्च-प्याज़'
          : /chicken/i.test(lower)
          ? 'बोनलेस चिकन और शिमला मिर्च'
          : 'बारीक कटी पत्तागोभी, गाजर और शिमला मिर्च',
        shopName: 'Fresh Veggies / Paneer',
        amount: s(250),
        unit: 'g',
        visualMeasure: '2 bade bowl',
        prepState: isNoodle ? 'Patle lambe juliennes (strips) mein kaat lo' : 'Barik chop ya cubes mein kaat lo',
        whenToAdd: 'Garlic toss karne ke turant baad high flame par',
        cost: c(/paneer|chicken/i.test(lower) ? 75 : 30),
        availability: 'kirana',
        note: 'Sabziyon ko sirf 2 min high flame par toss karein taaki crunch barkarar rahe',
        isOptional: false,
      },
      {
        id: 'ic-4',
        category: 'spice',
        name: 'Dark Soy Sauce, Red Chilli Sauce, White Vinegar & Black Pepper',
        nameHindi: 'डार्क सोया सॉस, रेड चिली सॉस, सिरका और काली मिर्च',
        shopName: 'Soy Sauce + Chilli Sauce + Vinegar',
        amount: s(3),
        unit: 'tbsp',
        visualMeasure: '1 tbsp soy + 1.5 tbsp chilli + 1 tsp vinegar',
        prepState: 'Teeno sauces ek chhoti katori mein pehle se mix karke rakh lo',
        whenToAdd: 'High flame tossing ke waqt kadhai ke kinare se daalo',
        cost: c(18),
        availability: 'kirana',
        note: 'Sauces ko kadhai ki garam deewar par dalne se smoky street-style wok hei flavour aata hai',
        isOptional: false,
      },
    ];
  }

  // 6. PIZZA / PASTA / BURGER / SANDWICH / TACOS / CONTINENTAL
  if (/pizza|pasta|macaroni|spaghetti|lasagna|burger|sandwich|toast|taco|burrito|quesadilla|nachos|garlic bread|wrap|frankie|shawarma/i.test(lower)) {
    return [
      {
        id: 'cnt-1',
        category: 'grain',
        name: /pasta|macaroni|spaghetti|lasagna/i.test(lower)
          ? 'Durum Wheat Pasta (Penne / Fusilli / Spaghetti)'
          : /burger/i.test(lower)
          ? 'Soft Burger Buns & Crispy Patty Base'
          : /pizza/i.test(lower)
          ? 'Fresh Pizza Dough Base (8-inch)'
          : 'Artisan Bread / Tortilla Wrap',
        nameHindi: /pasta|macaroni|spaghetti/i.test(lower)
          ? 'पास्ता (पेने / फुसिली / मैकरोनी)'
          : /pizza/i.test(lower)
          ? 'पिज़्ज़ा बेस'
          : 'ब्रेड / बन / टॉर्टिला बेस',
        shopName: 'Bakery / Kirana Pasta or Base',
        amount: s(200),
        unit: 'g',
        visualMeasure: '2 servings base',
        prepState: /pasta|macaroni/i.test(lower) ? 'Namak wale ubalte pani mein 8-9 min al-dente boil karo (1/2 cup pasta water bacha lo)' : 'Halka butter laga kar toast/prep kar lo',
        whenToAdd: 'Step 1',
        cost: c(45),
        availability: 'kirana',
        note: /pasta/i.test(lower) ? 'Bacha hua starchy pasta water sauce ko ekdum glossy aur creamy banata hai' : 'Base ko halka crisp karne se soggy nahi hota',
        isOptional: false,
      },
      {
        id: 'cnt-2',
        category: 'dairy',
        name: 'Grated Mozzarella / Cheddar Cheese & Butter',
        nameHindi: 'मोज़ेरेला / प्रोसेस्ड चीज़ और मक्खन',
        shopName: 'Amul Mozzarella / Cheese Cubes + Butter',
        amount: s(100),
        unit: 'g',
        visualMeasure: '1 bhari katori grated cheese',
        prepState: 'Kaddukas (grate) karke rakh lo',
        whenToAdd: 'Sauce ya topping ke upar melt hone ke liye',
        cost: c(55),
        availability: 'kirana',
        note: 'Mozzarella aur processed cheese 50:50 milane se pull aur salty taste dono milte hain',
        isOptional: false,
      },
      {
        id: 'cnt-3',
        category: 'vegetable',
        name: 'Minced Garlic, Sweet Corn, Bell Peppers, Onion & Olives/Tomatoes',
        nameHindi: 'लहसुन, स्वीट कॉर्न, शिमला मिर्च, प्याज़ और टमाटर',
        shopName: 'Shimla Mirch, Sweet Corn, Lehsun, Tamatar',
        amount: s(180),
        unit: 'g',
        visualMeasure: '1.5 cup dice ki hui veggies',
        prepState: 'Bite-size cubes mein kaat lo',
        whenToAdd: 'Butter aur garlic saute karne ke baad',
        cost: c(35),
        availability: 'kirana',
        note: 'Garlic ko butter mein golden hone tak bhunne se cafe jaisi aroma aati hai',
        isOptional: false,
      },
      {
        id: 'cnt-4',
        category: 'spice',
        name: 'Italian Mixed Herbs (Oregano, Basil), Red Chilli Flakes & Tangy Sauce',
        nameHindi: 'ओरेगैनो, चिली फ्लेक्स, काली मिर्च और पिज़्ज़ा/पास्ता सॉस',
        shopName: 'Oregano + Chilli Flakes + Pasta/Pizza Sauce',
        amount: s(3),
        unit: 'tbsp',
        visualMeasure: '3 bade chammach sauce + 1 tsp herbs',
        prepState: 'Ready rakho',
        whenToAdd: 'Sauce base aur finishing garnish mein',
        cost: c(20),
        availability: 'kirana',
        note: 'Desi twist ke liye 1 pinch garam masala ya schezwan touch bhi mila sakte hain',
        isOptional: false,
      },
    ];
  }

  // 7. STREET FOOD / CHAAT / SAMOSA / PAV BHAJI / VADA PAV / PARATHA / POORI
  if (/chaat|pani puri|golgappa|bhel|sev puri|dahi puri|papdi|samosa|kachori|pakora|bhajiya|pav bhaji|vada pav|dabeli|tikki|paratha|naan|kulcha|bhatura|poori|puri|thepla|litt?i|appe|dhokla|khandvi|poha|misal/i.test(lower)) {
    const isBread = /paratha|naan|kulcha|bhatura|poori|puri|thepla|litti/i.test(lower);
    const isPav = /pav bhaji|vada pav|dabeli|misal/i.test(lower);
    return [
      {
        id: 'st-1',
        category: 'grain',
        name: isBread ? 'Whole Wheat Atta / Maida (for Soft Dough)' : isPav ? 'Fresh Ladi Pav (Mumbai Style)' : 'Crispy Puris / Samosa Patti / Poha / Besan Base',
        nameHindi: isBread ? 'गेहूं का आटा / मैदा' : isPav ? 'ताज़ा लादी पाव' : 'कुरकुरी पूरी / बेसन / पोहा बेस',
        shopName: isBread ? 'Chakki Fresh Atta / Maida' : isPav ? 'Fresh Bakery Ladi Pav' : 'Chaat Puri / Besan / Poha',
        amount: s(250),
        unit: 'g',
        visualMeasure: isPav ? '6 Ladi Pav' : '2 bade cup',
        prepState: isBread ? 'Namak, ajwain aur 1 tbsp oil/ghee ke sath naram aata goondh kar 20 min dhak ke rakh do' : isPav ? 'Beech se slit karke makkhan aur bhaji masale ke sath tawa par seko' : 'Saaf karke plate mein lagao',
        whenToAdd: 'Step 1 — Base prep',
        cost: c(30),
        availability: 'kirana',
        note: isBread ? 'Aate ko 20 min rest dene se gluten relax hota hai aur paratha/kulcha phoolta hai' : 'Garma-garam makkhan mein sika pav swad double kar deta hai',
        isOptional: false,
      },
      {
        id: 'st-2',
        category: 'vegetable',
        name: 'Boiled & Mashed Potatoes (Aloo), Finely Chopped Onions, Green Chillies & Coriander',
        nameHindi: 'उबले आलू, बारीक कटा प्याज़, हरी मिर्च और हरा धनिया',
        shopName: 'Aloo, Pyaaz, Hari Mirch, Hara Dhaniya',
        amount: s(300),
        unit: 'g',
        visualMeasure: '3 medium uble aloo + 2 pyaaz',
        prepState: 'Aloo ubaal kar chheel lo aur bina guthli (lumps) ke mash kar lo',
        whenToAdd: 'Masala stuffing ya bhaji/chaat base mein',
        cost: c(25),
        availability: 'kirana',
        note: 'Aloo thanda hone ke baad mash karne se stuffing गीली (soggy) nahi hoti',
        isOptional: false,
      },
      {
        id: 'st-3',
        category: 'spice',
        name: 'Chatpata Chaat Masala, Roasted Jeera Powder, Kala Namak & Amchur / Pav Bhaji Masala',
        nameHindi: 'चाट मसाला, भुना जीरा, काला नमक और अमचूर / पाव भाजी मसाला',
        shopName: 'Chaat Masala + Kala Namak + Bhuna Jeera',
        amount: s(2.5),
        unit: 'tsp',
        visualMeasure: '2.5 chhote chammach',
        prepState: 'Tawa par jeera bhun kar dardara pees lo',
        whenToAdd: 'Stuffing/bhaji mein aur upar se sprinkle karne ke liye',
        cost: c(12),
        availability: 'kirana',
        note: 'Kala namak aur taza bhuna jeera hi asli thele (street) wali khushboo deta hai',
        isOptional: false,
      },
      {
        id: 'st-4',
        category: 'oil',
        name: 'Amul Butter / Desi Ghee / Mustard Oil',
        nameHindi: 'अमूल मक्खन / देसी घी / तेल',
        shopName: 'Amul Butter / Desi Ghee',
        amount: s(3),
        unit: 'tbsp',
        visualMeasure: '3 bade chammach',
        prepState: 'Seedha tawa ya kadhai mein use karo',
        whenToAdd: 'Sekne, tadka lagane aur finishing mein',
        cost: c(25),
        availability: 'kirana',
        note: 'Street food mein makkhan/ghee ki कंजूसी mat karna — isi se asli glaze aata hai',
        isOptional: false,
      },
    ];
  }

  // 8. CURRIES / SABZI / DAL / PANEER / CHICKEN / MUTTON / FISH / EGG (Default Intelligent Indian Main Course)
  const isChicken = /chicken|murgh|butter chicken|tikka masala|kadai chicken/i.test(lower);
  const isMutton = /mutton|rogan josh|keema|gosht|nihari|korma/i.test(lower);
  const isFishOrPrawn = /fish|machli|prawn|jhinga|shrimp|crab/i.test(lower);
  const isEgg = /egg|anda|omelette|bhurji/i.test(lower);
  const isPaneer = /paneer|shahi|makhani|lababdar|pasanda|kadai|kofta/i.test(lower);
  const isPalak = /palak|saag|methi|spinach/i.test(lower);
  const isDal = /dal|daal|rajma|chole|chana|lobia|sambhar|kadhi/i.test(lower);

  const mainItem = isChicken
    ? { cat: 'protein' as const, name: 'Fresh Bone-in / Boneless Chicken', hi: 'ताज़ा चिकन (करी कट)', shop: 'Fresh Curry Cut Chicken', amt: s(400), unit: 'g', meas: '8-10 medium pieces', prep: 'Dho kar haldi, namak aur 2 tbsp dahi mein 20 min marinate karo', cost: c(110) }
    : isMutton
    ? { cat: 'protein' as const, name: 'Tender Goat Mutton (Curry Cut)', hi: 'ताज़ा मटन (सीना और चाप के टुकड़े)', shop: 'Fresh Goat Mutton', amt: s(400), unit: 'g', meas: '8-10 pieces', prep: 'Dahi, adrak-lehsun aur kashmiri mirch mein 30 min marinate karo', cost: c(240) }
    : isFishOrPrawn
    ? { cat: 'protein' as const, name: 'Fresh Rohu/Surmai Fish Steaks or Prawns', hi: 'ताज़ा मछली के टुकड़े / झींगा', shop: 'Fresh Fish Steaks', amt: s(350), unit: 'g', meas: '6-8 pieces', prep: 'Haldi, namak aur nimbu ras laga kar 15 min rakh do', cost: c(150) }
    : isEgg
    ? { cat: 'protein' as const, name: 'Farm Fresh Eggs (अंडे)', hi: 'ताज़ा अंडे', shop: '6 Fresh Eggs', amt: s(4), unit: 'pcs', meas: '4 अंडे', prep: /bhurji|omelette/i.test(lower) ? 'Bowl mein tod kar namak aur halka doodh mila kar फेंट lo' : 'Hard boil karke chheel lo aur fork se halke prick kar lo', cost: c(32) }
    : isPaneer
    ? { cat: 'protein' as const, name: 'Fresh Soft Malai Paneer', hi: 'ताज़ा मलाई पनीर', shop: 'Dairy Fresh Malai Paneer', amt: s(250), unit: 'g', meas: '1.5 bada bowl cubes', prep: '1.5 inch cubes mein kaat kar 10 min gungune namak-pani mein bhigo do', cost: c(80) }
    : isDal
    ? { cat: 'protein' as const, name: `${clean} Lentils / Beans (दाल / राजमा / छोले)`, hi: `${clean} की दाल / फलियाँ`, shop: `Saaf ${clean} Dal`, amt: s(200), unit: 'g', meas: '1 bada cup (bhiga hua)', prep: '3 baar dho kar 30 min (rajma/chole 8 ghante) pani mein bhigo do, phir namak-haldi ke sath pressure cook karo', cost: c(35) }
    : { cat: 'vegetable' as const, name: `Fresh ${clean} Main Vegetable`, hi: `ताज़ा ${clean} सब्ज़ी`, shop: `Taza ${clean} Sabzi`, amt: s(350), unit: 'g', meas: '2 bade bowl', prep: 'Achhe se dho kar barabar tukdon mein kaat lo', cost: c(40) };

  return [
    {
      id: 'main-1',
      category: mainItem.cat,
      name: mainItem.name,
      nameHindi: mainItem.hi,
      shopName: mainItem.shop,
      amount: mainItem.amt,
      unit: mainItem.unit,
      visualMeasure: mainItem.meas,
      prepState: mainItem.prep,
      whenToAdd: 'Masala achhe se bhunne aur tel chhootne ke baad',
      cost: mainItem.cost,
      availability: 'kirana',
      note: isPaneer
        ? 'Paneer ko gungune pani mein rakhne se woh gravy mein रुई jaisa soft rehta hai'
        : 'Fresh aur barabar kate tukde ek saath barabar pakte hain',
      isOptional: false,
    },
    ...(isPalak
      ? [
          {
            id: 'main-palak',
            category: 'vegetable' as const,
            name: 'Fresh Spinach Leaves (Blanched Palak Puree)',
            nameHindi: 'ताज़ा पालक के पत्ते (प्यूरी)',
            shopName: 'Chhote patte wala kachcha Palak (1 gaddi)',
            amount: s(300),
            unit: 'g',
            visualMeasure: '1 badi gaddi palak',
            prepState: 'Ubalte pani mein 2 min blanch karke turant baraf wale thande pani mein daalo, phir hari mirch ke sath pees lo',
            whenToAdd: 'Pyaaz-lehsun bhunne ke baad',
            cost: c(20),
            availability: 'kirana' as const,
            note: 'Ice water shock se palak ka rang pakne ke baad bhi ekdum bright green rehta hai!',
            isOptional: false,
          },
        ]
      : []),
    {
      id: 'main-2',
      category: 'vegetable',
      name: 'Onions (Finely Chopped)',
      nameHindi: 'बारीक कटा प्याज़',
      shopName: 'Medium Lal Pyaaz',
      amount: s(150),
      unit: 'g',
      visualMeasure: '2 medium pyaaz',
      prepState: 'Chopper ya chaku se ekdum barik chop kar lo',
      whenToAdd: 'Jeera aur khade masale tadakne ke turant baad',
      cost: c(12),
      availability: 'kirana',
      substitute: 'No-onion option: 1 pinch Hing + 2 tbsp Cashew-Melon seed paste',
      note: 'Pyaaz bhunte waqt chutki bhar namak dalne se pyaaz jaldi aur barabar golden hota hai',
      isOptional: false,
    },
    {
      id: 'main-3',
      category: 'vegetable',
      name: 'Ripe Red Tomatoes (Chopped or Pureed)',
      nameHindi: 'पके लाल टमाटर (कटे या प्यूरी)',
      shopName: 'Lal Rasila Tamatar',
      amount: s(150),
      unit: 'g',
      visualMeasure: '2 medium tamatar',
      prepState: 'Barik chop kar lo ya मिक्सी mein 2 hari mirch ke sath pees lo',
      whenToAdd: 'Pyaaz aur adrak-lehsun sunehra bhunne ke baad',
      cost: c(15),
      availability: 'kirana',
      substitute: '3 tbsp Fresh Pheta Hua Dahi',
      note: 'Tamatar ko tab tak bhuno jab tak masala daane-daar na ho aur kinare se tel alag na dikhe',
      isOptional: false,
    },
    {
      id: 'main-4',
      category: 'spice',
      name: 'Fresh Ginger, Garlic & Green Chilli Paste',
      nameHindi: 'ताज़ा अदरक, लहसुन और हरी मिर्च पेस्ट',
      shopName: 'Adrak, Lehsun aur Hari Mirch',
      amount: s(1.5),
      unit: 'tbsp',
      visualMeasure: '1.5 bada chammach (1 inch adrak + 8 kali lehsun)',
      prepState: 'Imamdaste (mortar) mein taza dardara koot lo',
      whenToAdd: 'Pyaaz golden brown hone ke baad',
      cost: c(8),
      availability: 'kirana',
      note: 'Packet wale paste ke muqable taza kuta adrak-lehsun 5x zyada dhaba flavour deta hai',
      isOptional: false,
    },
    {
      id: 'main-5',
      category: 'spice',
      name: 'Jeera, Kashmiri Lal Mirch, Haldi, Dhaniya Powder & Garam Masala',
      nameHindi: 'जीरा, कश्मीरी लाल मिर्च, हल्दी, धनिया पाउडर और गरम मसाला',
      shopName: 'Basic Indian Masale',
      amount: s(3),
      unit: 'tsp',
      visualMeasure: '1 tsp mirch + 1.5 tsp dhaniya + 1/2 tsp haldi + 1/2 tsp garam masala',
      prepState: 'Sukhe masalon ko 3 tbsp pani mein ghol kar paste bana lo',
      whenToAdd: 'Jeera shuru mein, baaki masale tamatar ke sath',
      cost: c(12),
      availability: 'kirana',
      note: 'Masalon ko pani mein bhigo kar dalne se woh tel mein jalte nahi aur lajawab rogan aata hai',
      isOptional: false,
    },
    {
      id: 'main-6',
      category: 'oil',
      name: 'Desi Ghee / Butter & Cooking Oil + Kasuri Methi & Hara Dhaniya',
      nameHindi: 'देसी घी / तेल, कसूरी मेथी और ताज़ा हरा धनिया',
      shopName: 'Desi Ghee / Oil + Kasuri Methi + Dhaniya',
      amount: s(2.5),
      unit: 'tbsp',
      visualMeasure: '2 bade chammach oil/ghee + 1 tsp kasuri methi',
      prepState: 'Kasuri methi ko hatheli par ragad kar crush kar lo, dhaniya barik kaat lo',
      whenToAdd: 'Oil shuru mein, Kasuri Methi aur Hara Dhaniya gas band karne se 1 min pehle',
      cost: c(18),
      availability: 'kirana',
      note: 'Aakhir mein crushed kasuri methi aur 1 chammach ghee/butter se restaurant wali finishing aati hai',
      isOptional: false,
    },
  ];
}

