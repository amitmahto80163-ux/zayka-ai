// ============================================
// ZAYKA AI — Type Definitions
// ============================================

export interface Recipe {
  id: string;
  name: string;
  nameHindi?: string;
  description: string;
  cuisine: CuisineType;
  category: CategoryType;
  difficulty: DifficultyLevel;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  ingredients: Ingredient[];
  steps: CookingStep[];
  nutrition: NutritionInfo;
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  isVeg: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  rating?: number;
  reviews?: number;
  createdAt: Date;
}

export interface Ingredient {
  id: string;
  name: string;
  nameHindi?: string;
  amount: number;
  unit: string;
  optional?: boolean;
  substitute?: string;
}

export interface CookingStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  duration?: number; // seconds
  imageUrl?: string;
  videoUrl?: string;
  tips?: string[];
}

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber?: number;
  sugar?: number;
}

export type CuisineType =
  | 'indian-north'
  | 'indian-south'
  | 'indian-punjabi'
  | 'indian-bengali'
  | 'indian-gujarati'
  | 'indian-street'
  | 'chinese'
  | 'japanese'
  | 'thai'
  | 'korean'
  | 'italian'
  | 'mexican'
  | 'american'
  | 'french'
  | 'mediterranean'
  | 'other';

export type CategoryType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snacks'
  | 'dessert'
  | 'drinks'
  | 'healthy'
  | 'quick'
  | 'party'
  | 'kids';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'expert';

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  age?: number;
  preferences: UserPreferences;
  stats: UserStats;
  isPremium: boolean;
  premiumExpiry?: Date;
  createdAt: Date;
  language: AppLanguage;
  selectedChef: ChefId;
}

export interface UserPreferences {
  isVegetarian: boolean;
  isVegan: boolean;
  allergies: string[];
  skillLevel: DifficultyLevel;
  favoriteCuisines: CuisineType[];
  healthGoal: HealthGoal;
  familySize: number;
  dietaryRestrictions: string[];
}

export type HealthGoal =
  | 'weight-loss'
  | 'muscle-gain'
  | 'healthy'
  | 'diabetic-friendly'
  | 'heart-healthy'
  | 'none';

export type AppLanguage =
  | 'hindi'
  | 'english'
  | 'hinglish'
  | 'punjabi'
  | 'tamil'
  | 'telugu'
  | 'bengali'
  | 'gujarati';

export interface UserStats {
  totalRecipesMade: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  badges: Badge[];
  challengeDaysCompleted: number;
  skipPassesLeft: number;
  lastCookDate?: Date;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earnedAt: Date;
}

// ============================================
// CHEF AVATAR TYPES
// ============================================

export type ChefId =
  | 'rohan' // Young male (20s)
  | 'arjun' // Mid male (30s)
  | 'rajan' // Senior male (40s)
  | 'ananya' // Young female (20s)
  | 'priya' // Mid female (30s)
  | 'savita'; // Senior female (40s)

export interface ChefProfile {
  id: ChefId;
  name: string;
  gender: 'male' | 'female';
  ageGroup: 'young' | 'mid' | 'senior';
  personality: string;
  greeting: string;
  encouragement: string[];
  warnings: string[];
  humor: string[];
  avatarUrl: string;
  voiceId: string; // ElevenLabs voice ID
}

// ============================================
// CHAT TYPES
// ============================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'chef';
  content: string;
  timestamp: Date;
  language: AppLanguage;
}

// ============================================
// CHALLENGE TYPES
// ============================================

export interface ChallengeDay {
  day: number;
  date: Date;
  status: 'completed' | 'missed' | 'skipped' | 'pending';
  dish?: string;
  photoUrl?: string;
  aiScore?: number;
  aiReview?: string;
  ingredients?: string[];
}

export interface Challenge {
  userId: string;
  month: number;
  year: number;
  days: ChallengeDay[];
  isCompleted: boolean;
  freeMonthEarned: boolean;
  weekTheme?: string;
}

// ============================================
// INGREDIENT ADAPTER TYPES
// ============================================

export interface IngredientCheck {
  available: Ingredient[];
  missing: Ingredient[];
  substitutes: SubstituteMap;
}

export interface SubstituteMap {
  [ingredientName: string]: string[];
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
