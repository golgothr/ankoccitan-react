import { supabase } from '../lib/supabase';
import type { DeckRow, DeckInsert, DeckUpdate } from '../lib/supabase';

// Récupérer tous les decks de l'utilisateur connecté
export async function fetchUserDecks(): Promise<DeckRow[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  const { data, error } = await supabase
    .from('decks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des decks:', error);
    throw new Error('Impossible de récupérer les decks');
  }

  return data || [];
}

// Récupérer un deck par ID
export async function fetchDeckById(deckId: string): Promise<DeckRow | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  const { data, error } = await supabase
    .from('decks')
    .select('*')
    .eq('id', deckId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Erreur lors de la récupération du deck:', error);
    return null;
  }

  return data;
}

// Créer un nouveau deck
export async function createDeck(
  deckData: Omit<DeckInsert, 'user_id'>
): Promise<DeckRow> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  const newDeck: DeckInsert = {
    ...deckData,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('decks')
    .insert(newDeck)
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la création du deck:', error);
    throw new Error('Impossible de créer le deck');
  }

  return data;
}

// Mettre à jour un deck
export async function updateDeck(
  deckId: string,
  updates: DeckUpdate
): Promise<DeckRow> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  const { data, error } = await supabase
    .from('decks')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', deckId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la mise à jour du deck:', error);
    throw new Error('Impossible de mettre à jour le deck');
  }

  return data;
}

// Supprimer un deck
export async function deleteDeck(deckId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  const { error } = await supabase
    .from('decks')
    .delete()
    .eq('id', deckId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Erreur lors de la suppression du deck:', error);
    throw new Error('Impossible de supprimer le deck');
  }
}

// Dupliquer un deck
export async function duplicateDeck(deckId: string): Promise<DeckRow> {
  const originalDeck = await fetchDeckById(deckId);

  if (!originalDeck) {
    throw new Error('Deck non trouvé');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  const duplicatedDeck: DeckInsert = {
    name: `${originalDeck.name} (copie)`,
    description: originalDeck.description,
    category: originalDeck.category,
    tags: originalDeck.tags,
    is_public: false, // La copie est toujours privée
    user_id: user.id,
  };

  return await createDeck(duplicatedDeck);
}

// Récupérer les statistiques des decks
export async function fetchDeckStats() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  const { data, error } = await supabase
    .from('decks')
    .select('card_count, category, created_at')
    .eq('user_id', user.id);

  if (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw new Error('Impossible de récupérer les statistiques');
  }

  const stats = {
    totalDecks: data?.length || 0,
    totalCards: data?.reduce((sum, deck) => sum + deck.card_count, 0) || 0,
    categoryDistribution: {
      grammar: data?.filter((d) => d.category === 'grammar').length || 0,
      conjugation:
        data?.filter((d) => d.category === 'conjugation').length || 0,
      vocabulary: data?.filter((d) => d.category === 'vocabulary').length || 0,
      expressions:
        data?.filter((d) => d.category === 'expressions').length || 0,
      culture: data?.filter((d) => d.category === 'culture').length || 0,
    },
    lastActivity:
      data?.length > 0
        ? new Date(
            Math.max(...data.map((d) => new Date(d.created_at).getTime()))
          )
        : null,
  };

  return stats;
}

// Rechercher des decks
export async function searchDecks(
  query: string,
  filters: {
    category?: string;
    tags?: string[];
    isPublic?: boolean;
  }
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  let supabaseQuery = supabase.from('decks').select('*').eq('user_id', user.id);

  // Recherche par nom ou description
  if (query) {
    supabaseQuery = supabaseQuery.or(
      `name.ilike.%${query}%,description.ilike.%${query}%`
    );
  }

  // Filtre par catégorie
  if (filters.category && filters.category !== 'all') {
    supabaseQuery = supabaseQuery.eq('category', filters.category);
  }

  // Filtre par visibilité
  if (filters.isPublic !== undefined) {
    supabaseQuery = supabaseQuery.eq('is_public', filters.isPublic);
  }

  const { data, error } = await supabaseQuery.order('created_at', {
    ascending: false,
  });

  if (error) {
    console.error('Erreur lors de la recherche des decks:', error);
    throw new Error('Impossible de rechercher les decks');
  }

  // Filtre par tags côté client (Supabase ne supporte pas facilement les arrays)
  if (filters.tags && filters.tags.length > 0) {
    return (
      data?.filter((deck) =>
        filters.tags!.some((tag) => deck.tags.includes(tag))
      ) || []
    );
  }

  return data || [];
}
