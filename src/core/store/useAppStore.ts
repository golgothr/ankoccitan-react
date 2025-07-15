import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, DeckRow, CardRow } from '@/core/lib/supabase';

interface AppState {
  language: string;
  user: User | null;
  isAuthenticated: boolean;
  decks: DeckRow[];
  currentDeck: DeckRow | null;
  cards: CardRow[];
  currentCard: CardRow | null;

  setLanguage: (lang: string) => void;
  setUser: (user: User | null) => void;
  setDecks: (decks: DeckRow[]) => void;
  addDeck: (deck: DeckRow) => void;
  updateDeck: (id: string, updates: Partial<DeckRow>) => void;
  deleteDeck: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      language: 'fr',
      user: null,
      isAuthenticated: false,
      decks: [],
      currentDeck: null,
      cards: [],
      currentCard: null,

      setLanguage: (language) => set({ language }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setDecks: (decks) => set({ decks }),
      addDeck: (deck) => set((state) => ({ decks: [...state.decks, deck] })),
      updateDeck: (id, updates) =>
        set((state) => ({
          decks: state.decks.map((deck) =>
            deck.id === id ? { ...deck, ...updates } : deck
          ),
        })),
      deleteDeck: (id) =>
        set((state) => ({
          decks: state.decks.filter((deck) => deck.id !== id),
        })),
    }),
    {
      name: 'ankoccitan-store',
      partialize: (state) => ({
        language: state.language,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        decks: state.decks,
      }),
    }
  )
);
