import json
import random
import datetime

# ==============================================================================
# ZAYKA AI - MASTER DATASET GENERATOR (Phase 4)
# This script generates the JSONL training data required to fine-tune Qwen2.5-7B
# Features included:
# 1. Multilingual Code-Switching (Hindi, Tamil, Hinglish)
# 2. Emotional Context (Frustrated user vs Happy user)
# 3. Global to Desi Substitutes (Sushi -> Paratha Roll)
# 4. Regional Logic (Kerala defaults to Coconut Oil)
# ==============================================================================

# 1. Global vs Desi Knowledge Base
GLOBAL_TO_DESI_MAP = {
    "Sushi": "Spinach Paratha Roll with Sticky Jeera Rice",
    "Pasta Arrabbiata": "Macaroni in spicy Tomato-Garlic Tadka",
    "Tacos": "Crispy Roti folds with Rajma filling",
    "Risotto": "Creamy Khichdi with Cheese and Garlic"
}

# 2. Regional Defaults
REGIONAL_DEFAULTS = [
    {"region": "Kerala", "oil": "Coconut Oil", "spice": "Curry Leaves & Mustard Seeds"},
    {"region": "Punjab", "oil": "Desi Ghee", "spice": "Kasuri Methi & Garam Masala"},
    {"region": "Bengal", "oil": "Mustard Oil", "spice": "Panch Phoron"}
]

# 3. Emotional Prompts
EMOTIONS = [
    ("Angry/Hungry", "Bhai jaldi kuch bata, bohot bhook lagi hai aur time nahi hai!"),
    ("Curious", "I want to try something fancy today but with local ingredients."),
    ("Beginner", "Mujhe cooking bilkul nahi aati, please help step by step.")
]

# 4. Multilingual Variations
LANGUAGES = [
    {"code": "hi", "response_prefix": "Zaroor bhai! Yeh rahi recipe:"},
    {"code": "ta", "response_prefix": "Kandippa! Intha recipe paarunga:"},
    {"code": "bn", "response_prefix": "Oboshhoi! Ei je apnar recipe:"},
    {"code": "en-IN", "response_prefix": "Done boss! Check out this recipe:"}
]

def generate_dataset(num_samples=1000):
    dataset = []
    
    for i in range(num_samples):
        # Pick random traits
        dish = random.choice(list(GLOBAL_TO_DESI_MAP.keys()))
        desi_alt = GLOBAL_TO_DESI_MAP[dish]
        region = random.choice(REGIONAL_DEFAULTS)
        emotion = random.choice(EMOTIONS)
        lang = random.choice(LANGUAGES)
        
        # Build System Prompt (RAG Context Injection)
        system_prompt = f"You are Zayka AI. User is from {region['region']}, feeling {emotion[0]}, speaking {lang['code']}."
        
        # Build User Query
        user_query = f"{emotion[1]} Make me {dish}."
        
        # Build AI Response
        ai_response = f"{lang['response_prefix']} Since you are in {region['region']}, let's use {region['oil']}. Instead of traditional {dish}, let's make a Desi Jugaad: {desi_alt}!"
        
        # Alpaca/ChatML format
        sample = {
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query},
                {"role": "assistant", "content": ai_response}
            ]
        }
        dataset.append(sample)
        
    return dataset

if __name__ == "__main__":
    print(f"[{datetime.datetime.now()}] Generating Zayka AI Brain Dataset...")
    data = generate_dataset(100) # Generating 100 sample rows
    
    output_file = "zayka_finetune_dataset.jsonl"
    with open(output_file, 'w', encoding='utf-8') as f:
        for item in data:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')
            
    print(f"✅ Successfully generated {len(data)} rows in {output_file}!")
    print("Next step: Upload this file to Google Colab and run Unsloth Fine-Tuning.")
