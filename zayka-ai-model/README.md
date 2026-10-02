# 🧠 Zayka Brain — Apna Custom AI Model

Zayka AI ka khud ka fine-tuned language model — trained specifically on Indian cooking, Hinglish conversations, aur real-time chef guidance ke liye.

## 📁 Folder Structure

```
zayka-ai-model/
├── generate_dataset.js    ← Step 1: Training data generate karo (Groq se)
├── colab_finetune_zayka.py ← Step 2: Fine-tune karo (Google Colab)
├── serve_zayka.py         ← Step 3: Model serve karo (local/VPS)
├── requirements.txt       ← Python dependencies
└── README.md
```

## 🚀 Quick Start — 3 Steps

### Step 1: Dataset Generate Karo

```bash
# Zayka project root se run karo
GROQ_API_KEY=your_key node zayka-ai-model/generate_dataset.js

# ~5000 examples generate hoge (2-3 hours)
# Output: zayka_training_data.jsonl
```

### Step 2: Fine-tune on Google Colab (FREE!)

1. https://colab.research.google.com jaao
2. **Runtime → Change runtime type → T4 GPU** select karo
3. `colab_finetune_zayka.py` ka code copy-paste karo
4. `zayka_training_data.jsonl` upload karo
5. Apna Hugging Face token add karo (https://hf.co/settings/tokens)
6. Run all cells! (~3-4 hours)

### Step 3: App mein Use Karo

`.env.local` mein add karo:
```env
ZAYKA_MODEL_TOKEN=hf_xxxxxxxxxx
ZAYKA_MODEL_ID=your-username/zayka-brain-v1
```

Bas! App automatically Zayka Brain use karega instead of Groq.

---

## 🖥️ Self-Hosting (Optional — Faster Responses)

Agar aap khud server chalana chahte ho (GPU VPS pe):

```bash
# Install dependencies
pip install -r requirements.txt

# Server start karo
ZAYKA_MODEL=your-username/zayka-brain-v1 \
HF_TOKEN=hf_xxx \
python serve_zayka.py

# .env.local mein add karo:
ZAYKA_SELF_HOSTED_URL=http://your-server-ip:8000
```

**Cheap GPU VPS options:**
- **Vast.ai** — ~₹100-200/hr (spot pricing)
- **RunPod** — ~₹150/hr
- **Kaggle** — FREE (90 hrs/week GPU)

---

## 📊 Expected Results After Fine-tuning

| Metric | Base Llama 3.1 8B | Zayka Brain v1 |
|--------|-------------------|----------------|
| Indian recipe accuracy | 60% | 90%+ |
| Hinglish fluency | Basic | Native |
| Regional knowledge | Generic | Expert |
| Budget awareness | No | Yes |
| Response relevance | OK | Excellent |

---

## 💡 App Integration

The app has two new files:
- `src/hooks/useZaykaBrain.ts` — React hook for voice + text AI
- `src/components/ZaykaBrainChat.tsx` — Beautiful chat UI
- `src/app/api/zayka-brain/route.ts` — API route (HF + self-hosted)

The system automatically falls back to Groq if Zayka Brain is unavailable.

---

## 🗓️ Timeline

| Week | Task |
|------|------|
| 1-2 | Dataset generate karo (run script) |
| 3-4 | Dataset clean aur review karo |
| 5-7 | Fine-tune on Colab (automated) |
| 8 | Test karo, iterate karo |
| 9 | Hugging Face pe deploy karo |
| 10 | App mein live karo! |
