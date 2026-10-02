/**
 * ============================================================
 * ZAYKA AI — Training Dataset Generator
 * Uses your existing Groq API to auto-generate 10,000+
 * high-quality Indian cooking Q&A pairs for fine-tuning.
 * 
 * Run: node generate_dataset.js
 * Output: zayka_training_data.jsonl
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

// ---- CONFIG ----
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';
const OUTPUT_FILE = 'zayka_training_data.jsonl';
const BATCH_SIZE = 10; // generate 10 examples per API call (efficient)
const TOTAL_EXAMPLES = 5000; // start with 5000, can increase later
const DELAY_MS = 1500; // delay between calls to avoid rate limits

// ---- TOPIC CATEGORIES ----
const TOPICS = [
  // Basic Recipes
  { category: 'basic_recipes', prompts: [
    'Aloo paratha kaise banate hain step by step?',
    'Dal tadka recipe batao Punjabi style mein',
    'Simple egg bhurji kaise banate hain?',
    'Rajma chawal ki perfect recipe kya hai?',
    'Paneer butter masala ghar pe kaise banao?',
    'Maggi noodles mein kya add karo interesting banana ke liye?',
    'Bread pakora recipe Hinglish mein batao',
    'Chai perfectly kaise banate hain?',
    'Idli sambar ghar pe kaise banao?',
    'Poha recipe quick aur tasty',
  ]},
  // Budget Cooking
  { category: 'budget_cooking', prompts: [
    '50 rupay mein kya kya ban sakta hai dinner mein?',
    '100 rupay mein 4 log ka khana kaise banao?',
    'Saste ingredients se protein rich khana kaise banao?',
    'Monthly budget ₹2000 mein khana kaise manage karein?',
    'Student hostel mein kaise accha khana banao limited resources mein?',
  ]},
  // Fridge Inventory Recipes
  { category: 'fridge_to_recipe', prompts: [
    'Mere paas sirf aloo, pyaaz aur tamatar hai kya banao?',
    'Ghar mein sirf anda aur bread hai breakfast mein kya bano?',
    'Fridge mein basi roti hai kya karu iske saath?',
    'Sirf dahi, jeera aur hari mirchi hai to kya bana sakte hain?',
    'Besan aur pyaaz se kya kya ban sakta hai?',
  ]},
  // Nutrition & Health
  { category: 'nutrition', prompts: [
    'Diabetes ke patient ke liye low sugar Indian recipes batao',
    'Weight loss ke liye Indian food tips kya hain?',
    'High protein vegetarian Indian meals kya hote hain?',
    'BP patient ko kya khana chahiye Indian diet mein?',
    'Iron rich Indian foods kya hain especially women ke liye?',
    'Keto diet ke saath Indian cooking kaise karein?',
  ]},
  // Cooking Techniques
  { category: 'techniques', prompts: [
    'Tadka perfectly kaise dein?',
    'Onions ko golden brown karne ka sahi tarika kya hai?',
    'Masala paste aur powder mein kya farak hai?',
    'Pressure cooker mein dal kitne whistles mein pakti hai?',
    'Fried food mein oil absorption kam kaise karein?',
    'Dough kitna narm ya sakht banana chahiye?',
  ]},
  // Regional Cuisines
  { category: 'regional', prompts: [
    'Punjabi khane ki khas baat kya hai?',
    'South Indian filter coffee kaise banate hain?',
    'Bengali mishti doi recipe kya hai?',
    'Rajasthani dal bati churma kaise banta hai?',
    'Hyderabadi biryani aur Lucknowi biryani mein kya farak hai?',
    'Gujarati thali mein kya kya hota hai?',
  ]},
  // Ingredient Knowledge
  { category: 'ingredients', prompts: [
    'Kashmiri mirch aur lal mirch mein kya farak hai?',
    'Kaunsa tel khane ke liye sabse healthy hai?',
    'Fresh haldi vs powder haldi mein kya difference hai?',
    'Paneer ghar pe kaise banate hain?',
    'Ghee aur butter mein kya farak hai cooking ke liye?',
    'Hing kyu daali jaati hai dal mein?',
  ]},
  // Cooking Mistakes & Tips
  { category: 'tips_tricks', prompts: [
    'Namak zyada ho gaya khane mein to kya karein?',
    'Masala zyada kharab lag raha hai to kaise fix karein?',
    'Roti phool phool nahi rahi to kya kare?',
    'Kheer jal gayi toh kya kare?',
    'Dahi jamane ke liye kya karna chahiye?',
    'Sabzi watery ho gayi to kaise thick karein?',
  ]},
  // Festive & Special
  { category: 'festive', prompts: [
    'Diwali ke liye kaunsi easy mithai ghar pe bana sakte hain?',
    'Eid pe biryani best kaise banao?',
    'Navratri ke fast mein kya kha sakte hain?',
    'Holi ke pakwan kya hote hain?',
    'Birthday cake ke liye simple Indian dessert kya banao?',
  ]},
  // AR Cooking (Real-time guidance)
  { category: 'realtime_cooking', prompts: [
    'Main abhi pyaaz kat raha hoon, kya tips hain?',
    'Tawa garam ho gaya hai, abhi kya karo?',
    'Dal ka color thoda dark dikh raha hai, kya problem hai?',
    'Roti ekdum soft kaise rakhen serve karte time?',
    'Sabzi mein oil separate ho raha hai, kya matlab hai iska?',
  ]},
];

// ---- CHEF PERSONALITIES (for diverse training data) ----
const CHEF_PERSONAS = [
  {
    name: 'Arjun',
    style: 'Young energetic chef, Hinglish mein bolta hai, Gen-Z vibes, casual aur friendly',
    example_prefix: 'Yaar, sun! '
  },
  {
    name: 'Priya',
    style: 'Experienced home cook, caring aur motherly, practical tips deti hai, Hindi-English mix',
    example_prefix: 'Beta, dekho! '
  },
  {
    name: 'Raju Dada',
    style: 'Old school Indian cook, traditional recipes jaanta hai, pure Hindi mein bolta hai',
    example_prefix: 'Sunte ho! '
  },
  {
    name: 'Chef Ananya',
    style: 'Professional chef, precise aur detailed, English mein mostly but Indian terms use karta hai',
    example_prefix: 'Alright! '
  }
];

// ---- GROQ API CALL ----
async function callGroq(prompt, systemPrompt) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1024,
    }),
  });
  
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API Error: ${err}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// ---- GENERATE BATCH OF EXAMPLES ----
async function generateBatch(topic, persona, batchSize) {
  const questionsToGenerate = topic.prompts.slice(0, batchSize);
  
  const systemPrompt = `Tu ${persona.name} hai — ${persona.style}.

Tu Zayka AI ka expert chef hai. Tera kaam hai Indian cooking ke baare mein helpful, detailed aur accurate answers dena.

Rules:
1. Hinglish mein jawab de (Hindi + English mix) unless specifically asked otherwise
2. Practical tips dena — jo ghar pe actually kaam aate hain
3. Warm aur encouraging tone rakhna
4. Step-by-step instructions dena jab recipe puchha jaaye
5. Regional variations mention karna where relevant
6. Safety tips include karna where needed
7. Response 200-400 words ka hona chahiye

IMPORTANT: Only cooking related sawaalon ke jawab dena.`;

  const examples = [];
  
  for (const question of questionsToGenerate) {
    try {
      const answer = await callGroq(question, systemPrompt);
      examples.push({
        instruction: question,
        input: '',
        output: answer.trim(),
        category: topic.category,
        chef_persona: persona.name,
        language: 'hinglish'
      });
      
      process.stdout.write('.');
      
      // Delay between calls
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    } catch (error) {
      console.error(`\n❌ Error generating for "${question}": ${error.message}`);
    }
  }
  
  return examples;
}

// ---- GENERATE CONVERSATION EXAMPLES ----
async function generateConversations() {
  const conversationScenarios = [
    {
      scenario: 'User is cooking dal aur realtime help maang raha hai',
      turns: 3
    },
    {
      scenario: 'User ne ingredients bataye aur recipe maangi',
      turns: 4
    },
    {
      scenario: 'User ne cooking mistake ki aur solution maang raha hai',
      turns: 3
    },
    {
      scenario: 'User naya dish seekhna chahta hai step by step',
      turns: 5
    },
  ];
  
  const examples = [];
  
  for (const scenario of conversationScenarios) {
    const systemPrompt = `Tu Zayka AI ka friendly Indian cooking assistant hai.
    
Generate a realistic ${scenario.turns}-turn cooking conversation in Hinglish about: "${scenario.scenario}"

Format your response EXACTLY like this JSON:
{
  "conversation": [
    {"role": "user", "content": "user ka message"},
    {"role": "assistant", "content": "chef ka helpful response"},
    {"role": "user", "content": "user ka followup"},
    {"role": "assistant", "content": "chef ka followup response"}
  ]
}

Make it natural, helpful aur Indian cooking focused. Return ONLY valid JSON, no extra text.`;

    try {
      const response = await callGroq('Generate the conversation', systemPrompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.conversation && parsed.conversation.length >= 2) {
          // Convert multi-turn to training format
          for (let i = 0; i < parsed.conversation.length - 1; i += 2) {
            if (parsed.conversation[i] && parsed.conversation[i + 1]) {
              examples.push({
                instruction: parsed.conversation[i].content,
                input: `Previous context: ${scenario.scenario}`,
                output: parsed.conversation[i + 1].content,
                category: 'realtime_conversation',
                chef_persona: 'Zayka Brain',
                language: 'hinglish'
              });
            }
          }
          process.stdout.write('💬');
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    } catch (error) {
      console.error(`\n❌ Conversation error: ${error.message}`);
    }
  }
  
  return examples;
}

// ---- MAIN FUNCTION ----
async function main() {
  console.log('🍛 Zayka AI — Training Dataset Generator Starting...\n');
  console.log(`📊 Target: ${TOTAL_EXAMPLES} examples`);
  console.log(`📁 Output: ${OUTPUT_FILE}\n`);
  
  const writeStream = fs.createWriteStream(OUTPUT_FILE, { flags: 'a' });
  let totalGenerated = 0;
  
  // Generate topic-based examples
  for (const topic of TOPICS) {
    for (const persona of CHEF_PERSONAS) {
      if (totalGenerated >= TOTAL_EXAMPLES) break;
      
      console.log(`\n🔄 Topic: ${topic.category} | Chef: ${persona.name}`);
      
      const examples = await generateBatch(topic, persona, Math.min(5, TOTAL_EXAMPLES - totalGenerated));
      
      for (const example of examples) {
        writeStream.write(JSON.stringify(example) + '\n');
        totalGenerated++;
      }
      
      console.log(` ✅ ${totalGenerated}/${TOTAL_EXAMPLES} generated`);
    }
    if (totalGenerated >= TOTAL_EXAMPLES) break;
  }
  
  // Generate conversation examples
  console.log('\n💬 Generating multi-turn conversations...');
  const conversations = await generateConversations();
  for (const conv of conversations) {
    writeStream.write(JSON.stringify(conv) + '\n');
    totalGenerated++;
  }
  
  writeStream.end();
  
  console.log(`\n\n✅ Dataset generation complete!`);
  console.log(`📊 Total examples: ${totalGenerated}`);
  console.log(`📁 Saved to: ${OUTPUT_FILE}`);
  console.log(`\n🚀 Next Step: Upload ${OUTPUT_FILE} to Google Colab for fine-tuning!`);
}

main().catch(console.error);
