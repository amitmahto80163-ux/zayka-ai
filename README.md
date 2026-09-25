# Zayka AI ??

Zayka AI is your smart, AI-powered Indian home cooking assistant. It helps you discover new dishes, plan meals, and provides extremely detailed, step-by-step cooking instructions specifically designed for beginners.

## ? Features
- **Personalized Recommendations:** Get dish suggestions based on your budget, diet, and available ingredients.
- **Smart Recipe Generation:** Uses advanced AI (OpenRouter / Groq) to generate accurate, beginner-friendly instructions in Hinglish.
- **Voice Search:** Find recipes by speaking in Hindi/English using the built-in ChefChat.
- **Ingredient Shopping List:** Instantly generate estimated costs and local availability for Indian kitchens.
- **AI Assistant:** ChefChat answers your cooking questions in real-time.

## ?? Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project (for Auth & Storage)

### Installation

1. Clone the repository
2. Install dependencies:
   `ash
   npm install
   `
3. Setup Environment Variables:
   Create a \.env.local\ file in the root directory and add your keys:
   `env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   # ... other firebase keys
   OPENROUTER_API_KEY=your_openrouter_key
   GROQ_API_KEY=your_groq_key
   `
4. Run the development server:
   `ash
   npm run dev
   `
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## ??? Tech Stack
- Next.js (React)
- Tailwind CSS
- Firebase
- OpenRouter AI / Groq API
- Vercel (Hosting)
