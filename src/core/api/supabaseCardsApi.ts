import { supabase } from '../lib/supabase';
import type { CardRow } from '../lib/supabase';

// Fetch all cards belonging to the current user via the view cards_with_deck_info
export async function fetchUserCards(): Promise<CardRow[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  const { data, error } = await supabase
    .from('cards_with_deck_info')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Erreur lors de la récupération des cartes:', error);
    throw new Error('Impossible de récupérer les cartes');
  }

  return (data as CardRow[]) || [];
}
