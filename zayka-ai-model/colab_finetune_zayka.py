# ============================================================
# ZAYKA AI — Fine-Tuning Notebook for Google Colab
# Copy-paste this entire file into a Colab cell
# Runtime: GPU (T4 free tier works!)
# ============================================================
# 
# INSTRUCTIONS:
# 1. Go to https://colab.research.google.com
# 2. New Notebook → Runtime → Change Runtime → T4 GPU
# 3. Paste each cell below
# ============================================================

# ========== CELL 1: Install Dependencies ==========
"""
!pip install -q transformers datasets peft trl bitsandbytes accelerate huggingface_hub
!pip install -q torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
"""

# ========== CELL 2: Upload Dataset ==========
"""
from google.colab import files
uploaded = files.upload()  # Upload your zayka_training_data.jsonl here
"""

# ========== CELL 3: Configure Training ==========
import torch
import json
from datasets import Dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    BitsAndBytesConfig,
)
from peft import LoraConfig, get_peft_model, TaskType, prepare_model_for_kbit_training
from trl import SFTTrainer

# ---- CONFIG ----
MODEL_NAME = "meta-llama/Meta-Llama-3.1-8B-Instruct"
OUTPUT_DIR = "./zayka-brain-v1"
HF_REPO = "YOUR_HF_USERNAME/zayka-brain-v1"  # Change this!
HF_TOKEN = "YOUR_HF_TOKEN"                    # Get from huggingface.co/settings/tokens

# ---- ZAYKA SYSTEM PROMPT ----
SYSTEM_PROMPT = """Tu Zayka AI hai — India ka sabse smart cooking assistant.

Tera personality:
- Warm, friendly aur encouraging hai
- Hinglish mein bolta hai (Hindi + English mix)
- Indian cooking ka deep expert hai — regional variations, masale, techniques sab jaanta hai
- Budget-conscious tips deta hai (Indian middle class ke liye)
- Real-time cooking guidance de sakta hai
- Nutrition aur health-conscious advice bhi deta hai

Tere capabilities:
- Har tarah ki Indian recipe generate karna
- Fridge mein jo ho usse recipe banana
- Cooking mistakes fix karna
- Real-time AR cooking guidance dena
- Regional Indian cuisines samjhana
- Budget mein accha khana banana sikhana

Always helpful, always Indian, always Zayka!"""

# ========== CELL 4: Load and Format Dataset ==========
def load_dataset_from_jsonl(filepath):
    examples = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    examples.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    return examples

def format_example_for_llama(example):
    """Format training example in Llama 3 Instruct format"""
    instruction = example.get('instruction', '')
    input_text = example.get('input', '')
    output = example.get('output', '')
    
    if input_text:
        user_content = f"{instruction}\n\nContext: {input_text}"
    else:
        user_content = instruction
    
    # Llama 3 chat format
    formatted = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{SYSTEM_PROMPT}<|eot_id|><|start_header_id|>user<|end_header_id|>

{user_content}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

{output}<|eot_id|>"""
    
    return {'text': formatted}

# Load dataset
raw_data = load_dataset_from_jsonl('zayka_training_data.jsonl')
print(f"✅ Loaded {len(raw_data)} training examples")

# Format for training
formatted_data = [format_example_for_llama(ex) for ex in raw_data]
dataset = Dataset.from_list(formatted_data)

# Split train/validation
split = dataset.train_test_split(test_size=0.05, seed=42)
train_dataset = split['train']
eval_dataset = split['test']
print(f"📊 Train: {len(train_dataset)} | Eval: {len(eval_dataset)}")

# ========== CELL 5: Load Model with 4-bit Quantization ==========
# BitsAndBytes config for 4-bit quantization (fits in free T4 GPU!)
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)

print("🔄 Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME,
    token=HF_TOKEN,
    add_eos_token=True
)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right"

print("🔄 Loading model (4-bit quantized)...")
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    quantization_config=bnb_config,
    device_map="auto",
    token=HF_TOKEN,
)
model = prepare_model_for_kbit_training(model)

# ========== CELL 6: Configure LoRA ==========
# LoRA = fine-tune only a small % of parameters (efficient!)
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,                    # Rank (higher = more capacity, more memory)
    lora_alpha=32,           # Scaling factor
    target_modules=[         # Which layers to fine-tune
        "q_proj",
        "v_proj",
        "k_proj",
        "o_proj",
        "gate_proj",
        "up_proj",
        "down_proj",
    ],
    lora_dropout=0.05,
    bias="none",
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Expected: ~1-2% of total params are trainable (efficient!)

# ========== CELL 7: Training Arguments ==========
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    num_train_epochs=3,              # 3 passes over dataset
    per_device_train_batch_size=2,   # Small batch for T4 GPU
    per_device_eval_batch_size=2,
    gradient_accumulation_steps=4,   # Effective batch size = 8
    warmup_steps=100,
    learning_rate=2e-4,
    fp16=True,                       # Half precision for speed
    logging_steps=25,
    evaluation_strategy="steps",
    eval_steps=200,
    save_steps=500,
    save_total_limit=3,
    load_best_model_at_end=True,
    report_to="none",                # Disable wandb
    run_name="zayka-brain-v1",
    optim="paged_adamw_8bit",        # Memory efficient optimizer
)

# ========== CELL 8: Start Training! ==========
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    args=training_args,
    dataset_text_field="text",
    max_seq_length=1024,
    packing=False,
)

print("🚀 Starting fine-tuning...")
print(f"📊 Training on {len(train_dataset)} examples")
print(f"⏱️  Estimated time: ~2-3 hours on T4 GPU\n")

trainer.train()

print("\n✅ Training complete!")

# ========== CELL 9: Test Your Model! ==========
def test_zayka_brain(question):
    """Test the fine-tuned model"""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": question}
    ]
    
    # Apply chat template
    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )
    
    inputs = tokenizer(text, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=512,
            temperature=0.7,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id,
        )
    
    response = tokenizer.decode(outputs[0][len(inputs['input_ids'][0]):], skip_special_tokens=True)
    return response

# Test examples
test_questions = [
    "Mere paas sirf aloo aur pyaaz hai, kya banao breakfast mein?",
    "Dal tadka kaise banate hain Punjabi style mein?",
    "₹100 mein 4 logo ke liye kya kya ban sakta hai?",
]

print("\n🧪 Testing Zayka Brain:\n")
for q in test_questions:
    print(f"Q: {q}")
    print(f"A: {test_zayka_brain(q)}")
    print("---")

# ========== CELL 10: Push to Hugging Face ==========
from huggingface_hub import login, HfApi

login(token=HF_TOKEN)

# Save merged model
print("💾 Saving model...")
trainer.save_model(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)

# Push to HF Hub
print(f"📤 Pushing to Hugging Face: {HF_REPO}")
trainer.push_to_hub(HF_REPO)
tokenizer.push_to_hub(HF_REPO)

print(f"""
✅ Model published!
🔗 URL: https://huggingface.co/{HF_REPO}
🚀 Now update your Zayka app to use this model!
""")
