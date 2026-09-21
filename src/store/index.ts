// ============================================
// ZAYKA AI - Global State (Zustand Store)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, Recipe, ChatMessage, AppLanguage, ChefId, 
  ZaykaMemory, CookingHistoryEntry, FamilyRecipe 
} from '@/types';

interface ZaykaStore {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Language
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;

  // Selected chef
  selectedChef: ChefId;
  setChef: (chefId: ChefId) => void;

  // Current recipe (cooking mode)
  currentRecipe: Recipe | null;
  setCurrentRecipe: (recipe: Recipe | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Chat history
  chatHistory: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Voice listening
  isListening: boolean;
  setIsListening: (val: boolean) => void;

  // Camera
  cameraActive: boolean;
  setCameraActive: (val: boolean) => void;

  // Favourites
  favourites: string[];
  addFavourite: (recipeId: string) => void;
  removeFavourite: (recipeId: string) => void;
  isFavourite: (recipeId: string) => boolean;

  // Loading states
  isChefThinking: boolean;
  setChefThinking: (val: boolean) => void;

  // Zayka Memory
  memory: ZaykaMemory | null;
  setMemory: (memory: ZaykaMemory) => void;
  updateMemory: (partial: Partial<ZaykaMemory>) => void;
  addCookingHistoryEntry: (entry: CookingHistoryEntry) => void;

  // Saved/Generated recipes
  savedRecipes: any[];
  addSavedRecipe: (recipe: any) => void;

  // Family Recipes
  familyRecipes: FamilyRecipe[];
  addFamilyRecipe: (recipe: FamilyRecipe) => void;
  deleteFamilyRecipe: (id: string) => void;

  // Streak
  currentStreak: number;
  lastCookDate: string | null;
  updateStreak: () => void;
}

export const useZaykaStore = create<ZaykaStore>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Language
      language: 'hinglish',
      setLanguage: (language) => set({ language }),

      // Chef
      selectedChef: 'arjun',
      setChef: (selectedChef) => set({ selectedChef }),

      // Recipe
      currentRecipe: null,
      setCurrentRecipe: (currentRecipe) => set({ currentRecipe, currentStep: 0 }),
      currentStep: 0,
      setCurrentStep: (currentStep) => set({ currentStep }),

      // Chat
      chatHistory: [],
      addChatMessage: (msg) =>
        set((state) => ({
          chatHistory: [...state.chatHistory.slice(-50), msg], // Keep last 50 messages
        })),
      clearChat: () => set({ chatHistory: [] }),

      // Search
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      // Voice
      isListening: false,
      setIsListening: (isListening) => set({ isListening }),

      // Camera
      cameraActive: false,
      setCameraActive: (cameraActive) => set({ cameraActive }),

      // Favourites
      favourites: [],
      addFavourite: (recipeId) =>
        set((state) => ({
          favourites: [...state.favourites, recipeId],
        })),
      removeFavourite: (recipeId) =>
        set((state) => ({
          favourites: state.favourites.filter((id) => id !== recipeId),
        })),
      isFavourite: (recipeId) => get().favourites.includes(recipeId),

      // Loading
      isChefThinking: false,
      setChefThinking: (isChefThinking) => set({ isChefThinking }),

      // Zayka Memory
      memory: null,
      setMemory: (memory) => set({ memory }),
      updateMemory: (partial) => set((state) => ({
        memory: state.memory ? { ...state.memory, ...partial } : null
      })),
      addCookingHistoryEntry: (entry) => set((state) => ({
        memory: state.memory ? {
          ...state.memory,
          cookingHistory: [entry, ...state.memory.cookingHistory].slice(0, 100)
        } : null
      })),

      // Saved Recipes
      savedRecipes: [],
      addSavedRecipe: (recipe) => set((state) => ({
        savedRecipes: [recipe, ...state.savedRecipes.filter(r => r.id !== recipe.id)].slice(0, 50)
      })),

      // Family Recipes
      familyRecipes: [],
      addFamilyRecipe: (recipe) => set((state) => ({
        familyRecipes: [recipe, ...state.familyRecipes]
      })),
      deleteFamilyRecipe: (id) => set((state) => ({
        familyRecipes: state.familyRecipes.filter(r => r.id !== id)
      })),

      // Streak
      currentStreak: 0,
      lastCookDate: null,
      updateStreak: () => set((state) => {
        const today = new Date().toDateString();
        const last = state.lastCookDate;
        if (last === today) return {}; // Already counted today
        
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = last === yesterday ? state.currentStreak + 1 : 1;
        return { currentStreak: newStreak, lastCookDate: today };
      }),
    }),
    {
      name: 'zayka-ai-store',
      partialize: (state) => ({
        language: state.language,
        selectedChef: state.selectedChef,
        favourites: state.favourites,
        user: state.user,
        memory: state.memory,
        savedRecipes: state.savedRecipes,
        familyRecipes: state.familyRecipes,
        currentStreak: state.currentStreak,
        lastCookDate: state.lastCookDate,
      }),
    }
  )
);
