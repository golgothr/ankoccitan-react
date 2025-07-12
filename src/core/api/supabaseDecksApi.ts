import { supabase } from '@/core/lib/supabase';
import type { DeckRow } from '@/core/lib/supabase';

export async function fetchUserDecks(): Promise<DeckRow[]> {
  const { data, error } = await supabase
    .from('decks')
    .select(
      `
      *,
      cards(count)
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des decks:', error);
    throw error;
  }

  return data || [];
}

export async function fetchDeckStats() {
  // Récupérer le nombre total de decks
  const { count: deckCount, error: deckError } = await supabase
    .from('decks')
    .select('*', { count: 'exact', head: true });

  if (deckError) {
    console.error('Erreur lors du comptage des decks:', deckError);
    throw deckError;
  }

  // Récupérer le nombre total de cartes
  const { count: cardCount, error: cardError } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true });

  if (cardError) {
    console.error('Erreur lors du comptage des cartes:', cardError);
    throw cardError;
  }

  return {
    totalDecks: deckCount || 0,
    totalCards: cardCount || 0,
  };
}

export async function fetchPublicDecks() {
  const { data, error } = await supabase
    .from('decks')
    .select(
      `
      *,
      cards(count),
      users!decks_user_id_fkey(name, username)
    `
    )
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des decks publics:', error);
    throw error;
  }

  return data || [];
}

export async function createDeck(deckData: {
  title: string;
  description?: string;
  difficulty_level: 'débutant' | 'intermédiaire' | 'avancé';
  tags?: string[];
  is_public?: boolean;
}): Promise<DeckRow> {
  const { data, error } = await supabase
    .from('decks')
    .insert([deckData])
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la création du deck:', error);
    throw error;
  }

  return data;
}

export async function updateDeck(
  id: string,
  updates: Partial<DeckRow>
): Promise<DeckRow> {
  const { data, error } = await supabase
    .from('decks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la mise à jour du deck:', error);
    throw error;
  }

  return data;
}

export async function deleteDeck(id: string): Promise<void> {
  const { error } = await supabase.from('decks').delete().eq('id', id);

  if (error) {
    console.error('Erreur lors de la suppression du deck:', error);
    throw error;
  }
}
