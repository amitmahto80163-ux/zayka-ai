"""
===================================================================
RASOI AI - CUSTOM LLM FINE-TUNING DATASET GENERATOR & TRAINER
===================================================================
This pipeline prepares training data for fine-tuning Llama-3 / Mistral
on Indian Culinary Intelligence, Kitchen Emergency Recovery, & Desi Personas.
"""

import json
import os

# Sample Fine-Tuning Dataset (Instruction-Input-Output format for Unsloth / HuggingFace)
FINE_TUNING_DATASET = [
    {
        "instruction": "Rasoi AI Disaster Recovery - Burned Sabzi",
        "input": "User says: Meri Paneer Butter Masala ki gravy neeche se jal gayi hai aur mehak aa rahi hai, ab kya karu?",
        "output": "THANDI SAANS LO! Pehle inmediatamente gas band karo. Kadahi ke tale (bottom) ko bilkul mat kurcho! Upar upar se gravy dusri patili me shift karo. Usme 1 tbsp thanda doodh, 1/2 tsp makkhan aur 1 pinch shakkar mila do. Isse burnt smell 90% neutralize ho jayegi. Kadhai ko turant paani me daal do."
    },
    {
        "instruction": "Rasoi AI - Milk Boil Over Warning (Vision Alert)",
        "input": "Vision sensor: Milk rising to rim of utensil at 9.2cm/s velocity.",
        "output": "ALERT: Doodh ubalne wala hai! Aanch turant dheemi karo ya steel ka bada chammach patili ke upar kross karke rakh do!"
    },
    {
        "instruction": "Nostalgia Recipe Reconstruction",
        "input": "User memory: Meri nani ek aloo ki sabzi banati thi jisme bina tamatar ke khataas hoti thi aur saunf ki khushbu hoti thi.",
        "output": "Woh Mathura-style 'Khaday Aloo / Bhandare wale Aloo' hain! Usme tamatar ki jagah Amchur (dry mango powder) aur Dahi ka use hota hai. Saunf, kalonji aur hing ka chhonk lagta hai. Ye rahi exact 1980s ki Nani Style Recipe..."
    },
    {
        "instruction": "Sci-Fi Acoustic Temp Detection",
        "input": "Audio Frequency Input: 4.2kHz rapid popping sizzle in mustard oil.",
        "output": "Oil Temperature: 185°C (Smoking Point reached). Sarson ka tel pak chuka hai, ab aanch dheemi karke rai aur jeera daalo!"
    }
]

def export_dataset():
    output_dir = os.path.join(os.path.dirname(__file__), 'datasets')
    os.makedirs(output_dir, exist_ok=True)
    
    file_path = os.path.join(output_dir, 'rasoi_llm_alpaca_dataset.json')
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(FINE_TUNING_DATASET, f, ensure_ascii=False, indent=2)
    
    print(f"[OK] Successfully exported {len(FINE_TUNING_DATASET)} high-quality training pairs to {file_path}")

def generate_unsloth_training_script():
    script_content = """# RASOI AI - Llama-3 8B Fine-Tuning Script using Unsloth
# Run this on Google Colab T4 / A100 GPU

from unsloth import FastLanguageModel
import torch
from datasets import load_dataset

max_seq_length = 2048
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/llama-3-8b-Instruct-bnb-4bit",
    max_seq_length = max_seq_length,
    dtype = None,
    load_in_4bit = True,
)

model = FastLanguageModel.get_peft_model(
    model,
    r = 16,
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha = 16,
    lora_dropout = 0,
    bias = "none",
)

# Load Rasoi AI Dataset
dataset = load_dataset("json", data_files="datasets/rasoi_llm_alpaca_dataset.json")

print("[OK] Model ready for training on custom Rasoi AI Culinary Engine!")
"""
    script_path = os.path.join(os.path.dirname(__file__), 'train_llama3_rasoi.py')
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(script_content)
    print(f"[OK] Training script created at {script_path}")

if __name__ == "__main__":
    export_dataset()
    generate_unsloth_training_script()
