# RASOI AI - Llama-3 8B Fine-Tuning Script using Unsloth
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
