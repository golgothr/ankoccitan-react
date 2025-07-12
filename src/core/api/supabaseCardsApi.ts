import { supabase } from '@/core/lib/supabase';
import type { CardRow } from '@/core/lib/supabase';

export async function fetchUserCards(): Promise<CardRow[]> {
  const { data, error } = await supabase
    .from('cards')
    .select(
      `
      *,
      decks!cards_deck_id_fkey(title, description)
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des cartes:', error);
    throw error;
  }

  return data || [];
}

export async function fetchCardsByDeck(deckId: string): Promise<CardRow[]> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('deck_id', deckId)
    .order('position', { ascending: true });

  if (error) {
    console.error('Erreur lors de la récupération des cartes du deck:', error);
    throw error;
  }

  return data || [];
}

export async function fetchRandomCard(): Promise<CardRow | null> {
  // Récupérer toutes les cartes
  const { data: cards, error } = await supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des cartes:', error);
    throw error;
  }

  if (!cards || cards.length === 0) {
    return null;
  }

  // Sélectionner une carte aléatoire
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}

export async function createCard(cardData: {
  deck_id: string;
  card_type: string;
  front_content: string;
  back_content: string;
  pronunciation?: string;
  audio_url?: string;
  image_url?: string;
  api_metadata?: Record<string, unknown>;
  position?: number;
}): Promise<CardRow> {
  const { data, error } = await supabase
    .from('cards')
    .insert([cardData])
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la création de la carte:', error);
    throw error;
  }

  return data;
}

export async function updateCard(
  id: string,
  updates: Partial<CardRow>
): Promise<CardRow> {
  const { data, error } = await supabase
    .from('cards')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la mise à jour de la carte:', error);
    throw error;
  }

  return data;
}

export async function deleteCard(id: string): Promise<void> {
  const { error } = await supabase.from('cards').delete().eq('id', id);

  if (error) {
    console.error('Erreur lors de la suppression de la carte:', error);
    throw error;
  }
}

export async function getCardStats() {
  // Récupérer le nombre total de cartes
  const { count: totalCards, error: cardError } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true });

  if (cardError) {
    console.error('Erreur lors du comptage des cartes:', cardError);
    throw cardError;
  }

  // Récupérer les statistiques par type de carte
  const { data: cardsByType, error: typeError } = await supabase
    .from('cards')
    .select('card_type');

  if (typeError) {
    console.error(
      'Erreur lors de la récupération des types de cartes:',
      typeError
    );
    throw typeError;
  }

  const typeStats =
    cardsByType?.reduce(
      (acc, card) => {
        acc[card.card_type] = (acc[card.card_type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) || {};

  return {
    totalCards: totalCards || 0,
    cardsByType: typeStats,
  };
}
