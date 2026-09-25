// ============================================
// ZAYKA AI - Global State (Zustand Store)
// ============================================

import { create } from 'zustand';
import { syncStateToFirestore, loadStateFromFirestore } from '@/lib/db';
import { requestNotificationPermission } from '@/lib/notifications';

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
      setUser: async (user) => {
          set({ user });
          if (user?.id) {
            const serverState = await loadStateFromFirestore(user.id);
            if (serverState) {
              set((state) => ({ ...state, ...serverState }));
              requestNotificationPermission(user.id);
            }
          }
        },

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
        set((state) => 
          state.favourites.includes(recipeId) 
            ? state 
            : { favourites: [...state.favourites, recipeId] }
        ),
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
      addCookingHistoryEntry: (entry) => set((state) => {
        if (state.memory) {
          return { memory: { ...state.memory, cookingHistory: [entry, ...state.memory.cookingHistory].slice(0, 100) } };
        }
        return {
          memory: {
            isVegetarian: false, isVegan: false, allergies: [], spiceLevel: 'medium',
            skillLevel: 'beginner', cuisineTypes: [], goals: [], budgetPerMeal: 150,
            cookingHistory: [entry], preferredCookTime: 30, favoriteTags: [],
            lastActiveDate: new Date().toISOString(), weeklyGoal: 3, weeklyCompleted: 1
          }
        };
      }),

      // Saved Recipes
      savedRecipes: [],
      addSavedRecipe: (recipe) => set((state) => ({
        savedRecipes: [recipe, ...state.savedRecipes.filter(r => r.id !== recipe.id)].slice(0, 50)
      })),

      // Family Recipes
      familyRecipes: [],
      
        addFamilyRecipe: (recipe) => set((state) => {
          const badWords = ['fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'slut'];
          const textToScan = (recipe.title + ' ' + (recipe.description || '') + ' ' + recipe.ingredients.join(' ')).toLowerCase();
          if (badWords.some(word => textToScan.includes(word))) {
            console.warn('Inappropriate content detected in family recipe. Rejecting.');
            return state;
          }
          return { familyRecipes: [recipe, ...state.familyRecipes] };
        }),
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
        const newStreak = last === today ? state.currentStreak : (last === yesterday ? state.currentStreak + 1 : 1);
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


let syncTimeout: any = null;
useZaykaStore.subscribe((state, prevState) => {
  if (state.user?.id) {
    const keys = ['memory', 'favourites', 'savedRecipes', 'familyRecipes', 'currentStreak', 'lastCookDate'] as const;
    const changed = keys.some(key => state[key] !== prevState[key]);
    
    if (changed) {
      const stateToSync = keys.reduce((acc, key) => {
        acc[key] = state[key];
        return acc;
      }, {} as any);
      
      if (syncTimeout) clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        syncStateToFirestore(state.user!.id, stateToSync);
      }, 2000);
    }
  }
});
