#!/usr/bin/env python3
"""
============================================================
ZAYKA AI — One-Command Self-Hosting Server
Runs your fine-tuned Zayka Brain model locally or on a VPS

Usage:
  pip install -r requirements.txt
  python serve_zayka.py

Environment:
  ZAYKA_MODEL=your-hf-username/zayka-brain-v1
  HF_TOKEN=hf_xxxxx
  PORT=8000

Compatible with: Runpod, Vast.ai, any GPU VPS (~₹700/month)
============================================================
"""

import os
import json
import asyncio
from typing import Optional, List, AsyncGenerator
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# ---- CONFIG ----
MODEL_ID = os.getenv('ZAYKA_MODEL', 'meta-llama/Llama-3.1-8B-Instruct')
HF_TOKEN = os.getenv('HF_TOKEN', '')
PORT = int(os.getenv('PORT', 8000))
DEVICE = 'cuda' if os.getenv('CUDA_VISIBLE_DEVICES') else 'cpu'

app = FastAPI(title="Zayka Brain API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your domain
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- SYSTEM PROMPT ----
SYSTEM_PROMPT = """Tu Zayka AI hai — India ka sabse smart cooking assistant.

Tera personality:
- Warm, friendly aur encouraging hai
- Hinglish mein bolta hai (Hindi + English mix)
- Indian cooking ka deep expert hai
- Budget-conscious tips deta hai
- Real-time cooking guidance de sakta hai

Always helpful, always Indian, always Zayka!"""

# ---- MODELS (loaded lazily) ----
model = None
tokenizer = None

def load_model():
    global model, tokenizer
    if model is not None:
        return
    
    print(f"🔄 Loading Zayka Brain: {MODEL_ID}")
    
    from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
    import torch
    
    quant_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.bfloat16,
    ) if DEVICE == 'cuda' else None
    
    tokenizer = AutoTokenizer.from_pretrained(
        MODEL_ID,
        token=HF_TOKEN or None,
    )
    tokenizer.pad_token = tokenizer.eos_token
    
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        quantization_config=quant_config,
        device_map="auto" if DEVICE == 'cuda' else 'cpu',
        token=HF_TOKEN or None,
    )
    model.eval()
    print("✅ Zayka Brain loaded and ready!")

# ---- PYDANTIC MODELS ----
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str = "zayka-brain"
    messages: List[Message]
    max_tokens: int = 512
    temperature: float = 0.7
    stream: bool = False

class ChatResponse(BaseModel):
    id: str = "zayka-response"
    object: str = "chat.completion"
    choices: List[dict]

# ---- INFERENCE ----
def generate_response(messages: List[Message], max_tokens: int = 512, temperature: float = 0.7) -> str:
    import torch
    
    load_model()
    
    # Format messages in Llama chat template
    chat_messages = []
    
    # Add system prompt if not already present
    if not any(m.role == 'system' for m in messages):
        chat_messages.append({"role": "system", "content": SYSTEM_PROMPT})
    
    for m in messages:
        chat_messages.append({"role": m.role, "content": m.content})
    
    text = tokenizer.apply_chat_template(
        chat_messages,
        tokenize=False,
        add_generation_prompt=True,
    )
    
    inputs = tokenizer(text, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_tokens,
            temperature=temperature,
            do_sample=temperature > 0,
            pad_token_id=tokenizer.eos_token_id,
            repetition_penalty=1.1,
        )
    
    new_tokens = outputs[0][len(inputs['input_ids'][0]):]
    response = tokenizer.decode(new_tokens, skip_special_tokens=True)
    return response.strip()

async def generate_stream(messages: List[Message], max_tokens: int = 512, temperature: float = 0.7) -> AsyncGenerator[str, None]:
    """Streaming version - yields SSE formatted chunks"""
    from transformers import TextIteratorStreamer
    from threading import Thread
    import torch
    
    load_model()
    
    chat_messages = []
    if not any(m.role == 'system' for m in messages):
        chat_messages.append({"role": "system", "content": SYSTEM_PROMPT})
    
    for m in messages:
        chat_messages.append({"role": m.role, "content": m.content})
    
    text = tokenizer.apply_chat_template(chat_messages, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer(text, return_tensors="pt").to(model.device)
    
    streamer = TextIteratorStreamer(tokenizer, skip_special_tokens=True, skip_prompt=True)
    
    def run_generation():
        model.generate(
            **inputs,
            max_new_tokens=max_tokens,
            temperature=temperature,
            do_sample=temperature > 0,
            streamer=streamer,
            pad_token_id=tokenizer.eos_token_id,
        )
    
    thread = Thread(target=run_generation)
    thread.start()
    
    for token_text in streamer:
        if token_text:
            chunk = {
                "id": "zayka-stream",
                "object": "chat.completion.chunk",
                "choices": [{
                    "delta": {"content": token_text},
                    "index": 0,
                    "finish_reason": None,
                }]
            }
            yield f"data: {json.dumps(chunk)}\n\n"
    
    yield "data: [DONE]\n\n"

# ---- ROUTES ----
@app.get("/")
async def root():
    return {
        "status": "Zayka Brain is running! 🧠",
        "model": MODEL_ID,
        "device": DEVICE,
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "model": MODEL_ID}

@app.post("/v1/chat/completions")
async def chat_completions(request: ChatRequest):
    try:
        if request.stream:
            return StreamingResponse(
                generate_stream(request.messages, request.max_tokens, request.temperature),
                media_type="text/event-stream",
            )
        
        response_text = generate_response(
            request.messages,
            request.max_tokens,
            request.temperature,
        )
        
        return {
            "id": "zayka-response",
            "object": "chat.completion",
            "model": MODEL_ID,
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": response_text,
                },
                "finish_reason": "stop",
            }],
            "usage": {
                "prompt_tokens": 0,
                "completion_tokens": len(response_text.split()),
                "total_tokens": len(response_text.split()),
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print(f"""
    🍛 Zayka Brain Server Starting...
    
    Model: {MODEL_ID}
    Device: {DEVICE}
    Port: {PORT}
    
    Endpoints:
    GET  /health
    POST /v1/chat/completions
    
    Your Next.js app mein set karo:
    ZAYKA_SELF_HOSTED_URL=http://localhost:{PORT}
    """)
    
    # Pre-load model at startup
    load_model()
    
    uvicorn.run(app, host="0.0.0.0", port=PORT, log_level="info")
