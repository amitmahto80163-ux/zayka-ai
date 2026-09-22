// ============================================
// ZAYKA AI - Type Definitions
// ============================================

export interface Recipe {
  id: string;
  name: string;
  nameHindi?: string;
  description: string;
  cuisine: CuisineType;
  category: CategoryType;
  difficulty: DifficultyLevel;
  prepTime: number;
  cookTime: number;
  servings: number;
  isGlobalWithDesiOptions?: boolean;
  ingredients: Ingredient[];
  steps: CookingStep[];
  authenticIngredients?: Ingredient[];
  authenticSteps?: CookingStep[];
  desiSubstituteNote?: string;
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
  // Identity
  name: string;
  nameHindi?: string;
  shopName?: string;
  visualDescription?: string;
  // Quantity
  amount: number;
  unit: string;
  visualMeasure?: string;
  // Preparation
  prepState?: string;
  whenToAdd?: string;
  // Cost
  cost?: number;
  costPerUnit?: string;
  priceRange?: string;
  // Availability
  availability?: 'kirana' | 'supermarket' | 'online';
  availabilityNote?: string;
  // Freshness & Brand
  freshnessCheck?: string;
  brandTip?: string;
  // Substitute
  substitute?: string;
  substituteReason?: string;
  // Notes
  note?: string;
  storage?: string;
  healthNote?: string;
  commonMistake?: string;
  // Metadata
  optional?: boolean;
  isOptional?: boolean;
  category?: 'protein' | 'spice' | 'oil' | 'vegetable' | 'dairy' | 'grain' | 'other';
}

export interface CookingStep {
  id?: string;
  stepNumber: number;
  title: string;
  description: string;
  duration?: number;
  imageUrl?: string;
  videoUrl?: string;
  tips?: string[];
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export type CuisineType = 'indian-north' | 'indian-south' | 'indian-punjabi' | 'indian-bengali' | 'indian-gujarati' | 'indian-street' | 'chinese' | 'japanese' | 'thai' | 'korean' | 'italian' | 'mexican' | 'american' | 'french' | 'mediterranean' | 'other';
export type CategoryType = 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'dessert' | 'drinks' | 'healthy' | 'quick' | 'party' | 'kids';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'expert';
export type AppLanguage = 'hindi' | 'english' | 'hinglish' | 'punjabi' | 'tamil' | 'telugu' | 'bengali' | 'gujarati';
export type HealthGoal = 'weight-loss' | 'muscle-gain' | 'healthy' | 'diabetic-friendly' | 'heart-healthy' | 'none';

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

export type ChefId = 'rohan' | 'arjun' | 'rajan' | 'ananya' | 'priya' | 'savita';

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
  voiceId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'chef';
  content: string;
  timestamp: Date;
  language: AppLanguage;
}

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

export interface IngredientCheck {
  available: Ingredient[];
  missing: Ingredient[];
  substitutes: SubstituteMap;
}

export interface SubstituteMap {
  [ingredientName: string]: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ZaykaMemory {
  isVegetarian: boolean;
  isVegan: boolean;
  allergies: string[];
  spiceLevel: 'mild' | 'medium' | 'spicy' | 'very-spicy';
  skillLevel: 'beginner' | 'intermediate' | 'expert';
  cuisineTypes: string[];
  goals: string[];
  budgetPerMeal: number;
  cookingHistory: CookingHistoryEntry[];
  preferredCookTime: number;
  favoriteTags: string[];
  lastActiveDate: string;
  weeklyGoal: number;
  weeklyCompleted: number;
}

export interface CookingHistoryEntry {
  recipeId: string;
  recipeName: string;
  cookedAt: string;
  rating: number | null;
  note: string;
  imageUrl?: string;
}

export interface FamilyRecipe {
  id: string;
  title: string;
  description: string;
  origin: string;
  ingredients: string[];
  steps: string[];
  isPrivate: boolean;
  createdAt: string;
}
