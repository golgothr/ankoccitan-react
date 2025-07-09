import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Types pour TypeScript
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User | null;
  session: unknown | null;
  error: unknown | null;
}

// Types pour les decks
export interface DeckRow {
  id: string;
  name: string;
  description: string;
  category:
    | 'grammar'
    | 'conjugation'
    | 'vocabulary'
    | 'expressions'
    | 'culture';
  tags: string[];
  is_public: boolean;
  card_count: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  last_studied?: string;
  study_count: number;
  average_score: number;
}

export interface DeckInsert {
  name: string;
  description: string;
  category:
    | 'grammar'
    | 'conjugation'
    | 'vocabulary'
    | 'expressions'
    | 'culture';
  tags: string[];
  is_public: boolean;
  user_id: string;
}

export interface DeckUpdate {
  name?: string;
  description?: string;
  category?:
    | 'grammar'
    | 'conjugation'
    | 'vocabulary'
    | 'expressions'
    | 'culture';
  tags?: string[];
  is_public?: boolean;
  card_count?: number;
  last_studied?: string;
  study_count?: number;
  average_score?: number;
}

// Types pour les cartes
export interface CardRow {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  difficulty: number;
  last_reviewed?: string;
  review_count: number;
  next_review?: string;
}

export interface CardInsert {
  deck_id: string;
  front: string;
  back: string;
  notes?: string;
  difficulty?: number;
}

export interface CardUpdate {
  front?: string;
  back?: string;
  notes?: string;
  difficulty?: number;
  last_reviewed?: string;
  review_count?: number;
  next_review?: string;
}

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      decks: {
        Row: DeckRow;
        Insert: DeckInsert;
        Update: DeckUpdate;
      };
      cards: {
        Row: CardRow;
        Insert: CardInsert;
        Update: CardUpdate;
      };
    };
  };
}
