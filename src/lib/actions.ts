'use server';
import { AppLanguage, ChefId } from '@/types';

// ==========================================
// ZAYKA PITCH DEMO ENGINE (OFFLINE MODE)
// Ensures 100% success rate during Monday's pitch
// ==========================================

export async function judgeDishAction(imageBase64: string, dishName: string, language: AppLanguage) {
  // Simulate delay
  await new Promise(r => setTimeout(r, 1500));
  return { 
    success: true, 
    data: {
      score: 8.5,
      feedback: "Arre wah! The texture looks incredible, almost like a pro made it. Next time, try to get a little more golden brown on the edges for that perfect crunch. But honestly, brilliant effort!",
      tips: ["Roast it on low flame for 2 more mins", "Add a pinch of chaat masala on top"],
      shareCaption: "Tried making this masterpiece with Zayka AI! 🧑‍🍳🔥 #ChefMode"
    }
  };
}

export async function analyzeFrameAction(imageBase64: string, currentStep: string, chefId: ChefId, language: AppLanguage) {
  return { success: true, feedback: "Looks good, the onions are turning golden brown! You can add the tomatoes now." };
}

export async function scanFridgeAction(imageBase64: string, language: AppLanguage) {
  await new Promise(r => setTimeout(r, 1500));
  return { 
    success: true, 
    data: ["Paneer", "Leftover Roti", "Capsicum", "Onion", "Tomato", "Cheese"] 
  };
}

export async function generateBudgetMealAction(budget: number, language: AppLanguage) {
  await new Promise(r => setTimeout(r, 1200));
  return { 
    success: true, 
    data: {
      dishName: "Royal Masala Poha & Irani Chai",
      totalCost: budget > 5 ? budget - 5 : budget,
      ingredients: [
        { name: "Poha (Flattened Rice)", estimatedCost: 20 },
        { name: "Peanuts & Curry Leaves", estimatedCost: 15 },
        { name: "Onion & Green Chilli", estimatedCost: 10 },
        { name: "Milk & Tea Leaves", estimatedCost: 30 }
      ],
      quickRecipe: "1. Wash poha. 2. Roast peanuts and temper onions. 3. Mix everything with turmeric. 4. Brew thick Irani chai on the side."
    }
  };
}

export async function generateFusionRecipeAction(likedFoods: string[], language: AppLanguage) {
  await new Promise(r => setTimeout(r, 1500));
  
  const isPizza = likedFoods.includes('Margherita Pizza');
  const isChicken = likedFoods.includes('Butter Chicken');
  
  let title = "The Zayka Fusion Masterpiece";
  let description = "A mind-blowing combination of your swiped favorites!";
  let steps = ["Prep the ingredients", "Mix the core spices", "Cook on low flame", "Garnish and serve hot"];

  if (isPizza && isChicken) {
    title = "Makhani Pizza 🍕🍗";
    description = "A crispy thin Italian crust topped with rich, creamy Butter Chicken gravy, tender chicken chunks, and melted mozzarella cheese.";
    steps = [
      "Prepare a thin pizza base and bake it lightly for 5 minutes.",
      "Instead of tomato sauce, spread a thick layer of rich Butter Chicken Makhani gravy.",
      "Top with shredded tandoori chicken, sliced onions, and lots of mozzarella cheese.",
      "Bake at 200°C for 10 minutes until the cheese is bubbling and golden.",
      "Garnish with fresh coriander and a drizzle of fresh cream!"
    ];
  } else if (likedFoods.length >= 2) {
    title = `${likedFoods[0].split(' ')[0]} ${likedFoods[1].split(' ').pop()} Fusion`;
    description = `A crazy delicious blend combining the best of ${likedFoods[0]} and ${likedFoods[1]}.`;
  }

  return { 
    success: true, 
    data: {
      name: title,
      tagline: description,
      emoji: "🤯🍽️",
      ingredients: ["Main base from dish 1", "Core flavor from dish 2", "Secret Zayka spices", "Cheese/Garnish"],
      instructions: steps.join(' '),
      time: "25 mins"
    } 
  };
}
