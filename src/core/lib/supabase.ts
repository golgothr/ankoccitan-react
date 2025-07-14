import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'ankoccitan-auth',
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
  title: string;
  description: string | null;
  user_id: string;
  is_public: boolean;
  language: string;
  difficulty_level: 'débutant' | 'intermédiaire' | 'avancé';
  card_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface DeckInsert {
  title: string;
  description?: string;
  user_id: string;
  is_public?: boolean;
  language?: string;
  difficulty_level?: 'débutant' | 'intermédiaire' | 'avancé';
  tags?: string[];
}

export interface DeckUpdate {
  title?: string;
  description?: string;
  is_public?: boolean;
  language?: string;
  difficulty_level?: 'débutant' | 'intermédiaire' | 'avancé';
  tags?: string[];
}

// Types pour les cartes
export interface CardRow {
  id: string;
  deck_id: string;
  card_type: 'revirada' | 'pexels' | 'manual' | 'cloze';
  front_content: string;
  back_content: string;
  pronunciation?: string;
  audio_url?: string;
  image_url?: string;
  api_metadata?: Record<string, unknown>;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CardInsert {
  deck_id: string;
  card_type?: 'revirada' | 'pexels' | 'manual' | 'cloze';
  front_content: string;
  back_content: string;
  pronunciation?: string;
  audio_url?: string;
  image_url?: string;
  api_metadata?: Record<string, unknown>;
  position?: number;
}

export interface CardUpdate {
  card_type?: 'revirada' | 'pexels' | 'manual' | 'cloze';
  front_content?: string;
  back_content?: string;
  pronunciation?: string;
  audio_url?: string;
  image_url?: string;
  api_metadata?: Record<string, unknown>;
  position?: number;
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
